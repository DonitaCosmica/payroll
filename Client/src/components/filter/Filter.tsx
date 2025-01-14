import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { NavigationActionKind, useNavigationContext } from '../../context/Navigation'
import { usePeriodContext } from '../../context/Period'
import { type IPayrollType, type IMenuState, type IconDefinition } from "../../types"
import { weekRange } from '../../utils/modifyDates'
import './Filter.css'

const DropMenu = React.lazy(() => import('../dropmenu/DropMenu').then(module => ({ default: module.DropMenu })))
const DropMenuDates = React.lazy(() => import('../dropMenuDates/DropMenuDates').then(module => ({ default: module.DropMenuDates })))
const IoIosArrowDown = React.lazy(() => import('react-icons/io').then(module => ({ default: module.IoIosArrowDown })))

export const Filter = (): JSX.Element => {
  const { payroll, dispatch } = useNavigationContext()
  const { selectedPeriod } = usePeriodContext()
  const [showDropMenu, setShowDropMenu] = useState<IMenuState>({ date: false, text: false })
  const payrollTypesRef = useRef<IconDefinition[]>([])

  useEffect(() => {
    const fetchPayrollTypes = async (): Promise<void> => {
      try {
        const res: Response = await fetch('http://localhost:5239/api/Payroll')
        if (!res.ok) throw new Error('Failed to fetch payroll types')
        const data: IPayrollType[] = await res.json()
        payrollTypesRef.current = data.map((type) => ({
          id: type.payrollId,
          label: type.name
        }))
      } catch (error) {
        console.error('Error fetching Payroll Types: ', error)
      }
    }

    fetchPayrollTypes()
  }, [])

  const payrollTypes = useMemo(() => payrollTypesRef.current, [ payrollTypesRef.current ])

  const filterData = useMemo(() => {
    if (selectedPeriod.week === 0 || selectedPeriod.year === 0) return []

    const { monday, sunday } = weekRange(selectedPeriod.week, selectedPeriod.year)
    const { week, year } = selectedPeriod

    return [
      `${ year } - Periodo ${ week }`,
      `${ monday } a ${ sunday }`
    ]
  }, [ selectedPeriod ])

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
            {index === 0 && (
              <Suspense fallback={ <div>Loading icon...</div> }>
                <IoIosArrowDown />
              </Suspense>
            )}
            {index === 0 && showDropMenu.date && (
              <Suspense fallback={ <div>Loading dates ...</div> }>
                <DropMenuDates />
              </Suspense>
            )}
          </div>
        ))}
        <div className='filter' onClick={ () => handleDropMenu(payroll) }>
          <p>{ payroll }</p>
          <Suspense fallback={ <div>Loading icon...</div> }>
            <IoIosArrowDown />
          </Suspense>
          {showDropMenu.text && 
            <Suspense fallback={ <div>Loading menu...</div> }>
              <DropMenu
                menuOp={payrollTypes.map(op => ({
                  ...op,
                  onClick: () => setPayrollType(op.label)
                }))}
                dir='left'
                context='dates'
              />  
            </Suspense>}
        </div>
      </div>
    </section>
  )
}