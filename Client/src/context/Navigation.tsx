import { createContext, ReactNode, useContext, useEffect, useReducer, useState } from "react"
import { type NavigationAction, type NavigationState, type IDataResponse, type DataObject } from "../types"

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
  UPDATEPAYROLL,
  UPDATESELECTEDID,
  UPDATETOOLBAROPT,
  ERROR
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
  [NavigationActionKind.PAYROLLRECEIPTS]: { url: 'http://localhost:5239/api/Ticket', title: 'Periodo', formSize: 75 },
  [NavigationActionKind.EMPLOYEES]: { url: 'http://localhost:5239/api/Employee', title: 'Trabajador', formSize: 75 },
  [NavigationActionKind.JOBPOSITIONS]: { url: 'http://localhost:5239/api/JobPosition', title: 'Puesto', formSize: 40 },
  [NavigationActionKind.DEPARTMENTS]: { url: 'http://localhost:5239/api/Department', title: 'Departamento', formSize: 40 },
  [NavigationActionKind.COMMERCIALAREAS]: { url: 'http://localhost:5239/api/CommercialArea', title: 'Área Comercial', formSize: 30 },
  [NavigationActionKind.PERCEPTIONS]: { url: 'http://localhost:5239/api/Perception', title: 'Percepción', formSize: 57.5 },
  [NavigationActionKind.DEDUCTIONS]: { url: 'http://localhost:5239/api/Deduction', title: 'Deducción', formSize: 57.5 },
  [NavigationActionKind.PROJECTCATALOG]: { url: 'http://localhost:5239/api/Project', title: 'Proyecto', formSize: 75 },
  [NavigationActionKind.COMPANIES]: { url: 'http://localhost:5239/api/Company', title: 'Compañia', formSize: 30 },
  [NavigationActionKind.UPDATEDATA]: { url: '', title: '', formSize: 0 },
  [NavigationActionKind.UPDATEPAYROLL]: { url: '', title: '', formSize: 0 },
  [NavigationActionKind.UPDATESELECTEDID]: { url: '', title: '', formSize: 0 },
  [NavigationActionKind.UPDATETOOLBAROPT]: { url: '', title: '', formSize: 0 },
  [NavigationActionKind.ERROR]: { url: '', title: '', formSize: 0 }
}

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
  setSubmitCount: () => {}
})

const NavigationReducer = (state: NavigationState, action: NavigationAction): NavigationState => {
  const { type, payload } = action

  switch(type) {
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

export const NavigationProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(NavigationReducer, loadStateFromLocalStorage())
  const [submitCount, setSubmitCount] = useState<number>(0)

  useEffect(() => {
    const getValue = (value: string | number): number | string => 
      typeof value === 'string' ? (isNaN(parseInt(value, 10)) ? value : parseInt(value, 10)) : value

    const toCamelCase = (str: string): string => {
      return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index: number) =>
        index === 0 ? match.toLowerCase() : match.toUpperCase()).replace(/\s+/g, '')
    }

    const transformKeysToCamelCase = (obj: DataObject): DataObject => 
      Object.keys(obj).reduce((acc: DataObject, key: string) => {
        const camelCaseKey = toCamelCase(key)
        acc[camelCaseKey] = obj[key]
        return acc
      }, {} as DataObject)

    const reorganizeData = (data: DataObject[]) =>
      data.map((item: DataObject) => {
        if ('additionalProperties' in item && item.additionalProperties && typeof item.additionalProperties === 'object') {
          const { additionalProperties, ...rest } = item
          const transformedRest = transformKeysToCamelCase(rest)
          const transformedAdditionalProperties = transformKeysToCamelCase(additionalProperties)
          const totalIndex = Object.keys(transformedRest).indexOf('total')
          const result = { ...transformedRest }

          if (totalIndex !== -1) {
            const beforeTotal = Object.entries(result).slice(0, totalIndex)
            const afterTotal = Object.entries(result).slice(totalIndex)
            const reorderResult = Object.fromEntries([...beforeTotal, ...Object.entries(transformedAdditionalProperties), ...afterTotal])

            return reorderResult
          }

          return { ...transformedRest, ...transformedAdditionalProperties }
        }

        return transformKeysToCamelCase(item)
      })
    
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

    const fetchData = async (): Promise<void> => {
      try {
        if(!state.url) return
        
        const res: Response = await fetch(state.url)
        const dataResponse: IDataResponse = await res.json()
        if (!res.ok) {
          console.error('Response Error: ', dataResponse)
          return
        }

        const columns: string[] = dataResponse.formColumns
        const names: string[] = await translateColumns({ opt: state.option, columnsNames: dataResponse.columns })
        const data: DataObject[] = dataResponse.data
        const newData = reorganizeData(data)

        if (columns.includes('Code') || columns.includes('Key')) {
          newData.sort((a: DataObject, b: DataObject): number => {
            const aValue = getValue((a['code'] || a['key']) as number)
            const bValue = getValue((b['code'] || b['key']) as number)
            return (aValue as number) - (bValue as number)
          })
        } else if (columns.includes('Name')) {
          newData.sort((a: DataObject, b: DataObject): number => {
            const aValue = getValue(a['name'] as string)
            const bValue = getValue(b['name'] as string)
            return (aValue as string).localeCompare(bValue as string)
          })
        }
        const formData: DataObject[] = dataResponse.formData

        dispatch({ 
          type: NavigationActionKind.UPDATEDATA, 
          payload: { columns, newData, formData, names } 
        })
        saveToLocalStorage()
      } catch (error) {
        console.error(error)
        dispatch({ type: NavigationActionKind.ERROR })
      }
    }

    fetchData()
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
        setSubmitCount
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