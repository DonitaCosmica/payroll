import { ChangeEvent, useState } from 'react'
import { type ListObject, type IDropDownMenu } from '../../types'
import './DropDown.css'

interface Props {
  options: IDropDownMenu[] | [],
  selectedId: string,
  value: string,
  setFormData: React.MutableRefObject<{ [key: string]: string | number | boolean | string[] | ListObject[] }>
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
}

export const DropDown: React.FC<Props> = ({ options, selectedId, value, setFormData, setLoading }): JSX.Element => {
  const [selectedValue, setSelectedValue] = useState<string>(value)
  const sortedOptions = [...options].sort((a, b) => {
    const extractNumber = (str: string): number => {
      const match = str.match(/\d+/)
      return match ? parseInt(match[0], 10) : NaN
    }

    const nameA = a.name || ''
    const nameB = b.name || ''
    const numA = extractNumber(nameA)
    const numB = extractNumber(nameB)

    if (!isNaN(numA) && !isNaN(numB)) return numA - numB
    return nameA.localeCompare(nameB)
  })
  
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const { id, value } = event.target

    if (id === 'employee')
      setLoading(prev => !prev)

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