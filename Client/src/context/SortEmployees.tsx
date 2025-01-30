import { createContext, JSX, ReactNode, useContext, useEffect, useMemo, useReducer, useRef } from "react"
import { type IDropMenu, type IStatus } from "../types"

interface Props {
  children: ReactNode
}

interface SortState {
  filter: string,
  label: string
}

type SortAction = { type: 'SET_FILTER', payload: SortState }

interface SortContextType extends SortState {
  statuses: { id: string; label: string }[],
  dispatch: React.Dispatch<SortAction>
}

const INITIAL_STATE: SortState = {
  filter: '',
  label: ''
}

export const SortEmployeesContext = createContext<SortContextType>({
  ...INITIAL_STATE,
  statuses: [],
  dispatch: () => {}
})

const sortReducer = (state: SortState, action: SortAction): SortState => {
  const { type, payload } = action

  switch (type) {
    case 'SET_FILTER':
      return { ...state, ...payload }
    default:
      return state
  }
};

export const SortEmployeesProvider: React.FC<Props> = ({ children }): JSX.Element => {
  const [state, dispatch] = useReducer(sortReducer, INITIAL_STATE)
  const statusesRef = useRef<{ id: string; label: string }[]>([])

  useEffect(() => {
    const generateStatusCombinations = (data: IStatus[]): IDropMenu[] => {
      const groupedByOption = data.reduce<Record<IStatus['statusOption'], IStatus[]>>((acc, status) => {
        const { statusOption } = status
        acc[statusOption] = acc[statusOption] || []
        acc[statusOption].push(status)
        return acc
      }, { Positive: [], Negative: [] })

      return Object.values(groupedByOption).flatMap(statusGroup =>
        statusGroup.flatMap((status1, index) =>
          statusGroup.slice(index + 1).map(status2 => ({
            id: `${ status1.name }/${ status2.name }`,
            label: `${ status1.name }/${ status2.name }`,
          }))
        )
      )
    }

    const fetchStatuses = async (): Promise<void> => {
      try {
        const res: Response = await fetch('http://localhost:5239/api/Status/byType?type=Employee')
        if (!res.ok) throw new Error('Failed to fetch statuses')
        const data: IStatus[] = await res.json()
        const combinations = generateStatusCombinations(data)

        statusesRef.current = [
          { id: "default", label: "Todos" },
          ...data.map(status => ({ id: status.name, label: status.name })),
          ...combinations,
        ]

        if (combinations.length > 0)
          dispatch({
            type: "SET_FILTER",
            payload: { filter: combinations[0].id, label: combinations[0].label },
          })
      } catch (error) {
        console.error('Error fetching data: ', error)
      }
    }

    fetchStatuses()
  }, [])

  const statuses = useMemo(() => statusesRef.current, [ statusesRef.current ])

  return (
    <SortEmployeesContext.Provider value={{ ...state, statuses, dispatch }}>
      { children }
    </SortEmployeesContext.Provider>
  );
};

export const useSortEmployeesContext = (): SortContextType => {
  const context = useContext(SortEmployeesContext)
  if (!context) throw new Error('useSortEmployeesContext must be used within a SortProvider')
  return context
};