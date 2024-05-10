export interface IconDefinition {
  icon?: JSX.Element,
  label: string
}

export interface IconsToolbar {
  options: IconDefinition[],
  menuOp?: IconDefinition[],
  end?: number
}

export interface IdataResponse {
  columns: string[],
  data: (string | number)[]
}