import { NavigationActionKind } from "./context/Navigation"
import { type IReportDefinition } from "./types"

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

export const REPORTING_ACTIONS: Record<NavigationActionKind, Record<string, IReportDefinition[]>> = {
  [NavigationActionKind.PAYROLLRECEIPTS]: {
    'report': [
      { id: 'ticketByPeriod', label: 'Recibos del Periodo', hasForm: false }, { id: 'ticketByPeriodDet', label: 'Recibos del Periodo (det)', hasForm: false },
      { id: 'accumulatedByPeriod', label: 'Acumulado x Periodos', hasForm: true }, { id: 'accumulatedByDepartment', label: 'Acumulado x Depto.', hasForm: true },
      { id: 'accumulatedByProject', label: 'Acumulado por Proyecto/Puesto', hasForm: true }, { id: 'loans', label: 'Prestamos y Descuentos', hasForm: true },
      { id: 'deductions', label: 'Deducciones x Proyecto', hasForm: true }
    ]
  },
  [NavigationActionKind.EMPLOYEES]: {
    'report': [
      { id: 'list', label: 'Listado a Detalle', hasForm: false }, { id: 'employeesByDate', label: 'Trabajadores por Fecha', hasForm: true }
    ],
    'filter': [
      { id: 'default', label: 'Todos', hasForm: false }
    ]
  },
  [NavigationActionKind.JOBPOSITIONS]: {},
  [NavigationActionKind.DEPARTMENTS]: {},
  [NavigationActionKind.COMMERCIALAREAS]: {},
  [NavigationActionKind.PERCEPTIONS]: {},
  [NavigationActionKind.DEDUCTIONS]: {},
  [NavigationActionKind.PROJECTCATALOG]: {
    'report': [
      { id: 'accumulated', label: 'Acumulado', hasForm: false }
    ]
  },
  [NavigationActionKind.COMPANIES]: {},
  [NavigationActionKind.TABLEWORK]: {
    'layout': [
      { id: 'update-layout', label: 'Generar Layout', hasForm: true }
    ]
  },
  [NavigationActionKind.BANKS]: {},
  [NavigationActionKind.UPDATEDATA]: {},
  [NavigationActionKind.UPDATETABLE]: {},
  [NavigationActionKind.UPDATEPAYROLL]: {},
  [NavigationActionKind.UPDATESELECTEDID]: {},
  [NavigationActionKind.UPDATETOOLBAROPT]: {},
  [NavigationActionKind.ERROR]: {}
} as const

export const FILTER_COLUMNS: Record<string, number[]> = {
  ['loans']: [ 2, 3, 10 ],
  ['deductions']: [ 10 ],
  ['employeesByDate']: [ 2, 7, 9, 10, 11, 13, 17, 18 ]
} as const

export const totalTitles: string[] = ['Total de periodo', '', 'Total Pagado', 'Saldo'] as const