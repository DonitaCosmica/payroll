import { createContext, ReactNode, useEffect, useReducer } from "react"
import { type IdataResponse } from "../types"

export enum NavigationActionKind {
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
  title: string,
  option: NavigationActionKind,
  loading: boolean,
  url?: string
  columnNames: string[],
  data: (string | number)[][],
  formSize: number,
  error: boolean | null
}

interface NavigationAction {
  type: NavigationActionKind,
  payload?: {
    columns: string[],
    newData: (number | string)[][]
  } 
}

interface NavigationContextType extends NavigationState {
  dispatch: React.Dispatch<NavigationAction>
}

interface Props {
  children: ReactNode
}

const navigationConfig: Record<NavigationActionKind, { url: string, title: string, formSize: number }> = {
  [NavigationActionKind.PAYROLLRECEIPTS]: { url: '', title: 'Recibo', formSize: 75 },
  [NavigationActionKind.EMPLOYEES]: { url: 'http://localhost:5239/api/Employee', title: 'Trabajador', formSize: 75 },
  [NavigationActionKind.JOBPOSITIONS]: { url: 'http://localhost:5239/api/JobPosition', title: 'Puesto', formSize: 40 },
  [NavigationActionKind.DEPARTMENTS]: { url: 'http://localhost:5239/api/Department', title: 'Departamento', formSize: 40 },
  [NavigationActionKind.COMMERCIALAREAS]: { url: 'http://localhost:5239/api/CommercialArea', title: 'Área Comercial', formSize: 30 },
  [NavigationActionKind.PERCEPTIONS]: { url: 'http://localhost:5239/api/Perception', title: 'Percepción', formSize: 405 },
  [NavigationActionKind.DEDUCTIONS]: { url: 'http://localhost:5239/api/Deduction', title: 'Deducción', formSize: 45 },
  [NavigationActionKind.PROJECTCATALOG]: { url: 'http://localhost:5239/api/Project', title: 'Proyecto', formSize: 75 },
  [NavigationActionKind.COMPANIES]: { url: 'http://localhost:5239/api/Company', title: 'Compañia', formSize: 30 },
  [NavigationActionKind.UPDATEDATA]: { url: '', title: '', formSize: 0 },
  [NavigationActionKind.ERROR]: { url: '', title: '', formSize: 0 }
}

const INITIAL_STATE: NavigationState = {
  title: '',
  option: NavigationActionKind.PAYROLLRECEIPTS,
  loading: false,
  url: '',
  columnNames: [],
  data: [[]],
  formSize: 75,
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
      const { columns = state.columnNames, newData = state.data } = payload || {}
      return {
        ...state,
        columnNames: columns,
        data: newData,
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
      const { url, title, formSize } = navigationConfig[type]
      return {
        ...state,
        title,
        formSize,
        option: type,
        loading: true,
        url,
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
          const data: IdataResponse = await res.json()
          const values: IdataResponse[] = Object.values(data)
          const columns: string[] = Array.isArray(values[0]) ? values[0] : []
          const newData: (string | number)[][] = Array.isArray(values[1]) ?
            values[1].map((info: (string | number)) => Object.values(info)) : []
          console.log({ columns })
          dispatch({ type: NavigationActionKind.UPDATEDATA, payload: { columns, newData } })
        }
      } catch (error) {
        console.error(error)
        dispatch({ type: NavigationActionKind.ERROR })
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