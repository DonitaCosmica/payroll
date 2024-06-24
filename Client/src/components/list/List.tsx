import { useContext } from "react"
import { NavigationContext } from "../../context/Navigation"
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md"
import './List.css'

interface Props {
  setId: React.Dispatch<React.SetStateAction<string>>
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>
  setToolbarOption: React.Dispatch<React.SetStateAction<number>>
}

export const List: React.FC<Props> = ({ setId, setShowForm, setToolbarOption }): JSX.Element => {
  const { keys, data, columnNames } = useContext(NavigationContext)

  const getIdSelected = (info: (number | string)[]): void => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    const uuid = info.find(item => typeof item === 'string' && uuidRegex.test(item))
    uuid ? setId(uuid as string) : console.error('No valid UUID found in the provided info.')
  }

  const showFormDoubleClick = (info: (number | string)[]): void => {
    getIdSelected(info)
    setToolbarOption(1)
    setShowForm(true)
  }
  
  return (
    <section className="list">
      <div className="list-container">
        <table className='content'>
          <thead>
            <tr>
              {keys.map((filter: string, index: number) => (
                <th key={filter}>
                  <p>{ columnNames[index] }</p>
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
                <tr key={ index } onClick={ () => getIdSelected(row) } onDoubleClick={ () => showFormDoubleClick(row) }>
                {row.map((info: number | string, cellIndex: number) => (
                  <td key={`${ info }-${ cellIndex }`}>
                    <p>{ Array.isArray(info) ? info.join(', ') : info }</p>
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