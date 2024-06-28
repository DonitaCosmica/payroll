import { type IconDefinition } from "../types"
import { NavigationActionKind } from "../context/Navigation"
import { AiOutlinePrinter, AiFillFlag, AiOutlineStop } from "react-icons/ai"
import { BsBoxArrowInDownLeft, BsDownload, BsArrowClockwise, BsFiletypePdf , BsFiletypeXls  } from "react-icons/bs"
import { BiEditAlt, BiSolidCalculator, BiBuildings, BiSolidCheckShield, BiLogOut } from "react-icons/bi"
import { TbReportSearch, TbCalendarTime } from "react-icons/tb"
import { HiOutlineKey } from "react-icons/hi2"
import { GrAdd } from "react-icons/gr"
import { RiDeleteBin6Line } from "react-icons/ri"
import { FiSettings, FiUsers } from "react-icons/fi"
import { FaComments } from "react-icons/fa6"
import { MdOutlineEmail } from "react-icons/md"
import { PiPrinter } from "react-icons/pi"
import { TfiClose } from "react-icons/tfi"

export const ICON_OPTIONS: {
  common: IconDefinition[]
  special: Record<NavigationActionKind, IconDefinition[]>
  menu: Record<NavigationActionKind, IconDefinition[]>
} = {
  common: [
    { icon: <GrAdd fontSize='1.2rem' color="#73ba69" />, label: 'Nuevo' },
    { icon: <BiEditAlt fontSize='1.2rem' color="#e5ac3b" />, label: 'Editar' },
    { icon: <RiDeleteBin6Line color="#de4645" />, label: 'Eliminar' }
  ],
  special: {
    [NavigationActionKind.PAYROLLRECEIPTS]: [
      { icon: <AiOutlinePrinter fontSize='1.2rem' color="#2c8efa" />, label: 'Imprimir' },
      { icon: <BsDownload fontSize='1.2rem' color="#70b2fb" />, label: 'Descargar' },
      { icon: <BiSolidCalculator fontSize='1.2rem' color="#dd7e7b" />, label: 'Tabla de trabajo' },
      { icon: <TbReportSearch fontSize='1.2rem' color="#ffb380" />, label: 'Reportes' }
    ],
    [NavigationActionKind.EMPLOYEES]: [
      { icon: <AiFillFlag fontSize='1.2rem' color="#70b2fb" />, label: 'Status' },
      { icon: <TbCalendarTime fontSize='1.2rem' color="#333" />, label: 'Historial' },
      { icon: <TbReportSearch fontSize='1.2rem' color="#ffb380" />, label: 'Reportes' }
    ],
    [NavigationActionKind.JOBPOSITIONS]: [
      { icon: <TbReportSearch fontSize='1.2rem' color="#ffb380" />, label: 'Prenomina' }
    ],
    [NavigationActionKind.DEPARTMENTS]: [],
    [NavigationActionKind.COMMERCIALAREAS]: [],
    [NavigationActionKind.PERCEPTIONS]: [
      { icon: <AiOutlineStop fontSize='1.2rem' color="#d92928" />, label: 'Ocultar' }
    ],
    [NavigationActionKind.DEDUCTIONS]: [
      { icon: <AiOutlineStop fontSize='1.2rem' color="#d92928" />, label: 'Ocultar' }
    ],
    [NavigationActionKind.PROJECTCATALOG]: [
      { icon: <HiOutlineKey fontSize='1.2rem' color="#585858" />, label: 'Permisos' },
      { icon: <TbReportSearch fontSize='1.2rem' color="#ffb380" />, label: 'Reportes' }
    ],
    [NavigationActionKind.COMPANIES]: [],
    [NavigationActionKind.UPDATEDATA]: [],
    [NavigationActionKind.ERROR]: []
  },
  menu: {
    [NavigationActionKind.PAYROLLRECEIPTS]: [
      { icon: <BsBoxArrowInDownLeft color="#73ba69" />, label: 'Importar xlsx' },
      { icon: <RiDeleteBin6Line color="#de4645" />, label: 'Eliminar recibo' }
    ],
    [NavigationActionKind.EMPLOYEES]: [
      { icon: <BsBoxArrowInDownLeft color="#73ba69" />, label: 'Importar xlsx' }
    ],
    [NavigationActionKind.JOBPOSITIONS]: [],
    [NavigationActionKind.DEPARTMENTS]: [],
    [NavigationActionKind.COMMERCIALAREAS]: [],
    [NavigationActionKind.PERCEPTIONS]: [],
    [NavigationActionKind.DEDUCTIONS]: [],
    [NavigationActionKind.PROJECTCATALOG]: [
      { icon: <TbCalendarTime color="#333" />, label: 'Registro de Actividad' }
    ],
    [NavigationActionKind.COMPANIES]: [],
    [NavigationActionKind.UPDATEDATA]: [],
    [NavigationActionKind.ERROR]: []
  }
} as const

export const MENU_ICONS: IconDefinition[] = [
  { icon: <BiBuildings color='#dd7e7b' />, label: 'Empresas' }, 
  { icon: <BiSolidCheckShield color='#73ba69' />, label: 'Mi Cuenta' }, 
  { icon: <FiSettings />, label: 'Configuración Avanzada' },
  { icon: <FiUsers color='#0747A6' />, label: 'Usuarios' }, 
  { icon: <FaComments color='#b123ae' />, label: 'Soporte' }, 
  { icon: <BiLogOut color='#d95a54' />, label: 'Cerrar Sesión' }
] as const

export const PRINT_ICONS: IconDefinition[] = [
  { icon: <TfiClose />, label: 'Cerrar' },
  { icon: <BsArrowClockwise />, label: 'Recargar' },
  { icon: <PiPrinter />, label: 'Imprimir' },
  { icon: <MdOutlineEmail />, label: 'Enviar' },
  { icon: <BsFiletypePdf />, label: 'Exportar a pdf' },
  { icon: <BsFiletypeXls />, label: 'Exportar a Excel' },
]