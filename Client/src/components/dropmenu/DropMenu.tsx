import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { type IconDefinition } from "../../types"
import { Titlebar } from '../titlebar/Titlebar'
import './DropMenu.css'
import { createRoot } from 'react-dom/client'

interface Props {
  menuOp: IconDefinition[],
  dir: 'left' | 'right',
  width: number
}

export const DropMenu: React.FC<Props> = ({ menuOp, dir, width }): JSX.Element => {
  const directionStyle = dir === 'left' ? { left: 0, minWidth: `${width}%` } : { right: 0, minWidth: `${width}%` }

  const printData = (): void => {
    const container = document.createElement('div')
    document.body.appendChild(container)
    
    const root = createRoot(container)
    root.render(<Titlebar action='print' />)

    const componentHTML = ReactDOMServer.renderToStaticMarkup(<Titlebar action='print' />)
    document.body.removeChild(container)
    console.log(componentHTML)

    const dataToPrint = document.getElementById('data-list')
    const titlebar = document.getElementById('table-options')
    if (dataToPrint && titlebar) {
      const newWin = window.open('', '_blank')
      if (newWin) {
        const styleSheets = Array.from(document.styleSheets).map((styleSheet: CSSStyleSheet) => {
          try {
            return Array.from(styleSheet.cssRules)
              .map(rule => rule.cssText)
              .filter(cssText => (cssText.startsWith('.titlebar') || cssText.startsWith('.content') || cssText.startsWith('*')) && cssText.trim() !== '')
              .join(' ')
          } catch (error) {
            console.warn('You cannot access the CSS rules of a style sheet.')
            return ''
          }
        }).join('')

        const styles = `<style>${styleSheets}</style>`
        newWin.document.write(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Window</title>
            ${ styles }
          </head>
          <body>
            ${ titlebar.outerHTML }
            ${ dataToPrint.outerHTML }
            <script>
              window.onload = function() {
                console.log('Hola mundo');
              }
            </script>
          </body>
          </html>
          `)

          newWin.document.close()
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