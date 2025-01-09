import { createContext, ReactNode, useContext, useEffect, useReducer, useRef } from "react"
import { type IStatus } from "../types"

interface Props {
  children: ReactNode
}

interface SortState {
  filter: string
}

type SortAction = { type: 'SET_FILTER', payload: string }

interface SortContextType extends SortState {
  statuses: { id: string; label: string }[],
  dispatch: React.Dispatch<SortAction>
}

const INITIAL_STATE: SortState = {
  filter: 'default'
}

export const SortEmployeesContext = createContext<SortContextType>({
  ...INITIAL_STATE,
  statuses: [],
  dispatch: () => {}
})

const sortReducer = (state: SortState, action: SortAction): SortState => {
  switch (action.type) {
    case 'SET_FILTER':
      return { ...state, filter: action.payload }
    default:
      return state
  }
};

export const SortEmployeesProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(sortReducer, INITIAL_STATE)
  const statuses = useRef<{ id: string; label: string }[]>([])

  useEffect(() => {
    const generateStatusCombinations = (data: IStatus[]): { id: string, label: string }[] => {
      const groupedByOption = data.reduce<Record<IStatus['statusOption'], IStatus[]>>((acc, status) => {
        const { statusOption } = status
        return {
          ...acc,
          [statusOption]: [...(acc[statusOption] || []), status]
        };
      }, { Positive: [], Negative: [] })

      return Object.entries(groupedByOption).flatMap(([_, statuses]) =>
        statuses.flatMap((status1, index) =>
          statuses.slice(index + 1).map((status2) => ({
            id: `${status1.name}/${status2.name}`,
            label: `${status1.name}/${status2.name}`
          }))
        )
      )
    }

    const fetchStatuses = async () => {
      try {
        const res: Response = await fetch('http://localhost:5239/api/Status/byType?type=Employee')
        const data: IStatus[] = await res.json()
        statuses.current = [
          { id: 'default', label: 'Todos' },
          ...data.map(status => ({
            id: status.name,
            label: status.name
          })),
          ...generateStatusCombinations(data)
        ];
      } catch (error) {
        console.error('Error fetching data: ', error)
      }
    }

    fetchStatuses()
  }, [])

  return (
    <SortEmployeesContext.Provider value={{ ...state, statuses: statuses.current, dispatch }}>
      {children}
    </SortEmployeesContext.Provider>
  );
};

export const useSortEmployeesContext = (): SortContextType => {
  const context = useContext(SortEmployeesContext)
  if (!context) throw new Error('useSortEmployeesContext must be used within a SortProvider')
  return context
};