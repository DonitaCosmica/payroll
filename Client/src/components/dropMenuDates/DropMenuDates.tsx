import React, { JSX, useEffect, useMemo, useRef, useState } from 'react'
import { usePeriodContext } from '../../context/Period'
import { useFetchData } from '../../hooks/useFetchData'
import { type IWeekYear, type IIconDefinition } from '../../types'
import { Each } from '../../utils/Each'
import { ICON_OPTIONS } from '../../utils/icons'
import { getMondayOfWeek, getWeekNumber } from '../../utils/modifyDates'
import { Accordion } from '../accordion/Accordion'
import { FaCheck } from "react-icons/fa"
import './DropMenuDates.css'

export const DropMenuDates = React.memo((): JSX.Element => {
  const { fetchData, error } = useFetchData()
  const { dates, selectedPeriod, setActionType } = usePeriodContext()
  const [showOptionsPeriod, setShowOptionsPeriod] = useState<boolean>(false)
  const selectedOption = useRef<number>(-1)
  const period = useRef<IWeekYear>({ week: 0, year: 0 })

  useEffect(() => { setActionType('FETCH_DATA') }, [])

  const ICONS = useMemo(() =>
    [
      ...ICON_OPTIONS.common,
      {
        id: 'send',
        label: 'Enviar',
        icon: <FaCheck fontSize='1rem' color='#73ba69' />
      }
    ]
  , [ ICON_OPTIONS ])

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
    setShowOptionsPeriod((prevStatus) => !prevStatus)
    selectedOption.current = index
  }

  const handleSubmit = async (): Promise<void> => {
    const method = period.current.periodId && selectedOption.current === 1 ? 'PATCH' : 'POST'
    const url: string = period.current.periodId && selectedOption.current === 1 
      ? `http://localhost:5239/api/Period/${ selectedPeriod.periodId }`
      : 'http://localhost:5239/api/Period/'

    await fetchData(url, { method, body: period.current })
    if (!error) {
      setShowOptionsPeriod(false)
      setActionType('FETCH_DATA')
    }
  }

  const deletePeriod = async (): Promise<void> => {
    if (!selectedPeriod.periodId) return
    const url = `http://localhost:5239/api/Period/${ selectedPeriod.periodId }`
    await fetchData(url, { method: 'DELETE' })
    if (!error) setActionType('FETCH_DATA')
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.stopPropagation()

    const [year, month, day] = e.target.value.split('-').map(Number)
    const { week, year: yr } = getWeekNumber(new Date(year, month - 1, day))

    period.current = {
      periodId: selectedPeriod.periodId,
      week,
      year: yr
    }
  }
  
  return (
    <div className='drop-menu-dates' style={{ height: showOptionsPeriod ? '1225%' : '1000%' }}>
      <div className='title-menu'>
        <p>Seleccionar Periodo</p>
        <div className='title-menu-options'>
          <Each of={ ICONS } render={(iconOption: IIconDefinition, index: number) => (
            <div
              key={ iconOption.label }
              className='title-menu-option-box'
              onClick={ (e) => handleForm(e, index) }
            >
              { iconOption.icon }
            </div>
          )} />
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
          defaultValue={selectedOption.current === 1 && selectedPeriod.periodId
            ? getMondayOfWeek({ week: selectedPeriod.week, year: selectedPeriod.year })
            : undefined}
        />
      </div>
      <ul style={{ height: showOptionsPeriod ? '75%' : '85%' }}>
        <Each 
          of={ Object.entries(dates).sort(([yearA], [yearB]) => parseInt(yearB) - parseInt(yearA)) }
          render={([year, periods]) =>
            <Accordion 
              key={ year }
              year={ parseInt(year) }
              periods={ periods }
            />
          }
        />
      </ul>
    </div>
  )
})