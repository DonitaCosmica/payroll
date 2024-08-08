import { useEffect, useMemo, useState } from 'react'
import { usePeriodContext } from '../../context/Period'
import { useCurrentWeek } from '../../hooks/useCurrentWeek'
import { NavigationActionKind, useNavigationContext } from '../../context/Navigation'
import { type IMenuState } from "../../types"
import { PAYROLL_TYPE_OP } from '../../consts'
import { DropMenu } from '../dropmenu/DropMenu'
import { DropMenuDates } from '../dropMenuDates/DropMenuDates'
import { IoIosArrowDown } from "react-icons/io"
import './Filter.css'

interface Props {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>
}

export const Filter: React.FC<Props> = ({ setShowForm }): JSX.Element => {
  const { payroll, dispatch } = useNavigationContext()
  const { selectedPeriod: { year, week } } = usePeriodContext()
  const [showDropMenu, setShowDropMenu] = useState<IMenuState>({ date: false, text: false })
  const [filterData, setFilterData] = useState<string[]>([])
  const input = useMemo(() => ({ year, week }), [year, week])
  const { weekRanges } = useCurrentWeek({ input })

  useEffect(() => {
    const { monday, sunday } = weekRanges[0] || { monday: 'No Data', sunday: 'No Data' }
    setFilterData([
      `${ year } - Periodo ${ week }`,
      `${ monday } a ${ sunday }`
    ])
  }, [ weekRanges ])

  const handleDropMenu = (value: number | string): void => {
    const key: string = typeof value === 'number' ? 'date' : 'text'
    setShowDropMenu(prevState => ({
      ...prevState,
      [key]: !prevState[key]
     }))
  }

  const setPayrollType = (opt: string): void =>
    (opt === 'Ordinario' || opt === 'ExtraOrdinario')
      ? dispatch({ type: NavigationActionKind.UPDATEPAYROLL, payload: { payrollType: opt } })
      : console.error('Invalid payroll type: ', opt)

  return (
    <section className='filters'>
      <div className='container'>
        {filterData.map((filter: string, index: number) => (
          <div className='filter' key={ filter } onClick={() => handleDropMenu(index)}>
            <p>{ filter }</p>
            { index % 2 === 0 && <IoIosArrowDown /> }
            { index === 0 && showDropMenu.date && <DropMenuDates setShowForm={ setShowForm } /> }
          </div>
        ))}
        <div className='filter' onClick={ () => handleDropMenu(payroll) }>
          <p>{ payroll }</p>
          <IoIosArrowDown />
          {showDropMenu.text && 
            <DropMenu
              menuOp={ PAYROLL_TYPE_OP.map(op => ({
                ...op,
                onClick: () => setPayrollType(op.label)
              })) }
              dir={ 'left' }
              width={ 175 }
            />}
        </div>
      </div>
    </section>
  )
}