import { NavigationActionKind } from "../context/Navigation"
import { type IListObject, type IDataObject } from "../types"

const isIDataObject = (obj: any): obj is IDataObject => {
  return obj && typeof obj === 'object' && !Array.isArray(obj) && Object.keys(obj).every(key => 
    typeof key === 'string' && 
    (typeof obj[key] === 'string' || typeof obj[key] === 'number' || typeof obj[key] === 'boolean')
  )
}

const getValue = (value: string | number): number | string => 
  typeof value === 'string' ? (isNaN(parseInt(value, 10)) ? value : parseInt(value, 10)) : value

const getSortingKey = (item: IDataObject, keys: string[]): number | string | undefined => {
  for (const key of keys) {
    const value = item[key]
    if (typeof value === 'string' || typeof value === 'number')
      return getValue(value)
  }

  return undefined
}

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

export const transformKeysToCamelCase = (obj: IDataObject): IDataObject => 
  Object.keys(obj).reduce((acc: IDataObject, key: string) => {
    const camelCaseKey = toCamelCase(key)
    acc[camelCaseKey] = obj[key]
    return acc
  }, {} as IDataObject)

export const getKeyByValue = (obj: Record<string, string>, valueToFind: string): string | undefined => {
  for (const key in obj)
    if (obj[key] === valueToFind) return toCamelCase(key)
  return toCamelCase(valueToFind)
}

export const getKeyId = (obj: IListObject): string | undefined => {
  for (const key in obj)
    if (key.toLowerCase().includes('id')) return key
  return undefined
}

export const isDayOfWeek = (day: string): boolean => {
  const daysOfWeek = new Set([
    'Sunday', 'Monday',
    'Tuesday', 'Wednesday',
    'Thursday', 'Friday', 'Saturday'
  ])

  const formattedDay = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase()
  return daysOfWeek.has(formattedDay)
}

export const compareNames = (a: number | string, b: number | string): number => {
  if (typeof a === 'string' && typeof b === 'string') return a.localeCompare(b)
  if (typeof a === 'number' && typeof b === 'number') return a - b
  return 0
}

export const pluralToSingular = (word: string): string => {
  if (word.endsWith('ies')) return word.slice(0, -3) + 'y'
  else if (word.endsWith('es')) return word.slice(0, -2)
  else if (word.endsWith('s')) return word.slice(0, -1)
  else return word
}

export const toCamelCase = (str: string): string =>
  str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, (match, index: number) =>
    index === 0 ? match.toLowerCase() : match.toUpperCase()).replace(/\s+/g, '')

export const findKeyAndGetValue = <T extends IDataObject>(obj: T, searchKey: string): string | number | boolean | object | undefined => {
  const foundKey = Object.keys(obj).find((key: string) => key.includes(searchKey) || searchKey.includes(key))
  return foundKey ? obj[foundKey as keyof T] : undefined
}

export const normalizeValue = (val: unknown): string =>
  (typeof val === 'boolean' ? (val ? 'Verdadero' : 'Falso') : String(val))
    .toLowerCase()
    .trim()

export const getProperty = (obj: IDataObject, key: string): string | number | boolean | object => {
  const propertyMap: Record<string, string> = Object.keys(obj).reduce((item, originalKey) => {
    item[originalKey.toLowerCase()] = originalKey
    return item
  }, {} as Record<string, string>)

  return obj[propertyMap[key]]
}

export const sortDataByColumns = (data: IDataObject[], columns: string[]): void => {
  const sortingKeys = columns.includes('Code') || columns.includes('Key')
    ? ['code', 'key'] : columns.includes('Name') ? ['name'] : null

  if (sortingKeys)
    data.sort((a, b) => compareNames(getSortingKey(a, sortingKeys) ?? '', getSortingKey(b, sortingKeys) ?? ''))
}

export const translateColumns = async ({ opt, columnsNames }: { opt: NavigationActionKind, columnsNames: string[] }): Promise<string[]> => {
  const columnsDictionary: Record<string, string> = await loadTranslations({ opt })
  return columnsNames.map((column: string) => columnsDictionary[column] || column)
}

export const reorganizeData = (data: IDataObject[]): IDataObject[] =>
  data.map((item: IDataObject) => {
    if ('additionalProperties' in item && item.additionalProperties && typeof item.additionalProperties === 'object') {
      const { additionalProperties, ...rest } = item
      const transformedRest = transformKeysToCamelCase(rest)

      if (isIDataObject(additionalProperties)) {
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
      } else 
        throw new Error(`additionalProperties is not of type IDataObject: ${ JSON.stringify(additionalProperties) }`)
    }

    return transformKeysToCamelCase(item)
  })