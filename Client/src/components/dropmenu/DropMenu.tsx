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
  const directionStyle = dir === 'left' ? { left: 0, minWidth: `${ width }%` } : { right: 0, minWidth: `${ width }%` }

  const printData = (): void => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const root = createRoot(container)
    root.render(<Titlebar action='print' />)

    const titlebar = ReactDOMServer.renderToStaticMarkup(<Titlebar action='print' />)
    document.body.removeChild(container)

    const dataToPrint = document.getElementById('data-list')
    if (dataToPrint && titlebar) {
      const currentUrl = window.location.href
      const newWin = window.open(`${ currentUrl }documents`, '_blank')
      if (newWin) {
        newWin.postMessage({ data: 'message' }, '*')
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
            <style>
              #background {
                position: absolute;
                display: none;
                justify-content: center;
                align-items: center;
                top: 0;
                width: 100%;
                height: 100%;
                background: linear-gradient(rgba(0, 0, 0, .7), rgba(0, 0, 0, .7));
              }
  
              .mail-form-container {
                width: 50%;
                background-color: #fff;
                border-radius: 15px;
                padding: 25px;
              }
  
              .mail-form-container > h2 {
                text-align: center;
                margin-bottom: 15px;
              }
  
              .info {
                display: flex;
                align-items: flex-start;
                width: 100%
                padding: 15px;
                margin: 10px 0;
              }
  
              .info > p {
                width: 88%;
                padding: 5px 0 5px 5px;
                font-size: 0.8rem;
                border-radius: 10px;
                background-color: #f3f3f3;
              }
  
              .info > label {
                width: 7%;
                text-align: right;
                margin-right: 1%;
                font-size: 0.9rem;
                padding: 5px 0;
              }

              .info > .file-name {
                width: 11%;
              }
  
              .info > textarea {
                resize: none;
              }
  
              .info > input {
                font-size: 0.8rem;
              }
  
              .info > :where(textarea, input) {
                width: 92%;
                padding: 10px;
                border-radius: 10px;
                font-size: 0.8rem;
                border: 1px solid #333;
                transition: 0.35s ease;
              }
  
              .info > :where(textarea, input):focus {
                outline: none !important;
                border: 1px solid #489aff;
                transition: 0.35s ease;
              }
  
              .send-data {
                display: flex;
                justify-content: center;
                align-items: center;
                width: 100%;
                padding: 20px;
              }
  
              .send-data > button {
                margin: 0 10px;
                border: none;
                border-radius: 10px;
                padding: 10px 20px;
                color: #fff;
                cursor: pointer;
              }
  
              .send-data > #send {
                background-color: #73ba69;
                transition: 0.4s ease;
              }
  
              .send-data > #cancel {
                background-color: #de4645;
                transition: 0.4s ease;
              }
  
              .send-data > #send:hover {
                background-color: #5e9956;
                transition: 0.4s ease;
              }
  
              .send-data > #cancel:hover {
                background-color: #c92e2e;
                transition: 0.4s ease;
              }
            </style>
          </head>
          <body style="position: relative; height: 100vh">
            ${ titlebar }
            <section id="content">
              ${ dataToPrint.outerHTML }
            </section>
            <section id="background">
              <div class="mail-form-container">
                <h2>Enviar Correo Electrónico</h2>
                <form id="send-email" class="inputs-container">
                  <h4>Archivo Adjunto: </h4>
                  <div class="info">
                    <label class="file-name">Archivo Adjunto</label>
                    <p class="email">example@gmail.com</p>
                  </div>
                  <div class="info">
                    <label>Para</label>
                    <textarea
                      id="receiver"
                      name="receiver"
                      rows="4"
                      autocomplete="off"
                      placeholder="example@gmail.com"
                    ></textarea>
                  </div>
                  <div class="info">
                    <label>Asunto</label>
                    <input
                      id="subject"
                      name="subject"
                      type="text"
                      placeholder="Asunto..."
                      autocomplete="off"
                    />
                  </div>
                  <div class="info">
                    <label>Mensaje</label>
                    <textarea
                      id="msg"
                      name="msg"
                      rows="4"
                      autocomplete="off"
                      placeholder="Mensaje..."
                    ></textarea>
                  </div>
                  <div class="send-data">
                    <button id="send" type="submit">Enviar</button>
                    <button id="cancel" type="button">Cancelar</button>
                  </div>
                </form>
              </div>
            </section>
            <iframe name="print-frame" id="print-frame" width="0" height="0" frameborder="0" src="about:blank"></iframe>
            <canvas id="canvas" style="display: none;"></canvas>
            <script>
              const loadScript = (src) => {
                return new Promise((resolve, reject) => {
                  const script = document.createElement('script')
                  script.src = src
                  script.async = true
                  script.defer = true
                  script.onload = () => resolve(script)
                  script.onerror = () => reject(new Error(\`Failed to load script: \${ src }\`))
                  document.head.appendChild(script)
                })
              }
  
              loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js')
              .then(() => {
                console.log("jsPDF loaded successfully.")
                return loadScript('https://smtpjs.com/v3/smtp.js')
              })
              .then(() => {
                console.log("Google API loaded successfully")
                return loadScript('https://apis.google.com/js/api.js')
              })
              .then(() => {
                console.log("Google Account loaded successfully")
                return loadScript('https://accounts.google.com/gsi/client')
              })
              .then(() => {
                const formData = {
                  receiver: "",
                  subject: "",
                  msg: ""
                }
                const state = {
                  gapiInited: false,
                  gisInited: false
                }
  
                const handleChange = (e) => {
                  const { id, value } = e.target
                  formData[id] = value
                }
  
                const isValidEmail = (email) => {
                  if (!email) return false

                  const parts = email.split("@")
                  if (parts.length !== 2) return false
  
                  const [username, domain] = parts
                  if (username.trim() !== username || domain.trim() !== domain) return false
                  if (!domain.includes(".") || domain.split(".").some(part => part.trim() === "")) return false
                  
                  return true  
                }
  
                const handleCredentialResponse = () => {
                  try {
                    const client = google.accounts.oauth2.initTokenClient({
                      client_id: "925640410639-8jn0svt6bcpcj3b2cv0a3d6j9nsn0sc5.apps.googleusercontent.com",
                      scope: "https://www.googleapis.com/auth/gmail.send",
                      callback: (tokenResponse) => {
                        try {
                          gapi.client.setToken(tokenResponse)
                          sendEmail()
                        } catch (error) {
                          console.error("Error setting token or sendin email: ", error) 
                        }
                      },
                    })
                    client.requestAccessToken()
                  } catch (error) {
                    console.error("Error in handleCredentialResponse: ", error)
                  }
                }
  
                const initializeGapiClient = () => {
                  try {
                    gapi.client.init({
                      apiKey: "AIzaSyAG_sYz5i3AWqCc77JazaR8saxrz8uQFsc",
                      discoveryDocs: ["https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest"]
                    }).then(() => {
                      state.gapiInited = true
                      console.log("GAPI client initialized")
                    }).catch(error => {
                      console.error("Error initializing GAPI client: ", error)
                    })
                  } catch (error) {
                    console.error("Error in initializeGapiClient: ", error) 
                  }
                }
  
                const gisLoaded = () => {
                  try {
                    state.gisInited = true
                    console.log("GIS loaded")
                    gapi.load("client", initializeGapiClient)
                  } catch (error) {
                    console.error("Error in gisLoaded: ", error)
                  }
                }
  
                const sendEmail= () => {
                  const email = \`From: "me"\r\n\` +
                    \`To: \${ formData.receiver }\r\n\` +
                    \`Subject: \${ formData.subject }\r\n\` +
                    \`MIME-Version: 1.0\r\n\` +
                    \`Content-Type: multipart/mixed; boundary="boundary-example"\r\n\r\n\` +
                    \`--boundary-example\r\n\` +
                    \`Content-Type: text/plain; charset="UTF-8"\r\n\` +
                    \`Content-Transfer-Encoding: 7bit\r\n\r\n\` +
                    \`\${ formData.msg }\r\n\r\n\` +
                    \`--boundary-example\r\n\` +
                    \`Content-Type: image/png\r\n\` +
                    \`Content-Transfer-Encoding: base64\r\n\` +
                    \`Content-Disposition: attachment; filename="canvas-image.png"\r\n\r\n\` +
                    \`\${ drawHTMLToCanvas(document.getElementById("content")).split(",")[1] }\r\n\r\n\` +
                    \`--boundary-example--\r\n\`
  
                  const encodedEmail = encodeURIComponent(email);
                  const escapedEmail = unescape(encodedEmail);
                  const base64EncodedEmail = btoa(escapedEmail)
                    .split("+").join("-")
                    .split("/").join("_")
                    .split("=").join("")

                  if (!gapi.client.gmail) {
                    console.error("Gmail client not loaded")
                    return
                  }
  
                  gapi.client.gmail.users.messages.send({
                    userId: "me",
                    resource: {
                      raw: base64EncodedEmail,
                    },
                  }).then(response => {
                    console.log("Email sent!", response)
                  }).catch(error => {
                    console.error("Error sending email", error)
                  })
                }
  
                const getStylesOfAnElement = ({ prefixes }) => {
                  const styleSheet = [...document.styleSheets[0].cssRules]
                  return styleSheet
                    .filter(style => prefixes.some(prefix => style.cssText.startsWith(prefix)))
                    .map(style => style.cssText)
                    .join(" ")
                }
  
                const drawHTMLToCanvas = (content) => {
                  const canvas = document.getElementById("canvas")
                  const ctx = canvas.getContext("2d")
                  const width = content.offsetWidth
                  const height = content.offsetHeight
                  const computedStyle = getComputedStyle(content)
  
                  canvas.width = width
                  canvas.height = height
                  ctx.fillStyle = computedStyle.backgroundColor
                  ctx.fillRect(0, 0, width, height)
  
                  const drawText = (text, x, y, textStyle) => {
                    ctx.font = \`\${ textStyle.fontSize } \${ textStyle.fontFamily }\`
                    ctx.fillStyle = textStyle.color
                    ctx.textAlign = 'center'
                    ctx.textBaseline = 'middle'
                    ctx.fillText(text, x, y)
                  }
  
                  const drawTable = (table, offsetX, offsetY) => {
                    const tableStyle = getComputedStyle(table)
                    const borderCollapse = tableStyle.borderCollapse === "collapse"
  
                    Array.from(table.rows).reduce((accY, row) => {
                      const rowStyle = getComputedStyle(row)
  
                      Array.from(row.cells).reduce((accX, cell) => {
                        const cellStyle = getComputedStyle(cell)
  
                        ctx.fillStyle = rowStyle.backgroundColor
                        ctx.fillRect(accX, accY, cell.offsetWidth, cell.offsetHeight)
                          
                        if (!borderCollapse) {
                          ctx.strokeStyle = rowStyle.borderColor
                          ctx.strokeRect(accX, accY, cell.offsetWidth, cell.offsetHeight)
                        }
  
                        Array.from(cell.children).map(child => {
                          if (child.tagName === 'P') {
                            const pStyle = getComputedStyle(child)
                            drawText(child.innerText, accX + cell.offsetWidth / 2, accY + cell.offsetHeight / 2, pStyle)
                          }
                        })
  
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
                    } else {
                      ctx.font = \`\${ elementStyle.fontSize } \${ elementStyle.fontFamily }\`
                      ctx.fillStyle = elementStyle.color
                      ctx.textAlign = "left"
                      ctx.textBaseline = "top"
                        
                      const lineHeight = parseInt(elementStyle.lineHeight) || parseInt(elementStyle.fontSize) * 1.2
                      const lines = element.innerText.split(\`\n\`)
                      lines.map((line, index) => context.fillText(line, offsetX, offsetY + index * lineHeight))
  
                      return offsetY + lines.length * lineHeight
                    }
                  }
  
                  Array.from(content.children).reduce((acc, child) => drawElement(child, 0, acc), 0)
                  return canvas.toDataURL("image/png")
                }
  
                const closeWindow = () => window.close()
  
                const reloadTable = () => location.reload()
  
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
                };
  
                const openEmailWindow = () => document.getElementById("background").style.display = "flex"
  
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
  
                    doc.addImage(img, "png", xPos, yPos, imgWidth * 2, imgHeight * 2)
                    doc.save("prueba.pdf")
                  }
                }
  
                const importExcel = () => {
                  const table = document.getElementById("data-list")
                  const csvContent = Array.from(table.rows).reduce((csv, row) => {
                    const rowData = Array.from(row.cells).reduce((data, cell) => {
                      const cellText = Array.from(cell.children).map(child => child.innerText).join(',')
                      return [...data, cellText]
                    }, []).join(',')
  
                    return \`\${ csv }\${ rowData }\n\`
                  }, '')
  
                  const blob = new Blob([csvContent], { type: 'text/csv' })
                  const url = URL.createObjectURL(blob)
                  const link = document.createElement('a')
  
                  link.href = url
                  link.download = 'table.csv'
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                }

                gisLoaded()
  
                const actions = [closeWindow, reloadTable, printTable, openEmailWindow, importPDF, importExcel]
                const printIcons = document.getElementsByClassName("print-icon-container")
                const actionIterator = actions[Symbol.iterator]()
  
                for (const container of printIcons) {
                  const action = actionIterator.next().value
                  if (action) container.addEventListener("click", action)
                }
  
                document.getElementById("receiver").onchange = handleChange
                document.getElementById("subject").onchange = handleChange
                document.getElementById("msg").onchange = handleChange
                document.getElementById("cancel").addEventListener("click", () => {
                  document.getElementById("background").style.display = "none"
                  Object.keys(formData).map(key => formData[key] = "")
                  for (const element of document.querySelectorAll("#receiver, #subject, #msg"))
                    element.value = ""
                })
                document.getElementById("send-email").addEventListener("submit", () => {
                  event.preventDefault()
  
                  if (!isValidEmail(formData.receiver)) {
                    alert("Email no valido.")
                    return
                  }

                  handleCredentialResponse()
                  document.getElementById("background").style.display = "none"
                })
              }).catch((error) => {
                console.error(error)
              })
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
    <div className='drop-menu' style={directionStyle} onClick={ printData }>
      <ul>
        {menuOp.map((op: IconDefinition) => (
          <li key={ op.label }>
            { Object.keys(menuOp[0])[0] === 'icon' && (op.icon) }
            { op.label }
          </li>
        ))}
      </ul>
    </div>
  )
}
