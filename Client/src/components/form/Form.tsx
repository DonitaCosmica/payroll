import { useContext, useEffect, useState } from 'react'
import { NavigationContext } from '../../context/Navigation'
import { type IDropDownMenu, type FieldConfig } from '../../types'
import { DropDown } from '../dropdown/DropDown'
import { fieldsConfig } from '../../utils/fields'
import { FaArrowLeft } from "react-icons/fa"
import './Form.css'

interface Props {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>
}

export const Form: React.FC<Props> = ({ setShowForm }): JSX.Element => {
  const { option, title } = useContext(NavigationContext)
  const [dropdownData, setDropdownData] = useState<{ [key: string]: IDropDownMenu[] }>({})
  const [formData, setFormData] = useState<{ [key: string]: string }>({})

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
  }, [ option ])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData(prevFormData => ({
      ...prevFormData,
      [id]: value
    }))
  }

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log(formData)
  }

  return (
    <section className='background'>
      <div className='form-container'>
        <FaArrowLeft onClick={() => setShowForm(false)} />
        <h2>{`Crear ${title}`}</h2>
        <form className='fields-container' onSubmit={handleSubmit}>
          {fieldsConfig[option].map(({ type, name, inputType, id }: FieldConfig, index: number) => {
            if(type === 'input') {
              return (
                <div key={ `${name}-${index}-${id}` } className='field'>
                  <label htmlFor={ id }>{ name }</label>
                  <div className='input-container'>
                    <input 
                      type={inputType} 
                      id={ id } 
                      name={ name } 
                      autoComplete='off'
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )
            } else if(type === 'dropmenu' && Object.keys(dropdownData).length > 0) {
              return (
                <div key={ `${name}-${index}-${id}` } className='field'>
                  <label htmlFor={ id }>{ name }</label>
                  <div className='input-container'>
                    <DropDown options={ dropdownData[id ?? ''] } selectedId={ id ?? name } />
                  </div>
                </div>
              )
            } else if(type === 'section') {
              return (
                <div key={ `${name}-${index}-${id}` } className='title'>
                  <h4>{ name }</h4>
                </div>
              )
            } else {
              return (
                <div key={ `${name}-${index}-${id}` } className='button-container'>
                  <button type='submit'>{ name }</button>
                </div>
              )
            }
          })}
        </form>
      </div>
    </section>
  )
}