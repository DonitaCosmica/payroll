import React, { JSX, Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { NavigationActionKind, useNavigationContext } from '../../context/Navigation'
import { usePeriodContext } from '../../context/Period'
import { useFetchData } from '../../hooks/useFetchData'
import { type IPayrollType, type IMenuState, type IIconDefinition } from "../../types"
import { weekRange } from '../../utils/modifyDates'
import { DropMenu } from '../dropmenu/DropMenu'
import { IoIosArrowDown } from 'react-icons/io'
import './Filter.css'

const DropMenuDates = React.lazy(() => import('../dropMenuDates/DropMenuDates').then(module => ({ default: module.DropMenuDates })))

export const Filter = (): JSX.Element => {
  const { payroll, dispatch } = useNavigationContext() || { payroll: null }
  const { selectedPeriod } = usePeriodContext()
  const { fetchData, error } = useFetchData<IPayrollType[]>()
  const [showDropMenu, setShowDropMenu] = useState<IMenuState>({ date: false, text: false })
  const payrollTypesRef = useRef<IIconDefinition[]>([])

  useEffect(() => {
    const fetchPayrollTypes = async (): Promise<void> => {
      const url = 'http://localhost:5239/api/Payroll'
      const result = await fetchData(url)
      if (error) throw new Error(error)
      
      const sortedPayrollTypes = result?.sort((a, _) =>
        a.payrollType === 'Principal' ? -1 : 1
      )

      payrollTypesRef.current = sortedPayrollTypes?.map((type) => ({
        id: type.payrollId,
        label: type.name
      })) || []
    }

    fetchPayrollTypes()
  }, [])

  const payrollTypes = useMemo(() => payrollTypesRef.current, [ payrollTypesRef.current ])

  const filterData = useMemo(() => {
    if (selectedPeriod.week === 0 || selectedPeriod.year === 0) return []

    const { monday, sunday } = weekRange(selectedPeriod.week, selectedPeriod.year)
    const { week, year } = selectedPeriod

    return [ `${ year } - Periodo ${ week }`, `${ monday } a ${ sunday }` ]
  }, [ selectedPeriod ])

  const handleDropMenu = useCallback((value: number | IPayrollType): void => {
    const key: string = typeof value === 'number' ? 'date' : 'text'
    setShowDropMenu(prevState => ({
      ...prevState,
      [key]: !prevState[key]
     }))
  }, [])

  if (payrollTypes.length === 0)
    return <p>Cargando datos...</p>

  return (
    <section className='filters'>
      <div className='container'>
        {filterData.map((filter: string, index: number) => (
          <div className='filter' key={ filter } onClick={() => {
            if (index === 0) handleDropMenu(index)
          }}>
            <p>{ filter }</p>
            {index === 0 && (
              <IoIosArrowDown />
            )}
            {index === 0 && showDropMenu.date && (
              <Suspense fallback={ <div>Loading dates ...</div> }>
                <DropMenuDates />
              </Suspense>
            )}
          </div>
        ))}
        <div className='filter' onClick={ () => handleDropMenu(payroll) }>
          <p>{ payroll && payroll.name ? payroll.name : 'Error' }</p>
          <IoIosArrowDown />
          {showDropMenu.text && 
            <DropMenu
              menuOp={payrollTypes.map(op => ({
                ...op,
                onClick: (): void =>
                  dispatch({
                    type: NavigationActionKind.UPDATEPAYROLL,
                    payload: { payroll: { payrollId: op.id, name: op.label, payrollType: 'Secondary' } }
                  })
              }))}
              dir='left'
              context='payroll'
            />  
          }
        </div>
      </div>
    </section>
  )
}