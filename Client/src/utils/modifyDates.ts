import { type IWeek, type IWeekYear } from "../types"

const getDatesOfWeek = (week: number, year: number): IWeek => {
  const simple = new Date(year, 0, 1 + (week - 1) * 7)
  const dayOfWeek = simple.getDay()
  const monday = new Date(simple)
  monday.setDate(simple.getDate() - dayOfWeek + 1)

  if (dayOfWeek > 4)
    monday.setDate(monday.getDate() + 7)

  if (monday.getFullYear() > year || (monday.getFullYear() === year && monday.getMonth() === 11 && monday.getDate() > 28))
      throw new RangeError(`${year} has no ISO week ${week}`);

  const sunday = new Date(monday);
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

export const getMondayOfWeek = ({ week, year }: IWeekYear): string => {
  const janFirst = new Date(year, 0, 1)
  const firstMonday = janFirst.getDay() <= 1 
    ? new Date(year, 0, 1 + (1 - janFirst.getDay())) 
    : new Date(year, 0, 1 + (8 - janFirst.getDay()))

  const targetMonday = new Date(firstMonday)
  targetMonday.setDate(firstMonday.getDate() + (week - 1) * 7)

  const yearStr = targetMonday.getFullYear()
  const monthStr = String(targetMonday.getMonth() + 1).padStart(2, '0')
  const dayStr = String(targetMonday.getDate()).padStart(2, '0')
  return `${ yearStr }-${ monthStr }-${ dayStr }`
}

export const weekRange = (week: number, year: number): IWeek => {
  const { monday, sunday } = getDatesOfWeek(week, year)
  return {
    monday: formatDate(monday as Date),
    sunday: formatDate(sunday as Date)
  }
}

export const getWeekNumber = (d: Date): { week: number, year: number } => {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()))
  date.setUTCDate(date.getUTCDate() + 4 - (date.getUTCDay() || 7))

  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1))
  const week = Math.ceil(((date.getTime() - yearStart.getTime()) / 86400000 + 1) / 7)
  return { week, year: date.getUTCFullYear() }
}