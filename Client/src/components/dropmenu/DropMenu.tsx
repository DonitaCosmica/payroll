import React from 'react'
import './DropMenu.css'

interface IconDefinition {
  icon?: JSX.Element,
  label: string
}

interface Props {
  menuOp: IconDefinition[],
  dir: 'left' | 'right',
  width: number
}

export const DropMenu: React.FC<Props> = ({ menuOp, dir, width }) => {
  const directionStyle = dir === 'left' ? { left: 0, minWidth: `${width}%` } : { right: 0, minWidth: `${width}%` }

  return (
    <div className='drop-menu' style={ directionStyle }>
      <ul>
        {
          menuOp.map((op: IconDefinition) => (
            <li key={ op.label }>
              { Object.keys(menuOp[0])[0] === 'icon' && ( op.icon ) }
              { op.label }
            </li>
          ))
        }
      </ul>
    </div>
  )
}