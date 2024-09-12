import { useEffect, useMemo, useRef, useState } from 'react'
import { NavigationActionKind, useNavigationContext } from '../../context/Navigation'
import { usePeriodContext } from '../../context/Period'
import { type IDropDownMenu, type FieldConfig, type DataObject, type ListObject } from '../../types'
import { fieldsConfig } from '../../utils/fields'
import { FaArrowLeft } from "react-icons/fa"
import { DropDown } from '../dropdown/DropDown'
import { MultiDropDown } from '../multiDropDown/MultiDropDown'
import './Form.css'

interface Props {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>
}

const fetchDropdownData = async (option: NavigationActionKind): Promise<{ [x: string]: any[] }> => {
  const fetchPromises = fieldsConfig[option]
    .filter(({ type, fetchUrl }: FieldConfig) => (type === 'dropmenu' || type === 'multi-option') && fetchUrl)
    .map(async ({ fetchUrl, id, uriComponent }: FieldConfig) => {
      try {
        const urlToUse = uriComponent ? `${fetchUrl}/byType?type=${encodeURIComponent(uriComponent)}` : fetchUrl || ''
        const res: Response = await fetch(urlToUse)
        const data = await res.json()
        const dataResponse = Array.isArray(data) ? data : data.formData
        const dataOptions = Object.keys(dataResponse)
          .filter((key) => key !== 'columns')
          .flatMap(key => dataResponse[key])
        return { [String(id)]: dataOptions }
      } catch (error) {
        console.error(`Error fetching dropdown data for ${ id }`, error)
        return { [String(id)]: [] }
      }
    })
  
  const results = await Promise.all(fetchPromises)
  return results.reduce((acc, result) => ({ ...acc, ...result }), {})
}

const getProperty = (obj: DataObject, key: string): string | number | boolean => {
  const propertyMap: { [key: string]: string } = Object.keys(obj).reduce((item, originalKey) => {
    item[originalKey.toLowerCase()] = originalKey
    return item
  }, {} as { [key: string]: string });

  return obj[propertyMap[key.toLowerCase()]]
}

const createObject = (formDataRes: DataObject[], keys: string[], selectedId: string, dropdownData: { [key: string]: IDropDownMenu[] }, option: NavigationActionKind): { [key: string]: string | string[] | boolean | number | ListObject[] } | null => {
  const selectedObj = formDataRes.find((item: DataObject) => Object.keys(item).some(key => key.endsWith('Id') && item[key] === selectedId))
  if (!selectedObj) return null

  return keys.slice(1).reduce((obj: { [key: string]: string | string[] | boolean | number }, key: string) => {
    const dropDownKey = key.replace(/Id$/i, '').toLowerCase()
    const value = getProperty(selectedObj, dropDownKey)
    const newKey = Object.keys(dropdownData).find((key: string) => (key.toLowerCase() === dropDownKey) ? dropdownData[key] : undefined) as string
    if (!newKey) return { ...obj, [dropDownKey]: value };
    
    const field = fieldsConfig[option].find(item => item.id.toLowerCase() === newKey.toLowerCase())
    const dropDownDataFound = Array.isArray(value) ? value : (dropdownData[newKey]?.filter((dropData: IDropDownMenu) => dropData.name === value) || []);
    const newValue = Array.isArray(dropDownDataFound) ? dropDownDataFound.map(item => item[`${newKey}Id`] || item) : value            
    const oneValueInAnArray = field?.type === 'dropmenu' && Array.isArray(newValue)
    return { ...obj, [dropDownKey]: oneValueInAnArray ? newValue[0] : newValue }
  }, {} as { [key: string]: string | string[] | boolean | number })
}

export const Form: React.FC<Props> = ({ setShowForm }): JSX.Element => {
  const { option, title, formSize, url, data, formData: formDataRes, keys, submitCount, selectedId, toolbarOption, setSubmitCount } = useNavigationContext()
  const { selectedPeriod } = usePeriodContext()
  const [dropdownData, setDropdownData] = useState<{ [key: string]: IDropDownMenu[] }>({})
  const formData = useRef<{ [key: string]: string | string[] | boolean | number | ListObject[] }>({})

  useEffect(() => {
    const fetchData = async() => {
      const result = await fetchDropdownData(option)
      setDropdownData(result)
    }

    fetchData()
  }, [ option ])

  useEffect(() => {
    if (toolbarOption === 1 && selectedId) {
      const objectsForm = createObject(formDataRes, keys, selectedId, dropdownData, option)
      if (objectsForm) formData.current = objectsForm
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

    if (option === NavigationActionKind.PAYROLLRECEIPTS && selectedPeriod.week && selectedPeriod.year)
      formData.current = {
        ...formData.current,
        week: selectedPeriod.week,
        year: selectedPeriod.year
      }

    const requestOptions = {
       method: selectedId && toolbarOption === 1 ? 'PATCH' : 'POST',
       headers: {
        'Content-Type': 'application/json'
       },
       body: JSON.stringify(formData.current)
    }

    const urlToUse: string = selectedId && toolbarOption === 1 ? `${ String(url) }/${ selectedId } ` : String(url)
    try {
      const res: Response = await fetch(urlToUse, requestOptions)
      if (!res.ok) {
        const errorData = await res.json()
        console.error('Request error: ', errorData)
      } else {
        setShowForm(false)
        setSubmitCount(submitCount + 1)
      }
    } catch (error) {
      console.error('Request error: ', error)
    }
  }

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement | SVGElement>): void => {
    e.preventDefault()
    setShowForm(false)
  }

  const pluralToSingular = (word: string): string => {
    if (word.endsWith('ies')) return word.slice(0, -3) + 'y'
    else if (word.endsWith('es')) return word.slice(0, -2)
    else if (word.endsWith('s')) return word.slice(0, -1)
    else return word
  }

  const elements = useMemo(() => {
    const objectsForm = createObject(formDataRes, keys, selectedId, dropdownData, option)
    console.log({ objectsForm })
    return fieldsConfig[option].reduce((acc: JSX.Element[], { type, name, label, id, inputType, /*modify,*/ amount }: FieldConfig, index: number) => {
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
                  defaultValue={ toolbarOption === 1 && objectsForm ? String(objectsForm[id.toLowerCase()]) : '' }
                  //readOnly={ modify ? undefined : true }
                  checked={ toolbarOption === 1 
                    && objectsForm 
                    && typeof objectsForm[String(id.toLocaleLowerCase())] === 'boolean' 
                    ? objectsForm[String(id.toLocaleLowerCase())] as boolean 
                    : undefined }
                />
              ) : type === 'dropmenu' && Object.keys(dropdownData).length > 0 ? (
                <DropDown 
                  options={ dropdownData[id ?? ''] } 
                  selectedId={ fieldId }
                  value={ value }
                  setFormData={ formData } 
                />
              ) : type === 'multi-option' ? (
                <MultiDropDown
                  id={ fieldId }
                  options={ dropdownData[id ?? ''] || [] }
                  value={ toolbarOption === 1 && objectsForm ? objectsForm[String(id.toLowerCase())] as ListObject[] : [] }
                  idKey={ pluralToSingular(id) + 'Id' }
                  showAmount={ amount ?? false }
                  setFormData={ formData }
                />
              ) : type === 'textarea' ? (
                <textarea
                  id={ fieldId }
                  rows={10}
                  autoComplete='off'
                  placeholder={ label }
                  onChange={ (e) => handleChange(e) }
                  defaultValue={ value }
                />
              ) : null}
            </div>
          </div>
        )
        
        return [...acc.slice(0, -1), <div key={`input-group-${ index }`} className='input-group'>{ [...currentGroup, fieldElement] }</div>]
      }
    }, [])
  }, [ fieldsConfig, option, dropdownData, toolbarOption, selectedId, data, keys ])

  return (
    <section className='background'>
      <div className='form-container' style={{ height: `${ formSize }%` }}>
        <FaArrowLeft onClick={ handleCancel } />
        <h2>{`${ toolbarOption === 0 ? 'Crear' : 'Editar' } ${ title }`}</h2>
        <form className='fields-container' onSubmit={ handleSubmit }>
          {elements}
          <div className='button-container'>
            <button type='submit'>{ toolbarOption === 1 ? 'Actualizar' : 'Crear' }</button>
            <button onClick={ (e) => handleCancel(e) } type='button'>Cancelar</button>
          </div>
        </form>
      </div>
    </section>
  )
}