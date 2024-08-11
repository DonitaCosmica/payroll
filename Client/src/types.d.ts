import { NavigationActionKind } from "./context/Navigation"

export interface ListObject {
  value: string | number
}
export interface IMenuState {
  date: boolean,
  text: boolean,
  [key: string]: boolean
}
export interface IWeek {
  monday: string,
  sunday: string
}
export interface IWeekYear {
  periodId?: string,
  week: number,
  year: number
}
export interface IconDefinition {
  icon?: JSX.Element,
  label: string,
  onClick?: () => void
}
export interface IdataResponse {
  columns: string[],
  data: (string | number | boolean)[]
}
export interface IDropDownMenu {
  value: string,
  name: string,
  [key: string]: string | number
}
export interface FieldConfig {
  type: 'input' | 'dropmenu' | 'section' | 'textarea' | 'multi-option',
  name: string,
  label?: string,
  inputType?: 'text' | 'tel' | 'number' | 'email' | 'date' | 'checkbox',
  fetchUrl?: string,
  uriComponent?: string,
  id: string
}
export interface NavigationState {
  payroll: 'Ordinario' | 'ExtraOrdinario',
  selectedId: string,
  toolbarOption: number,
  title: string,
  option: NavigationActionKind,
  loading: boolean,
  url?: string
  keys: string[],
  columnNames: string[],
  data: (string | number | boolean)[][],
  formSize: number,
  error: boolean | null
}
export interface NavigationAction {
  type: NavigationActionKind,
  payload?: {
    payrollType?: 'Ordinario' | 'ExtraOrdinario',
    selectedId?: string,
    toolbarOption?: number,
    columns?: string[],
    newData?: (number | string | boolean)[][],
    names?: string[]
  } 
}
export interface IFilterPeriod {
  periods: IPeriod[],
  years: number[]
}
export interface IDates {
  years: number[],
  dates: IPeriod[][]
}