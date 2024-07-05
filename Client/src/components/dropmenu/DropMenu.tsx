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

    const titlebar = ReactDOMServer.renderToStaticMarkup(<Titlebar action='print' />)
    document.body.removeChild(container)

    const dataToPrint = document.getElementById('data-list')
    if (dataToPrint && titlebar) {
      const newWin = window.open('', '_blank')
      if (newWin) {
        const styleSheets = Array.from(document.styleSheets).map((styleSheet: CSSStyleSheet) => {
          try {
            return Array.from(styleSheet.cssRules)
              .map(rule => rule.cssText)
              .filter(cssText => (cssText.startsWith('.titlebar') || cssText.startsWith('.content') || cssText.startsWith('*')) && cssText.trim() !== '')
              .join('\n')
          } catch (error) {
            console.warn('You cannot access the CSS rules of a style sheet.')
            return ''
          }
        }).join(' ')

        const styles = `<style>${ styleSheets }</style>`
        newWin.document.write(`
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Reporte</title>
            ${ styles }
            <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
          </head>
          <body style="position: relative; height: 100vh">
            ${ titlebar }
            <section id="content">
              ${ dataToPrint.outerHTML }
            </section>
            <iframe name="print-frame" id="print-frame" width="0" height="0" frameborder="0" src="about:blank"></iframe>
            <canvas id="canvas" style="display: none;"></canvas>
            <script>
              const getStylesOfAnElement = ({ prefixes }) => {
                const styleSheet = [...document.styleSheets[0].cssRules]
                return styleSheet
                  .filter(style => prefixes.some(prefix => style.cssText.startsWith(prefix)))
                  .map(style => style.cssText)
                  .join(" ")
              }
  
              const drawHTMLToCanvas = (content) => {
                const canvas = document.getElementById("canvas")
                const context = canvas.getContext("2d")
                const width = content.offsetWidth
                const height = content.offsetHeight
                const computedStyle = getComputedStyle(content)

                canvas.width = width
                canvas.height = height
                              
                context.fillStyle = computedStyle.backgroundColor
                context.fillRect(0, 0, width, height)
  
                const drawTable = (table, offsetX, offsetY) => {
                  Array.from(table.rows).reduce((accY, row) => {
                    Array.from(row.cells).reduce((accX, cell) => {
                      const cellStyle = getComputedStyle(cell)
  
                      context.fillStyle = cellStyle.backgroundColor
                      context.fillRect(accX, accY, cell.offsetWidth, cell.offsetHeight)
                      context.strokeStyle = cellStyle.borderColor
                      context.strokeRect(accX, accY, cell.offsetWidth, cell.offsetHeight)
                      context.font = cellStyle.fontSize + " " + cellStyle.fontFamily
                      context.fillStyle = cellStyle.color
                      context.textAlign = "center"
                      context.textBaseline = "middle"
  
                      const textX = accX + cell.offsetWidth / 2
                      const textY = accY + cell.offsetHeight / 2
  
                      context.fillText(cell.innerText, textX, textY)
                      return accX + cell.offsetWidth
                    }, offsetX)
  
                    return accY + row.offsetHeight
                  }, offsetY)
                }
  
                const drawElement = (element, offsetX = 0, offsetY = 0) => {
                  const elementStyle = getComputedStyle(element)
                  if (element.tagName === "TABLE") {
                    drawTable(element, offsetX, offsetY)
                    return offsetY + element.offsetHeight
                  }
                  else {
                    context.font = elementStyle.fontSize + " " + elementStyle.fontFamily
                    context.fillStyle = elementStyle.color
                    context.textAlign = "left"
                    context.textBaseline = "top"
  
                    const lineHeight = parseInt(elementStyle.lineHeight) || parseInt(elementStyle.fontSize) * 1.2
                    const lines = element.innerText.split("\n")
                    lines.map((line, index) => context.fillText(line, offsetX, offsetY + index * lineHeight))
  
                    return offsetY + lines.length * lineHeight
                  }
                }
  
                Array.from(content.children).reduce((acc, child) => drawElement(child, 0, acc), 0)
                return canvas.toDataURL("image/png")
              }
  
              const closeWindow = () => {
                console.log("Closing Window")
              }

              const reloadTable = () => {
                console.log("Reloading Table")
              }
  
              const printTable = () => {
                const cssText = getStylesOfAnElement({ prefixes: [".content", "*"] })
                const content = document.getElementById("data-list")
                const contentClone = content.cloneNode(true)
                const printFrame = window.frames["print-frame"]
                const printDocument = printFrame.document
                const styleTag = printDocument.createElement("style")
  
                styleTag.type = "text/css"
                styleTag.appendChild(printDocument.createTextNode(cssText))
  
                printDocument.head.appendChild(styleTag)
                printDocument.body.innerHTML = ""
                printDocument.body.appendChild(contentClone)

                printFrame.window.focus()
                printFrame.window.print()
              }
  
              const sendEmail = () => {
                console.log("Sending Email")
              }
  
              const importPDF = () => {
                const { jsPDF } = jspdf
                const doc = new jsPDF()
                const img = new Image()

                img.src = drawHTMLToCanvas(document.getElementById("content"))
                img.onload = () => {
                  const padding = 10
                  const xPos = padding
                  const yPos = padding
                  const imgWidth = doc.internal.pageSize.width - 2 * padding
                  const imgHeight = (imgWidth * img.height) / img.width
  
                  doc.addImage(img, "png", xPos, yPos, imgWidth, imgHeight)
                  doc.save("prueba.pdf")
                }
              }

              const importExcel = () => {
                console.log("Importing Table to Excel")
              }

              const actions = [ closeWindow, reloadTable, printTable, sendEmail, importPDF, importExcel ]
              const printIcons = document.getElementsByClassName("print-icon-container")
              const actionIterator = actions[Symbol.iterator]()

              for (const container of printIcons) {
                const action = actionIterator.next().value
                if (action) container.addEventListener("click", action)
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