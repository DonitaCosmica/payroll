import { createContext, JSX, ReactNode, useContext, useEffect, useMemo, useReducer, useState } from "react"
import { type IDates, type IWeekYear } from "../types"
import { getWeekNumber } from "../utils/modifyDates" 

interface Props {
  children: ReactNode
}

interface PeriodState {
  dates: IDates
  selectedPeriod: IWeekYear,
  loading: boolean,
  error: boolean | null
}

type PeriodAction =
  | { type: 'SET_DATES', payload: { dates: IDates } }
  | { type: 'SET_WEEK', payload: IWeekYear }
  | { type: 'SET_LOADING', payload: boolean }
  | { type: 'SET_ERROR', payload: boolean | null }

interface PeriodContextType extends PeriodState {
  isCurrentWeek: boolean,
  setActionType: React.Dispatch<React.SetStateAction<'FETCH_DATA' | 'SET_PERIOD' | 'NONE'>>,
  dispatch: React.Dispatch<PeriodAction>
}

const INITIAL_STATE: PeriodState = {
  dates: {},
  selectedPeriod: { periodId: '', week: 0, year: 0 },
  loading: false,
  error: null,
} as const

export const PeriodContext: React.Context<PeriodContextType> = createContext<PeriodContextType>({
  ...INITIAL_STATE,
  isCurrentWeek: true,
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
export const PeriodProvider: React.FC<Props> = ({ children }): JSX.Element => {
  const [state, dispatch] = useReducer(periodReducer, INITIAL_STATE)
  const [actionType, setActionType] = useState<'FETCH_DATA' | 'SET_PERIOD' | 'NONE'>('SET_PERIOD')

  useEffect(() => {
    const fetchData = async(): Promise<void> => {
      try {
        const res: Response = await fetch('http://localhost:5239/api/Period')
        const data: IDates = await res.json()

        for (const year in data)
          data[year].sort((a, b) => b.week - a.week)
        
        dispatch({ type: "SET_DATES", payload: { dates: data } })
      } catch (error) {
        console.error(error)
        dispatch({ type: "SET_ERROR", payload: true })
      } finally {
        setActionType('NONE')
      }
    }

    const setPeriod = (): void => {
      if (state.selectedPeriod.week === 0) {
        const { week, year } = getWeekNumber(new Date())
        dispatch({
          type: 'SET_WEEK',
          payload: { week, year }
        })
        setActionType('NONE')
      }
    }

    if (actionType === 'SET_PERIOD') setPeriod()
    else if (actionType === 'FETCH_DATA') fetchData()
  }, [ actionType, state.selectedPeriod ])

  const isCurrentWeek = useMemo(() =>
    state.selectedPeriod.year !== getWeekNumber(new Date).year
      || state.selectedPeriod.week !== getWeekNumber(new Date).week
  , [ state.selectedPeriod ])

  return (
    <PeriodContext.Provider 
      value={{ 
        ...state,
        isCurrentWeek,
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