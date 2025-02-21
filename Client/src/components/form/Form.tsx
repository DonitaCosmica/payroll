import { JSX, useEffect, useMemo, useRef, useState } from 'react'
import { NavigationActionKind, useNavigationContext } from '../../context/Navigation'
import { usePeriodContext } from '../../context/Period'
import { useFetchData } from '../../hooks/useFetchData'
import { type IDropDownMenu, type IFieldConfig, type IDataObject, type IListObject, type IDataResponse } from '../../types'
import { DropDown } from '../dropdown/DropDown'
import { MultiDropDown } from '../multiDropDown/MultiDropDown'
import { FormSkeleton } from '../../custom/formSkeleton/FormSkeleton'
import { fieldsConfig } from '../../utils/fields'
import { FaArrowLeft } from "react-icons/fa"
import { getProperty, pluralToSingular } from '../../utils/modifyData'
import './Form.css'

interface Props {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>
}

interface IInitialDropdownData {
  [key: string]: IDropDownMenu[]
}

interface IPerceptionsAndDeductions {
  perceptions: IDropDownMenu[],
  deductions: IDropDownMenu[]
}

type PerceptionsDeductionsTuple = [
  perceptions: IPerceptionsAndDeductions['perceptions'],
  deductions: IPerceptionsAndDeductions['deductions']
]

function* fetchDataGenerator(option: NavigationActionKind) {
  try {
    const initialDropdownData: IInitialDropdownData = yield fetchInitialDropdownData(option)
    if (option === NavigationActionKind.PAYROLLRECEIPTS) {
      const employeeId: string = yield
      const perceptionsAndDeductions: IPerceptionsAndDeductions = yield fetchPerceptionsAndDeductions(employeeId)
      return perceptionsAndDeductions
    } else if (option === NavigationActionKind.EMPLOYEES) {
      const companyId: string = yield
      const projects: IDropDownMenu[] = yield fetchProjectsByCompany(companyId)
      const jobPositionId: string = yield
      const department: IDropDownMenu = yield fetchDepartment(jobPositionId)
      return { department, projects }
    }

    return initialDropdownData
  } catch (error) {
    console.error('Error in fetchDataGenerator:', error)
    throw error
  }
}

const fetchInitialDropdownData = async (option: NavigationActionKind): Promise<any> => {
  try {
    const fetchPromises = fieldsConfig[option]
      .filter(({ type, fetchUrl }: IFieldConfig) => ['dropmenu', 'multi-option'].includes(type) && fetchUrl)
      .map(async ({ fetchUrl, id, uriComponent }: IFieldConfig) => {
        try {
          const urlToUse = uriComponent ? `${ fetchUrl }/byType?type=${ encodeURIComponent(uriComponent) }` : fetchUrl || ''
          const res: Response = await fetch(urlToUse)
          const data = await res.json()
          const dataResponse = Array.isArray(data) ? data : data.formData
          return { [ String(id) ]: Object.keys(dataResponse).filter(key => key !== 'columns').flatMap(key => dataResponse[key]) }
        } catch (error) {
          console.error(`Error fetching dropdown data for ${ id }`, error)
          return { [ String(id) ]: [] }
        }
      })

    return Object.assign({}, ...(await Promise.all(fetchPromises)))
  } catch (error) {
    console.error('Error fetching initial dropdown data: ', error)
    return {}
  }
}

const fetchPerceptionsAndDeductions = async (employeeId: string | undefined): Promise<IPerceptionsAndDeductions> => {
  try {
    const [perceptionsRes, deductionsRes] = await Promise.all([
      fetch(`http://localhost:5239/api/Perception/by?employeeId=${ employeeId }`),
      fetch('http://localhost:5239/api/Deduction/by')
    ])

    const [perceptionsData, deductionsData]: PerceptionsDeductionsTuple = await Promise.all([perceptionsRes.json(), deductionsRes.json()])
    const salary = perceptionsData.find(p => p.compensationType === 'Principal')?.value || null
    localStorage.setItem('salary', JSON.stringify(salary))
    return { perceptions: perceptionsData || [], deductions: deductionsData || [] }
  } catch (error) {
    console.error('Error fetching perceptions or deductions: ', error)
    return { perceptions: [], deductions: [] }
  }
}

const fetchProjectsByCompany = async (companyId: string | undefined): Promise<IDropDownMenu[]> => {
  try {
    const projectsResponse: Response = await fetch(`http://localhost:5239/api/Project/by?companyId=${ companyId }`)
    const projectsData: IDataResponse = await projectsResponse.json()
    return projectsData.data as IDropDownMenu[] || []
  } catch (error) {
    console.error('Error fetching projects: ', error)
    return []
  }
}

const fetchDepartment = async (jobPositionId: string | undefined): Promise<IDropDownMenu> => {
  try {
    const departmentResponse: Response = await fetch(`http://localhost:5239/api/JobPosition/by?jobPositionId=${ jobPositionId }`)
    const departmentData: IDropDownMenu = await departmentResponse.json()
    return departmentData
  } catch (error) {
    console.error('Error fetching department: ', error)
    return {} as IDropDownMenu
  }
}

const createObject = (formDataRes: IDataObject[], keys: string[], selectedId: string, dropdownData: Record<string, IDropDownMenu[]>, option: NavigationActionKind): Record<string, unknown> | null => {
  const selectedObj = formDataRes.find((item: IDataObject) => Object.keys(item).some(key => key.endsWith('Id') && item[key] === selectedId))
  if (!selectedObj) return null

  return keys.slice(1).reduce((obj: Record<string, unknown>, key: string) => {
    const dropDownKey = key.replace(/Id$/i, '').toLowerCase()
    const value = getProperty(selectedObj, dropDownKey)
    const newKey = Object.keys(dropdownData).find((key: string) => (key.toLowerCase() === dropDownKey) ? dropdownData[key] : undefined) as string
    if (!newKey) return { ...obj, [dropDownKey]: value };

    const field = fieldsConfig[option].find(item => item.id.toLowerCase() === newKey.toLowerCase())
    const dropDownDataFound = Array.isArray(value) ? value : (dropdownData[newKey]?.filter((dropData: IDropDownMenu) => dropData.name === value) || []);
    const newValue = Array.isArray(dropDownDataFound) ? dropDownDataFound.map(item => item[`${ newKey }Id`] || item) : value            
    const oneValueInAnArray = field?.type === 'dropmenu' && Array.isArray(newValue)
    return { ...obj, [dropDownKey]: oneValueInAnArray ? newValue[0] : newValue }
  }, {} as Record<string, unknown>)
}

export const Form: React.FC<Props> = ({ setShowForm }): JSX.Element => {
  const { option, title, formSize, url, data, formData: formDataRes, keys, submitCount, selectedId, toolbarOption, setSubmitCount } = useNavigationContext()
  const { selectedPeriod } = usePeriodContext()
  const { isCurrentWeek } = usePeriodContext()
  const { fetchData } = useFetchData()
  const [dropdownData, setDropdownData] = useState<IInitialDropdownData>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [department, setDepartment] = useState<string>('')
  const formData = useRef<Record<string, unknown>>({})
  const discount = useRef<number | null>(null)

  const setFormData = (newData: Record<string, unknown>): void => {
    Object.assign(formData.current, newData)
  }

  const setDiscount = (newData: number | null): void => {
    Object.assign(discount, newData)
  }

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const generator = fetchDataGenerator(option)
      const initialDropdownData = await generator.next().value
      setDropdownData(initialDropdownData as IInitialDropdownData || {})

      if (option === NavigationActionKind.PAYROLLRECEIPTS) {
        const selectedEmployeeId = formData.current?.employee as any
        if (selectedEmployeeId) {
          generator.next()
          const { value: perceptionsAndDeductions } = generator.next(selectedEmployeeId)
          if (perceptionsAndDeductions) {
            const { perceptions, deductions } = await perceptionsAndDeductions as IPerceptionsAndDeductions
            setDropdownData((prevData) => ({ ...prevData, perceptions, deductions }))
          }
        }
      } else if (option === NavigationActionKind.EMPLOYEES) {
        const selectedCompanyId = formData.current?.company as any
        if (selectedCompanyId) {
          generator.next()
          const { value: projects } = generator.next(selectedCompanyId)
          if (projects) {
            const prs = await projects as IDropDownMenu[]
            setDropdownData((prevData) => ({ ...prevData, projects: prs }))
          }
        }

        const selectedJobPositionId = formData.current?.jobPosition as any
        if (selectedJobPositionId) {
          generator.next()
          setDepartment((await generator.next(selectedJobPositionId).value).name)
        }
      }
    }

    localStorage.removeItem('salary')
    localStorage.removeItem('discount')
    fetchData()
  }, [ option, loading ])

  useEffect(() => {
    if (toolbarOption === 1 && selectedId) {
      const objectsForm = createObject(formDataRes, keys, selectedId, dropdownData, option)
      if (objectsForm) formData.current = objectsForm
      if (option === NavigationActionKind.PAYROLLRECEIPTS) {
        formDataRes.forEach(res => {
          for (const key in res) {
            if (res[key] === selectedId && 'discount' in res)
             discount.current = Number(res.discount)
          }
        })
      }
    }
  }, [ toolbarOption, selectedId, data, keys, dropdownData, formDataRes, option ])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { id, value, type } = e.target

    if (type === 'checkbox') formData.current[id] = (e.target as HTMLInputElement).checked
    else if (type === 'number') formData.current[id] = Number(value)
    else if (Array.isArray(formData.current[id])) formData.current[id] = value.split(',')
    else formData.current[id] = value
  }

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    const cleanCompensationType = (items: IListObject[]) =>
      items.map(item => {
        if (typeof item === 'object' && 'compensationType' in item) {
          const { compensationType, ...rest } = item
          return rest
        }
        return item
      })

    if (option === NavigationActionKind.PAYROLLRECEIPTS && selectedPeriod.week && selectedPeriod.year) {
      const { deductions, perceptions } = formData.current
      const discount = localStorage.getItem('discount')
      
      if (discount !== null)
        formData.current = {
          ...formData.current,
          week: selectedPeriod.week,
          year: selectedPeriod.year,
          discount: parseFloat(discount),
          deductions: Array.isArray(deductions) ? cleanCompensationType(deductions as IListObject[]) : deductions,
          perceptions: Array.isArray(perceptions) ? cleanCompensationType(perceptions as IListObject[]) : perceptions
        }
      else {
        if ('discount' in formData.current) delete formData.current.discount
        formData.current = {
          ...formData.current,
          week: selectedPeriod.week,
          year: selectedPeriod.year,
          deductions: Array.isArray(deductions) ? cleanCompensationType(deductions as IListObject[]) : deductions,
          perceptions: Array.isArray(perceptions) ? cleanCompensationType(perceptions as IListObject[]) : perceptions
        }
      }
    }

    const urlToUse: string = selectedId && toolbarOption === 1 ? `${ String(url) }/${ selectedId } ` : String(url)
    const method = selectedId && toolbarOption === 1 ? 'PATCH' : 'POST'
    const result = await fetchData(urlToUse, { method, body: formData.current })
    if (result === null) return

    setShowForm(false)
    setSubmitCount(submitCount + 1)
    discount.current = null
    localStorage.removeItem('salary')
    localStorage.removeItem('discount')
  }

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement | SVGElement>): void => {
    e.preventDefault()
    setShowForm(false)
    discount.current = null
    localStorage.removeItem('salary')
    localStorage.removeItem('discount')
  }

  const elements = useMemo(() => {
    if ([1, 2, 3, 8].includes(option) && (!dropdownData || Object.keys(dropdownData).length === 0))
      return [] as JSX.Element[]

    const objectsForm = createObject(formDataRes, keys, selectedId, dropdownData, option)
    return fieldsConfig[option].reduce((acc: JSX.Element[], { type, name, label, id, inputType, modify, amount }: IFieldConfig, index: number) => {
      const currentGroup = [...acc[acc.length - 1]?.props?.children ?? []]
      const appendCurrentGroup = (group: JSX.Element[]) =>
        group.length > 0 ? [...acc.slice(0, -1), <div key={ `input-group-${ index }` } className='input-group'>{ group }</div>] : acc

      if (type === 'section') {
        const updatedAcc = appendCurrentGroup(currentGroup)
        return [
          ...updatedAcc,
          <div key={`${ name }-${ index }`} className='title'>
            <h4>{ name }</h4>
          </div>,
          <div key={ `input-group-start-${ index + 1 }` } className='input-group'></div>
        ]
      } else {
        const fieldId = id || `field-${index}`
        const value = toolbarOption === 1 && objectsForm ? String(objectsForm[String(id.toLowerCase())]) : ''
        const fieldElement = (
          <div key={`${ name }-${ index }-${ id }`} className='field'>
            <label htmlFor={ fieldId }>{ name }</label>
            <div className='input-container'>
              {type === 'input' ? (
                <input
                  type={ inputType }
                  id={ fieldId }
                  name={ name }
                  placeholder={ label }
                  autoComplete='off'
                  onChange={ (e) => handleChange(e) }
                  defaultValue={toolbarOption === 1 && objectsForm
                    ? String(objectsForm[id.toLowerCase()])
                    : id === 'department'
                      ? department
                      : ''}
                  readOnly={ modify ? undefined : true }
                  disabled={ isCurrentWeek }
                  checked={ toolbarOption === 1 
                    && objectsForm && typeof objectsForm[String(id.toLocaleLowerCase())] === 'boolean' 
                      ? objectsForm[String(id.toLocaleLowerCase())] as boolean 
                      : undefined }
                />
              ) : type === 'dropmenu' && Object.keys(dropdownData).length > 0 ? (
                <DropDown 
                  options={ dropdownData[id ?? ''] } 
                  selectedId={ fieldId }
                  value={ value }
                  isDisabled={ isCurrentWeek }
                  setFormData={ setFormData } 
                  setLoading={
                    option === NavigationActionKind.PAYROLLRECEIPTS || option === NavigationActionKind.EMPLOYEES
                      ? setLoading : () => {}
                  }
                />
              ) : type === 'multi-option' ? (
                <MultiDropDown
                  id={ fieldId }
                  options={ dropdownData[id ?? ''] || [] }
                  value={ toolbarOption === 1 && objectsForm ? objectsForm[String(id.toLowerCase())] as IListObject[] : [] }
                  idKey={ pluralToSingular(id) + 'Id' }
                  isDisabled={ isCurrentWeek }
                  showAmount={ amount ?? false }
                  setFormData={ setFormData }
                  discount={ discount }
                  setDiscount={ setDiscount }
                />
              ) : type === 'textarea' ? (
                <textarea
                  id={ fieldId }
                  rows={10}
                  autoComplete='off'
                  placeholder={ label }
                  onChange={ (e) => handleChange(e) }
                  defaultValue={ value }
                  disabled={ isCurrentWeek }
                />
              ) : null}
            </div>
          </div>
        )

        return [...acc.slice(0, -1), <div key={ `input-group-${ index }` } className='input-group'>{ [...currentGroup, fieldElement] }</div>]
      }
    }, [])
  }, [ option, dropdownData, toolbarOption, selectedId, data, keys, department ])

  if ([1, 2, 3, 8].includes(option) && (!dropdownData || Object.keys(dropdownData).length === 0))
    return <FormSkeleton />

  return (
    <section className='background'>
      <div className='form-container' style={{ height: `${ formSize }%` }}>
        <FaArrowLeft onClick={ handleCancel } />
        <h2>{ `${ toolbarOption === 0 ? 'Crear' : 'Editar' } ${ title }` }</h2>
        <form className='fields-container' onSubmit={ handleSubmit }>
          { elements }
          <div className='button-container'>
            <button type='submit'>{ toolbarOption === 1 ? 'Actualizar' : 'Crear' }</button>
            <button onClick={ (e) => handleCancel(e) } type='button'>Cancelar</button>
          </div>
        </form>
      </div>
    </section>
  )
}