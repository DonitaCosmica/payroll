import { createContext, JSX, ReactNode, useContext, useEffect, useReducer, useState } from "react"
import { type IDataResponse, type IDataObject, type IPayrollType } from "../types"
import { reorganizeData, sortDataByColumns, translateColumns } from "../utils/modifyData"

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
  payroll: IPayrollType,
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

type NavigationAction =
  | { type: NavigationActionKind.UPDATETABLE, payload: { data: IDataObject[], formData: IDataObject[] } }
  | { type: NavigationActionKind.UPDATEDATA, payload: { columnNames: string[], keys: string[], data: IDataObject[], formData: IDataObject[] } }
  | { type: NavigationActionKind.UPDATEPAYROLL, payload: { payroll: IPayrollType } }
  | { type: NavigationActionKind.UPDATESELECTEDID, payload: { selectedId: string } }
  | { type: NavigationActionKind.UPDATETOOLBAROPT, payload: { toolbarOption: number } }
  | { type: NavigationActionKind.ERROR }
  | { type: NavigationActionKind; payload?: undefined }

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
  [NavigationActionKind.PROJECTCATALOG]: { url: 'http://localhost:5239/api/Project/from-erp', title: 'Proyecto', formSize: 75 },
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
  payroll: { payrollId: '', name: '', payrollType: 'Principal' },
  selectedId: '',
  toolbarOption: -1,
  title: '',
  option: NavigationActionKind.PAYROLLRECEIPTS,
  loading: false,
  url: 'http://localhost:5239/api/Ticket',
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
  switch(action.type) {
    case NavigationActionKind.UPDATETABLE: {
      const { payload } = action
      if (payload)
        return {
          ...state,
          data: payload.data,
          formData: payload.formData,
          loading: false
        }

      return state
    }
    case NavigationActionKind.UPDATEDATA: {
      const { payload } = action
      if (payload)
        return {
          ...state,
          columnNames: payload.columnNames,
          keys: payload.keys,
          data: payload.data,
          formData: payload.formData,
          loading: false
        }

      return state
    }
    case NavigationActionKind.UPDATEPAYROLL: {
      if (action.payload)
        return {
          ...state,
          payroll: action.payload.payroll,
          loading: false,
          error: null
        }

      return state
    }
    case NavigationActionKind.UPDATESELECTEDID: {
      if (action.payload)
        return {
          ...state,
          selectedId: action.payload.selectedId,
          loading: false,
          error: null
        }

      return state
    }
    case NavigationActionKind.UPDATETOOLBAROPT: {
      if (action.payload)
        return {
          ...state,
          toolbarOption: action.payload.toolbarOption,
          loading: false,
          error: null
        }

      return state
    }
    case NavigationActionKind.ERROR: {
      return {
        ...INITIAL_STATE,
        loading: false,
        error: true
      }
    }
    default: {
      const config = navigationConfig[action.type] || { url: '', title: '', formSize: 0 }
      return {
        ...state,
        title: config.title,
        formSize: config.formSize,
        option: action.type,
        loading: true,
        url: config.url,
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
    const fetchPrincipalPayroll = async (): Promise<void> => {
      try {
        const res: Response = await fetch(`http://localhost:5239/api/Payroll/by?payrollType=${ state.payroll ? state.payroll.payrollType : 'Principal' }`)
        const data: IPayrollType = await res.json()
        const { payrollId, name, payrollType } = data
        dispatch({
          type: NavigationActionKind.UPDATEPAYROLL,
          payload: { payroll: { payrollId: payrollId, name: name, payrollType: payrollType } }
        })
      } catch (error) {
        console.error(error)
        dispatch({ type: NavigationActionKind.ERROR })
      }
    }

    fetchPrincipalPayroll()
  }, [])

  useEffect(() => {
    const saveToLocalStorage = (): void => {
      const { option, formSize, url, title } = state
      const stateToSave = { option, formSize, url, title }
      localStorage.setItem('navigationState', JSON.stringify(stateToSave))
    }

    const fetchData = async (): Promise<void> => {
      try {
        if(!state.url) return
        
        const payrollType = state.payroll && state.payroll.name.length > 0 ? state.payroll.name : 'Principal'
        const url: string = NavigationActionKind.PAYROLLRECEIPTS === state.option
          ? `${ state.url }/type?payrollType=${ payrollType }`
          : state.url

        const res: Response = await fetch(url)
        const dataResponse: IDataResponse = await res.json()
        if (!res.ok) {
          console.error('Response Error: ', dataResponse)
          dispatch({ type: NavigationActionKind.ERROR })
          return
        }

        const columns: string[] = dataResponse.formColumns
        const names: string[] = await translateColumns({ opt: state.option, columnsNames: dataResponse.columns })
        const newData = reorganizeData(dataResponse.data)
        sortDataByColumns(newData, columns)

        dispatch({ 
          type: NavigationActionKind.UPDATEDATA, 
          payload: { columnNames: names, keys: columns, data: newData, formData: dataResponse.formData } 
        })
      } catch (error) {
        console.error(error)
        dispatch({ type: NavigationActionKind.ERROR })
      }
    }

    fetchData()
    saveToLocalStorage()
  }, [ state.url, submitCount ])

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