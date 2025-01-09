import React, { Suspense, useEffect, useState } from 'react'
import { type IconDefinition } from '../../types'
import { MENU_ICONS, PRINT_ICONS } from '../../utils/icons'
import { IoIosArrowDown } from "react-icons/io"
import './Titlebar.css'

interface Props {
  action: 'print' | 'payroll'
}

const DropMenu = React.lazy(() => import('../dropmenu/DropMenu').then(module => ({ default: module.DropMenu }))) 

export const Titlebar: React.FC<Props> = ({ action }): JSX.Element => {
  const [showDropMenu, setShowDropMenu] = useState<Boolean>(false)
  const [userName, setUserName] = useState<string>('')

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user') ?? '')
    if ('name' in user) setUserName(user.name)
  }, [])

  const logout = async () => {
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
              <Suspense fallback={ <div>Loading menu...</div> }>
                <DropMenu 
                  menuOp={MENU_ICONS.map(op => ({
                    ...op,
                    onClick: async (id) => {
                      if (id === 'logout')
                        logout()
                    }
                  }))}
                  dir={ 'right' }
                  context='user'
                />
              </Suspense>
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