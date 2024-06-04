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

export interface FieldConfig {
  type: 'input' | 'dropmenu' | 'section' | 'button',
  name: string,
  label?: string,
  inputType?: 'text' | 'tel' | 'number' | 'email' | 'date' | 'checkbox',
  fetchUrl?: string,
  id?: string
}