import React, { useEffect, useRef, useState } from 'react'
import { usePeriodContext } from '../../context/Period'
import { IWeekYear, type IconDefinition } from '../../types'
import { ICON_OPTIONS } from '../../utils/icons'
import { getWeekNumber } from '../../utils/modifyData'
import { Accordion } from '../accordion/Accordion'
import { FaCheck } from "react-icons/fa"
import './DropMenuDates.css'

export const DropMenuDates = ({  }): JSX.Element => {
  const ICONS = [...ICON_OPTIONS.common, { label: 'Enviar', icon: <FaCheck fontSize='1rem' color='#73ba69' /> }]
  const { years, dates, selectedPeriod, setActionType } = usePeriodContext()
  const [showOptionsPeriod, setShowOptionsPeriod] = useState<boolean>(false)
  const selectedOption = useRef<number>(-1)
  const period = useRef<IWeekYear>({ week: 0, year: 0 })

  useEffect(() => { setActionType('FETCH_DATA') }, [])

  const getMondayOfWeek = ({ week, year }: IWeekYear): string => {
    const janFirst = new Date(year, 0, 1)
    const firstMonday = janFirst.getDay() <= 1 
        ? new Date(year, 0, 1 + (1 - janFirst.getDay())) 
        : new Date(year, 0, 1 + (8 - janFirst.getDay()))
    const targetMonday = new Date(firstMonday)
    targetMonday.setDate(firstMonday.getDate() + (week - 1) * 7)
    
    const yearStr = targetMonday.getFullYear()
    const monthStr = String(targetMonday.getMonth() + 1).padStart(2, '0')
    const dayStr = String(targetMonday.getDate()).padStart(2, '0')
    return `${ yearStr }-${ monthStr }-${ dayStr }`
  }

  const handleForm = async (e: React.MouseEvent<HTMLDivElement>, index: number): Promise<void> => {
    e.stopPropagation()
    if ((index === 1 || index === 2) && !selectedPeriod.periodId) return

    switch (index) {
      case 2: 
        await deletePeriod()
        break
      case 3: 
        await handleSubmit()
        break
      default:
        showFormAndSetOption(index)
    }
  }

  const showFormAndSetOption = (index: number): void => {
    setShowOptionsPeriod(true)
    selectedOption.current = index
  }

  const handleSubmit = async (): Promise<void> => {
    const requestOptions = {
      method: period.current.periodId && selectedOption.current === 1 ? 'PATCH' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(period.current)
    }

    const urlToUse: string = period.current.periodId && selectedOption.current === 1 
      ? `http://localhost:5239/api/Period/${ selectedPeriod.periodId }`
      : 'http://localhost:5239/api/Period/'

    try {
      const res: Response = await fetch(urlToUse, requestOptions)
      if (!res.ok) {
        const errorData = await res.json()
        console.error('Request error: ', errorData)
      } else {
        setShowOptionsPeriod(false)
        setActionType('FETCH_DATA')
      }
    } catch (error) {
      console.error('Request error: ', error)
    }
  }

  const deletePeriod = async (): Promise<void> => {
    if (!selectedPeriod.periodId) return
    const requestOptions = { method: 'DELETE' }

    try {
      const res: Response = await fetch(`http://localhost:5239/api/Period/${ selectedPeriod.periodId }`, requestOptions)
      if (!res.ok) {
        const errorData = await res.json()
        console.error('Request error: ', errorData)
      } else
        setActionType('FETCH_DATA')
    } catch (error) {
      console.error('Request error: ', error)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.stopPropagation()

    const selectedDate = new Date(e.target.value)
    period.current = {
      periodId: selectedPeriod.periodId,
      week: getWeekNumber(selectedDate), 
      year: selectedDate.getFullYear()
    }
  }
  
  return (
    <div className='drop-menu-dates' style={{ height: showOptionsPeriod ? '1225%' : '1000%' }}>
      <div className='title-menu'>
        <p>Seleccionar Periodo</p>
        <div className='title-menu-options'>
          {ICONS.map((iconOption: IconDefinition, index: number) => (
            <div
              key={ iconOption.label }
              className='title-menu-option-box'
              onClick={ (e) => handleForm(e, index) }
            >
              { iconOption.icon }
            </div>
          ))}
        </div>
      </div>
      <div className='set-date-box' style={{ display: showOptionsPeriod ? 'flex' : 'none' }}>
        <label htmlFor='period'>Ingrese Fecha</label>
        <input
          id='period'
          name='period'
          type='date'
          autoComplete='off'
          onChange={ (e) => handleChange(e) }
          onClick={ (e) => e.stopPropagation() }
          defaultValue={ 
            selectedOption.current === 1 && selectedPeriod.periodId 
            ? getMondayOfWeek({ week: selectedPeriod.week, year: selectedPeriod.year })
            : undefined}
        />
      </div>
      <ul style={{ height: showOptionsPeriod ? '75%' : '85%' }}>
        {years.map((year: number, index: number) => 
          <Accordion 
            key={ year }
            year={ year }
            period={ dates[index] }
          />
        )}
      </ul>
    </div>
  )
}