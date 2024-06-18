import { NavigationActionKind } from "../context/Navigation"
import { type FieldConfig } from "../types" 

export const fieldsConfig: Record<NavigationActionKind, FieldConfig[]> = {
  [NavigationActionKind.PAYROLLRECEIPTS]: [],
  [NavigationActionKind.EMPLOYEES]: [
    { type: 'section', name: 'Datos Generales', id: 'general-data' },
    { type: 'input', name: 'Código', label: '0', inputType: 'number', id: 'key' },
    { type: 'input', name: 'Nombre', label: 'Nombre...', inputType: 'text', id: 'name' },
    { type: 'input', name: 'RFC', label: 'RFC...', inputType: 'text', id: 'rfc' },
    { type: 'input', name: 'CURP', label: 'CURP...', inputType: 'text', id: 'curp' },
    { type: 'input', name: 'CLABE', label: 'CLABE...', inputType: 'number', id: 'interbankCode' },
    { type: 'input', name: 'Cuenta de Banco', label: 'Cuenta Banco...', inputType: 'number', id: 'bankAccount' },
    { type: 'dropmenu', name: 'Banco', fetchUrl: 'http://localhost:5239/api/Bank', id: 'bank' },
    { type: 'input', name: 'ID Portal Banco', label: 'Portal ID...', id: 'bankPortalID' },
    { type: 'input', name: 'Titular', inputType: 'checkbox', id: 'titular' },
    { type: 'section', name: 'Datos Laborales', id: 'labor-data' },
    { type: 'dropmenu', name: 'Proyecto', fetchUrl: 'http://localhost:5239/api/Project', id: 'project' },
    { type: 'dropmenu', name: 'Régimen', fetchUrl: 'http://localhost:5239/api/Regime', id: 'regime' },
    { type: 'input', name: 'NSS', label: 'NSS...', inputType: 'number', id: 'nss' },
    { type: 'input', name: 'Fecha de Ingreso', label: '1/1/2000', inputType: 'date', id: 'date' },
    { type: 'dropmenu', name: 'Puesto', fetchUrl: 'http://localhost:5239/api/JobPosition', id: 'job' },
    { type: 'dropmenu', name: 'Departamento', fetchUrl: 'http://localhost:5239/api/Department', id: 'department' },
    { type: 'dropmenu', name: 'Area Comercial', fetchUrl: 'http://localhost:5239/api/CommercialArea', id: 'commercial' },
    { type: 'dropmenu', name: 'Contrato', fetchUrl: 'http://localhost:5239/api/Contract', id: 'contract' },
    { type: 'input', name: 'Salario Semanal', label: '0.00', inputType: 'number', id: 'weekly-salary' },
    { type: 'input', name: 'Salario Diario Int.', label: '0.00', inputType: 'number', id: 'daily-salary' },
    { type: 'input', name: 'Val. Hora Extra', label: '0.00', inputType: 'number', id: 'extra-hour-value' },
    { type: 'dropmenu', name: 'Entidad Federativa', fetchUrl: 'http://localhost:5239/api/FederalEntity', id: 'federal' },
    { type: 'section', name: 'Contacto', id: 'contact-data' },
    { type: 'input', name: 'Teléfono', label: 'Teléfono...', inputType: 'tel', id: 'phone' },
    { type: 'input', name: 'Email', label: 'Email...', inputType: 'email', id: 'email' },
    { type: 'section', name: 'Otros', id: 'other-data' },
    { type: 'input', name: 'Dirección', label: 'Dirección...', inputType: 'text', id: 'direction' },
    { type: 'input', name: 'Colonia', label: 'Colonia...', inputType: 'text', id: 'cologne' },
    { type: 'input', name: 'CP', label: 'Código Postal...', inputType: 'number', id: 'postal-code' },
    { type: 'input', name: 'Ciudad', label: 'Ciudad...', inputType: 'text', id: 'city' },
    { type: 'dropmenu', name: 'Estado', fetchUrl: 'http://localhost:5239/api/State', id: 'state' },
    { type: 'input', name: 'País', label: 'País...', inputType: 'text', id: 'country' },
    { type: 'input', name: 'Proveedor', inputType: 'checkbox', id: 'isProvider' },
    { type: 'input', name: 'Crédito', label: 'Crédito...', inputType: 'text', id: 'credit' },
    { type: 'input', name: 'Contacto', label: '0', inputType: 'number', id: 'contact' },
    { type: 'dropmenu', name: 'Company', fetchUrl: 'http://localhost:5239/api/Company', id: 'company' }
  ],
  [NavigationActionKind.JOBPOSITIONS]: [
    { type: 'input', name: 'Puesto', label: 'Puesto...', inputType: 'text', id: 'name' },
    { type: 'dropmenu', name: 'Departamento', fetchUrl: 'http://localhost:5239/api/Department', id: 'department' }
  ],
  [NavigationActionKind.DEPARTMENTS]: [
    { type: 'input', name: 'Departamento', label: 'Departamento...', inputType: 'text', id: 'name' },
    { type: 'input', name: 'Subcontrato', label: 'Subcontrato...', inputType: 'checkbox', id: 'subcontract' }
  ],
  [NavigationActionKind.COMMERCIALAREAS]: [
    { type: 'input', name: 'Area Comercial', label: 'Area Comercial...', inputType: 'text', id: 'name' }
  ],
  [NavigationActionKind.PERCEPTIONS]: [
    { type: 'input', name: 'Clave', label: 'Clave...', inputType: 'text', id: 'code' },
    { type: 'textarea', name: 'Descripción', label: 'Descripción...', inputType: 'text', id: 'description' }
  ],
  [NavigationActionKind.DEDUCTIONS]: [
    { type: 'input', name: 'Clave', label: 'Clave...', inputType: 'number', id: 'key' },
    { type: 'textarea', name: 'Descripción', label: 'Descripción...', inputType: 'text', id: 'description' }
  ],
  [NavigationActionKind.PROJECTCATALOG]: [
    { type: 'input', name: 'Clave', label: 'Clave...', inputType: 'text', id: 'code' },
    { type: 'input', name: 'Nombre', label: 'Nombre...', inputType: 'text', id: 'name' },
    { type: 'input', name: 'Fecha de inicio', label: '1/1/2000', inputType: 'date', id: 'startDate' },
    { type: 'dropmenu', name: 'Status', fetchUrl: 'http://localhost:5239/api/Status', id: 'status' },
    { type: 'dropmenu', name: 'Company', fetchUrl: 'http://localhost:5239/api/Company', id: 'company' },
    { type: 'textarea', name: 'Descripción', label: 'Descripción...', inputType: 'text', id: 'description' }
  ],
  [NavigationActionKind.COMPANIES]: [
    { type: 'input', name: 'Nombre', label: 'Nombre...', inputType: 'text', id: 'name' }
  ],
  [NavigationActionKind.UPDATEDATA]: [],
  [NavigationActionKind.ERROR]: []
}