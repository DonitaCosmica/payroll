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
    { icon: <GrAdd fontSize='1.2rem' color="#73ba69" />, label: 'Nuevo' },
    { icon: <BiEditAlt fontSize='1.2rem' color="#e5ac3b" />, label: 'Editar' },
    { icon: <RiDeleteBin6Line fontSize='1.2rem' color="#de4645" />, label: 'Eliminar' }
  ],
  special: {
    [NavigationActionKind.PAYROLLRECEIPTS]: [
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
      { icon: <TbReportSearch fontSize='1.2rem' color="#ffb380" />, label: 'Reportes' }
    ],
    [NavigationActionKind.COMPANIES]: [],
    [NavigationActionKind.BANKS]: [],
    [NavigationActionKind.TABLEWORK]: [
      { icon: <IoReload color="#333" />, label: 'Actualizar' },
      { icon: <LuClipboardList color="#70b2fb" />, label: 'Reportes' },
      { icon: <LuClipboardList color="#70b2fb" />, label: 'Layout Bancos' }
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
  { icon: <FiSettings />, label: 'Configuración Avanzada' },
  { icon: <FiUsers color='#0747A6' />, label: 'Usuarios' }, 
  { icon: <BiLogOut color='#d95a54' />, label: 'Cerrar Sesión' }
] as const

export const PRINT_ICONS: IconDefinition[] = [
  { icon: <TfiClose color="#fff" fontSize='1.3rem' />, label: 'Cerrar' },
  { icon: <BsArrowClockwise color="#fff" fontSize='1.3rem' />, label: 'Recargar' },
  { icon: <PiPrinter color="#fff" fontSize='1.3rem' />, label: 'Imprimir' },
  { icon: <MdOutlineEmail color="#fff" fontSize='1.3rem' />, label: 'Enviar' },
  { icon: <BsFiletypePdf color="#fff" fontSize='1.3rem' />, label: 'Exportar a pdf' },
  { icon: <BsFiletypeXls color="#fff" fontSize='1.3rem' />, label: 'Exportar a Excel' },
]