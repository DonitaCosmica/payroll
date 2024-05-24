export interface IconDefinition {
  icon?: JSX.Element,
  label: string
}
export interface IdataResponse {
  columns: string[],
  data: (string | number)[]
}

export interface IDropDownMenu {
  value: string,
  name: string
}