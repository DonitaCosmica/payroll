import { createContext, ReactNode, useContext, useReducer } from "react"
import { type SortState } from "../types"

interface Props {
  children: ReactNode
}

type SortAction =
  | { type: 'SET_FILTER', payload: SortState['filter'] }

interface SortContextType extends SortState {
  dispatch: React.Dispatch<SortAction>
}

const INITIAL_STATE: SortState = {
  filter: 'Todos'
} as const

export const SortEmployeesContext: React.Context<SortContextType> = createContext<SortContextType>({
  ...INITIAL_STATE,
  dispatch: () => {}
})

const sortReducer = (state: SortState, action: SortAction): SortState => {
  const { type, payload } = action
  switch (type) {
    case 'SET_FILTER': {
      return {
        ...state,
        filter: payload
      }
    }
    default:
      return state
  }
}

export const SortEmployeesProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(sortReducer, INITIAL_STATE)
  return (
    <SortEmployeesContext.Provider value={{ ...state, dispatch }}>
      { children }
    </SortEmployeesContext.Provider>
  )
}

export const useSortEmployeesContext = (): SortContextType => {
  const context = useContext(SortEmployeesContext)
  if (!context) throw new Error('useSortEmployeesContext must be used within a SortProvider')
  return context
}