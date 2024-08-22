import { createContext, ReactNode, useContext, useEffect, useReducer, useState } from "react"
import { type IFilterPeriod, type IDates, type IWeekYear } from "../types"

interface PeriodState extends IDates {
  selectedPeriod: IWeekYear,
  loading: boolean,
  error: boolean | null
}

type PeriodAction =
  | { type: 'SET_DATES', payload: IDates }
  | { type: 'SET_WEEK', payload: IWeekYear }
  | { type: 'SET_LOADING', payload: boolean }
  | { type: 'SET_ERROR', payload: boolean | null }

interface PeriodContextType extends PeriodState {
  setActionType: React.Dispatch<React.SetStateAction<'FETCH_DATA' | 'NONE'>>,
  dispatch: React.Dispatch<PeriodAction>
}

const INITIAL_STATE: PeriodState = {
  years: [],
  dates: [[]],
  selectedPeriod: { periodId: '', week: 0, year: 0 },
  loading: false,
  error: null,
} as const

interface Props {
  children: ReactNode
}

export const PeriodContext: React.Context<PeriodContextType> = createContext<PeriodContextType>({
  ...INITIAL_STATE,
  setActionType: () => {},
  dispatch: () => {}
})

const periodReducer = (state: PeriodState, action: PeriodAction): PeriodState => {
  const { type, payload } = action

  switch (type) {
    case 'SET_DATES': {
      return {
        ...state,
        dates: payload.dates,
        years: payload.years,
        loading: false,
        error: null
      }
    }
    case 'SET_WEEK': {
      return {
        ...state,
        selectedPeriod: payload
      }
    }
    case 'SET_LOADING': {
      return {
        ...state,
        loading: payload,
        error: null
      }
    }
    case 'SET_ERROR': {
      return {
        ...state,
        error: payload,
        loading: false
      }
    }
    default:
      return state
  }
}

export const PeriodProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(periodReducer, INITIAL_STATE)
  const [actionType, setActionType] = useState<'FETCH_DATA' | 'NONE'>('FETCH_DATA')

  useEffect(() => {
    const getWeekNumber = (date: Date): number => {
      const currentDate = (typeof date === 'object') ? date : new Date()
      const januaryFirst = new Date(currentDate.getFullYear(), 0, 1)
      const daysToNextMonday = (januaryFirst.getDay() === 1) ? 0 : (7 - januaryFirst.getDay()) % 7
      const nextMonday = new Date(currentDate.getFullYear(), 0, januaryFirst.getDate() + daysToNextMonday)
    
      return (currentDate < nextMonday) ? 52 :
        (currentDate > nextMonday ? Math.ceil((currentDate.getTime() - nextMonday.getTime()) / (24 * 3600 * 1000) / 7) : 1)
    }

    const createYearlyPeriodArray = (filterPeriod: IFilterPeriod): IWeekYear[][] => {
      const periodsByYear: Record<number, IWeekYear[]> = {}

      filterPeriod.periods.map(period => {
        if (!periodsByYear[period.year]) 
          periodsByYear[period.year] = []

        periodsByYear[period.year].push(period)
      })

      return filterPeriod.years.map(year => periodsByYear[year] || [])
    }

    const fetchData = async(): Promise<void> => {
      try {
        const res: Response = await fetch('http://localhost:5239/api/Period')
        const data: IFilterPeriod = await res.json()
        data.years.sort((a: number, b: number) => b - a)
        
        const periods: IWeekYear[][] = createYearlyPeriodArray(data)
        periods.map(period => period.sort((a, b) => a.week - b.week))
        dispatch({ type: "SET_DATES", payload: { years: data.years, dates: periods } })
      
        const today = new Date()
        const week = getWeekNumber(today)
        const year = today.getFullYear()
        const currentPeriod = periods.flat()
          .find(period => period.week === week && period.year === year)

        dispatch({
          type: 'SET_WEEK',
          payload: { periodId: currentPeriod?.periodId, week, year }
        })
      } catch (error) {
        console.error(error)
        dispatch({ type: "SET_ERROR", payload: true })
      } finally {
        setActionType('NONE')
      }
    }

    switch (actionType) {
      case 'FETCH_DATA':
        fetchData()
        break
      case 'NONE':
    }
  }, [ actionType ])

  return (
    <PeriodContext.Provider 
      value={{ 
        ...state,
        setActionType,
        dispatch
      }}>
      { children }
    </PeriodContext.Provider>
  )
}

export const usePeriodContext = (): PeriodContextType => {
  const context = useContext(PeriodContext)
  if (!context) throw new Error('usePeriodContext must be used within a PeriodProvider')
  return context
}