import { ChangeEvent, useState } from 'react'
import { type IDropDownMenu } from '../../types'
import './DropDown.css'

interface Props {
  options: IDropDownMenu[] | [],
  selectedId: string,
  value: string | string[] | boolean | number,
  setFormData: React.MutableRefObject<{ [key: string]: string | number | boolean | string[] }>
}

export const DropDown: React.FC<Props> = ({ options, selectedId, value, setFormData }): JSX.Element => {
  const [selectedValue, setSelectedValue] = useState<string | readonly string[]>(typeof value === 'string' ? value : Array.isArray(value) ? value : [])
  const isMultiSelect = selectedId === 'projects'
  const sortedOptions = [...options].sort((a, b) => a.name.localeCompare(b.name))
  
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const { id, value, selectedOptions } = event.target
    const newValue: string | string[] = isMultiSelect 
      ? Array.from(selectedOptions).map((opt: HTMLOptionElement) => opt.value)
      : value

    setSelectedValue(newValue)
    setFormData.current[id] = newValue
  }

  const filterAttributesContainingId = (obj: IDropDownMenu): string | undefined => {
    const key = Object.keys(obj).find((key: string) => key.includes('Id'))
    return key ? (obj as any)[key] : undefined
  }

  return (
    <select id={`${ selectedId }`} value={ selectedValue } onChange={ handleChange } multiple={ isMultiSelect }>
      <option value='0'>Elije una opción...</option>
      {sortedOptions.map((option: IDropDownMenu, index: number) => 
        <option key={`${ selectedId }-${ index }`} value={ filterAttributesContainingId(option) }>{ option.name }</option>
      )}
    </select>
  )
}