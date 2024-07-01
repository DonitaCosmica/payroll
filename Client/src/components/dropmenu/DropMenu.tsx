import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { createRoot } from 'react-dom/client'
import { type IconDefinition } from "../../types"
import { Titlebar } from '../titlebar/Titlebar'
import './DropMenu.css'

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

    const dataToPrint = document.getElementById('data-list')
    if (dataToPrint && componentHTML) {
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

        const styles = `<style>${ styleSheets }</style>`
        newWin.document.write(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reporte</title>
            ${ styles }
          </head>
          <body style="height: 100vh">
            ${ componentHTML }
            ${ dataToPrint.outerHTML }
            <iframe name="print-frame" width="0" height="0" frameborder="0" src="about:blank"></iframe>
            <script>
              const styleSheet = document.styleSheets[0].cssRules
              const cssTextArr = []
              for (const style of styleSheet) {
                if (style.cssText.startsWith(".titlebar"))
                  cssTextArr.push(style.cssText)
              }

              const closeWindow = () => {
                console.log("Closing Window")
              }

              const reloadTable = () => {
                console.log("Reloading Table")
              }

              const printTable = () => {
                window.frames["print-frame"].document.body.innerHTML = document.getElementById("data-list").innerHTML
                window.frames["print-frame"].window.focus()
                window.frames["print-frame"].window.print()
              }

              const sendEmail = () => {
                console.log("Sending Email")
              }

              const importPDF = () => {
                console.log("Importing Table to PDF")
              }

              const importExcel = () => {
                console.log("Importing Table to Excel")
              }

              const actions = [ closeWindow, reloadTable, printTable, sendEmail, importPDF, importExcel ]
              const printIcons = document.getElementsByClassName("print-icon-container")
              const actionIterator = actions[Symbol.iterator]()

              for (const container of printIcons) {
                const action = actionIterator.next().value
                if (action)
                  container.addEventListener("click", action)
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