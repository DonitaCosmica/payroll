import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { type ListObject, type IDropDownMenu } from "../../types"
import './MultiDropDown.css'

interface Props {
  id: string,
  options: IDropDownMenu[] | [],
  value: ListObject[],
  idKey: string,
  showAmount: boolean,
  setFormData: React.MutableRefObject<{ [key: string]: string | number | boolean | string[] | ListObject[] }>
}

export const MultiDropDown: React.FC<Props> = ({ id, options, value, idKey, showAmount, setFormData }): JSX.Element => {  
  const [filteredOptions, setFilteredOptions] = useState<IDropDownMenu[]>([])
  const [isOptionSelected, setIsOptionSelected] = useState<boolean[]>([])
  const [isAllOptionsSelected, setIsAllOptionsSelected] = useState<boolean>(false)
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const selectedItemsRef = useRef<ListObject[]>([])
    
  const getDisplayValue = useCallback((item: IDropDownMenu): string =>
    (item.name ?? item.description ?? "").toString(), [])

  const sortedOptions = useMemo(() =>
    Array.isArray(options) ? [...options].sort((a, b) => {
      if ('name' in a && 'name' in b)
        return (a.name as string).localeCompare(b.name as string)
      if ('description' in a && 'description' in b)
        return (a.description as string).localeCompare(b.description as string)
      return 0
    }) : [],
    [ options ])

  useEffect(() => {
    const selectedIds = sortedOptions.map(item => item[idKey] as string)
    const selectedIdsSet = new Set(value.map(v => v[idKey] as string))
    const updatedIsOptionSelected = selectedIds.map(id => selectedIdsSet.has(id))
    const sortValues = value.sort((a, b) => (a.name as string).localeCompare(b.name as string))

    if (!sortValues.some(item => item.name === "Sueldo")) {
      const salaryItem: ListObject = sortedOptions.filter(item => item.name.toLowerCase() === 'sueldo')[0]
      if (salaryItem) {
        if ('compensationType' in salaryItem) delete salaryItem.compensationType
        sortValues.push(salaryItem)

        const salaryPosition = sortedOptions.findIndex(item => item.name.toLowerCase() === 'sueldo')
        updatedIsOptionSelected[salaryPosition] = true
      }
    }

    const allSelected = updatedIsOptionSelected.every(id => id)
    setIsOptionSelected(updatedIsOptionSelected)
    selectedItemsRef.current = sortValues
    setIsAllOptionsSelected(allSelected)
    setFilteredOptions(sortedOptions)

  }, [ sortedOptions, value, idKey ])

  const isDateKey = useCallback((key: string): boolean => {
    const datePatterns = ['date', 'assignedDate', 'dueDate', 'startDate', 'endDate']
    return datePatterns.some(pattern => key.toLowerCase().includes(pattern))
  }, [])

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const filter = e.target.value.toLowerCase().trim()
    const filtered = sortedOptions.filter(opt => getDisplayValue(opt).toLowerCase().includes(filter))
    setFilteredOptions(filtered)
  }, [ sortedOptions, getDisplayValue ])

  const updateFormData = useCallback((items: ListObject[]): void => {
    setFormData.current[id] = items
  }, [ setFormData, id ])

  const handleSelectAllOptions = useCallback((): void => {
    if (isAllOptionsSelected) {
      selectedItemsRef.current = []
      setIsOptionSelected(new Array(sortedOptions.length).fill(false))
      updateFormData([])
    } else {
      const allSelectedItems = sortedOptions.map(option => {
        const newItem: ListObject = {
          [idKey]: option[idKey],
          name: getDisplayValue(option),
        }

        Object.keys(option).forEach(key => {
          if (isDateKey(key))
            newItem[key.toLowerCase().includes('date') ? 'date' : key] = new Date().toISOString().split('T')[0]
          else if(key.toLowerCase() === 'value')
            newItem['value'] = 0
        })

        return newItem
      })
      
      selectedItemsRef.current = allSelectedItems
      setIsOptionSelected(new Array(sortedOptions.length).fill(true))
      updateFormData(allSelectedItems)
    }

    setIsAllOptionsSelected(!isAllOptionsSelected)
  }, [ isAllOptionsSelected, sortedOptions, idKey, getDisplayValue, isDateKey, updateFormData ])

  const handleSelectOption = useCallback((index: number): void => {
    const item = sortedOptions[index]
    const isSelected = isOptionSelected[index]
    const newIsOptionSelected = [...isOptionSelected]

    const newSelectedItems = isSelected
      ? selectedItemsRef.current.filter(p => p[idKey] !== item[idKey])
      : [...selectedItemsRef.current, {
          [idKey]: item[idKey],
          name: getDisplayValue(item),
          ...Object.keys(item).reduce((acc, key) => {
            if (isDateKey(key))
              acc[key.toLowerCase().includes('date') ? 'date' : key] = new Date().toISOString().split('T')[0]
            else if(key.toLowerCase() === 'value')
              acc['value'] = 0
            return acc
          }, {} as Record<string, string | number>)
        }]

    const sortValues = newSelectedItems.sort((a, b) => (a.name as string).localeCompare(b.name as string))
    selectedItemsRef.current = sortValues
    newIsOptionSelected[index] = !isSelected

    setIsOptionSelected(newIsOptionSelected)
    updateFormData(sortValues)

    const allSelected = newIsOptionSelected.every(selected => selected)
    setIsAllOptionsSelected(allSelected)
  }, [ sortedOptions, isOptionSelected, idKey, getDisplayValue, isDateKey, updateFormData ])

  const handleInput = useCallback((e: React.FormEvent<HTMLSpanElement>, opt: IDropDownMenu) => {
    const newValue = e.currentTarget.textContent || ""
    const updatedItems = selectedItemsRef.current.map(item =>
      item[idKey] === opt[idKey]
        ? { ...item, value: parseFloat(newValue.replace('$', '')) ?? 0 }
        : item
    )

    if (JSON.stringify(updatedItems) !== JSON.stringify(selectedItemsRef.current)) {
      selectedItemsRef.current = updatedItems
      updateFormData(updatedItems)
    }
  }, [ idKey, updateFormData ])

  return (
    <div className="multi-select" role="listbox" aria-labelledby="items-label">
      <select id={ id } style={{ display: 'none' }}></select>
      <div className="multi-select-header">
        {selectedItemsRef.current.length === 0 ? (
          <span className="multi-select-header-placeholder">Selecciona Proyecto</span>
        ) : (
          <div className="multi-select-header-option-box">
            {selectedItemsRef.current.map((item: ListObject) => (
              <span key={ `values-${ item[idKey] as string }` } className="multi-select-header-option" aria-selected="false">
                { item.name }
              </span>
            ))}
          </div>
        )}
        <div className="multi-select-header-box" onClick={ () => setShowMenu(!showMenu) }>
          <i className="multi-select-header-max"></i>
        </div>
      </div>
      {showMenu && (
        <div className="multi-select-options">
          <input
            id="search-option"
            name="search-option"
            type="text"
            placeholder="Buscar..."
            autoComplete="off"
            onChange={ handleSearchChange }
          />
          <div className="multi-select-all" onClick={ handleSelectAllOptions }>
            <span className={ `multi-select-option-radio ${ isAllOptionsSelected ? 'active' : '' }` }></span>
            <div className="multi-select-option-text" style={{ width: '92.5%' }}>
              <span>Seleccionar todos</span>
            </div>
          </div>
          {filteredOptions.map((opt: IDropDownMenu, index: number) => (
            <div
              key={`option-${index}-${opt[idKey]}`}
              className="multi-select-option"
            >
              <span className={ `multi-select-option-radio ${ isOptionSelected[index] ? 'active' : '' }` }
                onClick={ () => handleSelectOption(index) }></span>
              <div className="multi-select-option-text" style={{ width: showAmount && isOptionSelected[index] ? '50%' : '92.5%' }}>
                <span>{ getDisplayValue(opt) }</span>
              </div>
              {showAmount && isOptionSelected[index] && (
                <div className="multi-select-option-amount">
                  <span
                    contentEditable={ true }
                    suppressContentEditableWarning={ true }
                    onInput={(e) => handleInput(e, opt)}
                  >
                    { `$${ selectedItemsRef.current.find(item => item[idKey] === opt[idKey])?.value }` || '$0.00' }
                  </span>
                </div>
              )}
            </div>
          ))}
          {showAmount && (
            <>
              <hr />
              <div className="total-amount">
                <div className="total-text">
                  <p>Total</p>
                </div>
                <div className="total-number">
                  <p>{ `$${ selectedItemsRef.current.reduce((acc, item) =>
                      acc + parseFloat(String(item.value)), 0) }` }
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  )
}