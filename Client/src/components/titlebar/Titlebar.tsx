import { useState } from 'react'
import { MENU_ICONS } from '../../utils/icons'
import { IoIosArrowDown } from "react-icons/io"
import { DropMenu } from '../dropmenu/DropMenu'
import './Titlebar.css'

export const Titlebar = (): JSX.Element => {
  const [showDropMenu, setShowDropMenu] = useState<Boolean>(false)

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
              <DropMenu menuOp={ MENU_ICONS } dir={ 'right' } width={ 250 } />
            )
          }
        </div>
      </div>
    </header>
  )
}