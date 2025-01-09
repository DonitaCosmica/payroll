import { NavigationActionKind } from "./context/Navigation"

interface DataObject {
  [key: string]: string | number | boolean;
}
export interface IDataResponse {
  columns: string[],
  data: DataObject[],
  formData: DataObject[],
  formColumns: string[]
}
export interface ListObject {
  [key: string]: string | number,
  id?: string,
  name: string | number
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
  id: string,
  icon?: JSX.Element,
  label: string,
  onClick?: (id?: string) => void
}
export interface ReportDefinition {
  id: string,
  label: string,
  hasForm: boolean
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
  modify?: boolean,
  amount?: boolean,
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
  data: DataObject[],
  formData: DataObject[],
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
    newData?: DataObject[],
    formData?: DataObject[],
    formColumns?: string[],
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
export interface IStatus {
  statusId: string,
  name: string,
  statusType: string,
  statusOption: 'Positive' | 'Negative'
}