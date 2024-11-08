import { NavigationActionKind } from "../context/Navigation"
import { type FieldConfig } from "../types" 

export const fieldsConfig: Record<NavigationActionKind, FieldConfig[]> = {
  [NavigationActionKind.PAYROLLRECEIPTS]: [
    { type: 'input', name: 'Serie', label: 'Serie...', inputType: 'text', modify: false, id: 'serie' },
    { type: 'input', name: 'Folio', label: 'Folio...', inputType: 'text', modify: false, id: 'bill' },
    { type: 'dropmenu', name: 'Tipo de Nomina', fetchUrl: 'http://localhost:5239/api/Payroll', id: 'payroll' },
    { type: 'dropmenu', name: 'Status', fetchUrl: 'http://localhost:5239/api/Status', id: 'status', uriComponent: 'Ticket' },
    { type: 'input', name: 'Fecha de Recibo', label: `${ new Date().toLocaleDateString("en-GB").replace('/', '/') }`, inputType: 'date', modify: true, id: 'receiptOfDate' },
    { type: 'input', name: 'Fecha de Pago', label: `${ new Date().toLocaleDateString("en-GB").replace('/', '/') }`, inputType: 'date', modify: true, id: 'paymentDate' },
    { type: 'dropmenu', name: 'Empleado', fetchUrl: 'http://localhost:5239/api/Employee', id: 'employee' },
    { type: 'multi-option', name: 'Percepciones', amount: true, id: 'perceptions' },
    { type: 'multi-option', name: 'Deducciones', amount: true, id: 'deductions' },
    { type: 'textarea', name: 'Observaciones', label: 'Observaciones...', id: 'observations' }
  ],
  [NavigationActionKind.EMPLOYEES]: [
    { type: 'section', name: 'Datos Generales', id: 'general-data' },
    { type: 'input', name: 'Código', label: '0', inputType: 'number', modify: true, id: 'key' },
    { type: 'input', name: 'Nombre', label: 'Nombre...', inputType: 'text', modify: true, id: 'name' },
    { type: 'input', name: 'RFC', label: 'RFC...', inputType: 'text', modify: true, id: 'rfc' },
    { type: 'input', name: 'CURP', label: 'CURP...', inputType: 'text', modify: true, id: 'curp' },
    { type: 'dropmenu', name: 'Banco', fetchUrl: 'http://localhost:5239/api/Bank', id: 'bank' },
    { type: 'input', name: 'CLABE', label: 'CLABE...', inputType: 'number', modify: true, id: 'interbankCode' },
    { type: 'input', name: 'Cuenta de Banco', label: 'Cuenta Banco...', inputType: 'number', modify: true, id: 'bankAccount' },
    { type: 'input', name: 'ID Portal Banco', label: 'Portal ID...', modify: true, id: 'bankPortal' },
    { type: 'input', name: 'Titular', inputType: 'checkbox', modify: true, id: 'isAStarter' },
    { type: 'section', name: 'Datos Laborales', id: 'labor-data' },
    { type: 'multi-option', name: 'Proyecto', fetchUrl: 'http://localhost:5239/api/Project', amount: false, id: 'projects' },
    { type: 'dropmenu', name: 'Régimen', fetchUrl: 'http://localhost:5239/api/Regime', id: 'regime' },
    { type: 'input', name: 'NSS', label: 'NSS...', inputType: 'number', modify: true, id: 'nss' },
    { type: 'input', name: 'Fecha de Ingreso', label: `${ new Date().toLocaleDateString("en-GB").replace('/', '/') }`, inputType: 'date', modify: true, id: 'dateAdmission' },
    { type: 'dropmenu', name: 'Puesto', fetchUrl: 'http://localhost:5239/api/JobPosition', id: 'jobPosition' },
    { type: 'input', name: 'Departamento', label: 'Departmento...', modify: false, id: 'department' },
    { type: 'dropmenu', name: 'Area Comercial', fetchUrl: 'http://localhost:5239/api/CommercialArea', id: 'commercialArea' },
    { type: 'dropmenu', name: 'Contrato', fetchUrl: 'http://localhost:5239/api/Contract', id: 'contract' },
    { type: 'input', name: 'Salario Semanal', label: '0.00', inputType: 'number', modify: true, id: 'baseSalary' },
    { type: 'dropmenu', name: 'Entidad Federativa', fetchUrl: 'http://localhost:5239/api/FederalEntity', id: 'federalEntity' },
    { type: 'section', name: 'Contacto', id: 'contact-data' },
    { type: 'input', name: 'Teléfono', label: 'Teléfono...', inputType: 'tel', modify: true, id: 'phone' },
    { type: 'input', name: 'Email', label: 'Email...', inputType: 'email', modify: true, id: 'email' },
    { type: 'section', name: 'Otros', id: 'other-data' },
    { type: 'input', name: 'Dirección', label: 'Dirección...', inputType: 'text', modify: true, id: 'direction' },
    { type: 'input', name: 'Colonia', label: 'Colonia...', inputType: 'text', modify: true, id: 'suburb' },
    { type: 'input', name: 'Codigo Postal', label: 'Código Postal...', inputType: 'number', modify: true, id: 'postalCode' },
    { type: 'input', name: 'Ciudad', label: 'Ciudad...', inputType: 'text', modify: true, id: 'city' },
    { type: 'dropmenu', name: 'Estado', fetchUrl: 'http://localhost:5239/api/State', id: 'state' },
    { type: 'input', name: 'País', label: 'País...', inputType: 'text', modify: true, id: 'country' },
    { type: 'dropmenu', name: 'Status', fetchUrl: 'http://localhost:5239/api/Status', id: 'status', uriComponent: 'Employee' },
    { type: 'input', name: 'Proveedor', inputType: 'checkbox', id: 'isProvider' },
    { type: 'input', name: 'Crédito', label: 'Crédito...', inputType: 'text', modify: true, id: 'credit' },
    { type: 'input', name: 'Contacto', label: '0', inputType: 'number', modify: true, id: 'contact' },
    { type: 'dropmenu', name: 'Empresa', fetchUrl: 'http://localhost:5239/api/Company', id: 'company' }
  ],
  [NavigationActionKind.JOBPOSITIONS]: [
    { type: 'input', name: 'Puesto', label: 'Puesto...', inputType: 'text', modify: true, id: 'name' },
    { type: 'dropmenu', name: 'Departamento', fetchUrl: 'http://localhost:5239/api/Department', id: 'department' }
  ],
  [NavigationActionKind.DEPARTMENTS]: [
    { type: 'input', name: 'Departamento', label: 'Departamento...', inputType: 'text', modify: true, id: 'name' },
    { type: 'input', name: 'Subcontrato', label: 'Subcontrato...', inputType: 'checkbox', modify: true, id: 'subcontract' }
  ],
  [NavigationActionKind.COMMERCIALAREAS]: [
    { type: 'input', name: 'Area Comercial', label: 'Area Comercial...', inputType: 'text', modify: true, id: 'name' }
  ],
  [NavigationActionKind.PERCEPTIONS]: [
    { type: 'input', name: 'Clave', label: 'Clave...', inputType: 'text', modify: true, id: 'key' },
    { type: 'textarea', name: 'Descripción', label: 'Descripción...', inputType: 'text', modify: true, id: 'description' }
  ],
  [NavigationActionKind.DEDUCTIONS]: [
    { type: 'input', name: 'Clave', label: 'Clave...', inputType: 'number', modify: true, id: 'key' },
    { type: 'textarea', name: 'Descripción', label: 'Descripción...', inputType: 'text', modify: true, id: 'description' }
  ],
  [NavigationActionKind.PROJECTCATALOG]: [
    { type: 'input', name: 'Clave', label: 'Clave...', inputType: 'text', modify: true, id: 'code' },
    { type: 'input', name: 'Nombre', label: 'Nombre...', inputType: 'text', modify: true, id: 'name' },
    { type: 'input', name: 'Fecha de inicio', label: `${ new Date().toLocaleDateString("en-GB").replace('/', '/') }`, inputType: 'date', modify: true, id: 'startDate' },
    { type: 'dropmenu', name: 'Status', fetchUrl: 'http://localhost:5239/api/Status', id: 'status', uriComponent: 'Project' },
    { type: 'dropmenu', name: 'Compañia', fetchUrl: 'http://localhost:5239/api/Company', id: 'company' },
    { type: 'textarea', name: 'Descripción', label: 'Descripción...', inputType: 'text', modify: true, id: 'description' }
  ],
  [NavigationActionKind.COMPANIES]: [
    { type: 'input', name: 'Nombre', label: 'Nombre...', inputType: 'text', modify: true, id: 'name' }
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

export const fieldsReport: Record<string, FieldConfig[]> = {
  ['Acumulado x Periodos']: [
    { type: 'input', name: 'Periodo Inicial', inputType: 'date', modify: true, id: 'inicialPeriod' },
    { type: 'input', name: 'Periodo Final', inputType: 'date', modify: true, id: 'finalPeriod' }
  ],
  ['Acumulado x Depto.']: [
    { type: 'dropmenu', name: 'Departamento', fetchUrl: 'http://localhost:5239/api/Department', id: 'department' },
  ],
  ['Acumulado por Proyecto/Puesto']: [
    { type: 'input', name: 'Periodo Inicial', label: `${ new Date().toLocaleDateString("en-GB").replace('/', '/') }`, inputType: 'date', modify: true, id: 'inicialPeriod' },
    { type: 'input', name: 'Periodo Final', label: `${ new Date().toLocaleDateString("en-GB").replace('/', '/') }`, inputType: 'date', modify: true, id: 'finalPeriod' },
    { type: 'dropmenu', name: 'Departamento', fetchUrl: 'http://localhost:5239/api/Department', id: 'department' },
    { type: 'dropmenu', name: 'Concepto', fetchUrl: 'http://localhost:5239/api/Perception', id: 'perception' },
    { type: 'input', name: 'Resumen', inputType: 'checkbox', modify: true, id: 'resumen' }
  ],
  ['Prestamos y Descuentos']: [

  ],
  ['Deducciones x Proyecto']: [

  ],
  ['Trabajadores por Fecha']: [
    { type: 'dropmenu', name: 'Proyecto', fetchUrl: 'http://localhost:5239/api/Project', id: 'projects' },
    { type: 'dropmenu', name: 'Puesto', fetchUrl: 'http://localhost:5239/api/JobPosition', id: 'jobPosition' },
    { type: 'dropmenu', name: 'Status', fetchUrl: 'http://localhost:5239/api/Status', id: 'status', uriComponent: 'Employee' }
  ],
  ['Generar Layout']: [
    { type: 'dropmenu', name: 'Proyecto', fetchUrl: 'http://localhost:5239/api/Project', id: 'projects' },
    { type: 'dropmenu', name: 'Cuenta', fetchUrl: 'http://localhost:5239/api/Account', id: 'account' },
    { type: 'input', name: 'Agrupar no titulares', inputType: 'checkbox', modify: true, id: 'titular' }
  ]
} as const