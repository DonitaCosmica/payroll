import { ChangeEvent, useState } from 'react'
import { type ListObject, type IDropDownMenu } from '../../types'
import './DropDown.css'

interface Props {
  options: IDropDownMenu[] | [],
  selectedId: string,
  value: string,
  isDisabled: boolean,
  setFormData: React.MutableRefObject<{ [key: string]: string | number | boolean | string[] | ListObject[] }>
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>
}

export const DropDown: React.FC<Props> = ({ options, selectedId, value, isDisabled, setFormData, setLoading }): JSX.Element => {
  const [selectedValue, setSelectedValue] = useState<string>(value)
  const sortedOptions = [...options].sort((a, b) => {
    const extractNumber = (str: string): number | null => {
      const match = str.match(/\d+/)
      return match ? parseInt(match[0], 10) : null
    }
  
    const getNameOrDescription = (obj: { [key: string]: any }) => 
      'name' in obj ? obj.name : obj.description || ''
  
    const nameA = getNameOrDescription(a)
    const nameB = getNameOrDescription(b)
    const numA = typeof nameA === 'string' ? extractNumber(nameA) : nameA
    const numB = typeof nameB === 'string' ? extractNumber(nameB) : nameB
  
    return (numA !== null && numB !== null) ? numA - numB
      : String(nameA).localeCompare(String(nameB))
  })
  
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const { id, value } = event.target
    if ((id === 'employee' || id === 'jobPosition') && setLoading)
      setLoading(prev => !prev)

    setSelectedValue(value)
    setFormData.current[id] = value
  }

  const filterAttributesContainingId = (obj: IDropDownMenu): string | undefined => {
    const key = Object.keys(obj).find((key: string) => key.includes('Id'))
    return key ? (obj as any)[key] : undefined
  }

  return (
    <select id={`${ selectedId }`} value={ selectedValue } onChange={ handleChange } disabled={ isDisabled ? true : undefined }>
      <option value='0'>Elije una opción...</option>
      {sortedOptions.map((option: IDropDownMenu, index: number) => 
        <option key={`${ selectedId }-${ index }`} value={ filterAttributesContainingId(option) }>{ option.name ?? option.description }</option>
      )}
    </select>
  )
}