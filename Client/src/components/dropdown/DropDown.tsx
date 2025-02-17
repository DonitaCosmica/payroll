import React, { ChangeEvent, JSX, useState } from 'react'
import { type IDropDownMenu } from '../../types'
import { Each } from '../../utils/Each'
import { compareNames, findKeyAndGetValue } from '../../utils/modifyData'
import './DropDown.css'

interface Props {
  options: IDropDownMenu[] | [],
  selectedId: string,
  value: string,
  isDisabled: boolean,
  setFormData: (data: Record<string, unknown>) => void
  setLoading?: React.Dispatch<React.SetStateAction<boolean>>
}

export const DropDown: React.FC<Props> = React.memo(({ options, selectedId, value, isDisabled, setFormData, setLoading }): JSX.Element => {
  const [selectedValue, setSelectedValue] = useState<string>(value)
  const sortedOptions = [...options].sort((a: IDropDownMenu, b: IDropDownMenu) => {
    const extractNumber = (str: string): number | null => {
      const match = str.match(/\d+/)
      return match ? parseInt(match[0], 10) : null
    }
  
    const getNameOrDescription = (obj: Record<string, any>): any => 
      obj.name ?? obj.description ?? ''
  
    const nameA = getNameOrDescription(a)
    const nameB = getNameOrDescription(b)
    const numA = typeof nameA === 'string' ? extractNumber(nameA) : nameA
    const numB = typeof nameB === 'string' ? extractNumber(nameB) : nameB
    return compareNames(numA ?? nameA, numB ?? nameB)
  })
  
  const handleChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    const { id, value } = event.target
    if ((id === 'employee' || id === 'jobPosition') && setLoading)
      setLoading(prev => !prev)

    setSelectedValue(value)
    setFormData({ [id]: value })
  }

  return (
    <select id={ `${ selectedId }` } value={ selectedValue } onChange={ handleChange } disabled={ isDisabled ? true : undefined } autoComplete='off'>
      <option value='0'>Elije una opción...</option>
      <Each of={ sortedOptions } render={(option, index) => 
        <option key={`${ selectedId }-${ index }`} value={ findKeyAndGetValue(option, 'Id')?.toString() }>{ option.name ?? option.description }</option>
      } />
    </select>
  )
})