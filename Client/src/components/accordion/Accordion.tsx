import { useState } from 'react'
import './Accordion.css'

interface Props {
  year: string
}

export const Accordion: React.FC<Props> = ({ year }) => {
  const [isCollapsed, setIsCollapsed] = useState(true)

  const handleCollapsed = (event: React.MouseEvent<HTMLLIElement>): void => {
    event.stopPropagation();
    setIsCollapsed(!isCollapsed)
  }

  return (
    <div className='container'>
      <li className='year-filter' onClick={ handleCollapsed }>
        <strong>{ year }</strong>
      </li>
      <ul className={`accordion ${ isCollapsed ? 'collapsed' : 'expanded' }`}>
        <li>a</li>
      </ul>
    </div>
  )
}