import { ChangeEvent, useState } from 'react'
import { type IDropDownMenu } from '../../types'
import './DropDown.css'

interface Props {
  options: IDropDownMenu[] | [],
  selectedId: string
}

export const DropDown: React.FC<Props> = ({ options, selectedId }): JSX.Element => {
  const [selectedValue, setSelectedValue] = useState<string>('0')
  
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => 
    setSelectedValue(event.target.value)

  return (
    <select id={`${selectedId}`} value={selectedValue} onChange={handleChange}>
      <option value='0'>Elije una opción...</option>
      {options.map((option: IDropDownMenu, index: number) => 
        <option key={`${selectedId}-${index}`} value={option.value}>{ option.name }</option>
      )}
    </select>
  )
}