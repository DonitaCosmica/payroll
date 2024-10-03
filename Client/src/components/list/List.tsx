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
  const columnsDictionary = useRef<Record<string, string>>({})
  const rowSelected = useRef<number>(-1)
  const columnCountSelected = useRef<number>(0)

  useEffect(() => {
    const getTranslateDocument = async (): Promise<void> => {
      const res: Response = await fetch('/src/data/translations.json')
      const data = await res.json()
      columnsDictionary.current = data[option]
    }

    rowSelected.current = -1
    setFilteredValues(data)
    getTranslateDocument()
  }, [ option, data ])

  useEffect(() => {
    const filtered = data.filter((value: DataObject) =>
      Object.values(value).some((val) => {
        const normalizedVal = (typeof val === 'boolean' ? (val ? 'Verdadero' : 'Falso') : String(val)).toLowerCase().trim()
        return normalizedVal.includes(searchFilter.toLowerCase().trim())
      })
    )

    setFilteredValues(filtered)
  }, [ searchFilter, data, option ])

  const getIdSelected = useCallback((info: (string | number | boolean)[]): void => {
    const uuid = info.find(item => typeof item === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item))
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

    setFilteredValues((prevValues) => [...prevValues].sort(compareValues))
  }, [ data ])

  const showFormDoubleClick = useCallback((info: (string | number | boolean)[]): void => {
    getIdSelected(info)
    dispatch({
      type: NavigationActionKind.UPDATETOOLBAROPT,
      payload: { toolbarOption: 1 }
    })
    setShowForm(true)
  }, [ getIdSelected, dispatch, setShowForm ])

  const toCamelCase = (str: string): string => {
    if (str === str.toUpperCase()) return str.toLowerCase()
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index) =>
      index === 0 ? match.toLowerCase() : match.toUpperCase()
    ).replace(/\s+/g, '')
  }

  const getValueByKeyIncludes = (obj: DataObject, searchKey: string): string | number | boolean | object | undefined => {
    const foundKey = Object.keys(obj).find((key: string) => searchKey.includes(key))
    return foundKey ? obj[foundKey as keyof DataObject] : undefined
  }

  const renderCellContent = (row: DataObject, column: string): number | string => {
    const key = Object.keys(columnsDictionary.current).find(key => columnsDictionary.current[key] === column) ?? column
    const newKey = toCamelCase(key)
    const info = getValueByKeyIncludes(row, newKey)
    
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
            {filteredValues.map((row: DataObject, index: number) => (
              <tr 
                key={ index }
                className={
                  rowSelected.current === index &&
                  option !== NavigationActionKind.TABLEWORK
                  ? 'selected-row' : '' 
                }
                onClick={ () => selectedRow(Object.values(row), index) } 
                onDoubleClick={ () => showFormDoubleClick(Object.values(row)) }
              >
                {columnNames.map((column: string, cellIndex: number) => (
                  <td key={ `$data-{ column }-${ cellIndex }` }>
                    {option !== NavigationActionKind.TABLEWORK
                      ? <p>{ renderCellContent(row, column) }</p>
                      : <input
                          defaultValue={ renderCellContent(row, column) }
                        />}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}