import { useContext } from "react"
import { NavigationContext } from "../../context/Navigation"
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md"
import './List.css'

export const List = (): JSX.Element => {
  const { columnNames, data } = useContext(NavigationContext)
  
  return (
    <section className="list">
      <div className="list-container">
        <table className='content'>
          <thead>
            <tr>
              {
                columnNames.map((filter: string) => (
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
                      return (
                        <td key={info}>
                          {
                            Array.isArray(info) ?
                              (
                                info.join(', ')
                              ) :
                              <p>{ info }</p>
                          }
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