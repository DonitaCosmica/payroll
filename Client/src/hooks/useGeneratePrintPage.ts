import { useEffect, useRef, useState } from "react"
import { useNavigationContext } from "../context/Navigation"
import { FILTER_COLUMNS, LINKS, REPORTING_ACTIONS } from "../consts"
import { type IReportDefinition, type IFieldConfig, type IIconDefinition } from "../types"
import { fieldsReport } from "../utils/fields"

interface IPrintPage {
  handlePrint: (op: IIconDefinition, titlebar: string, filterReport: string) => Promise<void>,
  docName: string;
}

export const useGeneratePrintPage = (): IPrintPage => {
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

  const fetchDropdownData = async (id: string): Promise<void> => {
    const fetchPromises = fieldsReport[id]
      .filter(({ type, fetchUrl }: IFieldConfig) => type === 'dropmenu' && fetchUrl)
      .map(async ({ fetchUrl, id }: IFieldConfig) => {
        try {
          const urlToUse: string = fetchUrl ? fetchUrl: ''
          const res: Response = await fetch(urlToUse)
          const data = await res.json()
          const dataResponse = Array.isArray(data) ? data : data.formData
          const dataOptions = Object.keys(dataResponse)
            .filter((key: string) => key !== 'columns')
            .map((key: string) => dataResponse[key])
            .flat()
          return { [ String(id) ]: dataOptions }
        } catch (error) {
          console.error(`Error fetching dropdown data for ${ id }`, error)
          return { [ String(id) ]: [] }
        }
      })

    localStorage.setItem('dropdownData', JSON.stringify(Object.assign({}, ...(await Promise.all(fetchPromises)))))
  }

  const getStyleSheets = (): string =>
    Array.from(document.styleSheets).map((styleSheet: CSSStyleSheet) => {
      try {
        return Array.from(styleSheet.cssRules)
          .map((rule: CSSRule) => rule.cssText)
          .filter((cssText: string) => (cssText.startsWith('.titlebar') || cssText.startsWith('.content') || cssText.startsWith('*')) && cssText.trim() !== '')
          .join('\n')
      } catch (error) {
        console.warn('You cannot access the CSS rules of a style sheet.')
        return ''
      }
    }).join(' ')

  const getContentHtmlTemplate = (hasForm: boolean, titlebar: string, modifiedDataToPrint: string, filterReport: string, id: string): string => {
    const styles = `<style>${ getStyleSheets() }</style>`
    const styleHtmlTemplate = htmlText.replace('</head>', `${ styles }</head>`)

    return styleHtmlTemplate.replace('<body>', `
      <body>
        ${ titlebar }
        <section id="content">${ id !== 'layout' ? modifiedDataToPrint : '' }</section>
        ${ !hasForm ? '' : filterReport }
      </body>
    `)
  }

  const getSendEmailHtmlTemplate = (contentHtmlTemplate: string): string => {
    return contentHtmlTemplate.replace('//sendEmail', `
      const sendEmail = () => {
        const email = \`From: "me"\r\n\` +
          \`To: \${formData.receiver}\r\n\` +
          \`Subject: \${formData.subject}\r\n\` +
          \`MIME-Version: 1.0\r\n\` +
          \`Content-Type: multipart/mixed; boundary="boundary-example"\r\n\r\n\` +
          \`--boundary-example\r\n\` +
          \`Content-Type: text/plain; charset="UTF-8"\r\n\` +
          \`Content-Transfer-Encoding: 7bit\r\n\r\n\` +
          \`\${formData.msg}\r\n\r\n\` +
          \`--boundary-example\r\n\` +
          \`Content-Type: image/png\r\n\` +
          \`Content-Transfer-Encoding: base64\r\n\` +
          \`Content-Disposition: attachment; filename="${ docName.current }.png"\r\n\r\n\` +
          \`\${drawHTMLToCanvas(document.getElementById("content")).split(",")[1]}\r\n\r\n\` +
          \`--boundary-example--\r\n\`

        const encodedEmail = encodeURIComponent(email)
        const escapedEmail = unescape(encodedEmail)
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
          resource: { raw: base64EncodedEmail }
        }).then(response => {
          console.log("Email sent!", response)
        }).catch(error => {
          console.error("Error sending email", error)
        })
      }
    `)
  }

  const getPrintPageTemplate = (sendEmailHtmlTemplate: string): string => {
    return sendEmailHtmlTemplate.replace('//openEmailWindow', `
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
          return \`\${csv}\${rowData}\n\`
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
  }

  const filterTable = (dataToPrint: string, id: string): string | undefined => {
    const columnIndexes: number[] = FILTER_COLUMNS[id]
    const parser = new DOMParser()
    const doc = parser.parseFromString(dataToPrint, 'text/html')
    const table = doc.querySelector('table')
      
    if (table && columnIndexes) {
      const headers: Element[] = Array.from(table.querySelectorAll('thead th'))
      const rows = Array.from(table.querySelectorAll('tbody tr')) as HTMLTableRowElement[]
  
     headers.forEach((header: Element, index: number) => {
      if (!columnIndexes.includes(index))
        header.remove()
     })

     rows.forEach((row: HTMLTableRowElement) => {
      Array.from(row.cells).forEach((cell: HTMLTableCellElement, index: number) => {
        if (!columnIndexes.includes(index))
          cell.remove()
      })
     })
    }
  
    return table?.outerHTML
  }
  
  const modifyDataToPrint = (data: string): string => {
    if (!data) return ''
    const parser = new DOMParser()
    const doc = parser.parseFromString(data, 'text/html')
    const inputs = doc.querySelectorAll('input')
    if (inputs.length > 0) {
      inputs.forEach((input: HTMLInputElement) => {
        const p = document.createElement('p')
        p.textContent = input.defaultValue
        input.replaceWith(p)
      })
    }
    return doc.body.innerHTML
  }

  const printData = (printPageTemplate: string): void => {
    const currentUrl = window.location.href
    const newWin = window.open(`${ currentUrl }documents`, '_blank')
    if (!newWin) {
      console.error('Could not open a new window')
      return
    }

    newWin.postMessage({ data: 'message' }, '*')
    newWin.document.write(printPageTemplate)
    newWin.document.close()
  }

  const handlePrint = async (op: IIconDefinition, titlebar: string, filterReport: string): Promise<void> => {
    const reports = REPORTING_ACTIONS[option]?.['report'] || REPORTING_ACTIONS[option]?.['layout']
    const hasForm = reports ? reports.some((report: IReportDefinition) => report.id === op.id && report.hasForm) : false
    if (hasForm) await fetchDropdownData(op.id)
    const dataToPrint = document.getElementById('data-list')?.outerHTML ?? ''
    const modifiedDataToPrint = modifyDataToPrint(dataToPrint)
    const filterTableToPrint = filterTable(modifiedDataToPrint, op.id)
    const contentHtmlTemplate = getContentHtmlTemplate(hasForm, titlebar, filterTableToPrint ?? modifiedDataToPrint, filterReport, op.id)
    const sendEmailHtmlTemplate = getSendEmailHtmlTemplate(contentHtmlTemplate)
    const printPageTemplate = getPrintPageTemplate(sendEmailHtmlTemplate)
    printData(printPageTemplate)
  }

  return { handlePrint, docName: docName.current }
}