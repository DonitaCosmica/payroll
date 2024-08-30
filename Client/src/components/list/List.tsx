import { useCallback, useEffect, useRef, useState } from "react"
import { NavigationActionKind, useNavigationContext } from "../../context/Navigation"
import { type DataObject, type ListObject } from "../../types"
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md"
import './List.css'

interface Props {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>
  searchFilter: string
}

export const List: React.FC<Props> = ({ setShowForm, searchFilter }): JSX.Element => {
  const { option, data, columnNames, dispatch } = useNavigationContext()
  const [filteredValues, setFilteredValues] = useState<DataObject[]>(data)
  const rowSelected = useRef<number>(-1)
  const columnCountSelected = useRef<number>(0)

  useEffect(() => {
    rowSelected.current = -1
    if (data && data.length > 0) setFilteredValues(data)
  }, [ option, data ])

  useEffect(() => {
    const filtered = data.filter((value: DataObject) =>
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

  const getIdSelected = useCallback((info: (string | number | boolean)[]): void => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    const uuid = info.find(item => typeof item === 'string' && uuidRegex.test(item))
    uuid ? dispatch({
      type: NavigationActionKind.UPDATESELECTEDID,
      payload: { selectedId: uuid as string }
    }) : console.error('No valid UUID found in the provided info.')
  }, [ dispatch ])

  const selectedRow = useCallback((row: (string | number | boolean)[], index: number): void => {
    getIdSelected(row)
    rowSelected.current = index
  }, [ getIdSelected ])

  const selectedColumn = useCallback((index: number): void => {
    const newDataOrder = [...data]
    const columnType = typeof Object.values(data[0])[index]
    
    columnCountSelected.current++
    const compareValues = (a: DataObject, b: DataObject): number => {
      const aValue = Object.values(a)[index]
      const bValue = Object.values(b)[index]
      const isAsc = columnCountSelected.current % 2 === 0

      if (columnType === 'string')
        return isAsc ? 
          (aValue as string).localeCompare(bValue as string) : 
          (bValue as string).localeCompare(aValue as string)

      if (columnType === 'number')
        return isAsc ?
          (bValue as number) - (aValue as number) :
          (aValue as number) - (bValue as number)
      
      return 0
    } 

    newDataOrder.sort(compareValues)
    setFilteredValues(newDataOrder)
  }, [ data ])

  const showFormDoubleClick = useCallback((info: (string | number | boolean)[]): void => {
    getIdSelected(info)
    dispatch({
      type: NavigationActionKind.UPDATETOOLBAROPT,
      payload: { toolbarOption: 1 }
    })
    setShowForm(true)
  }, [ getIdSelected, dispatch, setShowForm ])

  const renderCellContent = (row: DataObject, column: string): number | string => {
    const key = column.toLowerCase().replace(/\s+/g, '')
    const info = row[key]

    if (typeof info === 'boolean') return info ? 'Verdadero' : 'Falso'
    if (Array.isArray(info)) {
      if (info.length > 0 && typeof info[0] === 'object') {
        return (info as ListObject[]).sort((a, b) => {
          if (typeof a.name === 'string' && typeof b.name === 'string')
            return a.name.localeCompare(b.name)
          else if (typeof a.name === 'number' && typeof b.name === 'number')
            return a.name - b.name
          else
            return 0
        }).map(obj => obj.name).join(', ')
      }

      if (info.every(item => typeof item === 'string'))
        return (info as string[]).join(', ')
    }
    return info !== undefined ? info.toString() : ''
  }
  
  return (
    <section className="list">
      <div className="list-container">
        <table id='data-list' className='content'>
          <thead>
            <tr>
              {columnNames.map((column: string, index: number) => (
                <th key={ column } onClick={ () => selectedColumn(index) }>
                  <p>{ column }</p>
                  <div className="filter-list">
                    <MdArrowDropUp />
                    <MdArrowDropDown />
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredValues.map((row: DataObject, index: number) => {
              const rowInfo = Object.values(row)

              return (
                <tr 
                  key={ index }
                  className={ rowSelected.current === index ? 'selected-row' : '' }
                  onClick={ () => selectedRow(rowInfo, index) } 
                  onDoubleClick={ () => showFormDoubleClick(rowInfo) }
                >
                {columnNames.map((column: string, cellIndex: number) => (
                  <td key={ `$data-{ column }-${ cellIndex }` }>
                    <p>{ renderCellContent(row, column) }</p>
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