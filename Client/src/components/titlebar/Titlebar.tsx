import { useState } from 'react'
import { type IconDefinition } from "../../types"
import { BiBuildings, BiSolidCheckShield, BiLogOut } from "react-icons/bi"
import { IoIosArrowDown } from "react-icons/io"
import { FiSettings, FiUsers } from "react-icons/fi"
import { FaComments } from "react-icons/fa6"
import { DropMenu } from '../dropmenu/DropMenu'
import './Titlebar.css'

const menuOp: IconDefinition[] = [
  { icon: <BiBuildings color='#dd7e7b' />, label: 'Empresas' }, 
  { icon: <BiSolidCheckShield color='#73ba69' />, label: 'Mi Cuenta' }, 
  { icon: <FiSettings />, label: 'Configuración Avanzada' },
  { icon: <FiUsers color='#0747A6' />, label: 'Usuarios' }, 
  { icon: <FaComments color='#b123ae' />, label: 'Soporte' }, 
  { icon: <BiLogOut color='#d95a54' />, label: 'Cerrar Sesión' }
]

export const Titlebar = (): JSX.Element => {
  const [showDropMenu, setShowDropMenu] = useState(false)

  return (
    <header className="titlebar">
      <div className='titlebar-logo'>
        <img className='logo'></img>
        <div className='title'>
          <h2>NOMINA RAYO</h2>
        </div>
      </div>
      <div className="titlebar-user">
        <div className='user' onClick={() => setShowDropMenu(!showDropMenu)}>
          <p>Jose Solis</p>
          <IoIosArrowDown />
          {
            showDropMenu && (
              <DropMenu menuOp={ menuOp } dir={ 'right' } width={ 250 } />
            )
          }
        </div>
      </div>
    </header>
  )
}