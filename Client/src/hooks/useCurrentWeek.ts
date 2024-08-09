import { useEffect, useRef } from "react"
import { type IWeek, type IWeekYear } from "../types"

interface Props {
  input: IWeekYear | IWeekYear[]
}

export const useCurrentWeek = ({ input }: Props): { weekRanges: IWeek[] } => {
  const weekRanges = useRef<IWeek[]>([])

  useEffect(() => {
    const weeks = Array.isArray(input) ? input : [input]
    if (weeks.some(week => Object.values(week).includes(0))) return

    const newWeekRanges = weeks.map(({ year, week }) => {
      const { monday, sunday } = getDatesOfWeek(year, week)
      return {
        monday: formatDate(monday),
        sunday: formatDate(sunday)
      }
    })
    weekRanges.current = newWeekRanges
  }, [ input ])

  const getDatesOfWeek = (year: number, weekNUmber: number): { monday: Date, sunday: Date } => {
    const firstDayOfYear = new Date(year, 0, 1)
    const firstMonday = firstDayOfYear.getDate() + (1 - firstDayOfYear.getDay() + 7) % 7
    const startOfWeek = new Date(year, 0, firstMonday + (weekNUmber - 1) * 7)
    const monday = new Date(startOfWeek)
    const sunday = new Date(startOfWeek)
  
    monday.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 1)
    sunday.setDate(startOfWeek.getDate() - startOfWeek.getDay() + 7)
  
    return { monday, sunday }
  }
  
  const formatDate = (date: Date): string =>
    new Intl.DateTimeFormat('es-Es', 
      { 
        weekday: 'short', 
        day: 'numeric', 
        month: 'short', 
        year: 'numeric'
      }).format(date).replace(',', '')

  return { weekRanges: weekRanges.current }
}