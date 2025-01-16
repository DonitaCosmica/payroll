import { useRef } from 'react'
import { type IFieldConfig, type IListObject } from '../../types'
import { fieldsReport } from '../../utils/fields'
import { DropDown } from '../dropdown/DropDown'
import './FilterReport.css'

interface Props {
  fields: string
}

export const FilterReport: React.FC<Props> = ({ fields }): JSX.Element => {
  const formData = useRef<{ [key: string]: string | string[] | boolean | number | IListObject[] }>({})

  return (
    <section id="filter-report-background">
      <div className="filter-report-container">
        <h1>Parametros del Reporte</h1>
        <div id="fields-container">
          {fieldsReport[fields]?.map(({ type, name, label, id, inputType, modify }: IFieldConfig, index: number) => {
            const fieldId = id || `field-${index}`
            const isCheckbox = inputType === 'checkbox'
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
                      defaultValue={ modify ? '' : undefined }
                      onChange={ () => {} }
                      checked={ isCheckbox ? Boolean(formData.current[fieldId]) : undefined }
                    />
                  ) : (
                    <DropDown
                      options={ [] }
                      selectedId={ fieldId }
                      value={ formData.current[fieldId] as string }
                      setFormData={ formData }
                      isDisabled={ false }
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
        <div className="report-buttons-container">
          <div className='button-container'>
            <button id='accept-report'>Aceptar</button>
          </div>
          <div className='button-container'>
            <button id='cancel-report'>Cancelar</button>
          </div>
        </div>
      </div>
    </section>
  )
}