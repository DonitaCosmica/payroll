import { useState } from "react"
import { AiFillHome } from "react-icons/ai"
import { GrAdd } from "react-icons/gr"
import { BiEditAlt } from "react-icons/bi"
import { AiOutlinePrinter } from "react-icons/ai"
import { BsDownload } from "react-icons/bs"
import { BiSolidCalculator } from "react-icons/bi"
import { TbReportSearch } from "react-icons/tb"
import { AiOutlineSearch } from "react-icons/ai"
import { BsThreeDotsVertical } from "react-icons/bs"
import { BsBoxArrowInDownLeft } from "react-icons/bs"
import { RiDeleteBin6Line } from "react-icons/ri"
import { DropMenu } from "../dropmenu/DropMenu"
import './Toolbar.css'

interface IconDefinition {
  icon: JSX.Element,
  label: string
}

const options: IconDefinition[] = [
  { icon: <GrAdd fontSize='1.2rem' color="#73ba69" />, label: 'Nuevo' },
  { icon: <BiEditAlt fontSize='1.2rem' color="#e5ac3b" />, label: 'Editar' },
  { icon: <AiOutlinePrinter fontSize='1.2rem' color="#2c8efa" />, label: 'Imprimir' },
  { icon: <BsDownload fontSize='1.2rem' color="#70b2fb" />, label: 'Descargar' },
  { icon: <BiSolidCalculator fontSize='1.2rem' color="#dd7e7b" />, label: 'Tabla de trabajo' },
  { icon: <TbReportSearch fontSize='1.2rem' color="#ffb380" />, label: 'Reportes' }
]

const menuOp: IconDefinition[] = [
  { icon: <BsBoxArrowInDownLeft color="#73ba69" />, label: 'Importar xlsx' },
  { icon: <RiDeleteBin6Line color="#de4645" />, label: 'Eliminar recibo' }
]

export const Toolbar = (): JSX.Element => {
  const [showDropMenu, setShowDropMenu] = useState<boolean>(false)

  return (
    <section className='toolbar'>
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
      <div className="more-options">
        <BsThreeDotsVertical onClick={() => setShowDropMenu(!showDropMenu)} />
        { showDropMenu && <DropMenu menuOp={ menuOp } dir={ 'right' } width={ 35 } /> }
      </div>
    </section>
  )
}