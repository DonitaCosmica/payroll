import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { NavigationContext } from '../../context/Navigation'
import { type IDropDownMenu, type FieldConfig } from '../../types'
import { DropDown } from '../dropdown/DropDown'
import { fieldsConfig } from '../../utils/fields'
import { FaArrowLeft } from "react-icons/fa"
import './Form.css'

interface Props {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>
  toolbarOption: number
  idSelected: string | undefined
}

export const Form: React.FC<Props> = ({ setShowForm, toolbarOption, idSelected }): JSX.Element => {
  const { option, title, formSize, url, data, keys } = useContext(NavigationContext)
  const [dropdownData, setDropdownData] = useState<{ [key: string]: IDropDownMenu[] }>({})
  const formData = useRef<{ [key: string]: string }>({})
  const [submitCount, setSubmitCount] = useState<number>(0)

  useEffect(() => {
    const fetchDropdownData = async (): Promise<void> => {
      const fetchPromises = fieldsConfig[option]
        .filter(({ type, fetchUrl }: FieldConfig) => type === 'dropmenu' && fetchUrl)
        .map(async ({ fetchUrl, id }: FieldConfig) => {
          try {
            const res: Response = await fetch(fetchUrl ?? '')
            const data = await res.json()
            const dataOptions = Object.keys(data)
              .filter((key) => key !== 'columns')
              .map((key) => data[key])
              .flat()
            return { [String(id)]: dataOptions }
          } catch (error) {
            console.error(`Error fetching dropdown data for ${id}`, error)
            return { [String(id)]: [] }
          }
        })
      
      const results = await Promise.all(fetchPromises)
      const combinedResults = results.reduce((acc, result) => ({ ...acc, ...result }), {})
      setDropdownData(combinedResults)
    }

    fetchDropdownData()
  }, [ option, submitCount ])

  useEffect(() => {
    if (toolbarOption === 1 && idSelected) {
      const objectsForm = createObject(data, keys)
      if (objectsForm) {
        const initialFormData = Object.keys(objectsForm).reduce((acc, key: string) => {
          acc[key] = String(objectsForm[key])
          return acc
        }, {} as { [key: string]: string })
        formData.current = initialFormData
      }
    }
  }, [ toolbarOption, idSelected, data, keys ])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { id, value } = e.target
    formData.current[id] = value
  }

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    const requestOptions = {
       method: idSelected ? 'PATCH' : 'POST',
       headers: {
        'Content-Type': 'application/json'
       },
       body: JSON.stringify(formData.current)
    }

    await fetch(idSelected && toolbarOption === 1 ? `${String(url)}/${idSelected}` : String(url), requestOptions)
    setShowForm(false)
    setSubmitCount(submitCount + 1)
  }

  const handleCancel = (e: React.MouseEvent<HTMLButtonElement | SVGElement>): void => {
    e.preventDefault()
    setShowForm(false)
  }

  const createObject = (data: (string | number)[][], keys: string[]) => {
    const selectedObj = data.find((item: (string | number)[]) => item[0] === idSelected)
    if (!selectedObj) return null

    const selectedObjCopy = [...selectedObj]
    const selectedKeysCopy = [...keys]

    selectedObjCopy.shift()
    selectedKeysCopy.shift()

    const obj: { [key: string]: string | number } = {}
    selectedKeysCopy.map((key: string, index: number) => obj[key.replace(/Id/i, '').toLowerCase()] = selectedObjCopy[index])

    return obj
  }

  const elements = useMemo(() => {
    const objectsForm = createObject(data, keys)
    return fieldsConfig[option].reduce((acc: JSX.Element[], { type, name, label, id, inputType }: FieldConfig, index: number) => {
      const currentGroup = [...acc[acc.length - 1]?.props?.children ?? []]
      const appendCurrentGroup = (group: JSX.Element[]) =>
        group.length > 0 ? [...acc.slice(0, -1), <div key={`input-group-${index}`} className='input-group'>{group}</div>] : acc
  
      if (type === 'section') {
        const updatedAcc = appendCurrentGroup(currentGroup)
  
        return [
          ...updatedAcc,
          <div key={`${ name }-${ index }`} className='title'>
            <h4>{ name }</h4>
          </div>,
          <div key={`input-group-start-${index + 1}`} className='input-group'></div>
        ]
      } else {
        const fieldElement = (
          <div key={`${ name }-${index}-${ id }`} className='field'>
            <label htmlFor={ id }>{ name }</label>
            <div className='input-container'>
              {type === 'input' ? (
                <input
                  type={ inputType }
                  id={ id }
                  name={ name }
                  placeholder={ label }
                  autoComplete='off'
                  onChange={ (e) => handleChange(e) }
                  defaultValue={ toolbarOption === 1 && objectsForm ? String(objectsForm[id.toLowerCase()]) : '' }
                />
              ) : type === 'dropmenu' && Object.keys(dropdownData).length > 0 ? (
                <DropDown 
                  options={ dropdownData[id ?? ''] } 
                  selectedId={ id ?? '' }
                  value={ toolbarOption === 1 && objectsForm ? String(objectsForm[id.toLowerCase()]) : '0' }
                  setFormData={ formData } 
                />
              ) : type === 'textarea' ? (
                <textarea
                  id={ id }
                  rows={10}
                  autoComplete='off'
                  placeholder={ label }
                  onChange={ (e) => handleChange(e) }
                  defaultValue={ toolbarOption === 1 && objectsForm ? String(objectsForm[id.toLowerCase()]) : '' }
                />
              ) : null}
            </div>
          </div>
        )
        
        return [...acc.slice(0, -1), <div key={`input-group-${index}`} className='input-group'>{[...currentGroup, fieldElement]}</div>]
      }
    }, [])
  }, [ fieldsConfig, option, dropdownData, toolbarOption, idSelected, data, keys ])

  return (
    <section className='background'>
      <div className='form-container' style={{ height: `${formSize}%` }}>
        <FaArrowLeft onClick={ handleCancel } />
        <h2>{`Crear ${title}`}</h2>
        <form className='fields-container' onSubmit={ handleSubmit }>
          {elements}
          <div className='button-container'>
            <button type='submit'>Crear</button>
            <button onClick={ (e) => handleCancel(e) }>Cancelar</button>
          </div>
        </form>
      </div>
    </section>
  )
}