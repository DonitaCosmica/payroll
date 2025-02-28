import React, { JSX, useEffect, useState } from 'react'
import { MENU_ICONS, PRINT_ICONS } from '../../utils/icons'
import { Each } from '../../utils/Each'
import { DropMenu } from '../dropmenu/DropMenu'
import { IoIosArrowDown } from "react-icons/io"
import './Titlebar.css'

interface Props {
  action: 'print' | 'payroll'
}

interface IUser {
  name: string,
  role: string
}

export const Titlebar: React.FC<Props> = ({ action }): JSX.Element => {
  const [showDropMenu, setShowDropMenu] = useState<Boolean>(false)
  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        const user: IUser = JSON.parse(storedUser)
        setUserName(user.name)
      } catch (error) {
        console.error('Error parsing user from localStorage: ', error)
        setUserName('Unknown')
      }
    } else
      setUserName('Unknown')
  }, [])

  const logout = async (): Promise<void> => {
    try {
      const res: Response = await fetch('http://localhost:1234/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })

      if(res.ok) {
        document.cookie = 'accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
        window.location.href = 'http://localhost:5173/'
      }
    } catch (error) {
      console.error('Error loging out: ', error)
    }
  }

  const renderUserName = (): string => {
    const parts = userName.split(' ')
    return parts.length > 1 ? `${ parts[0] } ${ parts[1][0] }.` : parts[0]
  }

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
            <p>{ renderUserName() }</p>
            <IoIosArrowDown />
            {showDropMenu && (
              <DropMenu
                menuOp={MENU_ICONS.map(op => ({
                  ...op,
                  onClick: async (id): Promise<void> => {
                    if (id === 'logout') logout()
                  }
                }))}
                dir='right'
                context='user'
              />
            )}
          </div>
        </div>
      </>) : (
      <div className='print-icons-section'>
        <Each of={ PRINT_ICONS } render={(item, index) => (
          <div key={ `${ item.label }-${ index }` } className='print-icon-container'>
            { item.icon }
            <span>{ item.label }</span>
          </div>
        )} />
      </div>)}
    </header>
  )
}