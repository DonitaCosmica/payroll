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
  UPDATEDATA,
  ERROR
}

interface NavigationState {
  option: NavigationActionKind,
  loading: boolean,
  url?: string
  columnNames: string[],
  data: (string | number)[][],
  error: boolean | null
}

interface NavigationAction {
  type: NavigationActionKind,
  payload?: any 
}

interface NavigationContextType extends NavigationState {
  dispatch: React.Dispatch<NavigationAction>
}

interface Props {
  children: ReactNode
}

const urlMapping: Record<NavigationActionKind, string> = {
  [NavigationActionKind.PAYROLLRECEIPTS]: 'a',
  [NavigationActionKind.EMPLOYEES]: 'http://localhost:5239/api/Employee',
  [NavigationActionKind.JOBPOSITIONS]: 'http://localhost:5239/api/JobPosition',
  [NavigationActionKind.DEPARTMENTS]: 'http://localhost:5239/api/Department',
  [NavigationActionKind.COMMERCIALAREAS]: 'http://localhost:5239/api/CommercialArea',
  [NavigationActionKind.PERCEPTIONS]: 'http://localhost:5239/api/Perception',
  [NavigationActionKind.DEDUCTIONS]: 'http://localhost:5239/api/Deduction',
  [NavigationActionKind.PROJECTCATALOG]: 'http://localhost:5239/api/Project',
  [NavigationActionKind.COMPANIES]: 'http://localhost:5239/api/Company',
  [NavigationActionKind.UPDATEDATA]: '',
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
  const { type, payload } = action

  switch(type) {
    case NavigationActionKind.UPDATEDATA: {
      return {
        ...state,
        data: payload,
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
      try {
        if(state.url) {
          const res: Response = await fetch(state.url)
          const data: (string | number)[] = await res.json()
          const newData: (string | number)[][] = data.map((info: (string | number)) => Object.values(info))
          dispatch({ type: NavigationActionKind.UPDATEDATA, payload: newData })
          console.log(Object.values(newData))
        }
      } catch (error) {
        console.error(error)
      }
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