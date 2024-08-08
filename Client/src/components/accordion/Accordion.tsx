import { useEffect, useState } from 'react'
import { usePeriodContext } from '../../context/Period'
import { useCurrentWeek } from '../../hooks/useCurrentWeek'
import { type IWeekYear } from '../../types'
import { IoIosArrowForward } from "react-icons/io"
import './Accordion.css'

interface Props {
  year: number,
  period: IWeekYear[]
}

export const Accordion: React.FC<Props> = ({ year, period }) => {
  const { weekRanges } = useCurrentWeek({ input: period })
  const { dispatch, setActionType } = usePeriodContext()
  const [isCollapsed, setIsCollapsed] = useState(true)

  useEffect(() => setActionType('SET_PERIOD'), [ setActionType ])

  const handleCollapsed = (event: React.MouseEvent<HTMLLIElement>): void => {
    event.stopPropagation();
    setIsCollapsed(!isCollapsed)
  }

  const getPeriodSelected = (period: IWeekYear): void => 
    dispatch({
      type: 'SET_WEEK',
      payload: { week: period.week, year: period.year }
    })

  return (
    <div className='container'>
      <li className='year-filter' onClick={ handleCollapsed }>
        <IoIosArrowForward />
        <strong>{ year }</strong>
      </li>
      <ul className={`accordion ${ isCollapsed ? 'collapsed' : 'expanded' }`}>
        {period.map((pr: IWeekYear, index: number) => {
          const { monday, sunday } = weekRanges[index] || { monday: 'No Data', sunday: 'No Data' }

          return (
            <li key={ pr.periodId } onClick={ () => getPeriodSelected(pr) }>
              { `${ pr.week } [ ${ monday } - ${ sunday } ]` }
            </li>
          )
        })}
      </ul>
    </div>
  )
}