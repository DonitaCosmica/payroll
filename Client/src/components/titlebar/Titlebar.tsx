import React, { useState } from 'react'
import { MENU_ICONS } from '../../utils/icons'
import { IoIosArrowDown } from "react-icons/io"
import { DropMenu } from '../dropmenu/DropMenu'
import './Titlebar.css'

interface Props {
  action: 'print' | 'payroll'
}

export const Titlebar: React.FC<Props> = ({ action }): JSX.Element => {
  const [showDropMenu, setShowDropMenu] = useState<Boolean>(false)

  return (
    <header id='table-options' className="titlebar" style={{ justifyContent: action === 'payroll' ? 'center' : 'flex-start' }}>
      {action === 'payroll' ?
      (<>
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
                <DropMenu menuOp={ MENU_ICONS } dir={ 'right' } width={ 250 } />
              )
            }
          </div>
        </div>
      </>) : (<h1>Hola</h1>)}
    </header>
  )
}