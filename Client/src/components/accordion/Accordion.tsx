import React, { useEffect, useMemo, useState } from 'react'
import { usePeriodContext } from '../../context/Period'
import { useCurrentWeek } from '../../hooks/useCurrentWeek'
import { type IWeekYear } from '../../types'
import { IoIosArrowForward } from "react-icons/io"
import './Accordion.css'

interface Props {
  year: number,
  period: IWeekYear[]
}

export const Accordion: React.FC<Props> = React.memo(({ year, period }) => {
  const { weekRanges } = useCurrentWeek({ input: period })
  const { selectedPeriod, setActionType, dispatch } = usePeriodContext()
  const [isCollapsed, setIsCollapsed] = useState<boolean>(true)

  useEffect(() => setActionType('SET_PERIOD'), [ setActionType ])

  const sortedPeriods = useMemo(() =>
    Array.isArray(period) ? [...period].sort((a, b) => b.week - a.week) : [],
    [ period ])

  const handleCollapsed = (event: React.MouseEvent<HTMLLIElement>): void => {
    event.stopPropagation();
    setIsCollapsed(!isCollapsed)
  }

  const getPeriodSelected = (e: React.MouseEvent<HTMLLIElement>, period: IWeekYear): void => {
    e.stopPropagation()
    dispatch({
      type: 'SET_WEEK',
      payload: { periodId: period.periodId, week: period.week, year: period.year }
    })
  }

  return (
    <div className='container'>
      <li className='year-filter' onClick={ handleCollapsed }>
        <IoIosArrowForward />
        <strong>{ year }</strong>
      </li>
      <ul className={`accordion ${ isCollapsed ? 'collapsed' : 'expanded' }`}>
        {sortedPeriods.map((pr: IWeekYear, index: number) => {
          const { monday, sunday } = weekRanges[index] || { monday: 'No Data', sunday: 'No Data' }
          const selectedWeek = pr.week === selectedPeriod.week && 
            pr.year === selectedPeriod.year

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