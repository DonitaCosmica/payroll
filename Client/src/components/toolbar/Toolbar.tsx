import { useContext, useState } from "react"
import { type IconDefinition } from "../../types"
import { NavigationContext } from "../../context/Navigation"
import { BsThreeDotsVertical, BsBoxArrowInDownLeft, BsDownload } from "react-icons/bs"
import { AiFillHome, AiOutlineSearch, AiOutlinePrinter } from "react-icons/ai"
import { BiEditAlt, BiSolidCalculator } from "react-icons/bi"
import { TbReportSearch, TbCalendarTime } from "react-icons/tb"
import { GrAdd } from "react-icons/gr"
import { RiDeleteBin6Line } from "react-icons/ri"
import { DropMenu } from "../dropmenu/DropMenu"
import './Toolbar.css'

const options: IconDefinition[] = [
  { icon: <GrAdd fontSize='1.2rem' color="#73ba69" />, label: 'Nuevo' },
  { icon: <BiEditAlt fontSize='1.2rem' color="#e5ac3b" />, label: 'Editar' },
  { icon: <AiOutlinePrinter fontSize='1.2rem' color="#2c8efa" />, label: 'Imprimir' },
  { icon: <BsDownload fontSize='1.2rem' color="#70b2fb" />, label: 'Descargar' },
  { icon: <BiSolidCalculator fontSize='1.2rem' color="#dd7e7b" />, label: 'Tabla de trabajo' },
  { icon: <TbReportSearch fontSize='1.2rem' color="#ffb380" />, label: 'Reportes' }
]

export const Toolbar = (): JSX.Element => {
  const { option } = useContext(NavigationContext)
  const [showDropMenu, setShowDropMenu] = useState<boolean>(false)
  const showMoreOptions = option === 1 || option === 2 || option === 8

  const menuOp = (): IconDefinition[] => {
    switch(option)
    {
      case 1:
        return [
          { icon: <BsBoxArrowInDownLeft color="#73ba69" />, label: 'Importar xlsx' },
          { icon: <RiDeleteBin6Line color="#de4645" />, label: 'Eliminar recibo' },
        ]
      case 2:
        return [
          { icon: <BsBoxArrowInDownLeft color="#73ba69" />, label: 'Importar xlsx' },
        ]
      case 8:
        return [
          { icon: <TbCalendarTime color="#333" />, label: 'Registro de Actividad' }
        ]
      default:
        return []
    }
  }

  return (
    <section className='toolbar' style={{ margin: `${option === 1 ? '5px 0' : '0 0 5px 0'}` }}>
      <div className="container">
        <div className='home'>
          <AiFillHome fontSize='1.25rem' color="#333" />
        </div>
        <div className='main-options'>
          {
            options.slice(0, 3).map((option: IconDefinition) => (
              <div className="option" key={ option.label }>
                { option.icon }
                <p>{ option.label }</p>
              </div>
            ))
          }
        </div>
        <div className='other-options'>
          {
            options.slice(3).map((option: IconDefinition) => (
              <div className="option" key={ option.label }>
                { option.icon }
                <p>{ option.label }</p>
              </div>
            ))
          }
        </div>
      </div>
      <div className='search'>
        <input type="text" placeholder="Busqueda..."></input>
        <AiOutlineSearch />
      </div>
      {
        showMoreOptions && (
          <div className="more-options">
            <BsThreeDotsVertical onClick={() => setShowDropMenu(!showDropMenu)} />
            { showDropMenu && <DropMenu menuOp={ menuOp() } dir={ 'right' } width={ 35 } /> }
          </div>
        )
      }
    </section>
  )
}