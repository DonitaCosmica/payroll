import { ChangeEvent, useState } from 'react'
import { type IDropDownMenu } from '../../types'
import './DropDown.css'

interface Props {
  options: IDropDownMenu[] | [],
  selectedId: string,
  value: string,
  setFormData: React.MutableRefObject<{ [key: string]: string | number | boolean | string[] }>
}

export const DropDown: React.FC<Props> = ({ options, selectedId, value, setFormData }): JSX.Element => {
  const [selectedValue, setSelectedValue] = useState<string>(value)
  const sortedOptions = [...options].sort((a, b) => a.name.localeCompare(b.name))
  
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const { id, value } = event.target

    setSelectedValue(value)
    setFormData.current[id] = value
  }

  const filterAttributesContainingId = (obj: IDropDownMenu): string | undefined => {
    const key = Object.keys(obj).find((key: string) => key.includes('Id'))
    return key ? (obj as any)[key] : undefined
  }

  return (
    <select id={`${ selectedId }`} value={ selectedValue } onChange={ handleChange }>
      <option value='0'>Elije una opción...</option>
      {sortedOptions.map((option: IDropDownMenu, index: number) => 
        <option key={`${ selectedId }-${ index }`} value={ filterAttributesContainingId(option) }>{ option.name }</option>
      )}
    </select>
  )
}