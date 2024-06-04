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

const titleMapping: Record<NavigationActionKind, string> = {
  [NavigationActionKind.PAYROLLRECEIPTS]: 'Recibo',
  [NavigationActionKind.EMPLOYEES]: 'Trabajador',
  [NavigationActionKind.JOBPOSITIONS]: 'Puesto',
  [NavigationActionKind.DEPARTMENTS]: 'Departamento',
  [NavigationActionKind.COMMERCIALAREAS]: 'Area Comercial',
  [NavigationActionKind.PERCEPTIONS]: 'Percepción',
  [NavigationActionKind.DEDUCTIONS]: 'Deducción',
  [NavigationActionKind.PROJECTCATALOG]: 'Proyecto',
  [NavigationActionKind.COMPANIES]: 'Compañia',
  [NavigationActionKind.UPDATEDATA]: '',
  [NavigationActionKind.ERROR]: ''
}

const INITIAL_STATE: NavigationState = {
  title: '',
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
      const title: string = titleMapping[type]
      const url: string = urlMapping[type]
      return {
        ...state,
        title,
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