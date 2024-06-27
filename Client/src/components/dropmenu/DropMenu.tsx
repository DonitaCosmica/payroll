import React from 'react'
import { type IconDefinition } from "../../types"
import './DropMenu.css'

interface Props {
  menuOp: IconDefinition[],
  dir: 'left' | 'right',
  width: number
}

export const DropMenu: React.FC<Props> = ({ menuOp, dir, width }): JSX.Element => {
  const directionStyle = dir === 'left' ? { left: 0, minWidth: `${width}%` } : { right: 0, minWidth: `${width}%` }

  const printData = (): void => {
    const dataToPrint = document.getElementById('data-list')
    if (dataToPrint) {
      const newWin = window.open('')
      if (newWin) {
        const styleSheets = Array.from(document.styleSheets).map((styleSheet: CSSStyleSheet) => {
          try {
            return Array.from(styleSheet.cssRules)
              .map(rule => rule.cssText)
              .join(' ')
          } catch (error) {
            console.warn('You cannot access the CSS rules of a style sheet.')
            return ''
          }
        })

        const styles = `<style>${styleSheets[13] + styleSheets[8]}</style>`
        newWin?.document.write(styles + dataToPrint?.outerHTML)
        newWin?.print()
        newWin?.close()
      } else
        console.error('Could not open a new window')
    } else
      console.error('The element with id "data-list" was not found')
  }

  return (
    <div className='drop-menu' style={ directionStyle } onClick={ printData }>
      <ul>
        {menuOp.map((op: IconDefinition) => (
          <li key={ op.label }>
            { Object.keys(menuOp[0])[0] === 'icon' && ( op.icon ) }
            { op.label }
          </li>
        ))}
      </ul>
    </div>
  )
}