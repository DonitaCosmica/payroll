import { useCallback, useEffect, useRef, useState } from "react"
import { NavigationActionKind, useNavigationContext } from "../../context/Navigation"
import { type ListObject } from "../../types"
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md"
import './List.css'

interface Props {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>
  searchFilter: string
}

export const List: React.FC<Props> = ({ setShowForm, searchFilter }): JSX.Element => {
  const { option, keys, data, columnNames, dispatch } = useNavigationContext()
  const [filteredValues, setFilteredValues] = useState<(string | number | boolean)[][]>(data)
  const rowSelected = useRef<number>(-1)
  const columnCountSelected = useRef<number>(0)

  useEffect(() => {
    rowSelected.current = -1
    if (data && data.length > 0) setFilteredValues(data)
  }, [ option, data ])

  useEffect(() => {
    const filtered = data.filter((value: (string | number | boolean)[]) =>
      Object.values(value).some((val) => {
        const newVal = typeof val === 'boolean' 
          ? (val ? 'Verdadero' : 'Falso') 
          : (typeof val === 'number' ? val.toString() : val)

        const normalizedSearchFilter = searchFilter.toLowerCase().trim()
        const normalizedVal = newVal.toLowerCase().trim()
        return normalizedVal.includes(normalizedSearchFilter)
      })
    )

    setFilteredValues(filtered)
  }, [ searchFilter, data ])

  const getIdSelected = useCallback((info: (string)[]): void => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    const uuid = info.find(item => typeof item === 'string' && uuidRegex.test(item))
    uuid ? dispatch({
      type: NavigationActionKind.UPDATESELECTEDID,
      payload: { selectedId: uuid as string }
    }) : console.error('No valid UUID found in the provided info.')
  }, [ dispatch ])

  const selectedRow = useCallback((row: string[], index: number): void => {
    getIdSelected(row)
    rowSelected.current = index
  }, [ getIdSelected ])

  const selectedColumn = useCallback((index: number): void => {
    const newDataOrder = [...data]
    const columnType = typeof data[0][index]
    
    columnCountSelected.current++
    const compareValues = (a: (string | number | boolean)[], b: (string | number | boolean)[]): number => {
      const aValue = a[index]
      const bValue = b[index]
      const isAsc = columnCountSelected.current % 2 === 0

      if (columnType === 'string')
        return isAsc ? 
          (aValue as string).localeCompare(bValue as string) : 
          (bValue as string).localeCompare(aValue as string)

      if (columnType === 'number')
        return isAsc ?
          (bValue as number) - (aValue as number) :
          (aValue as number) - (bValue as number)

      if (columnType === 'boolean')
        return isAsc ?
          (aValue === bValue ? 0 : (aValue ? 1 : -1)) :
          (aValue === bValue ? 0 : (aValue ? -1 : 1))
      
      return 0
    } 

    newDataOrder.sort(compareValues)
    setFilteredValues(newDataOrder)
  }, [ data ])

  const showFormDoubleClick = useCallback((info: string[]): void => {
    getIdSelected(info)
    dispatch({
      type: NavigationActionKind.UPDATETOOLBAROPT,
      payload: { toolbarOption: 1 }
    })
    setShowForm(true)
  }, [ getIdSelected, dispatch, setShowForm ])

  const renderCellContent = (info: number | string | boolean | ListObject[]): number | string => {
    if (typeof info === 'boolean') return info ? 'Verdadero' : 'Falso'
    if (Array.isArray(info)) {
      if (info.length > 0 && typeof info[0] === 'object' && 'value' in info[0]) {
        return (info as ListObject[]).sort((a, b) => {
          if (typeof a.value === 'string' && typeof b.value === 'string')
            return a.value.localeCompare(b.value)
          else if (typeof a.value === 'number' && typeof b.value === 'number')
            return a.value - b.value
          else
            return 0
        }).map(obj => obj.value).join(', ')
      }

      if (info.every(item => typeof item === 'string'))
        return (info as string[]).join(', ')
    }
    return info.toString()
  }

  console.log({ filteredValues })
  
  return (
    <section className="list">
      <div className="list-container">
        <table id='data-list' className='content'>
          <thead>
            <tr>
              {keys.map((filter: string, index: number) => (
                <th key={ filter } onClick={ () => selectedColumn(index) }>
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
            {filteredValues.map((row: (string | number | boolean)[], index: number) => {
              return (
                <tr 
                  key={ index }
                  className={ rowSelected.current === index ? 'selected-row' : '' }
                  onClick={ () => selectedRow(row as string[], index) } 
                  onDoubleClick={ () => showFormDoubleClick(row as string[]) }
                >
                {row.map((info: number | string | boolean | ListObject[], cellIndex: number) => (
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