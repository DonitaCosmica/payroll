import { ChangeEvent, useEffect, useState } from 'react'
import { type IDropDownMenu } from '../../types'
import './DropDown.css'

interface Props {
  options: IDropDownMenu[] | [],
  selectedId: string,
  value: string,
  setFormData:(value:  React.SetStateAction<{ [key: string]: string }>) => void
}

export const DropDown: React.FC<Props> = ({ options, selectedId, value, setFormData }): JSX.Element => {
  const [selectedValue, setSelectedValue] = useState<string>('0')

  useEffect(() => {
    const foundOption = options.find((opt: IDropDownMenu) => opt.name === value)
    foundOption ? setSelectedValue(Object.values(foundOption)[0]) : setSelectedValue('0')
  }, [ options, value ])
  
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const { id, value } = event.target
    setSelectedValue(value)
    setFormData(prevFormData => ({
      ...prevFormData,
      [id]: value
    }))
  }

  const filterAttributesContainingId = (obj: IDropDownMenu): string | undefined => {
    const key = Object.keys(obj).find((key: string) => key.includes('Id'))
    return key ? (obj as any)[key] : undefined
  }

  return (
    <select id={`${ selectedId }`} value={ selectedValue } onChange={ handleChange }>
      <option value='0'>Elije una opción...</option>
      {options.map((option: IDropDownMenu, index: number) => 
        <option key={`${ selectedId }-${ index }`} value={ filterAttributesContainingId(option) }>{ option.name }</option>
      )}
    </select>
  )
}