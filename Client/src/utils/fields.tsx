import { NavigationActionKind } from "../context/Navigation"
import { type FieldConfig } from "../types" 

export const fieldsConfig: Record<NavigationActionKind, FieldConfig[]> = {
  [NavigationActionKind.PAYROLLRECEIPTS]: [],
  [NavigationActionKind.EMPLOYEES]: [
    { type: 'section', name: 'Datos Generales' },
    { type: 'input', name: 'Código', label: '0', inputType: 'number' },
    { type: 'input', name: 'Nombre', label: '', inputType: 'text' },
    { type: 'input', name: 'RFC', label: '', inputType: 'text' },
    { type: 'input', name: 'CURP', label: '', inputType: 'text' },
    { type: 'input', name: 'CLABE', label: '', inputType: 'number' },
    { type: 'input', name: 'Cuenta de Banco', label: '', inputType: 'text' },
    { type: 'dropmenu', name: 'Banco', fetchUrl: 'http://localhost:5239/api/Bank', id: 'bank' },
    { type: 'input', name: 'ID Portal Banco', label: '' },
    { type: 'input', name: 'Titular', label: '', inputType: 'checkbox' },
    { type: 'section', name: 'Datos Laborales' },
    { type: 'dropmenu', name: 'Proyecto', fetchUrl: 'http://localhost:5239/api/Project', id: 'project' },
    { type: 'dropmenu', name: 'Régimen', fetchUrl: 'http://localhost:5239/api/Regime', id: 'regime' },
    { type: 'input', name: 'NSS', label: '', inputType: 'number' },
    { type: 'input', name: 'Fecha de Ingreso', label: '', inputType: 'date' },
    { type: 'dropmenu', name: 'Puesto', fetchUrl: 'http://localhost:5239/api/JobPosition', id: 'job' },
    { type: 'dropmenu', name: 'Departamento', fetchUrl: 'http://localhost:5239/api/Department', id: 'department' },
    { type: 'dropmenu', name: 'Area Comercial', fetchUrl: 'http://localhost:5239/api/CommercialArea', id: 'commercial' },
    { type: 'dropmenu', name: 'Contrato', fetchUrl: 'http://localhost:5239/api/Contract', id: 'contract' },
    { type: 'input', name: 'Salario Semanal', label: '0.00', inputType: 'number' },
    { type: 'input', name: 'Salario Diario Int.', label: '0.00', inputType: 'number' },
    { type: 'input', name: 'Val. Hora Extra', label: '0.00', inputType: 'number' },
    { type: 'dropmenu', name: 'Entidad Federativa', fetchUrl: 'http://localhost:5239/api/FederalEntity', id: 'federal' },
    { type: 'section', name: 'Contacto' },
    { type: 'input', name: 'Teléfono', label: '', inputType: 'tel' },
    { type: 'input', name: 'Email', label: '', inputType: 'email' },
    { type: 'section', name: 'Otros' },
    { type: 'input', name: 'Dirección', label: '', inputType: 'text' },
    { type: 'input', name: 'Colonia', label: '', inputType: 'text' },
    { type: 'input', name: 'CP', label: '', inputType: 'number' },
    { type: 'input', name: 'Ciudad', label: '', inputType: 'text' },
    { type: 'dropmenu', name: 'Estado', fetchUrl: 'http://localhost:5239/api/State', id: 'state' },
    { type: 'input', name: 'País', label: '', inputType: 'text' },
    { type: 'input', name: 'Proveedor', label: '', inputType: 'checkbox' },
    { type: 'input', name: 'Crédito', label: '', inputType: 'text' },
    { type: 'input', name: 'Contacto', label: '', inputType: 'number' },
    { type: 'button', name: 'Enviar' },
    { type: 'button', name: 'Cancelar' }
  ],
  [NavigationActionKind.JOBPOSITIONS]: [
    { type: 'input', name: 'Puesto', label: '', inputType: 'text' },
    { type: 'dropmenu', name: 'Departamento', fetchUrl: 'http://localhost:5239/api/Department', id: 'department' }
  ],
  [NavigationActionKind.DEPARTMENTS]: [
    { type: 'input', name: 'Departamento', label: '', inputType: 'text' },
    { type: 'input', name: 'Subcontrato', label: '', inputType: 'checkbox' }
  ],
  [NavigationActionKind.COMMERCIALAREAS]: [
    { type: 'input', name: 'Area Comercial', label: '', inputType: 'text' }
  ],
  [NavigationActionKind.PERCEPTIONS]: [
    { type: 'input', name: 'Clave', label: '', inputType: 'text' },
    { type: 'input', name: 'Descripción', label: '', inputType: 'text' }
  ],
  [NavigationActionKind.DEDUCTIONS]: [
    { type: 'input', name: 'Clave', label: '', inputType: 'text' },
    { type: 'input', name: 'Descripción', label: '', inputType: 'text' }
  ],
  [NavigationActionKind.PROJECTCATALOG]: [
    { type: 'input', name: 'Clave', label: '', inputType: 'text' },
    { type: 'input', name: 'Nombre', label: '', inputType: 'text' }
  ],
  [NavigationActionKind.COMPANIES]: [
    { type: 'input', name: 'Nombre', label: '', inputType: 'text' }
  ],
  [NavigationActionKind.UPDATEDATA]: [],
  [NavigationActionKind.ERROR]: []
}