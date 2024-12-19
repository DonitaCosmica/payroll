import { NavigationActionKind } from "./context/Navigation"
import { type ReportDefinition, type IconDefinition } from "./types"

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

export const REPORTING_ACTIONS: Record<NavigationActionKind, ReportDefinition[]> = {
  [NavigationActionKind.PAYROLLRECEIPTS]: [
    { label: 'Recibos del Periodo', hasForm: false }, { label: 'Recibos del Periodo (det)', hasForm: false },
    { label: 'Acumulado x Periodos', hasForm: true }, { label: 'Acumulado x Depto.', hasForm: true },
    { label: 'Acumulado por Proyecto/Puesto', hasForm: true }, { label: 'Prestamos y Descuentos', hasForm: true },
    { label: 'Deducciones x Proyecto', hasForm: true }
  ],
  [NavigationActionKind.EMPLOYEES]: [
    { label: 'Listado a Detalle', hasForm: false }, { label: 'Trabajadores por Fecha', hasForm: true }
  ],
  [NavigationActionKind.JOBPOSITIONS]: [],
  [NavigationActionKind.DEPARTMENTS]: [],
  [NavigationActionKind.COMMERCIALAREAS]: [],
  [NavigationActionKind.PERCEPTIONS]: [],
  [NavigationActionKind.DEDUCTIONS]: [],
  [NavigationActionKind.PROJECTCATALOG]: [
    { label: 'Acumulado', hasForm: false }
  ],
  [NavigationActionKind.COMPANIES]: [],
  [NavigationActionKind.TABLEWORK]: [
    { label: 'Generar Layout', hasForm: true }
  ],
  [NavigationActionKind.BANKS]: [],
  [NavigationActionKind.UPDATEDATA]: [],
  [NavigationActionKind.UPDATETABLE]: [],
  [NavigationActionKind.UPDATEPAYROLL]: [],
  [NavigationActionKind.UPDATESELECTEDID]: [],
    [NavigationActionKind.UPDATETOOLBAROPT]: [],
  [NavigationActionKind.ERROR]: []
} as const

export const FILTER_COLUMNS: Record<string, string[]> = {
  ['Prestamos y Descuentos']: [
    'Folio', 'Proyectos', 'Trabajador'
  ],
  ['Deducciones x Proyecto']: [
    'Proyectos'
  ],
  ['Trabajadores por Fecha']: [
    'Proyectos', 'Nombre', 'Puesto de trabajo',
    'Estado', 'Salario Base', 'Fecha de Admisión'
  ]
}

export const totalTitles: string[] = ['Total de periodo', 'Total Extraordinario', 'Total Pagado', 'Saldo']