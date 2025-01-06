import React, { useEffect, useState } from 'react'
import { type IconDefinition } from '../../types'
import { MENU_ICONS, PRINT_ICONS } from '../../utils/icons'
import { IoIosArrowDown } from "react-icons/io"
import { DropMenu } from '../dropmenu/DropMenu'
import './Titlebar.css'

interface Props {
  action: 'print' | 'payroll'
}

export const Titlebar: React.FC<Props> = ({ action }): JSX.Element => {
  const [showDropMenu, setShowDropMenu] = useState<Boolean>(false)
  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') ?? '')
    if ('name' in user) setUserName(user.name)
  }, [])

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
          <div className='user' onClick={ () => setShowDropMenu(!showDropMenu) }>
            <p>{ userName ? userName.split(' ')[0] + ' ' + userName.split(' ')[1][0] + '.' : 'Unknown' }</p>
            <IoIosArrowDown />
            {showDropMenu && (
              <DropMenu 
                menuOp={ MENU_ICONS.map(op => ({
                  ...op,
                  onClick: () => {}
                })) }
                dir={ 'right' }
                context='user'
              />
            )}
          </div>
        </div>
      </>) : (<div className='print-icons-section'>
          {PRINT_ICONS.map((item: IconDefinition, index: number) => (
            <div key={ `${ item.label }-${ index }` } className='print-icon-container'>
              { item.icon }
              <span>{ item.label }</span>
            </div>
          ))}
        </div>)}
    </header>
  )
}