import { createContext, ReactNode, useEffect, useReducer } from "react"

enum NavigationActionKind {
  PAYROLLRECEIPTS = 1,
  EMPLOYEES,
  JOBPOSITIONS,
  DEPARTMENTS,
  COMMERCIALAREAS,
  PERCEPTIONS,
  DEDUCTIONS,
  PROJECTCATALOG,
  COMPANIES,
  LOADED,
  ERROR
}

interface NavigationState {
  option: NavigationActionKind,
  loading: boolean,
  url?: string
  columnNames: string[],
  data: string[][],
  error: boolean | null
}

interface NavigationAction {
  type: NavigationActionKind
}

interface NavigationContextType extends NavigationState {
  dispatch: React.Dispatch<NavigationAction>
}

interface Props {
  children: ReactNode
}

const urlMapping: Record<NavigationActionKind, string> = {
  [NavigationActionKind.PAYROLLRECEIPTS]: 'a',
  [NavigationActionKind.EMPLOYEES]: 'b',
  [NavigationActionKind.JOBPOSITIONS]: 'c',
  [NavigationActionKind.DEPARTMENTS]: 'd',
  [NavigationActionKind.COMMERCIALAREAS]: 'e',
  [NavigationActionKind.PERCEPTIONS]: 'f',
  [NavigationActionKind.DEDUCTIONS]: 'g',
  [NavigationActionKind.PROJECTCATALOG]: 'h',
  [NavigationActionKind.COMPANIES]: 'i',
  [NavigationActionKind.LOADED]: '',
  [NavigationActionKind.ERROR]: ''
}

const INITIAL_STATE: NavigationState = {
  option: NavigationActionKind.PAYROLLRECEIPTS,
  loading: false,
  url: '',
  columnNames: [],
  data: [[]],
  error: null
} as const

export const NavigationContext: React.Context<NavigationContextType> = createContext<NavigationContextType>({
  ...INITIAL_STATE, 
  dispatch: () => {}
})

const NavigationReducer = (state: NavigationState, action: NavigationAction): NavigationState => {
  const { type } = action

  switch(type) {
    case NavigationActionKind.LOADED: {
      return {
        ...state,
        loading: false
      }
    }
    case NavigationActionKind.ERROR: {
      return {
        ...INITIAL_STATE,
        error: true
      }
    }
    default: {
      return {
        ...state,
        option: type || state.option,
        loading: true,
        url: urlMapping[type],
        columnNames: [],
        data: [[]],
        error: null
      }
    }
  }
}

export const NavigationProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(NavigationReducer, INITIAL_STATE)

  useEffect(() => {
    const fetchInfo = async (): Promise<void> => {

    }

    fetchInfo()
  }, [state.url])

  return (
    <NavigationContext.Provider
      value={{
        ...state,
        dispatch
      }}
    >
      { children }
    </NavigationContext.Provider>
  )
}