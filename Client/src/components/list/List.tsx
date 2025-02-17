import { JSX, useCallback, useEffect, useMemo, useRef, useState } from "react"
import { NavigationActionKind, useNavigationContext } from "../../context/Navigation"
import { usePeriodContext } from "../../context/Period"
import { useSortEmployeesContext } from "../../context/SortEmployees"
import { useFetchData } from "../../hooks/useFetchData"
import { usePrevious } from "../../hooks/usePrevious"
import { type IDataObject, type IListObject } from "../../types"
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md"
import { compareNames, findKeyAndGetValue, getKeyByValue, getKeyId, isDayOfWeek, normalizeValue, toCamelCase } from '../../utils/modifyData'
import { ListSkeleton } from "../../custom/listSkeleton/ListSkeleton"
import './List.css'

interface Props {
  searchFilter: string
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>
}

export const List: React.FC<Props> = ({ searchFilter, setShowForm }): JSX.Element => {
  const { option, data, columnNames, formData: formDataRes, updateTableWork, setUpdateTableWork, dispatch } = useNavigationContext()
  const { isCurrentWeek } = usePeriodContext()
  const { filter } = useSortEmployeesContext()
  const { fetchData } = useFetchData()
  const { prevValue } = usePrevious(data)

  const [loading, setLoading] = useState<boolean>(true)
  const [columnClicked, setColumnClicked] = useState<boolean>(false)
  const formData = useRef<IDataObject[]>([])
  const perceptions = useRef<IListObject[]>([])
  const deductions = useRef<IListObject[]>([])
  const rowSelected = useRef<number>(-1)
  const columnsDictionary = useRef<Record<string, string>>({})
  const columnCountSelected = useRef<number>(0)
  const columnNumber = useRef<number>(-1)

  const fetchDataAsync = useCallback(async (): Promise<void> => {
    setLoading(true)

    try {
      const [perceptionsRes, deductionsRes, translateRes]: [Response, Response, Response] = await Promise.all([
        fetch('http://localhost:5239/api/Perception'),
        fetch('http://localhost:5239/api/Deduction'),
        fetch('/src/data/translations.json')
      ])
      
      const [perceptionsObj, deductionsObj, translateObj] = await Promise.all([
        perceptionsRes.json(),deductionsRes.json(), translateRes.json()])

      perceptions.current = perceptionsObj.data
      deductions.current = deductionsObj.data
      columnsDictionary.current = translateObj[option]
    } catch (error) {
      console.error('Error fetching data: ', error)
    } finally {
      setLoading(false)
    }
  }, [ option ])

  useEffect(() => {
    if (JSON.stringify(data) !== JSON.stringify(prevValue)) {
      rowSelected.current = -1
      formData.current = formDataRes
      fetchDataAsync()
    }
  }, [ option, data ])

  useEffect(() => {
    const updateData = async (): Promise<void> => {
      if (!updateTableWork) return

      formData.current.forEach(item => {
        if ('perceptions' in item && Array.isArray(item.perceptions)) {
          item.perceptions.forEach(perception => {
            if ('compensationType' in perception) 
              delete perception.compensationType
          })
        }
      })

      const url: string = 'http://localhost:5239/api/TableWork'
      const method = 'PATCH'
      const result = await fetchData(url, { method, body: formData.current })
      if (result) console.error('Request error: ', result)
      setUpdateTableWork(false)
    }

    updateData()
  }, [ updateTableWork ])

  const filteredValues = useMemo(() => {
    const compareValues = (a: IDataObject, b: IDataObject): number => {
      const aValue = Object.values(a)[columnNumber.current]
      const bValue = Object.values(b)[columnNumber.current]
      const isAsc = columnCountSelected.current % 2 === 0
      const safeAValue = typeof aValue === 'number' || typeof aValue === 'string' ? aValue : ''
      const safeBValue = typeof bValue === 'number' || typeof bValue === 'string' ? bValue : ''
      const comparisonResult = compareNames(safeAValue, safeBValue)
      return isAsc ? comparisonResult : -comparisonResult
    }

    if (data.length === 0) return [] as IDataObject[]

    const filteredBySearch = data.filter((value: IDataObject) =>
      Object.values(value).some((val) => normalizeValue(val).includes(searchFilter.toLowerCase().trim())))

    const filteredByColumn = columnNumber.current !== -1
      ? filteredBySearch.sort(compareValues)
      : filteredBySearch

    const filteredByStatus = option === NavigationActionKind.EMPLOYEES && filter !== 'default' 
      ? filteredByColumn.filter((value: IDataObject) => 'status' in value && filter.includes(value.status as string)) 
      : filteredByColumn

    return option === NavigationActionKind.EMPLOYEES ? filteredByStatus : filteredByColumn
  }, [ searchFilter, data, option, filter, columnClicked ])

  const getIdSelected = useCallback((info: IDataObject): void => {
    const uuid = findKeyAndGetValue(info, 'Id')

    uuid ? dispatch({
      type: NavigationActionKind.UPDATESELECTEDID,
      payload: { selectedId: uuid as string }
    }) : console.error('No valid UUID found in the provided info.')
  }, [ dispatch ])

  const renderArray = (info: object[]): string => {
    if (info.length > 0 && typeof info[0] === 'object') {
      return (info as IListObject[])
        .sort((a, b) => compareNames(a.name, b.name))
        .map(obj => obj.name)
        .join(', ')
    }

    if (info.every(item => typeof item === 'string'))
      return (info as string[]).join(', ')

    return ''
  }

  const selectedRow = useCallback((row: IDataObject, index: number): void => {
    if (!isCurrentWeek) getIdSelected(row)
    rowSelected.current = index
  }, [ getIdSelected ])

  const showFormDoubleClick = useCallback((info: IDataObject): void => {
    getIdSelected(info)
    dispatch({
      type: NavigationActionKind.UPDATETOOLBAROPT,
      payload: { toolbarOption: 1 }
    })

    setShowForm(true)
  }, [ getIdSelected, dispatch, setShowForm ])

  const renderCellContent = useCallback((row: IDataObject, column: string): number | string => {
    const key = Object.keys(columnsDictionary.current).find(key => columnsDictionary.current[key] === column) ?? column
    const newKey = key === key.toUpperCase() ? key.toLowerCase() : toCamelCase(key)
    const info = findKeyAndGetValue(row, newKey)

    if (info === undefined || info === null) return 'Error'
    if (Array.isArray(info)) return renderArray(info)
    if (typeof info === 'boolean') return info ? 'Verdadero' : 'Falso'
    if (typeof info === 'number' && !['NSS', 'Clave', 'Celular', 'Folio'].includes(column) && !column.includes('Total de'))
      return info.toFixed(2)

    return info.toString()
  }, [ formData.current ])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number): void => {
    const { id, value } = e.target
    const [key, _] = id.split('-')
    const form = formData.current[index]
    const list = filteredValues[index]

    if (form[key.trim()] === undefined && 'perceptions' in form && 'deductions' in form) {
      const property = ['perceptions', 'deductions'].reduce((acc, type) => {
        const items = type === 'perceptions' ? perceptions.current : deductions.current
        return items.find(item => {
          const description = item.description as string
          return typeof description === 'string' && toCamelCase(description.trim()) === key.trim()
        }) ? type : acc
      }, 'none')

      const resultItems = property === 'perceptions' ? perceptions.current : (property === 'deductions' ? deductions.current : [])
      if (property !== 'none') {
        const targetArray: IListObject = form[property] as any
        if (Array.isArray(targetArray)) {
          const objIndex = targetArray.findIndex(item => typeof item !== 'string' && toCamelCase(item.name as string).trim() === key.trim())
          if (objIndex !== -1 && typeof targetArray[objIndex] !== 'string' && 'value' in targetArray[objIndex])
            targetArray[objIndex].value = value
          else {
            const item = resultItems.find(item => toCamelCase(item.description as string).trim() === key.trim())
            if (item) {
              const id = getKeyId(item)
              if (!id) return

              const newItem: IListObject = {
                [id]: item[id],
                name: item.description,
                value: parseInt(value)
              }

              targetArray.push(newItem)
              targetArray.sort((a, b) => compareNames(String(a), String(b)))
            }
          }
        }
      }

      formData.current[index] = form
      return
    }

    if (typeof list[key.trim()] === 'string') list[key.trim()] = value
    else if (typeof list[key.trim()] === 'number') list[key.trim()] = parseFloat(value.replace(',', '.'))

    for (const id in form) {
      if (key.trim() === id)
        form[id] = typeof form[id] === 'number' ? parseFloat(value.replace(',', '.')) : value

      if (isDayOfWeek(id) && key.trim() === id && Array.isArray(form.perceptions)) {
        const hours = parseInt(value) ?? 0
        if (!Number.isNaN(hours)) {
          const salary = form.perceptions.find(item => item.name === 'Sueldo')?.value
          const money = salary / 40 * hours
          list['horaExtra'] = (Number(list['horaExtra']) || 0) + money
          form.perceptions.forEach(item => {
            if (item.name === 'Hora Extra')
              item.value += money
          })
        }
      }
    }

    if (Array.isArray(form.perceptions) && Array.isArray(form.deductions))
      list['total'] = form.perceptions.reduce((acc, item) => acc + item.value , 0)
        - form.deductions.reduce((acc, item) => acc + item.value, 0)

    formData.current[index] = form
  }

  const calculateTotals = useCallback((column: string): Record<string, number> => {
    const totals: Record<string, number> = {}
    filteredValues.forEach((row: IDataObject) => {
      const property = getKeyByValue(columnsDictionary.current, column)
      if (row[property as string] !== undefined && !isNaN(Number(row[property as string]))) {
        const numberValue = parseFloat(row[property as string] as string)
        if (!totals[column]) totals[column] = 0
        totals[column] += numberValue
      }
    })

    return totals
  }, [ filteredValues ])

  const renderTotalContent = useCallback((column: string, index: number): string | number => {
    const totals = calculateTotals(column)

    if (index === 1) return 'Total'
    if (index === 2) return 'Periodo'
    if (index === 3) return filteredValues.length

    return totals[column] ?? ''
  }, [ filteredValues ])

  if (Object.keys(columnsDictionary.current).length === 0 || loading)
    return <ListSkeleton />

  if (filteredValues.length === 0)
    return (
      <section className="list">
        <div className="list-container">
          <table className="content">
            <thead>
              <tr>
                {columnNames.map((column: string) => (
                  <th key={ column }>
                    <p>{ column }</p>
                    <div className="filter-list">
                      <MdArrowDropUp />
                      <MdArrowDropDown />
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="empty-table">
              <tr>
                {[...Array(18)].map((_, id: number) =>
                  <td key={ `cell-${ id }` } className='empty-cell'></td>
                )}
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    )

  return (
    <section className="list">
      <div className="list-container">
        <table id='data-list' className='content'>
          <thead>
            <tr>
              {columnNames.map((column: string, index: number) => (
                <th key={ column } onClick={() => {
                  columnCountSelected.current++
                  columnNumber.current = index
                  setColumnClicked((prevState) => !prevState)
                }}>
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
            {filteredValues.map((row: IDataObject, index: number) => (
              <tr 
                key={ index }
                className={
                  rowSelected.current === index &&
                  option !== NavigationActionKind.TABLEWORK
                  ? 'selected-row' : '' 
                }
                onClick={ () => selectedRow(row, index) } 
                onDoubleClick={ () => isCurrentWeek ? () => {} : showFormDoubleClick(row) }
              >
                {columnNames.map((column: string, cellIndex: number) => {
                  const content = renderCellContent(row, column)
                  return (
                    <td key={ `$data-${ column }-${ cellIndex }` }>
                      {option !== NavigationActionKind.TABLEWORK
                        ? (<p>{ typeof content === 'number' ? content.toFixed(2) : content }</p>
                        ) : (
                          <input
                            type="text"
                            id={ `${ getKeyByValue(columnsDictionary.current, column) } - ${ index }` }
                            autoComplete="off"
                            onChange={ (e) => handleChange(e, index) }
                            defaultValue={ column !== 'Hora Extra' && column !== 'Total' ? content : undefined }
                            value={ column === 'Hora Extra' || column === 'Total' ? content : undefined }
                          />
                        )}
                    </td>
                  )
                })}
              </tr>
            ))}
            {option === NavigationActionKind.TABLEWORK && (
              <tr className="total-row">
                {columnNames.map((column: string, cellIndex: number) => {
                  const content = renderTotalContent(column, cellIndex)
                  return (
                    <td key={ `total-${ column }-${ cellIndex }` }>
                      <p>{ typeof content === 'number' && cellIndex !== 3 ? content.toFixed(2) : content }</p>
                    </td>
                  )
                })}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}