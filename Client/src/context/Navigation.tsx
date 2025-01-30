import { createContext, JSX, ReactNode, useContext, useEffect, useReducer, useState } from "react"
import { type IDataResponse, type IDataObject } from "../types"
import { compareNames, reorganizeData } from "../utils/modifyData"

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
  BANKS,
  TABLEWORK,
  UPDATEDATA,
  UPDATETABLE,
  UPDATEPAYROLL,
  UPDATESELECTEDID,
  UPDATETOOLBAROPT,
  ERROR
}

interface Props {
  children: ReactNode
}

interface NavigationState {
  payroll: string,
  selectedId: string,
  toolbarOption: number,
  title: string,
  option: NavigationActionKind,
  loading: boolean,
  url?: string
  keys: string[],
  columnNames: string[],
  data: IDataObject[],
  formData: IDataObject[],
  formSize: number,
  error: boolean | null
}
interface NavigationAction {
  type: NavigationActionKind,
  payload?: {
    payrollType?: string,
    selectedId?: string,
    toolbarOption?: number,
    columns?: string[],
    newData?: IDataObject[],
    formData?: IDataObject[],
    formColumns?: string[],
    names?: string[]
  }
}

interface NavigationContextType extends NavigationState {
  dispatch: React.Dispatch<NavigationAction>,
  submitCount: number,
  updateTableWork: boolean,
  setSubmitCount: React.Dispatch<React.SetStateAction<number>>,
  setUpdateTableWork: React.Dispatch<React.SetStateAction<boolean>>
}

interface IFormConfig {
  url: string,
  title: string,
  formSize: number
}

const navigationConfig: Record<NavigationActionKind, IFormConfig> = {
  [NavigationActionKind.PAYROLLRECEIPTS]: { url: 'http://localhost:5239/api/Ticket', title: 'Periodo', formSize: 75 },
  [NavigationActionKind.EMPLOYEES]: { url: 'http://localhost:5239/api/Employee', title: 'Trabajador', formSize: 75 },
  [NavigationActionKind.JOBPOSITIONS]: { url: 'http://localhost:5239/api/JobPosition', title: 'Puesto', formSize: 37.5 },
  [NavigationActionKind.DEPARTMENTS]: { url: 'http://localhost:5239/api/Department', title: 'Departamento', formSize: 35 },
  [NavigationActionKind.COMMERCIALAREAS]: { url: 'http://localhost:5239/api/CommercialArea', title: 'Área Comercial', formSize: 35 },
  [NavigationActionKind.PERCEPTIONS]: { url: 'http://localhost:5239/api/Perception', title: 'Percepción', formSize: 40 },
  [NavigationActionKind.DEDUCTIONS]: { url: 'http://localhost:5239/api/Deduction', title: 'Deducción', formSize: 40 },
  [NavigationActionKind.PROJECTCATALOG]: { url: 'http://localhost:5239/api/Project', title: 'Proyecto', formSize: 75 },
  [NavigationActionKind.COMPANIES]: { url: 'http://localhost:5239/api/Company', title: 'Compañia', formSize: 35 },
  [NavigationActionKind.BANKS]: { url: '', title: '', formSize: 0 },
  [NavigationActionKind.TABLEWORK]: { url: 'http://localhost:5239/api/TableWork', title: 'Tabla de Trabajo', formSize: 75 },
  [NavigationActionKind.UPDATEDATA]: { url: '', title: '', formSize: 0 },
  [NavigationActionKind.UPDATETABLE]: { url: '', title: '', formSize: 0 },
  [NavigationActionKind.UPDATEPAYROLL]: { url: '', title: '', formSize: 0 },
  [NavigationActionKind.UPDATESELECTEDID]: { url: '', title: '', formSize: 0 },
  [NavigationActionKind.UPDATETOOLBAROPT]: { url: '', title: '', formSize: 0 },
  [NavigationActionKind.ERROR]: { url: '', title: '', formSize: 0 }
} as const

const INITIAL_STATE: NavigationState = {
  payroll: 'Ordinario',
  selectedId: '',
  toolbarOption: -1,
  title: '',
  option: NavigationActionKind.PAYROLLRECEIPTS,
  loading: false,
  url: '',
  keys: [],
  columnNames: [],
  data: [],
  formData: [],
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
      data: [],
      formColumns: [],
      loading: false,
      error: null
    } as const
  }

  return INITIAL_STATE
}

const NavigationContext: React.Context<NavigationContextType> = createContext<NavigationContextType>({
  ...loadStateFromLocalStorage(), 
  dispatch: () => {},
  submitCount: 0,
  updateTableWork: false,
  setSubmitCount: () => {},
  setUpdateTableWork: () => {}
})

const NavigationReducer = (state: NavigationState, action: NavigationAction): NavigationState => {
  const { type, payload } = action

  switch(type) {
    case NavigationActionKind.UPDATETABLE: {
      const { newData = state.data, formData = state.formData } = payload || {}
      return {
        ...state,
        data: newData,
        formData,
        loading: false
      }
    }
    case NavigationActionKind.UPDATEDATA: {
      const { columns = state.columnNames, newData = state.data, names = state.columnNames, formData = state.formData } = payload || {}
      return {
        ...state,
        columnNames: names,
        keys: columns,
        data: newData,
        formData,
        loading: false
      }
    }
    case NavigationActionKind.UPDATEPAYROLL: {
      const { payrollType = state.payroll } = payload || {}
      return {
        ...state,
        payroll: payrollType,
        loading: false,
        error: null
      }
    }
    case NavigationActionKind.UPDATESELECTEDID: {
      const { selectedId = state.selectedId } = payload || {}
      return {
        ...state,
        selectedId,
        loading: false,
        error: null
      }
    }
    case NavigationActionKind.UPDATETOOLBAROPT: {
      const { toolbarOption = state.toolbarOption } = payload || {}
      return {
        ...state,
        toolbarOption,
        loading: false,
        error: null
      }
    }
    case NavigationActionKind.ERROR: {
      return {
        ...INITIAL_STATE,
        loading: false,
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

export const NavigationProvider: React.FC<Props> = ({ children }): JSX.Element => {
  const [state, dispatch] = useReducer(NavigationReducer, loadStateFromLocalStorage())
  const [submitCount, setSubmitCount] = useState<number>(0)
  const [updateTableWork, setUpdateTableWork] = useState<boolean>(false)

  useEffect(() => {
    const getValue = (value: string | number): number | string => 
      typeof value === 'string' ? (isNaN(parseInt(value, 10)) ? value : parseInt(value, 10)) : value
    
    const loadTranslations = async ({ opt }: { opt: NavigationActionKind }): Promise<Record<string, string>> => {
      try {
        const res: Response = await fetch('/src/data/translations.json')
        const data = await res.json()
        return data[opt]
      } catch (error) {
        console.error('Error loading translations: ', error)
        return {} as Record<string, string>
      }
    }

    const translateColumns = async ({ opt, columnsNames }: { opt: NavigationActionKind, columnsNames: string[] }): Promise<string[]> => {
      const columnsDictionary: Record<string, string> = await loadTranslations({ opt })
      return columnsNames.map((column: string) => columnsDictionary[column] || column)
    }

    const saveToLocalStorage = (): void => {
      const { option, formSize, url, title } = state
      const stateToSave = { option, formSize, url, title }
      localStorage.setItem('navigationState', JSON.stringify(stateToSave))
    }

    const getSortingKey = (item: IDataObject, keys: string[]): number | string | undefined => {
      for (const key of keys) {
        const value = item[key]
        if (typeof value === 'string' || typeof value === 'number')
          return getValue(value)
      }

      return undefined
    }

    const fetchData = async (): Promise<void> => {
      try {
        if(!state.url) return
        
        const res: Response = await fetch(state.url)
        const dataResponse: IDataResponse = await res.json()
        if (!res.ok) {
          console.error('Response Error: ', dataResponse)
          dispatch({ type: NavigationActionKind.ERROR })
          return
        }

        const columns: string[] = dataResponse.formColumns
        const names: string[] = await translateColumns({ opt: state.option, columnsNames: dataResponse.columns })
        const newData = reorganizeData(dataResponse.data)

        if (columns.includes('Code') || columns.includes('Key'))
          newData.sort((a, b) => compareNames(getSortingKey(a, ['code', 'key']) ?? 0, getSortingKey(b, ['code', 'key']) ?? 0))
        else if (columns.includes('Name'))
          newData.sort((a, b) => compareNames(getSortingKey(a, ['name']) ?? '', getSortingKey(b, ['name']) ?? ''))
        
        dispatch({ 
          type: NavigationActionKind.UPDATEDATA, 
          payload: { columns, newData, formData: dataResponse.formData, names } 
        })
      } catch (error) {
        console.error(error)
        dispatch({ type: NavigationActionKind.ERROR })
      }
    }

    fetchData()
    saveToLocalStorage()
  }, [ state.url, submitCount ])

  useEffect(() => {
    dispatch({
      type: NavigationActionKind.UPDATEPAYROLL,
      payload: { payrollType: 'Ordinario' }
    })
  }, [])

  return (
    <NavigationContext.Provider
      value={{
        ...state,
        dispatch,
        submitCount,
        updateTableWork,
        setSubmitCount,
        setUpdateTableWork
      }}
    >
      { children }
    </NavigationContext.Provider>
  )
}

export const useNavigationContext = (): NavigationContextType => {
  const context = useContext(NavigationContext)
  if (!context) throw new Error('useNavigationContext must be used within a NavigationProvider')
  return context
}