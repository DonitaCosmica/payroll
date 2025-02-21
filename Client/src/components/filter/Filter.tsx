import { JSX, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { NavigationActionKind, useNavigationContext } from '../../context/Navigation'
import { usePeriodContext } from '../../context/Period'
import { useFetchData } from '../../hooks/useFetchData'
import { type IPayrollType, type IMenuState, type IIconDefinition, type IDataResponse } from "../../types"
import { weekRange } from '../../utils/modifyDates'
import { Each } from '../../utils/Each'
import { DropMenuDates } from '../dropMenuDates/DropMenuDates'
import { DropMenu } from '../dropmenu/DropMenu'
import { FilterSkeleton } from '../../custom/filterSkeleton/FilterSkeleton'
import { IoIosArrowDown } from 'react-icons/io'
import { reorganizeData, sortDataByColumns, translateColumns } from '../../utils/modifyData'
import './Filter.css'

export const Filter = (): JSX.Element => {
  const { option, payroll, dispatch } = useNavigationContext() || { payroll: null }
  const { selectedPeriod } = usePeriodContext()
  const { fetchData, error } = useFetchData<IPayrollType[] | IDataResponse>()
  const [showDropMenu, setShowDropMenu] = useState<IMenuState>({ date: false, text: false })
  const payrollTypesRef = useRef<IIconDefinition[]>([])

  useEffect(() => {
    const fetchPayrollTypes = async (): Promise<void> => {
      const url = 'http://localhost:5239/api/Payroll'
      const result = await fetchData(url)
      if (error) throw new Error(error)
      
      const sortedPayrollTypes = (result as IPayrollType[])?.sort((a, _) =>
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

  const fetchTicketsByPayroll = useCallback(async (payroll: string): Promise<void> => {
    const { week, year } = selectedPeriod
    const url = `http://localhost:5239/api/Ticket/by?week=${ week }&year=${ year }&payrollType=${ payroll }`
    const result = await fetchData(url)
    if (!result) {
      dispatch({ type: NavigationActionKind.ERROR })
      return
    }
    
    const newData = reorganizeData((result as IDataResponse).data)
    const names: string[] = await translateColumns({ opt: option, columnsNames: (result as IDataResponse).columns })
    const columns: string[] = (result as IDataResponse).formColumns
    sortDataByColumns(newData, columns)    

    dispatch({
      type: NavigationActionKind.UPDATEDATA,
      payload: { columnNames: names, keys: columns, data: newData, formData: (result as IDataResponse).formData }
    })
  }, [ selectedPeriod, dispatch ])

  const handleDropMenu = useCallback((value: number | IPayrollType): void => {
    setShowDropMenu(prevState => ({
      ...prevState,
      [typeof value === 'number' ? 'date' : 'text']: !prevState[typeof value === 'number' ? 'date' : 'text']
    }))
  }, [])

  if (payrollTypes.length === 0)
    return <FilterSkeleton />

  return (
    <section className='filters'>
      <div className='container'>
        <Each of={ filterData } render={(filter, index) => (
          <div className='filter' key={ filter } onClick={() => {
            if (index === 0) handleDropMenu(index)
          }}>
            <p>{ filter }</p>
            { index === 0 && (<IoIosArrowDown />) }
            { index === 0 && showDropMenu.date && (<DropMenuDates />) }
          </div>
        )} />
        <div className='filter' onClick={ () => handleDropMenu(payroll) }>
          <p>{ payroll && payroll.name ? payroll.name : 'Error' }</p>
          <IoIosArrowDown />
          {showDropMenu.text && 
            <DropMenu
              menuOp={payrollTypes.map(op => ({
                ...op,
                onClick: (): void => {
                  fetchTicketsByPayroll(op.label)

                  dispatch({
                    type: NavigationActionKind.UPDATEPAYROLL,
                    payload: { payroll: { payrollId: op.id, name: op.label, payrollType: 'Secondary' } }
                  })
                }
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