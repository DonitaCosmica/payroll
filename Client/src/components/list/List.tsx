import { MdArrowDropDown } from "react-icons/md"
import { MdArrowDropUp } from "react-icons/md"
import './List.css'

const filters: string[] = [
  'Clave', 'Nombre', 'RFC', 'CURP', 'Banco', 'CLABE', 'Proyecto', 'NSS', 'Depto.', 
  'Area Comercial', 'Fecha de ingreso', 'Puesto', 'Salario Base', 'Salario Diario',
  'Status', 'Teléfono', 'Email'
]

const rows: string[][] = [
  [
    '000008', 'CARRILLO FLORES CARLOS DOROTEO', 'CAFC720928MK5', 'CAFC720928HJCRLR00',
    'Banamex', '002320701676977104', 'CONCRAYO', '048972405154', 'ADMINISTRACION',
    '0', '2023-06-12', 'SERVICIOS GENERALES', '4,000', '571.43', 'ACTIVO', '3319907910',
    'carlos.carrillo@tamyccc.com'
  ],
  [
    '000008', 'CARRILLO FLORES CARLOS DOROTEO', 'CAFC720928MK5', 'CAFC720928HJCRLR00',
    'Banamex', '002320701676977104', 'CONCRAYO', '048972405154', 'ADMINISTRACION',
    '0', '2023-06-12', 'SERVICIOS GENERALES', '4,000', '571.43', 'ACTIVO', '3319907910',
    'carlos.carrillo@tamyccc.com'
  ]
]

export const List = (): JSX.Element => {
  return (
    <section className="list">
      <div className="list-container">
        <table className='content'>
          <thead>
            <tr>
              {
                filters.map((filter: string) => (
                  <>
                    <th key={filter}>
                      <p>{ filter }</p>
                      <div className="filter-list">
                        <MdArrowDropUp />
                        <MdArrowDropDown />
                      </div>
                    </th>
                  </>
                ))
              }
            </tr>
          </thead>
          <tbody>
            {
              rows.map((row: string[], index: number) => (
                <tr key={index}>
                  {
                    row.map((info: string) => (
                      <td key={info}>
                        <p>{ info }</p>
                      </td>
                    ))
                  }
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </section>
  )
}