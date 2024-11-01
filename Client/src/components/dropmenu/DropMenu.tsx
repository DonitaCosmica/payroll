import React, { useMemo } from 'react'
import { type IconDefinition } from "../../types"
import './DropMenu.css'

interface Props {
  menuOp: IconDefinition[],
  dir: 'left' | 'right',
  width: number,
  setSelectedLabel?: React.Dispatch<React.SetStateAction<string>>
}

export const DropMenu: React.FC<Props> = React.memo(({ menuOp, dir, width, setSelectedLabel }): JSX.Element => {
  const directionStyle = useMemo(() => ({
    [dir]: 0,
    minWidth: `${width}%`
  }), [dir, width])

  const firstItemIconKey = useMemo(() => 
    Object.keys(menuOp[0])[0] === 'icon', 
  [menuOp])

  return (
    <div
      className='drop-menu'
      style={ directionStyle }
    >
      <ul>
        {menuOp.map((op: IconDefinition) => (
          <li key={ op.label } onClick={ () => {
            if (setSelectedLabel) setSelectedLabel(op.label)
            if(op.onClick) op.onClick()
          }}>
            { firstItemIconKey && op.icon }
            { op.label }
          </li>
        ))}
      </ul>
    </div>
  )
})