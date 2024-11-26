import { useCallback, useEffect, useRef, useState } from "react"
import { NavigationActionKind, useNavigationContext } from "../../context/Navigation"
import { useCurrentWeek } from "../../hooks/useCurrentWeek"
import { type DataObject, type ListObject } from "../../types"
import { MdArrowDropDown, MdArrowDropUp } from "react-icons/md"
import { toCamelCase } from '../../utils/modifyData'
import './List.css'

interface Props {
  searchFilter: string
  updateTableWork: boolean
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>
  setUpdateTableWork: React.Dispatch<React.SetStateAction<boolean>>
}

export const List: React.FC<Props> = ({ searchFilter, updateTableWork, setShowForm, setUpdateTableWork}): JSX.Element => {
  const { option, data, columnNames, formData: formDataRes, dispatch } = useNavigationContext()
  const { isDisabled } = useCurrentWeek({ input: [] })
  const [filteredValues, setFilteredValues] = useState<DataObject[]>(data)
  const columnsDictionary = useRef<Record<string, string>>({})
  const rowSelected = useRef<number>(-1)
  const columnCountSelected = useRef<number>(0)
  const formData = useRef<DataObject[]>([])
  const perceptions = useRef<ListObject[]>([])
  const deductions = useRef<ListObject[]>([])

  useEffect(() => {
    const fetchDataAsync = async (): Promise<void> => {
      const [perceptionsRes, deductionsRes, translateRes]: [Response, Response, Response] = await Promise.all([
        fetch('http://localhost:5239/api/Perception'),
        fetch('http://localhost:5239/api/Deduction'),
        fetch('/src/data/translations.json')
      ])
      
      const [perceptionsObj, deductionsObj, translateObj] = await Promise.all([perceptionsRes.json(), deductionsRes.json(), translateRes.json()])
      perceptions.current = perceptionsObj.data
      deductions.current = deductionsObj.data
      columnsDictionary.current = translateObj[option]
    }

    rowSelected.current = -1
    formData.current = formDataRes
    setFilteredValues(data)
    fetchDataAsync()
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

  useEffect(() => {
    const updateData = async () => {
      if (!updateTableWork) return

      const requestOptions = {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData.current)
      }

      formData.current.forEach(item => {
        if ('perceptions' in item && Array.isArray(item.perceptions)) {
          item.perceptions.forEach(perception => {
            if ('compensationType' in perception) 
              delete perception.compensationType
          })
        }
      })

      try {
        const res: Response = await fetch('http://localhost:5239/api/TableWork', requestOptions)
        if (!res.ok) {
          const errorData = await res.json()
          console.error('Request error: ', errorData)
        }
      } catch (error) {
        console.error('Request error: ', error)
      } finally {
        setUpdateTableWork(false)
      }
    }

    updateData()
  }, [ updateTableWork ])

  const getIdSelected = useCallback((info: (string | number | boolean)[]): void => {
    const uuid = info.find(item => typeof item === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(item))
    uuid ? dispatch({
      type: NavigationActionKind.UPDATESELECTEDID,
      payload: { selectedId: uuid as string }
    }) : console.error('No valid UUID found in the provided info.')
  }, [ dispatch ])

  const getValueByKeyIncludes = (obj: DataObject, searchKey: string): string | number | boolean | object | undefined => {
    const foundKey = Object.keys(obj).find((key: string) => searchKey.includes(key))
    return foundKey ? obj[foundKey as keyof DataObject] : undefined
  }

  const getKeyByValue = (obj: Record<string, string>, valueToFind: string): string | undefined => {
    for (const key in obj)
      if (obj[key] === valueToFind) return toCamelCase(key)
    return toCamelCase(valueToFind)
  }

  const getKeyId = (obj: ListObject): string | undefined => {
    for (const key in obj)
      if (key.toLowerCase().includes('id')) return key
    return undefined
  }

  const isDayOfWeek = (day: string): boolean => {
    const daysOfWeek = new Set([
      'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
    ])
    const formattedDay = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()
    return daysOfWeek.has(formattedDay)
  }

  const selectedRow = useCallback((row: (string | number | boolean)[], index: number): void => {
    if (!isDisabled) getIdSelected(row)
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

  const renderCellContent = useCallback((row: DataObject, column: string): number | string => {
    const key = Object.keys(columnsDictionary.current).find(key => columnsDictionary.current[key] === column) ?? column
    const newKey = key === key.toUpperCase() ? key.toLowerCase() : toCamelCase(key)
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
  }, [formData.current])

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
        const targetArray: ListObject = form[property] as any
        if (Array.isArray(targetArray)) {
          const objIndex = targetArray.findIndex(item => typeof item !== 'string' && toCamelCase(item.name as string).trim() === key.trim())
          if (objIndex !== -1 && typeof targetArray[objIndex] !== 'string' && 'value' in targetArray[objIndex])
            targetArray[objIndex].value = value
          else {
            const item = resultItems.find(item => toCamelCase(item.description as string).trim() === key.trim())
            if (item) {
              const id = getKeyId(item)
              if (!id) return

              const newItem: ListObject = {
                [id]: item[id],
                name: item.description,
                value: parseInt(value)
              }

              targetArray.push(newItem)
              targetArray.sort((a, b) => (a.name as string).localeCompare(b.name as string))
            }
          }
        }
      }

      formData.current[index] = form
      return
    }

    if (typeof list[key.trim()] === 'string')
      list[key.trim()] = value
    else if (typeof list[key.trim()] === 'number')
      list[key.trim()] = parseFloat(value.replace(',', '.'))

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
    filteredValues.forEach((row: DataObject) => {
      const property = getKeyByValue(columnsDictionary.current, column)
      if (row[property as string] !== undefined && !isNaN(Number(row[property as string]))) {
        const numberValue = parseFloat(row[property as string] as string)
        if (!totals[column]) totals[column] = 0
        totals[column] += numberValue
      }
    })

    return totals
  }, [ filteredValues ])

  const renderTotalContent = useCallback((column: string): string | number => {
    const totals = calculateTotals(column)
    if (column === 'Proyectos') return 'Total'
    if (column === 'Empleado') return 'Periodo'
    if (column === 'Puesto de trabajo') return filteredValues.length
    return totals[column] ?? ''
  }, [ filteredValues ])

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
                onDoubleClick={ () => isDisabled ? () => {} : showFormDoubleClick(Object.values(row)) }
              >
                {columnNames.map((column: string, cellIndex: number) => (
                  <td key={ `$data-${ column }-${ cellIndex }` }>
                    {option !== NavigationActionKind.TABLEWORK
                      ? (<p>{ renderCellContent(row, column) }</p>
                      ): (
                        <input
                          type="text"
                          id={ `${ getKeyByValue(columnsDictionary.current, column) } - ${ index }` }
                          autoComplete="off"
                          onChange={ (e) => handleChange(e, index) }
                          defaultValue={ column !== 'Hora Extra' && column !== 'Total' ? renderCellContent(row, column) : undefined }
                          value={ column === 'Hora Extra' || column === 'Total' ? renderCellContent(row, column) : undefined }
                        />
                      )}
                  </td>
                ))}
              </tr>
            ))}
            {option === NavigationActionKind.TABLEWORK && (
              <tr className="total-row">
                {columnNames.map((column: string, cellIndex: number) => (
                  <td key={ `total-${ column }-${ cellIndex }` }>
                    <p>{ renderTotalContent(column) }</p>
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}