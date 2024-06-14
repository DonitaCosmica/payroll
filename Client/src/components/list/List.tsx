import { useContext } from "react"
import { NavigationContext } from "../../context/Navigation"
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md"
import './List.css'

interface Props {
  setId: React.Dispatch<React.SetStateAction<string>>
}

export const List: React.FC<Props> = ({ setId }): JSX.Element => {
  const { columnNames, data } = useContext(NavigationContext)

  const getIdSelected = (info: (number | string)[]): void => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    const uuid = info.find(item => typeof item === 'string' && uuidRegex.test(item))
    uuid ? setId(String(uuid)) : console.error('No valid UUID found in the provided info.')
  }
  
  return (
    <section className="list">
      <div className="list-container">
        <table className='content'>
          <thead>
            <tr>
              {columnNames.map((filter: string) => (
                <th key={filter}>
                  <p>{ filter }</p>
                  <div className="filter-list">
                    <MdArrowDropUp />
                    <MdArrowDropDown />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row: (string | number)[], index: number) => {
              return (
                <tr key={ index } onClick={ () => getIdSelected(row) }>
                {row.map((info: number | string, cellIndex: number) => (
                  <td key={`${ info }-${ cellIndex }`}>
                    {Array.isArray(info) ? (
                      <p>{ info.join(', ') }</p>
                    ) : (
                      <p>{ info }</p>
                    )}
                  </td>
                ))}
              </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}