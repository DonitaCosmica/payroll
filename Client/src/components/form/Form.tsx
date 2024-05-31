import { useContext, useEffect, useState } from 'react'
import { NavigationActionKind, NavigationContext } from '../../context/Navigation'
import { type IDropDownMenu } from '../../types'
import { DropDown } from '../dropdown/DropDown'
import './Form.css'

interface FieldConfig {
  type: 'input' | 'dropmenu',
  name: string,
  label?: string,
  inputType?: 'text' | 'tel' | 'number' | 'email' | 'date' | 'checkbox',
  fetchUrl?: string,
  id?: string
}

const fieldsConfig: Record<NavigationActionKind, FieldConfig[]> = {
  [NavigationActionKind.PAYROLLRECEIPTS]: [

  ],
  [NavigationActionKind.EMPLOYEES]: [
    { type: 'input', name: 'Código', label: '0', inputType: 'number' },
    { type: 'input', name: 'Nombre', label: '', inputType: 'text' },
    { type: 'input', name: 'RFC', label: '', inputType: 'text' },
    { type: 'input', name: 'CURP', label: '', inputType: 'text' },
    { type: 'input', name: 'CLABE', label: '', inputType: 'number' },
    { type: 'input', name: 'Cuenta de Banco', label: '', inputType: 'text' },
    { type: 'dropmenu', name: 'Banco', fetchUrl: 'http://localhost:5239/api/Bank', id: 'bank' },
    { type: 'input', name: 'ID Portal Banco', label: '' },
    { type: 'input', name: 'Titular', label: '', inputType: 'checkbox' },
    { type: 'dropmenu', name: 'Proyecto', fetchUrl: 'http://localhost:5239/api/Project', id: 'project' },
    { type: 'dropmenu', name: 'Régimen', fetchUrl: 'http://localhost:5239/api/Regime', id: 'regime' },
    { type: 'input', name: 'NSS', label: '', inputType: 'number' },
    { type: 'input', name: 'Fecha de Ingreso', label: '', inputType: 'date' },
    { type: 'dropmenu', name: 'Puesto', fetchUrl: 'http://localhost:5239/api/JobPosition', id: 'job' },
    { type: 'dropmenu', name: 'Departamento', fetchUrl: 'http://localhost:5239/api/Department', id: 'department' },
    { type: 'dropmenu', name: 'Area Comercial', fetchUrl: 'http://localhost:5239/api/CommercialArea', id: 'commercial' },
    { type: 'dropmenu', name: 'Contrato', fetchUrl: 'http://localhost:5239/api/Contract', id: 'contract' },
    { type: 'input', name: 'Salario Semanal', label: '0.00', inputType: 'number' },
    { type: 'input', name: 'Salario Diario Int.', label: '0.00', inputType: 'number' },
    { type: 'input', name: 'Val. Hora Extra', label: '0.00', inputType: 'number' },
    { type: 'dropmenu', name: 'Entidad Federativa', fetchUrl: 'http://localhost:5239/api/FederalEntity', id: 'federal' },
    { type: 'input', name: 'Teléfono', label: '', inputType: 'tel' },
    { type: 'input', name: 'Email', label: '', inputType: 'email' },
    { type: 'input', name: 'Dirección', label: '', inputType: 'text' },
    { type: 'input', name: 'Colonia', label: '', inputType: 'text' },
    { type: 'input', name: 'CP', label: '', inputType: 'number' },
    { type: 'input', name: 'Ciudad', label: '', inputType: 'text' },
    { type: 'dropmenu', name: 'Estado', fetchUrl: 'http://localhost:5239/api/State', id: 'state' },
    { type: 'input', name: 'País', label: '', inputType: 'text' },
    { type: 'input', name: 'Proveedor', label: '', inputType: 'checkbox' },
    { type: 'input', name: 'Crédito', label: '', inputType: 'text' },
    { type: 'input', name: 'Contacto', label: '', inputType: 'number' }

  ],
  [NavigationActionKind.JOBPOSITIONS]: [

  ],
  [NavigationActionKind.DEPARTMENTS]: [

  ],
  [NavigationActionKind.COMMERCIALAREAS]: [

  ],
  [NavigationActionKind.PERCEPTIONS]: [

  ],
  [NavigationActionKind.DEDUCTIONS]: [

  ],
  [NavigationActionKind.PROJECTCATALOG]: [

  ],
  [NavigationActionKind.COMPANIES]: [

  ],
  [NavigationActionKind.UPDATEDATA]: [],
  [NavigationActionKind.ERROR]: []
}

export const Form = (): JSX.Element => {
  const { option } = useContext(NavigationContext)
  const [dropdownData, setDropdownData] = useState<{ [key: string]: IDropDownMenu[] }>({})

  useEffect(() => {
    const fetchDropdownData = async (): Promise<void> => {
      const fetchPromises = fieldsConfig[option]
        .filter((field: FieldConfig) => field.type === 'dropmenu' && field.fetchUrl)
        .map(async (field: FieldConfig) => {
          const res: Response = await fetch(field.fetchUrl ?? '')
          const data = await res.json()
          const dataOptions = Object.keys(data)
            .filter((key) => key !== 'columns')
            .map((key) => data[key])
            .flat()
          return { [String(field.id)]: dataOptions }
        })
      
      const results = await Promise.all(fetchPromises)
      const combinedResults = results.reduce((acc, result) => ({ ...acc, ...result }), {})
      setDropdownData(combinedResults)
    }

    fetchDropdownData()
  }, [])

  return (
    <section className='background'>
      <div className='form-container'>
        <h2>Titulo</h2>
        <div className='fields-container'>
          {fieldsConfig[option].map((fieldConfig: FieldConfig) => {
            if(fieldConfig.type === 'input') {
              return (
                <div key={ fieldConfig.name } className='field'>
                  <label htmlFor={ fieldConfig.name }>{ fieldConfig.name }</label>
                  <div className='input-container'>
                    <input type={fieldConfig.inputType} name={ fieldConfig.name } />
                  </div>
                </div>
              )
            } else if (fieldConfig.type === 'dropmenu' && Object.keys(dropdownData).length > 0) {
              return (
                <div key={ fieldConfig.name } className='field'>
                  <label htmlFor={ fieldConfig.name }>{ fieldConfig.name }</label>
                  <div className='input-container'>
                    <DropDown options={ dropdownData[fieldConfig.id ?? ''] } selectedId={ fieldConfig.id ?? fieldConfig.name } />
                  </div>
                </div>
              )
            } else {
              return null
            }
          })}
        </div>
      </div>
    </section>
  )
}