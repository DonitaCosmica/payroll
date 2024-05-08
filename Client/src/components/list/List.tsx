import { useContext } from "react"
import { NavigationContext } from "../../context/Navigation"
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md"
import './List.css'

const filters: string[] = [
  'Clave', 'Nombre', 'RFC', 'CURP', 'Banco', 'CLABE', 'Proyecto', 'NSS', 'Depto.', 
  'Area Comercial', 'Fecha de ingreso', 'Puesto', 'Salario Base', 'Salario Diario',
  'Status', 'Teléfono', 'Email'
]

export const List = (): JSX.Element => {
  const { data } = useContext(NavigationContext)
  
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
              data.map((row: (string | number)[], index: number) => (
                <tr key={index}>
                  {
                    row.map((info: number | string) => {
                      return(
                        <td key={info}>
                          <p>{ info }</p>
                        </td>
                      )
                    })
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