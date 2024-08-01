import { useCallback, useContext, useEffect, useRef } from "react"
import { NavigationContext } from "../../context/Navigation"
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md"
import './List.css'

interface Props {
  setId: React.Dispatch<React.SetStateAction<string>>
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>
  setToolbarOption: React.Dispatch<React.SetStateAction<number>>
}

export const List: React.FC<Props> = ({ setId, setShowForm, setToolbarOption }): JSX.Element => {
  const { option, keys, data, columnNames } = useContext(NavigationContext)
  const rowSelected = useRef<number>(-1)

  useEffect(() => { rowSelected.current = -1 }, [ option ])

  const getIdSelected = useCallback((info: (number | string)[]): void => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    const uuid = info.find(item => typeof item === 'string' && uuidRegex.test(item))
    uuid ? setId(uuid as string) : console.error('No valid UUID found in the provided info.')
  }, [ setId ])

  const selectedRow = useCallback((row: (string | number)[], index: number): void => {
    getIdSelected(row)
    rowSelected.current = index
  }, [ getIdSelected ])

  const showFormDoubleClick = useCallback((info: (number | string)[]): void => {
    getIdSelected(info)
    setToolbarOption(1)
    setShowForm(true)
  }, [ getIdSelected, setToolbarOption, setShowForm ])

  const renderCellContent = (info: number | string | boolean | string[]): number | string => {
    switch (typeof info) {
      case 'boolean':
        return info ? 'Verdadero' : 'Falso'
      case 'object':
        if (Array.isArray(info))
          return info.sort((a, b) => a.localeCompare(b)).join(', ')
        break;
      default:
        return info
    }

    return info
  }
  
  return (
    <section className="list">
      <div className="list-container">
        <table id='data-list' className='content'>
          <thead>
            <tr>
              {keys.map((filter: string, index: number) => (
                <th key={ filter }>
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
                <tr 
                  key={ index }
                  className={ rowSelected.current === index ? 'selected-row' : '' }
                  onClick={ () => selectedRow(row, index) } 
                  onDoubleClick={ () => showFormDoubleClick(row) }
                >
                {row.map((info: number | string, cellIndex: number) => (
                  <td key={`${ info }-${ cellIndex }`}>
                    <p>{ renderCellContent(info) }</p>
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