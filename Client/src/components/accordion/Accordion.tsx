import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { usePeriodContext } from '../../context/Period'
import { useCurrentWeek } from '../../hooks/useCurrentWeek'
import { type IDataResponse, type IWeekYear } from '../../types'
import { IoIosArrowForward } from "react-icons/io"
import { NavigationActionKind, useNavigationContext } from '../../context/Navigation'
import { reorganizeData } from '../../utils/modifyData'
import './Accordion.css'

interface Props {
  year: number,
  period: IWeekYear[]
}

export const Accordion: React.FC<Props> = React.memo(({ year, period }) => {
  const { weekRanges } = useCurrentWeek({ input: period })
  const { dispatch: updateList } = useNavigationContext()
  const { selectedPeriod, setActionType, dispatch: updatePeriod } = usePeriodContext()
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true)

  useEffect(() => setActionType('SET_PERIOD'), [ setActionType ])

  const sortedPeriods = useMemo(() =>
    [...period].sort((a, b) => b.week - a.week),
    [ period ])

  const handleCollapsed = (event: React.MouseEvent<HTMLLIElement>): void => {
    event.stopPropagation();
    setIsCollapsed((prev) => !prev)
  }

  const setNewList = useCallback(async (period: IWeekYear): Promise<void> => {
    try {
      const res: Response = await fetch(`http://localhost:5239/api/Ticket/by?week=${ period.week }&year=${ period.year }`)
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

  const getPeriodSelected = useCallback((e: React.MouseEvent<HTMLLIElement>, period: IWeekYear): void => {
    e.stopPropagation()
    updatePeriod({
      type: 'SET_WEEK',
      payload: { periodId: period.periodId, week: period.week, year: period.year }
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
        {sortedPeriods.map((pr: IWeekYear, index: number) => {
          const { monday, sunday } = weekRanges[index] || { monday: 'No Data', sunday: 'No Data' }
          const selectedWeek = pr.week === selectedPeriod.week && pr.year === selectedPeriod.year

          return (
            <li
              className={ selectedWeek ? 'selected' : '' }
              key={ pr.periodId }
              onClick={ (e) => getPeriodSelected(e, pr) }
            >
              { `${ pr.week } [ ${ monday } - ${ sunday } ]` }
            </li>
          )
        })}
      </ul>
    </div>
  )
})