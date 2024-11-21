import { type DataObject } from "../types"

const transformKeysToCamelCase = (obj: DataObject): DataObject => 
  Object.keys(obj).reduce((acc: DataObject, key: string) => {
    const camelCaseKey = toCamelCase(key)
    acc[camelCaseKey] = obj[key]
    return acc
  }, {} as DataObject)

export const getWeekNumber = (date: Date): number => {
  const currentDate = date || new Date()
  const januaryFirst = new Date(currentDate.getFullYear(), 0, 1)
  const daysToNextMonday = (januaryFirst.getDay() === 1) ? 0 : (7 - januaryFirst.getDay()) % 7
  const nextMonday = new Date(currentDate.getFullYear(), 0, januaryFirst.getDate() + daysToNextMonday)
  return (currentDate < nextMonday) ? 52 :
    (currentDate > nextMonday ? Math.ceil((currentDate.getTime() - nextMonday.getTime()) / (24 * 3600 * 1000) / 7) : 1)
}

export const toCamelCase = (str: string): string => {
  return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index: number) =>
    index === 0 ? match.toLowerCase() : match.toUpperCase()).replace(/\s+/g, '')
}

export const reorganizeData = (data: DataObject[]) =>
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