import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { type ListObject, type IDropDownMenu } from "../../types"
import './MultiDropDown.css'

interface Props {
  id: string,
  options: IDropDownMenu[] | [],
  value: ListObject[],
  idKey: string,
  isDisabled: boolean,
  discount: React.MutableRefObject<number | null>,
  showAmount: boolean,
  setFormData: React.MutableRefObject<{ [key: string]: string | number | boolean | string[] | ListObject[] }>
}

export const MultiDropDown: React.FC<Props> = ({ id, options, value, idKey, isDisabled, discount, showAmount, setFormData }): JSX.Element => {  
  const [filteredOptions, setFilteredOptions] = useState<IDropDownMenu[]>([])
  const [isOptionSelected, setIsOptionSelected] = useState<boolean[]>([])
  const [isAllOptionsSelected, setIsAllOptionsSelected] = useState<boolean>(false)
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const selectedItemsRef = useRef<ListObject[]>([])
    
  const getDisplayValue = useCallback((item: IDropDownMenu): string =>
    (item.name ?? item.description ?? "").toString(), [])

  const getCompensationType = useCallback((item: IDropDownMenu): string =>
    'compensationType' in item ? String(item.compensationType) : 'Normal', [])

  const sortedOptions = useMemo(() =>
    Array.isArray(options) ? [...options].sort((a, b) => {
      const aName = a.name ?? a.description
      const bName = b.name ?? b.description
      return (aName as string).localeCompare(bName as string)
    }) : [], [ options ])

  useEffect(() => {
    const selectedIds = sortedOptions.map(item => item[idKey] as string)
    const selectedIdsSet = new Set(value.map(v => v[idKey] as string))
    const updatedIsOptionSelected = selectedIds.map(id => selectedIdsSet.has(id))
    const sortValues = value.sort((a, b) => (a.name as string).localeCompare(b.name as string))

    const addItemIfNotPresent = (name: string, matchFn: (item: ListObject) => boolean) => {
      if (!sortValues.some(item => item.name === name)) {
        const itemToAdd = sortedOptions.find(matchFn)
        if (itemToAdd) {
          sortValues.push(itemToAdd)
          const itemPosition = sortedOptions.findIndex(matchFn)
          updatedIsOptionSelected[itemPosition] = true
        }
      }
    }

    addItemIfNotPresent('Sueldo', item => (item.name as string).toLowerCase() === 'sueldo')
    addItemIfNotPresent('Hora Extra', item => (item.name as string).toLowerCase().includes('extra'))
    if (discount.current !== null)
      addItemIfNotPresent('Desc. x Prestamos', item => (item.name as string).toLowerCase().includes('prestamos'))

    const allSelected = updatedIsOptionSelected.every(id => id)
    setIsOptionSelected(updatedIsOptionSelected)
    selectedItemsRef.current = sortValues
    updateFormData(sortValues)
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

  const createListObject = (option: IDropDownMenu): ListObject => {
    const newItem: ListObject = {
      [idKey]: option[idKey],
      name: getDisplayValue(option),
      compensationType: getCompensationType(option),
      ...Object.keys(option).reduce((acc, key) => {
        if (isDateKey(key))
          acc[key.toLowerCase().includes('date') ? 'date' : key] = new Date().toISOString().split('T')[0]
        else if (key.toLowerCase() === 'value')
          acc['value'] = 0
        return acc
      }, {} as Record<string, string | number>),
    }
    return newItem
  }

  const handleSelectAllOptions = useCallback((): void => {
    const allSelected = !isAllOptionsSelected;
    setIsAllOptionsSelected(allSelected);
    const updatedItems = allSelected ? sortedOptions.map(option => createListObject(option)) : [];
    selectedItemsRef.current = updatedItems;
    setIsOptionSelected(new Array(sortedOptions.length).fill(allSelected));
    updateFormData(updatedItems)
  }, [ isAllOptionsSelected, sortedOptions, updateFormData ])

  const handleSelectOption = useCallback((index: number): void => {
    const option = sortedOptions[index];
    const isSelected = isOptionSelected[index];
    const newSelection = isSelected ? selectedItemsRef.current.filter(item => item[idKey] !== option[idKey]) :
      [...selectedItemsRef.current, createListObject(option)];

    selectedItemsRef.current = newSelection;
    setIsOptionSelected(prev => {
      const newSelectionState = [...prev];
      newSelectionState[index] = !isSelected;
      return newSelectionState;
    });

    updateFormData(newSelection);
    setIsAllOptionsSelected(newSelection.length === sortedOptions.length)
  }, [ sortedOptions, isOptionSelected, updateFormData ])

  const updateItemValue = (opt: IDropDownMenu, value: number) => {
    const updatedItems = selectedItemsRef.current.map(item =>
      item[idKey] === opt[idKey] ? { ...item, value } : item)
    if (JSON.stringify(updatedItems) !== JSON.stringify(selectedItemsRef.current)) {
      selectedItemsRef.current = updatedItems
      updateFormData(updatedItems)
    }
  }

  const handleInput = useCallback((e: React.FormEvent<HTMLSpanElement>, opt: IDropDownMenu) => {
    const newValue = parseFloat(e.currentTarget.textContent?.replace('$', '') ?? '0');
    updateItemValue(opt, newValue)
  }, [ idKey, updateFormData ])

  const handleContent = useCallback((e: React.FormEvent<HTMLSpanElement>, opt: IDropDownMenu, selectedItem: ListObject | undefined) => {
    const salary = localStorage.getItem('salary')
    const value = parseFloat(e.currentTarget.textContent ?? '0')

    if (isNaN(value)) return
    if (!salary || isNaN(parseFloat(salary))) return

    const salaryValue = parseFloat(salary)
    const calculateAndUpdate = (factor: number): void => {
      const calculatedValue = salaryValue * factor * value
      updateItemValue(opt, calculatedValue)
    }

    switch (selectedItem?.compensationType) {
      case 'Hours':
        calculateAndUpdate(1 / 40)
        break
      case 'Days':
        calculateAndUpdate(1 / 7)
        break
      case 'Discount':
        updateItemValue(opt, value)
        break
      default:
    }
  }, [])

  const handleDiscount = (e: React.FormEvent<HTMLSpanElement>): void => {
    const value = parseFloat(e.currentTarget.textContent?.replace('$', '') ?? '0')
    discount.current === null
      ? localStorage.setItem('discount', JSON.stringify(value))
      : discount.current = value
  }

  const renderContent = useCallback((value: number, selectedItem: ListObject | undefined): number | null => {
    const salary = localStorage.getItem('salary')
    if (isNaN(value)) return -1
    if (!salary || isNaN(parseFloat(salary))) return -1

    const salaryValue = parseFloat(salary)
    switch (selectedItem?.compensationType) {
      case 'Hours':
        return value ? 40 * value / salaryValue : 0
      case 'Days':
        return value ? 7 * value / salaryValue : 0
      case 'Discount':
        return Number(selectedItem.value)
    }

    return null
  }, [])

  const totalAmount = useMemo(() =>
    selectedItemsRef.current.reduce((acc, item) => acc + (item.value as number), 0)
  , [ selectedItemsRef.current ])

  return (
    <div className="multi-select" role="listbox" aria-labelledby="items-label">
      <select id={ id } style={{ display: 'none' }}></select>
      <div className="multi-select-header">
        {selectedItemsRef.current.length === 0 ? (
          <span className="multi-select-header-placeholder">
            {id.toLowerCase().includes('deductions')
              ? 'Seleccionar Deducciones'
              : id.toLowerCase().includes('perceptions')
                ? 'Seleccionar Percepciones'
                : 'Seleccionar Proyectos'}
          </span>
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
            disabled={ isDisabled }
            onChange={ handleSearchChange }
          />
          <div className="multi-select-all" onClick={ handleSelectAllOptions }>
            <span className={ `multi-select-option-radio ${ isAllOptionsSelected ? 'active' : '' }` }></span>
            <div className="multi-select-option-text" style={{ width: '92.5%' }}>
              <span>Seleccionar todos</span>
            </div>
          </div>
          {filteredOptions.map((opt: IDropDownMenu, index: number) => {
            const selectedItem = selectedItemsRef.current.find(item => item[idKey] === opt[idKey])
            const isEditabled = !isDisabled && selectedItem?.compensationType === 'Discount'
              && (discount.current === null || discount.current === 0)

            return (
              <div
                key={ `option-${ index }-${ opt[idKey] }` }
                className="multi-select-option"
              >
                <span className={ `multi-select-option-radio ${ isOptionSelected[index] ? 'active' : '' }` }
                  onClick={ () => handleSelectOption(index) }></span>
                <div className="multi-select-option-text" style={{ width: showAmount && isOptionSelected[index] ? '50%' : '92.5%' }}>
                  <span>{ getDisplayValue(opt) }</span>
                </div>
                {showAmount && isOptionSelected[index] && (
                  <div className="multi-select-option-amount">
                    {selectedItem && ((selectedItem.compensationType !== 'Hours'
                      && selectedItem.compensationType !== 'Days'
                      && selectedItem.compensationType !== 'Discount')
                      ) ? (
                        <span
                          contentEditable={ true }
                          suppressContentEditableWarning={ true }
                          onInput={(e) => handleInput(e, opt)}
                        >
                          { `$${ selectedItem.value }` || '$0.00' }
                        </span>
                      ) : (
                        <>
                          <span
                            contentEditable={ !isDisabled }
                            suppressContentEditableWarning={ !isDisabled }
                            onInput={(e) => !isDisabled ? handleContent(e, opt, selectedItem) : () => {} }
                          >
                            { renderContent(selectedItem?.value as number, selectedItem) || '0' }
                          </span>
                          <span 
                            className="hours-money"
                            contentEditable={ isEditabled }
                            suppressContentEditableWarning={ isEditabled }
                            onInput={ (e) => isEditabled ? handleDiscount(e) : {} }
                          >
                          { `$${ selectedItem?.compensationType === 'Discount' && discount.current === null
                            ?  parseFloat(localStorage.getItem('discount') || '0') || '0.00'
                            : selectedItem?.compensationType === 'Discount' && discount.current !== null
                              ? discount.current
                              : Number(selectedItem?.value).toFixed(2) }` || '$0.00' }
                          </span>
                        </>
                      )}
                  </div>
                )}
              </div>
          )})}
          {showAmount && (
            <>
              <hr />
              <div className="total-amount">
                <div className="total-text">
                  <p>Total</p>
                </div>
                <div className="total-number">
                  <p>{ `$${ totalAmount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }` }
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