import { ChangeEvent, useState } from 'react'
import { type IDropDownMenu } from '../../types'
import './DropDown.css'

interface Props {
  options: IDropDownMenu[] | [],
  selectedId: string,
  setFormData:(value:  React.SetStateAction<{ [key: string]: string }>) => void
}

export const DropDown: React.FC<Props> = ({ options, selectedId, setFormData }): JSX.Element => {
  const [selectedValue, setSelectedValue] = useState<string>('0')
  
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const { id, value } = event.target
    setSelectedValue(value)
    setFormData(prevFormData => ({
      ...prevFormData,
      [id]: value
    }))
  }

  return (
    <select id={`${ selectedId }`} value={ selectedValue } onChange={ handleChange }>
      <option value='0'>Elije una opción...</option>
      {options.map((option: IDropDownMenu, index: number) => {
        const value = Object.values(option)[0]
        return (
          <option key={`${ selectedId }-${ index }`} value={ value }>{ option.name }</option>
        )
      }
      )}
    </select>
  )
}