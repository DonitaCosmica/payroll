import ReactDOMServer from 'react-dom/server'
import React, { useMemo } from 'react'
import { type IconDefinition } from "../../types"
import { FilterReport } from '../filterReport/FilterReport'
import { NavigationActionKind, useNavigationContext } from '../../context/Navigation'
import { REPORTING_ACTIONS } from '../../consts'
import './DropMenu.css'

interface Props {
  menuOp: IconDefinition[],
  dir: 'left' | 'right',
  width: number,
  setSelectedLabel?: React.Dispatch<React.SetStateAction<string>>
  setHasForm?: React.Dispatch<React.SetStateAction<boolean>>
}

export const DropMenu: React.FC<Props> = React.memo(({ menuOp, dir, width, setSelectedLabel, setHasForm }): JSX.Element => {
  const { option } = useNavigationContext()
  
  const directionStyle = useMemo(() => ({
    [dir]: 0,
    minWidth: `${ width }%`
  }), [ dir, width ])

  const firstItemIconKey = useMemo(() => 
    Object.keys(menuOp[0])[0] === 'icon', 
  [ menuOp ])

  const handleLabel = (op: IconDefinition): void => {
    if (setSelectedLabel && setHasForm) {
      setSelectedLabel(ReactDOMServer.renderToStaticMarkup(
        <FilterReport fields={ op.label }/>))
      setHasForm(REPORTING_ACTIONS[option ?? NavigationActionKind.ERROR]
        .find(rep => rep.label === op.label)?.hasForm ?? false)
    }
    if(op.onClick) op.onClick()
  }

  return (
    <div className='drop-menu' style={ directionStyle }>
      <ul>
        {menuOp.map((op: IconDefinition) => (
          <li key={ op.label } onClick={ () => handleLabel(op)}>
            { firstItemIconKey && op.icon }
            { op.label }
          </li>
        ))}
      </ul>
    </div>
  )
})