import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigationContext } from '../../context/Navigation'
import { type IDropDownMenu, type FieldConfig, type DataObject, ListObject } from '../../types'
import { fieldsConfig } from '../../utils/fields'
import { FaArrowLeft } from "react-icons/fa"
import { DropDown } from '../dropdown/DropDown'
import { MultiDropDown } from '../multiDropDown/MultiDropDown'
import './Form.css'

interface Props {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>
}

export const Form: React.FC<Props> = ({ setShowForm }): JSX.Element => {
  const { option, title, formSize, url, data, formData: formDataRes, keys, submitCount, selectedId, toolbarOption, setSubmitCount } = useNavigationContext()
  const [dropdownData, setDropdownData] = useState<{ [key: string]: IDropDownMenu[] }>({})
  const formData = useRef<{ [key: string]: string | string[] | boolean | number | ListObject[] }>({})

  useEffect(() => {
    const fetchDropdownData = async (): Promise<void> => {
      const fetchPromises = fieldsConfig[option]
        .filter(({ type, fetchUrl }: FieldConfig) => (type === 'dropmenu' || type === 'multi-option') && fetchUrl)
        .map(async ({ fetchUrl, id, uriComponent }: FieldConfig) => {
          try {
            const urlToUse: string = uriComponent
              ? `${ fetchUrl }/byType?type=${ encodeURIComponent(uriComponent) }`
              : fetchUrl
                ? fetchUrl
                : ''
            const res: Response = await fetch(urlToUse)
            const data = await res.json()
            const dataResponse = Array.isArray(data) ? data : data.formData
            const dataOptions = Object.keys(dataResponse)
              .filter((key) => key !== 'columns')
              .map((key) => dataResponse[key])
              .flat()
            return { [String(id)]: dataOptions }
          } catch (error) {
            console.error(`Error fetching dropdown data for ${ id }`, error)
            return { [String(id)]: [] }
          }
        })
      
      const results = await Promise.all(fetchPromises)
      const combinedResults = results.reduce((acc, result) => ({ ...acc, ...result }), {})
      setDropdownData(combinedResults)
    }

    fetchDropdownData()
  }, [ option ])

  const getProperty = (obj: DataObject, key: string) => {
    const lowerCaseKey = key.toLowerCase()
    const propertyMap: { [key: string]: string } = Object.keys(obj).reduce((item, originalKey) => {
      item[originalKey.toLowerCase()] = originalKey
      return item
    }, {} as { [key: string]: string });
  
    const actualKey = propertyMap[lowerCaseKey]
    return actualKey ? obj[actualKey] : undefined
  }

  const createObject = (formDataRes: DataObject[], keys: string[]): { [key: string]: string | string[] | boolean | number | ListObject[] } | null => {
    const selectedObj = formDataRes.find((item: DataObject) => Object.keys(item).some(key => key.endsWith('Id') && item[key] === selectedId))
    if (!selectedObj) return null

    return keys.slice(1).reduce((obj: { [key: string]: string | string[] | boolean | number }, key: string) => {
      const auxKey = key.replace(/Id$/i, '')
      const dropDownKey = auxKey.charAt(0).toLowerCase() + auxKey.slice(1)
      const newKey = auxKey.toLowerCase()
      const value = getProperty(selectedObj, newKey)
      const dropDownDataFound = Array.isArray(value) ? value : dropdownData[dropDownKey]?.filter((dropData: IDropDownMenu) => dropData.name === value)      
      const newValue = dropDownDataFound && dropDownDataFound.length === 1  ? dropDownDataFound[0][dropDownKey + 'Id'] : value
      return { ...obj, [newKey]: newValue }
    }, {} as { [key: string]: string | string[] | boolean | number })
  }

  useEffect(() => {
    if (toolbarOption === 1 && selectedId) {
      const objectsForm = createObject(formDataRes, keys)
      if (objectsForm) {
        const initialFormData = Object.keys(objectsForm).reduce((acc, key: string) => {
          acc[key] = objectsForm[key]
          return acc
        }, {} as { [key: string]: string | number | boolean | string[] | ListObject[] })
        formData.current = initialFormData
      }
    }
  }, [ toolbarOption, selectedId, data, keys, dropdownData ])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { id, value, type } = e.target

    if (type === 'checkbox') formData.current[id] = (e.target as HTMLInputElement).checked
    else if (type === 'number') formData.current[id] = Number(value)
    else if (Array.isArray(formData.current[id])) formData.current[id] = value.split(',')
    else formData.current[id] = value
  }

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    const requestOptions = {
       method: selectedId && toolbarOption === 1 ? 'PATCH' : 'POST',
       headers: {
        'Content-Type': 'application/json'
       },
       body: JSON.stringify(formData.current)
    }

    const urlToUse: string = selectedId && toolbarOption === 1 ? `${ String(url) }/${ selectedId } ` : String(url)
    console.log({ data: formData.current })
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
    const objectsForm = createObject(formDataRes, keys)
    return fieldsConfig[option].reduce((acc: JSX.Element[], { type, name, label, id, inputType }: FieldConfig, index: number) => {
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
                  readOnly={ objectsForm && id.toLowerCase() === 'department' ? true : undefined }
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