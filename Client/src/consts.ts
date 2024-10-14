import { NavigationActionKind } from "./context/Navigation"
import { type IconDefinition } from "./types"

export const LINKS: string[] = [
  'RECIBOS DE NOMINA',
  'TRABAJADORES',
  'PUESTOS',
  'DEPARTAMENTOS',
  'AREAS COMERCIALES',
  'PERCEPCIONES',
  'DEDUCCIONES',
  'CATALOGO DE PROYECTOS',
  'EMPRESAS',
  'BANCOS'
] as const

export const PAYROLL_TYPE_OP: IconDefinition[] = [
  { label: 'Ordinario' }, 
  { label: 'ExtraOrdinario' }
] as const

export const REPORTING_ACTIONS: Record<NavigationActionKind, IconDefinition[]> = {
  [NavigationActionKind.PAYROLLRECEIPTS]: [
    { label: 'Recibos del Periodo' }, { label: 'Recibos del Periodo (det)' },
    { label: 'Acumulado x Periodos' }, { label: 'Acumulado x Depto.' },
    { label: 'Acumulado por Proyecto/Puesto' }, { label: 'Prestamos y Descuentos' },
    { label: 'Deducciones x Proyecto' }
  ],
  [NavigationActionKind.EMPLOYEES]: [
    { label: 'Listado a Detalle' }, { label: 'Trabajadores por Fecha' }
  ],
  [NavigationActionKind.JOBPOSITIONS]: [],
  [NavigationActionKind.DEPARTMENTS]: [],
  [NavigationActionKind.COMMERCIALAREAS]: [],
  [NavigationActionKind.PERCEPTIONS]: [],
  [NavigationActionKind.DEDUCTIONS]: [],
  [NavigationActionKind.PROJECTCATALOG]: [
    { label: 'Acumulado' }
  ],
  [NavigationActionKind.COMPANIES]: [],
  [NavigationActionKind.TABLEWORK]: [],
  [NavigationActionKind.BANKS]: [],
  [NavigationActionKind.UPDATEDATA]: [],
  [NavigationActionKind.UPDATETABLE]: [],
  [NavigationActionKind.UPDATEPAYROLL]: [],
  [NavigationActionKind.UPDATESELECTEDID]: [],
    [NavigationActionKind.UPDATETOOLBAROPT]: [],
  [NavigationActionKind.ERROR]: []
} as const