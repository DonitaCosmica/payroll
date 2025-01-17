import React, { JSX, useCallback, useEffect, useState } from 'react'
import { usePeriodContext } from '../../context/Period'
import { IPeriod, type IDataResponse } from '../../types'
import { IoIosArrowForward } from "react-icons/io"
import { NavigationActionKind, useNavigationContext } from '../../context/Navigation'
import { reorganizeData } from '../../utils/modifyData'
import { weekRange } from '../../utils/modifyDates'
import './Accordion.css'

interface Props {
  year: number,
  periods: IPeriod[]
}

export const Accordion: React.FC<Props> = React.memo(({ year, periods }): JSX.Element => {
  const { dispatch: updateList } = useNavigationContext()
  const { selectedPeriod, setActionType, dispatch: updatePeriod } = usePeriodContext()
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true)

  useEffect(() => setActionType('SET_PERIOD'), [ setActionType ])

  const handleCollapsed = (event: React.MouseEvent<HTMLLIElement>): void => {
    event.stopPropagation();
    setIsCollapsed((prev) => !prev)
  }

  const setNewList = useCallback(async (period: IPeriod): Promise<void> => {
    try {
      const res: Response = await fetch(`http://localhost:5239/api/Ticket/by?week=${ period.week }&year=${ year }`)
      const dataResponse: IDataResponse = await res.json()
      if (!res.ok) {
        console.error('Response Error: ', dataResponse)
        updateList({ type: NavigationActionKind.ERROR })
        return
      }

      const newData = reorganizeData(dataResponse.data)
      updateList({
        type: NavigationActionKind.UPDATETABLE,
        payload: { newData, formData: dataResponse.formData }
      })
    } catch (error) {
      console.error(error)
      updateList({ type: NavigationActionKind.ERROR })
    }
  }, [ updateList ])

  const getPeriodSelected = useCallback((e: React.MouseEvent<HTMLLIElement>, period: IPeriod): void => {
    e.stopPropagation()
    updatePeriod({
      type: 'SET_WEEK',
      payload: { periodId: period.periodId, week: period.week, year }
    })
    setNewList(period)
  }, [ setNewList, updatePeriod ])

  return (
    <div className='container'>
      <li className='year-filter' onClick={ handleCollapsed }>
        <IoIosArrowForward />
        <strong>{ year }</strong>
      </li>
      <ul className={`accordion ${ isCollapsed ? 'collapsed' : 'expanded' }`}>
        {periods.map((period: IPeriod) => {
          const { monday, sunday } = weekRange(period.week, year)
          const selectedWeek = period.week === selectedPeriod.week && year === selectedPeriod.year

          return (
            <li
              className={ selectedWeek ? 'selected' : '' }
              key={ period.periodId }
              onClick={ (e) => getPeriodSelected(e, period) }
            >
              { `${ period.week } [ ${ monday } - ${ sunday } ]` }
            </li>
          )
        })}
      </ul>
    </div>
  )
})