import { NavigationActionKind } from "../context/Navigation"
import { FieldType, InputType, type IFieldConfig } from "../types.d" 

export const fieldsConfig: Record<NavigationActionKind, IFieldConfig[]> = {
  [NavigationActionKind.PAYROLLRECEIPTS]: [
    { type: FieldType.DropMenu, name: 'Tipo de Nomina', fetchUrl: 'http://localhost:5239/api/Payroll', id: 'payroll' },
    { type: FieldType.DropMenu, name: 'Status', fetchUrl: 'http://localhost:5239/api/Status', id: 'status', uriComponent: 'Ticket' },
    { type: FieldType.DropMenu, name: 'Empleado', fetchUrl: 'http://localhost:5239/api/Employee', id: 'employee' },
    { type: FieldType.MultiOption, name: 'Percepciones', amount: true, id: 'perceptions' },
    { type: FieldType.MultiOption, name: 'Deducciones', amount: true, id: 'deductions' },
    { type: FieldType.TextArea, name: 'Observaciones', label: 'Observaciones...', id: 'observations' }
  ],
  [NavigationActionKind.EMPLOYEES]: [
    { type: FieldType.Section, name: 'Datos Generales', id: 'general-data' },
    { type: FieldType.Input, name: 'Código', label: '0', inputType: InputType.Number, modify: true, id: 'key' },
    { type: FieldType.Input, name: 'Nombre', label: 'Nombre...', inputType: InputType.Text, modify: true, id: 'name' },
    { type: FieldType.Input, name: 'RFC', label: 'RFC...', inputType: InputType.Text, modify: true, id: 'rfc' },
    { type: FieldType.Input, name: 'CURP', label: 'CURP...', inputType: InputType.Text, modify: true, id: 'curp' },
    { type: FieldType.DropMenu, name: 'Banco', fetchUrl: 'http://localhost:5239/api/Bank', id: 'bank' },
    { type: FieldType.Input, name: 'CLABE', label: 'CLABE...', inputType: InputType.Text, modify: true, id: 'interbankCode' },
    { type: FieldType.Input, name: 'Cuenta de Banco', label: 'Cuenta Banco...', inputType: InputType.Text, modify: true, id: 'bankAccount' },
    { type: FieldType.Input, name: 'ID Portal Banco', label: 'Portal ID...', inputType: InputType.Number, modify: true, id: 'bankPortal' },
    { type: FieldType.Input, name: 'Titular', inputType: InputType.Checkbox, modify: true, id: 'isAStarter' },
    { type: FieldType.Section, name: 'Datos Laborales', id: 'labor-data' },
    { type: FieldType.DropMenu, name: 'Régimen', fetchUrl: 'http://localhost:5239/api/Regime', id: 'regime' },
    { type: FieldType.Input, name: 'NSS', label: 'NSS...', inputType: InputType.Text, modify: true, id: 'nss' },
    { type: FieldType.DropMenu, name: 'Empresa', fetchUrl: 'http://localhost:5239/api/Company', id: 'company' },
    { type: FieldType.Input, name: 'Fecha de Ingreso', label: `${ new Date().toLocaleDateString("en-GB").replace('/', '/') }`, inputType: InputType.Date, modify: true, id: 'dateAdmission' },
    { type: FieldType.DropMenu, name: 'Puesto', fetchUrl: 'http://localhost:5239/api/JobPosition', id: 'jobPosition' },
    { type: FieldType.Input, name: 'Departamento', label: 'Departmento...', inputType: InputType.Text, modify: false, id: 'department' },
    { type: FieldType.DropMenu, name: 'Area Comercial', fetchUrl: 'http://localhost:5239/api/CommercialArea', id: 'commercialArea' },
    { type: FieldType.DropMenu, name: 'Entidad Federativa', fetchUrl: 'http://localhost:5239/api/FederalEntity', id: 'federalEntity' },
    { type: FieldType.MultiOption, name: 'Proyecto', amount: false, id: 'projects' },
    { type: FieldType.DropMenu, name: 'Contrato', fetchUrl: 'http://localhost:5239/api/Contract', id: 'contract' },
    { type: FieldType.Input, name: 'Salario Semanal', label: '0.00', inputType: InputType.Number, modify: true, id: 'baseSalary' },
    { type: FieldType.Section, name: 'Contacto', id: 'contact-data' },
    { type: FieldType.Input, name: 'Teléfono', label: 'Teléfono...', inputType: InputType.Tel, modify: true, id: 'phone' },
    { type: FieldType.Input, name: 'Email', label: 'Email...', inputType: InputType.Email, modify: true, id: 'email' },
    { type: FieldType.Section, name: 'Otros', id: 'other-data' },
    { type: FieldType.Input, name: 'Dirección', label: 'Dirección...', inputType: InputType.Text, modify: true, id: 'direction' },
    { type: FieldType.Input, name: 'Colonia', label: 'Colonia...', inputType: InputType.Text, modify: true, id: 'suburb' },
    { type: FieldType.Input, name: 'Codigo Postal', label: 'Código Postal...', inputType: InputType.Number, modify: true, id: 'postalCode' },
    { type: FieldType.Input, name: 'Ciudad', label: 'Ciudad...', inputType: InputType.Text, modify: true, id: 'city' },
    { type: FieldType.DropMenu, name: 'Estado', fetchUrl: 'http://localhost:5239/api/State', id: 'state' },
    { type: FieldType.Input, name: 'País', label: 'País...', inputType: InputType.Text, modify: true, id: 'country' },
    { type: FieldType.DropMenu, name: 'Status', fetchUrl: 'http://localhost:5239/api/Status', id: 'status', uriComponent: 'Employee' },
    { type: FieldType.Input, name: 'Proveedor', inputType: InputType.Checkbox, id: 'isProvider' },
    { type: FieldType.Input, name: 'Crédito', label: 'Crédito...', inputType: InputType.Number, modify: true, id: 'credit' },
    { type: FieldType.Input, name: 'Contacto', label: '0', inputType: InputType.Tel, modify: true, id: 'contact' }
  ],
  [NavigationActionKind.JOBPOSITIONS]: [
    { type: FieldType.Input, name: 'Puesto', label: 'Puesto...', inputType: InputType.Text, modify: true, id: 'name' },
    { type: FieldType.DropMenu, name: 'Departamento', fetchUrl: 'http://localhost:5239/api/Department', id: 'department' }
  ],
  [NavigationActionKind.DEPARTMENTS]: [
    { type: FieldType.Input, name: 'Departamento', label: 'Departamento...', inputType: InputType.Text, modify: true, id: 'name' },
    { type: FieldType.Input, name: 'Subcontrato', label: 'Subcontrato...', inputType: InputType.Checkbox, modify: true, id: 'subcontract' }
  ],
  [NavigationActionKind.COMMERCIALAREAS]: [
    { type: FieldType.Input, name: 'Area Comercial', label: 'Area Comercial...', inputType: InputType.Text, modify: true, id: 'name' }
  ],
  [NavigationActionKind.PERCEPTIONS]: [
    { type: FieldType.Input, name: 'Clave', label: 'Clave...', inputType: InputType.Text, modify: true, id: 'key' },
    { type: FieldType.Input, name: 'Descripción', label: 'Descripción...', inputType: InputType.Text, modify: true, id: 'description' }
  ],
  [NavigationActionKind.DEDUCTIONS]: [
    { type: FieldType.Input, name: 'Clave', label: 'Clave...', inputType: InputType.Text, modify: true, id: 'key' },
    { type: FieldType.Input, name: 'Descripción', label: 'Descripción...', inputType: InputType.Text, modify: true, id: 'description' }
  ],
  [NavigationActionKind.PROJECTCATALOG]: [
    { type: FieldType.Input, name: 'Clave', label: 'Clave...', inputType: InputType.Text, modify: true, id: 'code' },
    { type: FieldType.Input, name: 'Nombre', label: 'Nombre...', inputType: InputType.Text, modify: true, id: 'name' },
    { type: FieldType.Input, name: 'Fecha de inicio', label: `${ new Date().toLocaleDateString("en-GB").replace('/', '/') }`, inputType: InputType.Date, modify: true, id: 'startDate' },
    { type: FieldType.DropMenu, name: 'Status', fetchUrl: 'http://localhost:5239/api/Status', id: 'status', uriComponent: 'Project' },
    { type: FieldType.DropMenu, name: 'Compañia', fetchUrl: 'http://localhost:5239/api/Company', id: 'company' },
    { type: FieldType.TextArea, name: 'Descripción', label: 'Descripción...', inputType: InputType.Text, modify: true, id: 'description' }
  ],
  [NavigationActionKind.COMPANIES]: [
    { type: FieldType.Input, name: 'Nombre', label: 'Nombre...', inputType: InputType.Text, modify: true, id: 'name' }
  ],
  [NavigationActionKind.BANKS]: [],
  [NavigationActionKind.TABLEWORK]: [],
  [NavigationActionKind.UPDATEDATA]: [],
  [NavigationActionKind.UPDATETABLE]: [],
  [NavigationActionKind.UPDATEPAYROLL]: [],
  [NavigationActionKind.UPDATESELECTEDID]: [],
  [NavigationActionKind.UPDATETOOLBAROPT]: [],
  [NavigationActionKind.ERROR]: []
} as const

export const fieldsReport: Record<string, IFieldConfig[]> = {
  ['accumulatedByPeriod']: [
    { type: FieldType.Input, name: 'Periodo Inicial', inputType: InputType.Date, modify: true, id: 'inicialPeriod' },
    { type: FieldType.Input, name: 'Periodo Final', inputType: InputType.Date, modify: true, id: 'finalPeriod' }
  ],
  ['accumulatedByDepartment']: [
    { type: FieldType.DropMenu, name: 'Departamento', fetchUrl: 'http://localhost:5239/api/Department', id: 'department' },
  ],
  ['accumulatedByProject']: [
    { type: FieldType.Input, name: 'Periodo Inicial', label: `${ new Date().toLocaleDateString("en-GB").replace('/', '/') }`, inputType: InputType.Date, modify: true, id: 'inicialPeriod' },
    { type: FieldType.Input, name: 'Periodo Final', label: `${ new Date().toLocaleDateString("en-GB").replace('/', '/') }`, inputType: InputType.Date, modify: true, id: 'finalPeriod' },
    { type: FieldType.DropMenu, name: 'Departamento', fetchUrl: 'http://localhost:5239/api/Department', id: 'department' },
    { type: FieldType.DropMenu, name: 'Concepto', fetchUrl: 'http://localhost:5239/api/Perception', id: 'perception' },
    { type: FieldType.Input, name: 'Resumen', inputType: InputType.Checkbox, modify: true, id: 'resumen' }
  ],
  ['loans']: [],
  ['deductions']: [],
  ['employeesByDate']: [
    { type: FieldType.DropMenu, name: 'Proyecto', fetchUrl: 'http://localhost:5239/api/Project', id: 'projects' },
    { type: FieldType.DropMenu, name: 'Puesto', fetchUrl: 'http://localhost:5239/api/JobPosition', id: 'jobPosition' },
    { type: FieldType.DropMenu, name: 'Status', fetchUrl: 'http://localhost:5239/api/Status/byType?type=Employee', id: 'status', uriComponent: 'Employee' }
  ],
  ['update-layout']: [
    { type: FieldType.DropMenu, name: 'Proyecto', fetchUrl: 'http://localhost:5239/api/Project', id: 'projects' },
    { type: FieldType.DropMenu, name: 'Cuenta', fetchUrl: 'http://localhost:5239/api/Account', id: 'account' },
    { type: FieldType.Input, name: 'Agrupar no titulares', inputType: InputType.Checkbox, modify: true, id: 'titular' }
  ]
} as const