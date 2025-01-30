import { NavigationActionKind } from "./context/Navigation"

export enum FieldType {
  Input = "input",
  DropMenu = "dropmenu",
  Section = "section",
  TextArea = "textarea",
  MultiOption = "multi-option"
}
export enum InputType {
  Text = "text",
  Tel = "tel",
  Number = "number",
  Email = "email",
  Date = "date",
  Checkbox = "checkbox"
}

interface IDataObject {
  [key: string]: string | number | boolean | object;
}
export interface IDropDownMenu extends IDataObject {
  readonly value: string,
  readonly name: string,
  readonly description?: string,
  readonly compensationType?: string
}
export interface IDataResponse {
  readonly columns: string[],
  readonly data: IDataObject[],
  readonly formData: IDataObject[],
  readonly formColumns: string[]
}
export interface IListObject extends Record<string, string | number> {
  readonly id?: string,
  readonly name: string | number
}
export interface IMenuState extends Record<string, boolean> {
  readonly date: boolean,
  readonly text: boolean
}
export interface IWeek {
  readonly monday: string | Date,
  readonly sunday: string | Date
}
export interface IWeekYear {
  readonly periodId?: string,
  readonly week: number,
  readonly year: number
}
export interface IPeriod extends Pick<IWeekYear, 'periodId' | 'week'> {}
export interface IDates extends Record<number, IPeriod[]> {}
export interface IDropMenu {
  readonly id: string,
  readonly label: string
}
export interface IIconDefinition extends IDropMenu {
  readonly icon?: JSX.Element,
  readonly onClick?: (id?: string, label?: string) => void
}
export interface IReportDefinition {
  readonly id: string,
  readonly label: string,
  readonly hasForm: boolean
}
export interface IFieldConfig {
  readonly type: FieldType,
  readonly name: string,
  readonly label?: string,
  readonly inputType?: InputType,
  readonly fetchUrl?: string,
  readonly uriComponent?: string,
  readonly modify?: boolean,
  readonly amount?: boolean,
  readonly id: string
}
export interface IStatus {
  readonly statusId: string,
  readonly name: string,
  readonly statusType: string,
  readonly statusOption: 'Positive' | 'Negative'
}
export interface IPayrollType {
  readonly payrollId: string,
  readonly name: string
}
export interface IPageComponents {
  titlebar: string,
  filterReport: string
}