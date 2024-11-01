import { useEffect, useRef, useState } from "react"
import { useNavigationContext } from "../context/Navigation"
import { LINKS } from "../consts"

interface Props {
  titlebar: string,
  tableId: string,
  label: string,
  hasForm: boolean
}

export const useGeneratePrintPage = ({ titlebar, tableId, label, hasForm }: Props): { [key: string]: string } => {
  const { option } = useNavigationContext()
  const [htmlText, setHtmlText] = useState<string>('')
  const docName = useRef<string>('')
  
  useEffect(() => {
    const getHtmlText = async (): Promise<void> => {
      const res: Response = await fetch('/src/pages/print.html')
      const text: string = await res.text()
      setHtmlText(text)
    }

    const tableName = LINKS[option - 1] ?? 'Layout'
    docName.current = tableName.toLowerCase().split(' ').join('-')
    getHtmlText()
  }, [ option ])
  
  const getStyleSheets = (): string =>
    Array.from(document.styleSheets).map((styleSheet: CSSStyleSheet) => {
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

    const styles = `<style>${ getStyleSheets() }</style>`
    const dataToPrint: string = document.getElementById(tableId)?.outerHTML ?? ''
    const modifiedDataToPrint = dataToPrint ? (() => {
      const parser = new DOMParser()
      const doc = parser.parseFromString(dataToPrint, 'text/html')
      const inputs = doc.querySelectorAll('input')
      if (inputs.length > 0)
        inputs.forEach(input => {
          const p = document.createElement('p')
          p.textContent = input.defaultValue
          input.replaceWith(p)
        })

      return doc.body.innerHTML
    })() : ''
    const styleHtmlTemplate = htmlText.replace('</head>', `${styles}</head>`)
    const contentHtmlTemplate = styleHtmlTemplate.replace('<body style="position: relative; height: 100vh">', `
      <body style="position: relative; height: 98vh">
        ${ titlebar }
        <section id="content">
          ${ modifiedDataToPrint }
        </section>
    `)

    if (hasForm) {
      
    }

    const sendEmailHtmlTemplate = contentHtmlTemplate.replace('//sendEmail', `
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
          \`Content-Disposition: attachment; filename="${ docName.current }.png"\r\n\r\n\` +
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
    `)
    const printPageTemplate = sendEmailHtmlTemplate.replace('//openEmailWindow', `
      const openEmailWindow = () => {
        document.getElementById("background").style.display = "flex"
        document.getElementById("email").innerHTML = "${ docName.current }.pdf"
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

          doc.addImage(img, "png", xPos, yPos, imgWidth * 2, imgHeight * 2)
          doc.save("${ docName.current }.pdf")
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
        link.download = "${ docName.current }.csv"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    `)

  return { printPageTemplate }
}