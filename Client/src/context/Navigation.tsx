import { createContext, ReactNode, useEffect, useReducer, useState } from "react"
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
  keys: string[],
  columnNames: string[],
  data: (string | number)[][],
  formSize: number,
  error: boolean | null
}

interface NavigationAction {
  type: NavigationActionKind,
  payload?: {
    columns?: string[],
    newData?: (number | string)[][],
    names?: string[]
  } 
}

interface NavigationContextType extends NavigationState {
  dispatch: React.Dispatch<NavigationAction>,
  submitCount: number,
  setSubmitCount: React.Dispatch<React.SetStateAction<number>>
}

interface Props {
  children: ReactNode
}

const navigationConfig: Record<NavigationActionKind, { url: string, title: string, formSize: number }> = {
  [NavigationActionKind.PAYROLLRECEIPTS]: { url: 'http://localhost:5239/api/Ticket', title: 'Recibo', formSize: 75 },
  [NavigationActionKind.EMPLOYEES]: { url: 'http://localhost:5239/api/Employee', title: 'Trabajador', formSize: 75 },
  [NavigationActionKind.JOBPOSITIONS]: { url: 'http://localhost:5239/api/JobPosition', title: 'Puesto', formSize: 40 },
  [NavigationActionKind.DEPARTMENTS]: { url: 'http://localhost:5239/api/Department', title: 'Departamento', formSize: 40 },
  [NavigationActionKind.COMMERCIALAREAS]: { url: 'http://localhost:5239/api/CommercialArea', title: 'Área Comercial', formSize: 30 },
  [NavigationActionKind.PERCEPTIONS]: { url: 'http://localhost:5239/api/Perception', title: 'Percepción', formSize: 57.5 },
  [NavigationActionKind.DEDUCTIONS]: { url: 'http://localhost:5239/api/Deduction', title: 'Deducción', formSize: 57.5 },
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
  keys: [],
  columnNames: [],
  data: [[]],
  formSize: 0,
  error: null
} as const

const loadStateFromLocalStorage = (): NavigationState => {
  const storedState = localStorage.getItem('navigationState')
  if (storedState) {
    const savedState = JSON.parse(storedState)
    return {
      ...savedState,
      keys: [],
      columnNames: [],
      data: [[]],
      loading: false,
      error: null
    } as const
  }

  return INITIAL_STATE
}

export const NavigationContext: React.Context<NavigationContextType> = createContext<NavigationContextType>({
  ...loadStateFromLocalStorage(), 
  dispatch: () => {},
  submitCount: 0,
  setSubmitCount: () => {}
})

const NavigationReducer = (state: NavigationState, action: NavigationAction): NavigationState => {
  const { type, payload } = action

  switch(type) {
    case NavigationActionKind.UPDATEDATA: {
      const { columns = state.keys, newData = state.data, names = state.columnNames } = payload || {}
      return {
        ...state,
        columnNames: names,
        keys: columns,
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
  const [state, dispatch] = useReducer(NavigationReducer, loadStateFromLocalStorage())
  const [submitCount, setSubmitCount] = useState<number>(0)

  useEffect(() => {
    const loadTranslations = async ({ opt }: { opt: NavigationActionKind }): Promise<Record<string, string>> => {
      try {
        const res: Response = await fetch('/src/utils/translations.json')
        const data = await res.json()
        return data[opt]
      } catch (error) {
        console.error('Error loading translations: ', error)
        return {} as Record<string, string>
      }
    }

    const translateColumns = async ({ opt, columns }: { opt: NavigationActionKind, columns: string[] }): Promise<string[]> => {
      const columnsDictionary: Record<string, string> = await loadTranslations({ opt })
      return columns.map((column: string) => columnsDictionary[column] || column)
    }

    const saveToLocalStorage = (): void => {
      const { option, formSize, url, title } = state
      const stateToSave = { option, formSize, url, title }
      localStorage.setItem('navigationState', JSON.stringify(stateToSave))
    }

    const fetchInfo = async (): Promise<void> => {
      try {
        if(!state.url) return
        
        const res: Response = await fetch(state.url)
        const data: IdataResponse = await res.json()
        if (!res.ok) {
          console.error('Response Error: ', data)
          return
        }

        const values: IdataResponse[] = Object.values(data)
        const columns: string[] = Array.isArray(values[0]) ? values[0] : []
        const names: string[] = await translateColumns({ opt: state.option, columns })
        const newData: (string | number)[][] = Array.isArray(values[1]) ?
          values[1].map((info: (string | number)) => Object.values(info)) : []
        if (columns.includes('Code') || columns.includes('Key')) {
          newData.sort((a: (string | number)[], b: (string | number)[]) => {
            const aValue: number = typeof a[1] === 'string' ? parseInt(a[1], 10) : a[1]
            const bValue: number = typeof b[1] === 'string' ? parseInt(b[1], 10) : b[1]
            return aValue - bValue
          })
        }
        dispatch({ 
          type: NavigationActionKind.UPDATEDATA, 
          payload: { columns, newData, names } 
        })
        saveToLocalStorage()
      } catch (error) {
        console.error(error)
        dispatch({ type: NavigationActionKind.ERROR })
      }
    }

    fetchInfo()
  }, [ state.url, submitCount ])

  return (
    <NavigationContext.Provider
      value={{
        ...state,
        dispatch,
        submitCount,
        setSubmitCount
      }}
    >
      { children }
    </NavigationContext.Provider>
  )
}