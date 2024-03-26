import { useState } from 'react'
import { DropMenu } from '../dropmenu/DropMenu'
import { DropMenuDates } from '../dropMenuDates/DropMenuDates'
import { IoIosArrowDown } from "react-icons/io"
import './Filter.css'

interface MenuState {
  date: boolean,
  text: boolean
}

const menuOp = [
  { label: 'Ordinario' }, 
  { label: 'Extraordinario' }
]

const filters: string[] = [
  '2024 - Periodo 8',
  'Sáb 17-Feb-2024 a Vie 23-Feb-2024',
  'Ordinario'
]

export const Filter = (): JSX.Element => {
  const [showDropMenu, setShowDropMenu] = useState<MenuState>({ date: false, text: false })

  const handleDropMenu = (index: number): void => {
    if(index === 0) {
      setShowDropMenu((prevState) => ({
        ...prevState,
        date: !prevState.date
      }))
    } else if(index === 2) {
      setShowDropMenu((prevState) => ({
        ...prevState,
        text: !prevState.text
      }))
    }
  }

  return (
    <section className='filters'>
      <div className='container'>
        {
          filters.map((filter: string, index: number) => (
            <div className='filter' key={ filter } onClick={() => handleDropMenu(index)}>
              <p>{ filter }</p>
              { index % 2 === 0 && <IoIosArrowDown /> }
              { index === 0 && showDropMenu.date && <DropMenuDates /> }
              { index === 2 && showDropMenu.text && <DropMenu menuOp={menuOp} dir={'left'} width={175} /> }
            </div>
          ))
        }
      </div>
    </section>
  )
}