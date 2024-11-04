import { useRef, useState, useEffect } from 'react'
import { type IDropDownMenu, type FieldConfig, type ListObject } from '../../types'
import { fieldsReport } from '../../utils/fields'
import { DropDown } from '../dropdown/DropDown'
import './FilterReport.css'

interface Props {
  fields: string
}

export const FilterReport: React.FC<Props> = ({ fields }): JSX.Element => {
  const formData = useRef<{ [key: string]: string | string[] | boolean | number | ListObject[] }>({})
  const [dropdownData, setDropdownData] = useState<{ [key: string]: IDropDownMenu[] }>({})

  useEffect(() => {
    const fetchDropdownData = async (): Promise<void> => {
      const fetchPromises = fieldsReport[fields]
        .filter(({ type, fetchUrl }: FieldConfig) => type === 'dropmenu' && fetchUrl)
        .map(async ({ fetchUrl, id }: FieldConfig) => {
          try {
            const urlToUse: string = fetchUrl ? fetchUrl: ''
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
  }, [ fields ])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>): void => {
    const { id, value, type } = e.target

    if (type === 'checkbox') formData.current[id] = (e.target as HTMLInputElement).checked
    else if (type === 'number') formData.current[id] = Number(value)
    else if (Array.isArray(formData.current[id])) formData.current[id] = value.split(',')
    else formData.current[id] = value
  }

  return (
    <section className="filter-report-background">
      <div className="filter-report-container">
        <h1>Parametros del Reporte</h1>
        <div className="fields-container">
          {fieldsReport[fields]?.map(({ type, name, label, id, inputType, modify }: FieldConfig, index: number) => {
            const fieldId = id || `field-${index}`
            const isCheckbox = inputType === 'checkbox'
            console.log({ id, dropdownData })
            return (
              <div key={ fieldId } className="field-item">
                <h4>{ name }</h4>
                <div className='input-item'>
                  {type === 'input' ? (
                    <input
                      type={ inputType || 'text' }
                      id={ fieldId }
                      name={ name }
                      placeholder={ label || name }
                      autoComplete='off'
                      onChange={ handleChange }
                      defaultValue={ modify ? '' : undefined }
                      checked={ isCheckbox ? Boolean(formData.current[fieldId]) : undefined }
                    />
                  ) : (
                    <DropDown
                      options={ dropdownData[id ?? ''] ?? [] }
                      selectedId={ fieldId }
                      value={ formData.current[fieldId] as string }
                      setFormData={ formData }
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <div className="report-buttons-container">
          <div className='button-container'>
            <button className='accept-report'>Aceptar</button>
          </div>
          <div className='button-container'>
            <button className='cancel-report'>Cancelar</button>
          </div>
        </div>
      </div>
    </section>
  )
}