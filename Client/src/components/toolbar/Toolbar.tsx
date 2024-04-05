import { useContext, useState } from "react"
import { type IconsToolbar, type IconDefinition } from "../../types"
import { NavigationContext } from "../../context/Navigation"
import { AiFillHome, AiOutlineSearch, AiOutlinePrinter, AiFillFlag, AiOutlineStop } from "react-icons/ai"
import { BsThreeDotsVertical, BsBoxArrowInDownLeft, BsDownload } from "react-icons/bs"
import { BiEditAlt, BiSolidCalculator } from "react-icons/bi"
import { TbReportSearch, TbCalendarTime } from "react-icons/tb"
import { HiOutlineKey } from "react-icons/hi2"
import { GrAdd } from "react-icons/gr"
import { RiDeleteBin6Line } from "react-icons/ri"
import { DropMenu } from "../dropmenu/DropMenu"
import './Toolbar.css'

export const Toolbar = (): JSX.Element => {
  const { option } = useContext(NavigationContext)
  const [showDropMenu, setShowDropMenu] = useState<boolean>(false)
  const showMoreOptions = option === 1 || option === 2 || option === 8

  const icons = (): IconsToolbar => {
    switch(option)
    {
      case 1:
        return {
          options: [
              { icon: <GrAdd fontSize='1.2rem' color="#73ba69" />, label: 'Nuevo' },
              { icon: <BiEditAlt fontSize='1.2rem' color="#e5ac3b" />, label: 'Editar' },
              { icon: <AiOutlinePrinter fontSize='1.2rem' color="#2c8efa" />, label: 'Imprimir' },
              { icon: <BsDownload fontSize='1.2rem' color="#70b2fb" />, label: 'Descargar' },
              { icon: <BiSolidCalculator fontSize='1.2rem' color="#dd7e7b" />, label: 'Tabla de trabajo' },
              { icon: <TbReportSearch fontSize='1.2rem' color="#ffb380" />, label: 'Reportes' }
            ],
          menuOp: [
            { icon: <BsBoxArrowInDownLeft color="#73ba69" />, label: 'Importar xlsx' },
            { icon: <RiDeleteBin6Line color="#de4645" />, label: 'Eliminar recibo' },
          ],
          end: 3
        }
      case 2:
        return {
          options: [
              { icon: <GrAdd fontSize='1.2rem' color="#73ba69" />, label: 'Nuevo' },
              { icon: <BiEditAlt fontSize='1.2rem' color="#e5ac3b" />, label: 'Editar' },
              { icon: <RiDeleteBin6Line fontSize='1.2rem' color="#de4645" />, label: 'Imprimir' },
              { icon: <AiFillFlag fontSize='1.2rem' color="#70b2fb" />, label: 'Descargar' },
              { icon: <TbCalendarTime fontSize='1.2rem' color="#333" />, label: 'Tabla de trabajo' },
              { icon: <TbReportSearch fontSize='1.2rem' color="#ffb380" />, label: 'Reportes' }
            ],
          menuOp: [
            { icon: <BsBoxArrowInDownLeft color="#73ba69" />, label: 'Importar xlsx' }
          ],
          end: 5
        }
      case 3:
        return {
          options: [
            { icon: <GrAdd fontSize='1.2rem' color="#73ba69" />, label: 'Nuevo' },
            { icon: <BiEditAlt fontSize='1.2rem' color="#e5ac3b" />, label: 'Editar' },
            { icon: <RiDeleteBin6Line fontSize='1.2rem' color="#de4645" />, label: 'Imprimir' },
            { icon: <TbReportSearch fontSize='1.2rem' color="#ffb380" />, label: 'Reportes' }
          ]
        }
      case 4:
      case 5:
      case 9:
        return {
          options: [
            { icon: <GrAdd fontSize='1.2rem' color="#73ba69" />, label: 'Nuevo' },
            { icon: <BiEditAlt fontSize='1.2rem' color="#e5ac3b" />, label: 'Editar' },
            { icon: <RiDeleteBin6Line fontSize='1.2rem' color="#de4645" />, label: 'Imprimir' }
          ]
        }
      case 6:
      case 7:
        return {
          options: [
            { icon: <GrAdd fontSize='1.2rem' color="#73ba69" />, label: 'Nuevo' },
            { icon: <BiEditAlt fontSize='1.2rem' color="#e5ac3b" />, label: 'Editar' },
            { icon: <AiOutlineStop fontSize='1.2rem' color="#d92928" />, label: 'Ocultar' },
            { icon: <RiDeleteBin6Line fontSize='1.2rem' color="#de4645" />, label: 'Imprimir' }
          ]
        }
      case 8:
        return {
          options: [
            { icon: <GrAdd fontSize='1.2rem' color="#73ba69" />, label: 'Nuevo' },
            { icon: <BiEditAlt fontSize='1.2rem' color="#e5ac3b" />, label: 'Editar' },
            { icon: <RiDeleteBin6Line fontSize='1.2rem' color="#de4645" />, label: 'Imprimir' },
            { icon: <HiOutlineKey fontSize='1.2rem' color="#585858" />, label: 'Permisos' },
            { icon: <TbReportSearch fontSize='1.2rem' color="#ffb380" />, label: 'Reportes' }
          ],
          menuOp: [
            { icon: <TbCalendarTime color="#333" />, label: 'Registro de Actividad' }
          ],
          end: 4
        }
      default: return { options: [], menuOp: [], end: 0 }
    }
  }

  return (
    <section className='toolbar' style={{ margin: `${option === 1 ? '5px 0' : '0 0 5px 0'}` }}>
      <div 
        className="container" 
        style={{ 
          gridTemplateColumns: `${showMoreOptions ? '10% auto auto': '15% auto'}`,
          width: `${showMoreOptions ? '45%': '30%'}`
        }}
      >
        <div className='home'>
          <AiFillHome fontSize='1.25rem' color="#333" />
        </div>
        <div className='main-options'>
          {
            showMoreOptions ? (
              icons().options.slice(0, icons().end).map((option: IconDefinition) => (
                <div className="option" key={ option.label }>
                  { option.icon }
                  <p>{ option.label }</p>
                </div>
              ))
            ) : (
              icons().options.map((option: IconDefinition) => (
                <div className="option" key={ option.label }>
                  { option.icon }
                  <p>{ option.label }</p>
                </div>
              ))
            )
          }
        </div>
        {
          showMoreOptions && (
            <div className='other-options'>
              {
                icons().options.slice(icons().end).map((option: IconDefinition) => (
                  <div className="option" key={ option.label }>
                    { option.icon }
                    <p>{ option.label }</p>
                  </div>
                ))
              }
            </div>
          )
        }
      </div>
      <div className='search'>
        <input type="text" placeholder="Busqueda..."></input>
        <AiOutlineSearch />
      </div>
      {
        showMoreOptions && (
          <div className="more-options">
            <BsThreeDotsVertical onClick={() => setShowDropMenu(!showDropMenu)} />
            { showDropMenu && <DropMenu menuOp={ icons().menuOp ?? [] } dir={ 'right' } width={ 35 } /> }
          </div>
        )
      }
    </section>
  )
}