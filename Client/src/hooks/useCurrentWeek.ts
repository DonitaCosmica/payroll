import { useMemo } from "react"
import { usePeriodContext } from "../context/Period"
import { type IWeek, type IWeekYear } from "../types"
import { getWeekNumber } from "../utils/modifyData"

interface ICurrentWeek {
  selectedPeriod: IWeekYear,
  weekRanges: IWeek[],
  isDisabled: boolean
}

interface Props {
  input: IWeekYear | IWeekYear[]
}

export const useCurrentWeek = ({ input }: Props): ICurrentWeek => {
  const { selectedPeriod } = usePeriodContext()

  const getStartOfWeek = (date: Date): Date => {
    const day = date.getDay()
    const diff = (day === 0 ? -6 : 1) - day
    const monday = new Date(date)
    monday.setDate(date.getDate() + diff)
    return monday
  }
  
  const getDatesOfWeek = (year: number, weekNumber: number): { monday: Date, sunday: Date } => {
    const firstDayOfYear = new Date(year, 0, 1)
    const startOfWeek = new Date(firstDayOfYear)
    const firstMonday = getStartOfWeek(firstDayOfYear)
    startOfWeek.setDate(firstMonday.getDate() + (weekNumber - 1) * 7)
    console.log({ firstDayOfYear, startOfWeek, firstMonday })
    
    const monday = getStartOfWeek(startOfWeek)
    const sunday = new Date(monday)
    sunday.setDate(monday.getDate() + 6)
  
    return { monday, sunday }
  }
  
  const formatDate = (date: Date): string =>
    new Intl.DateTimeFormat('es-Es', { 
      weekday: 'short', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric'
    }).format(date).replace(',', '')

  const weekRanges = useMemo(() => {
    const weeks = Array.isArray(input) ? input : [input]
    if (weeks.some(week => Object.values(week).includes(0))) return []
    
    return weeks.map(({ year, week }) => {
      const { monday, sunday } = getDatesOfWeek(year, week)
      //console.log({ weeks, selectedPeriod, monday, sunday })
      return {
        monday: formatDate(monday),
        sunday: formatDate(sunday)
      }
    })
  }, [ input, selectedPeriod ])

  const isDisabled = selectedPeriod.year !== new Date().getFullYear()
    || selectedPeriod.week !== getWeekNumber(new Date)

  return { selectedPeriod, weekRanges, isDisabled }
}