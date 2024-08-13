import { useEffect, useMemo, useState } from "react"
import { type ListObject, type IDropDownMenu } from "../../types"
import './MultiDropDown.css'

interface Props {
  id: string;
  options: IDropDownMenu[] | []
  value: ListObject[]
  idKey: string
  setFormData: React.MutableRefObject<{ [key: string]: string | number | boolean | string[] | ListObject[] }>
}

export const MultiDropDown: React.FC<Props> = ({ id, options, value, idKey, setFormData }): JSX.Element => {
  const [filteredOptions, setFilteredOptions] = useState<IDropDownMenu[]>([])
  const [isOptionSelected, setIsOptionSelected] = useState<boolean[]>([])
  const [selectedItems, setSelectedItems] = useState<ListObject[]>([])
  const [isAllOptionsSelected, setIsAllOptionsSelected] = useState<boolean>(false)
  const [showMenu, setShowMenu] = useState<boolean>(false)

  const sortedOptions = useMemo(() =>
    Array.isArray(options) ? [...options].sort((a, b) => a.name.localeCompare(b.name)) : [],
    [ options ])

  useEffect(() => {
    const selectedIds = sortedOptions.map(item => item[idKey] as string)
    const selectedIdsSet = new Set(value.map(v => v[idKey] as string))
    const updatedIsOptionSelected = selectedIds.map(id => selectedIdsSet.has(id))
    const allSelected = selectedIds.every(id => selectedIdsSet.has(id))
    const sortValues = value.sort((a, b) => (a.value as string).localeCompare(b.value as string))

    setIsOptionSelected(updatedIsOptionSelected)
    setSelectedItems(sortValues)
    setIsAllOptionsSelected(allSelected)
    setFilteredOptions(sortedOptions)

  }, [sortedOptions, value])

  const isDateKey = (key: string): boolean => {
    const datePatterns = ['date', 'assignedDate', 'dueDate', 'startDate', 'endDate']
    return datePatterns.some(pattern => key.toLowerCase().includes(pattern))
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const filter = e.target.value.toLowerCase().trim()
    const filtered = sortedOptions.filter(opt => opt.name.toLowerCase().includes(filter))
    setFilteredOptions(filtered)
  }

  const updateFormData = (items: ListObject[]): void => { setFormData.current[id] = items }

  const handleSelectAllOptions = (): void => {
    if (isAllOptionsSelected) {
      setSelectedItems([])
      setIsOptionSelected(new Array(sortedOptions.length).fill(false))
      updateFormData([])
    } else {
      const allSelectedItems = sortedOptions.map(option => {
        const newItem = {
          [idKey]: option[idKey],
          value: option.name,
        }
  
        Object.keys(option).map(key => {
          if (isDateKey(key))
            newItem[key] = new Date().toISOString().split('T')[0]
        })
  
        return newItem
      })
      
      setSelectedItems(allSelectedItems)
      setIsOptionSelected(new Array(sortedOptions.length).fill(true))
      updateFormData(allSelectedItems)
    }

    setIsAllOptionsSelected(!isAllOptionsSelected)
  };

  const handleSelectOption = (index: number): void => {
    const item = sortedOptions[index]
    const isSelected = isOptionSelected[index]
    const newIsOptionSelected = [...isOptionSelected]

    const newSelectedItems = isSelected
      ? selectedItems.filter(p => p[idKey] !== item[idKey])
      : [...selectedItems, {
          [idKey]: item[idKey],
          value: item.name,
          ...Object.keys(item).reduce((acc, key) => {
            if (isDateKey(key))
              acc[key.toLowerCase().includes('date') ? 'date' : key] = new Date().toISOString().split('T')[0]
            return acc
          }, {} as Record<string, string | number>)
        }]

    const sortValues = newSelectedItems.sort((a, b) => (a.value as string).localeCompare(b.value as string))
    newIsOptionSelected[index] = !isSelected

    setIsOptionSelected(newIsOptionSelected)
    setSelectedItems(sortValues)
    updateFormData(sortValues)

    const allSelected = newIsOptionSelected.every(selected => selected)
  setIsAllOptionsSelected(allSelected)
  }

  return (
    <div className="multi-select" role="listbox" aria-labelledby="items-label">
      <select id={id} style={{ display: 'none' }}></select>
      <div className="multi-select-header">
        {selectedItems.length === 0 ? (
          <span className="multi-select-header-placeholder">Selecciona Proyecto</span>
        ) : (
          <div className="multi-select-header-option-box">
            {selectedItems.map((item: ListObject) => (
              <span key={ `values-${ item[idKey] as string }` } className="multi-select-header-option" aria-selected="false">
                { item.value }
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
          <div className="multi-select-all" onClick={handleSelectAllOptions}>
            <span className={ `multi-select-option-radio ${ isAllOptionsSelected ? 'active' : '' }` }></span>
            <span className="multi-select-option-text">Seleccionar todos</span>
          </div>
          {filteredOptions.map((opt: IDropDownMenu, index: number) => (
            <div
              key={`option-${ index }-${ opt[idKey] }`}
              className="multi-select-option"
              onClick={() => handleSelectOption(index)}
            >
              <span className={ `multi-select-option-radio ${ isOptionSelected[index] ? 'active' : '' }` }></span>
              <span className="multi-select-option-text">{ opt.name }</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}