import { type IconDefinition } from "../types"
import { NavigationActionKind } from "../context/Navigation"
import { AiFillFlag, AiOutlineStop } from "react-icons/ai"
import { BsBoxArrowInDownLeft, BsArrowClockwise, BsFiletypePdf , BsFiletypeXls  } from "react-icons/bs"
import { BiEditAlt, BiSolidCalculator, BiLogOut } from "react-icons/bi"
import { TbReportSearch, TbCalendarTime } from "react-icons/tb"
import { GrAdd } from "react-icons/gr"
import { RiDeleteBin6Line } from "react-icons/ri"
import { FiSettings, FiUsers } from "react-icons/fi"
import { MdOutlineEmail } from "react-icons/md"
import { PiPrinter } from "react-icons/pi"
import { TfiClose } from "react-icons/tfi"
import { IoReload } from "react-icons/io5"
import { LuClipboardList } from "react-icons/lu"

export const ICON_OPTIONS: {
  common: IconDefinition[]
  special: Record<NavigationActionKind, IconDefinition[]>
  menu: Record<NavigationActionKind, IconDefinition[]>
} = {
  common: [
    { id: 'basic-new', icon: <GrAdd fontSize='1.2rem' color="#73ba69" />, label: 'Nuevo' },
    { id: 'basic-edit', icon: <BiEditAlt fontSize='1.2rem' color="#e5ac3b" />, label: 'Editar' },
    { id: 'basic-delete', icon: <RiDeleteBin6Line fontSize='1.2rem' color="#de4645" />, label: 'Eliminar' }
  ],
  special: {
    [NavigationActionKind.PAYROLLRECEIPTS]: [
      { id: 'table', icon: <BiSolidCalculator fontSize='1.2rem' color="#dd7e7b" />, label: 'Tabla de trabajo' },
      { id: 'report', icon: <TbReportSearch fontSize='1.2rem' color="#ffb380" />, label: 'Reportes' }
    ],
    [NavigationActionKind.EMPLOYEES]: [
      { id: 'status', icon: <AiFillFlag fontSize='1.2rem' color="#70b2fb" />, label: 'Status' },
      { id: 'history', icon: <TbCalendarTime fontSize='1.2rem' color="#333" />, label: 'Historial' },
      { id: 'report', icon: <TbReportSearch fontSize='1.2rem' color="#ffb380" />, label: 'Reportes' }
    ],
    [NavigationActionKind.JOBPOSITIONS]: [
      { id: '', icon: <TbReportSearch fontSize='1.2rem' color="#ffb380" />, label: 'Prenomina' }
    ],
    [NavigationActionKind.DEPARTMENTS]: [],
    [NavigationActionKind.COMMERCIALAREAS]: [],
    [NavigationActionKind.PERCEPTIONS]: [
      { id: 'hide', icon: <AiOutlineStop fontSize='1.2rem' color="#d92928" />, label: 'Ocultar' }
    ],
    [NavigationActionKind.DEDUCTIONS]: [
      { id: 'hide', icon: <AiOutlineStop fontSize='1.2rem' color="#d92928" />, label: 'Ocultar' }
    ],
    [NavigationActionKind.PROJECTCATALOG]: [
      { id: 'report', icon: <TbReportSearch fontSize='1.2rem' color="#ffb380" />, label: 'Reportes' }
    ],
    [NavigationActionKind.COMPANIES]: [],
    [NavigationActionKind.BANKS]: [],
    [NavigationActionKind.TABLEWORK]: [
      { id: 'update', icon: <IoReload color="#333" />, label: 'Actualizar' },
      { id: 'report', icon: <LuClipboardList color="#70b2fb" />, label: 'Reportes' },
      { id: 'update', icon: <LuClipboardList color="#70b2fb" />, label: 'Layout Bancos' }
    ],
    [NavigationActionKind.UPDATEDATA]: [],
    [NavigationActionKind.UPDATETABLE]: [],
    [NavigationActionKind.UPDATEPAYROLL]: [],
    [NavigationActionKind.UPDATESELECTEDID]: [],
    [NavigationActionKind.UPDATETOOLBAROPT]: [],
    [NavigationActionKind.ERROR]: []
  },
  menu: {
    [NavigationActionKind.PAYROLLRECEIPTS]: [
      { id: 'import', icon: <BsBoxArrowInDownLeft color="#73ba69" />, label: 'Importar xlsx' },
      { id: 'delete', icon: <RiDeleteBin6Line color="#de4645" />, label: 'Eliminar recibo' }
    ],
    [NavigationActionKind.EMPLOYEES]: [
      { id: 'import', icon: <BsBoxArrowInDownLeft color="#73ba69" />, label: 'Importar xlsx' }
    ],
    [NavigationActionKind.JOBPOSITIONS]: [],
    [NavigationActionKind.DEPARTMENTS]: [],
    [NavigationActionKind.COMMERCIALAREAS]: [],
    [NavigationActionKind.PERCEPTIONS]: [],
    [NavigationActionKind.DEDUCTIONS]: [],
    [NavigationActionKind.PROJECTCATALOG]: [
      { id: 'register', icon: <TbCalendarTime color="#333" />, label: 'Registro de Actividad' }
    ],
    [NavigationActionKind.COMPANIES]: [],
    [NavigationActionKind.BANKS]: [],
    [NavigationActionKind.TABLEWORK]: [],
    [NavigationActionKind.UPDATEDATA]: [],
    [NavigationActionKind.UPDATETABLE]: [],
    [NavigationActionKind.UPDATEPAYROLL]: [],
    [NavigationActionKind.UPDATESELECTEDID]: [],
    [NavigationActionKind.UPDATETOOLBAROPT]: [],
    [NavigationActionKind.ERROR]: []
  }
} as const

export const MENU_ICONS: IconDefinition[] = [
  { id: 'settings', icon: <FiSettings />, label: 'Configuración Avanzada' },
  { id: 'users', icon: <FiUsers color='#0747A6' />, label: 'Usuarios' }, 
  { id: 'logout', icon: <BiLogOut color='#d95a54' />, label: 'Cerrar Sesión' }
] as const

export const PRINT_ICONS: IconDefinition[] = [
  { id: 'close', icon: <TfiClose color="#fff" fontSize='1.3rem' />, label: 'Cerrar' },
  { id: 'load', icon: <BsArrowClockwise color="#fff" fontSize='1.3rem' />, label: 'Recargar' },
  { id: 'print', icon: <PiPrinter color="#fff" fontSize='1.3rem' />, label: 'Imprimir' },
  { id: 'send', icon: <MdOutlineEmail color="#fff" fontSize='1.3rem' />, label: 'Enviar' },
  { id: 'export', icon: <BsFiletypePdf color="#fff" fontSize='1.3rem' />, label: 'Exportar a pdf' },
  { id: 'export', icon: <BsFiletypeXls color="#fff" fontSize='1.3rem' />, label: 'Exportar a Excel' },
] as const