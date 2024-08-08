import { useEffect, useMemo, useState } from 'react'
import { usePeriodContext } from '../../context/Period'
import { useCurrentWeek } from '../../hooks/useCurrentWeek'
import { type IWeekYear, type IPeriod } from '../../types'
import { IoIosArrowForward } from "react-icons/io"
import './Accordion.css'

interface Props {
  year: number,
  period: IPeriod[]
}

export const Accordion: React.FC<Props> = ({ year, period }) => {
  const weeks: IWeekYear[] = useMemo(() => period.map(pr => ({ year: pr.year, week: pr.periodNumber })), [period])
  const { weekRanges } = useCurrentWeek({ input: weeks })
  const { dispatch, setActionType } = usePeriodContext()
  const [isCollapsed, setIsCollapsed] = useState(true)

  useEffect(() => setActionType('SET_PERIOD'), [ setActionType ])

  const handleCollapsed = (event: React.MouseEvent<HTMLLIElement>): void => {
    event.stopPropagation();
    setIsCollapsed(!isCollapsed)
  }

  const getPeriodSelected = (period: IPeriod): void => 
    dispatch({
      type: 'SET_WEEK',
      payload: { week: period.periodNumber, year: period.year }
    })

  return (
    <div className='container'>
      <li className='year-filter' onClick={ handleCollapsed }>
        <IoIosArrowForward />
        <strong>{ year }</strong>
      </li>
      <ul className={`accordion ${ isCollapsed ? 'collapsed' : 'expanded' }`}>
        {period.map((pr: IPeriod, index: number) => {
          const { monday, sunday } = weekRanges[index] || { monday: 'No Data', sunday: 'No Data' }

          return (
            <li key={ pr.periodId } onClick={ () => getPeriodSelected(pr) }>
              { `${ pr.periodNumber } [ ${ monday } - ${ sunday } ]` }
            </li>
          )
        })}
      </ul>
    </div>
  )
}