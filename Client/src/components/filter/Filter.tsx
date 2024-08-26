import { useCallback, useEffect, useMemo, useState } from 'react'
import { NavigationActionKind, useNavigationContext } from '../../context/Navigation'
import { usePeriodContext } from '../../context/Period'
import { useCurrentWeek } from '../../hooks/useCurrentWeek'
import { type IMenuState } from "../../types"
import { PAYROLL_TYPE_OP } from '../../consts'
import { DropMenu } from '../dropmenu/DropMenu'
import { DropMenuDates } from '../dropMenuDates/DropMenuDates'
import { IoIosArrowDown } from "react-icons/io"
import './Filter.css'

export const Filter = (): JSX.Element => {
  const { payroll, dispatch } = useNavigationContext()
  const { selectedPeriod, setActionType } = usePeriodContext()
  const [showDropMenu, setShowDropMenu] = useState<IMenuState>({ date: false, text: false })
  const { weekRanges } = useCurrentWeek({ input: selectedPeriod })

  useEffect(() => setActionType('FETCH_DATA') ,[ setActionType ])

  const filterData = useMemo(() => {
    if (selectedPeriod.week === 0 || selectedPeriod.year === 0) return []

    const { monday, sunday } = weekRanges[0] || { monday: '', sunday: '' }
    const { week, year } = selectedPeriod
    return [
      `${ year } - Periodo ${ week }`,
      `${ monday } a ${ sunday }`
    ]
  }, [ weekRanges, selectedPeriod ])

  const handleDropMenu = useCallback((value: number | string): void => {
    const key: string = typeof value === 'number' ? 'date' : 'text'
    setShowDropMenu(prevState => ({
      ...prevState,
      [key]: !prevState[key]
     }))
  }, [])

  const setPayrollType = useCallback((opt: string): void =>
    (opt === 'Ordinario' || opt === 'ExtraOrdinario')
      ? dispatch({ type: NavigationActionKind.UPDATEPAYROLL, payload: { payrollType: opt } })
      : console.error('Invalid payroll type: ', opt)
    , [ dispatch ])

  return (
    <section className='filters'>
      <div className='container'>
        {filterData.map((filter: string, index: number) => (
          <div className='filter' key={ filter } onClick={() => {
            if (index === 0) handleDropMenu(index)
          }}>
            <p>{ filter }</p>
            { index === 0 && <IoIosArrowDown /> }
            { index === 0 && showDropMenu.date && <DropMenuDates /> }
          </div>
        ))}
        <div className='filter' onClick={ () => handleDropMenu(payroll) }>
          <p>{ payroll }</p>
          <IoIosArrowDown />
          {showDropMenu.text && 
            <DropMenu
              menuOp={PAYROLL_TYPE_OP.map(op => ({
                ...op,
                onClick: () => setPayrollType(op.label)
              }))}
              dir={ 'left' }
              width={ 175 }
            />}
        </div>
      </div>
    </section>
  )
}