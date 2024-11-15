import ReactDOMServer from 'react-dom/server'
import React, { useMemo } from 'react'
import { NavigationActionKind, useNavigationContext } from '../../context/Navigation'
import { useGeneratePrintPage } from '../../hooks/useGeneratePrintPage'
import { type FieldConfig, type IconDefinition } from "../../types"
import { FILTER_COLUMNS, REPORTING_ACTIONS } from '../../consts'
import { fieldsReport } from '../../utils/fields'
import { FilterReport } from '../filterReport/FilterReport'
import { Titlebar } from '../titlebar/Titlebar'
import './DropMenu.css'

interface Props {
  menuOp: IconDefinition[],
  dir: 'left' | 'right',
  width: number,
}

export const DropMenu: React.FC<Props> = React.memo(({ menuOp, dir, width }): JSX.Element => {
  const { option } = useNavigationContext()
  const { styleHtmlTemplate, docName } = useGeneratePrintPage()
  
  const directionStyle = useMemo(() => ({
    [dir]: 0,
    minWidth: `${ width }%`
  }), [ dir, width ])

  const firstItemIconKey = useMemo(() => 
    Object.keys(menuOp[0])[0] === 'icon', 
  [ menuOp ])

  const fetchDropdownData = async (label: string): Promise<void> => {
    const fetchPromises = fieldsReport[label]
      .filter(({ type, fetchUrl }: FieldConfig) => type === 'dropmenu' && fetchUrl)
      .map(async ({ fetchUrl, id }: FieldConfig) => {
        try {
          const urlToUse: string = fetchUrl ? fetchUrl: ''
          const res: Response = await fetch(urlToUse)
          const data = await res.json()
          const dataResponse = Array.isArray(data) ? data : data.formData
          const dataOptions = Object.keys(dataResponse)
            .filter((key) => key !== 'columns')
            .map((key) => dataResponse[key])
            .flat()
          return { [String(id)]: dataOptions }
        } catch (error) {
          console.error(`Error fetching dropdown data for ${ id }`, error)
          return { [String(id)]: [] }
        }
      })
    
    const results = await Promise.all(fetchPromises)
    const combinedResults = results.reduce((acc, result) => ({ ...acc, ...result }), {})
    localStorage.setItem('dropdownData', JSON.stringify(combinedResults))
  }

  const handleLabel = async (op: IconDefinition): Promise<void> => {
    const hasForm = REPORTING_ACTIONS[option ?? NavigationActionKind.ERROR].find(rep => rep.label === op.label)?.hasForm ?? false
    hasForm && await fetchDropdownData(op.label)
    const titlebar = ReactDOMServer.renderToStaticMarkup(<Titlebar action='print' />)
    const filterReport = ReactDOMServer.renderToStaticMarkup(<FilterReport fields={op.label} />)
    const dataToPrint = document.getElementById('data-list')?.outerHTML ?? ''
    const modifiedDataToPrint = modifyDataToPrint(dataToPrint)
    const filterTableToPrint = filterTable(modifiedDataToPrint, op.label)
    const contentHtmlTemplate = getContentHtmlTemplate(hasForm, titlebar, filterTableToPrint ?? modifiedDataToPrint, filterReport, op.label)
    const sendEmailHtmlTemplate = getSendEmailHtmlTemplate(contentHtmlTemplate)
    const printPageTemplate = getPrintPageTemplate(sendEmailHtmlTemplate)
    printData(printPageTemplate)
  }

  const filterTable = (dataToPrint: string, label: string): string | undefined => {
    const columns = FILTER_COLUMNS[label]
    const parser = new DOMParser()
    const doc = parser.parseFromString(dataToPrint, 'text/html')
    const table = doc.querySelector('table')
    
    if (table && columns) {
      const headers = Array.from(table.querySelectorAll('thead th'))
      const rows = Array.from(table.querySelectorAll('tbody tr')) as HTMLTableRowElement[]

      const columnIndexes = headers
        .map((header, index) => (columns.includes(header.textContent?.trim() ?? '') ? index : -1))
        .filter(index => index !== -1)

      headers.forEach((header, index) => {
        if (!columnIndexes.includes(index)) header.remove()
      })

      rows.forEach(row => {
        Array.from(row.cells).forEach((cell, index) => {
          if (!columnIndexes.includes(index)) cell.remove()
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
      inputs.forEach(input => {
        const p = document.createElement('p')
        p.textContent = input.defaultValue
        input.replaceWith(p)
      })
    }
    return doc.body.innerHTML
  }

  const getContentHtmlTemplate = (hasForm: boolean, titlebar: string, modifiedDataToPrint: string, filterReport: string, label: string): string => {
    return styleHtmlTemplate.replace('<body style="position: relative; height: 100vh">', `
      <body style="position: relative; height: 98vh">
        ${ titlebar }
        <section id="content">${ label !== 'Generar Layout' ? modifiedDataToPrint : '' }</section>
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
          \`Content-Disposition: attachment; filename="${docName}.png"\r\n\r\n\` +
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
        document.getElementById("email").innerHTML = "${docName}.pdf"
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
          doc.save("${docName}.pdf")
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
        link.download = "${docName}.csv"
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      }
    `)
  }

  const printData = (printPageTemplate: string) => {
    const currentUrl = window.location.href
    const newWin = window.open(`${currentUrl}documents`, '_blank')
    if (!newWin) {
      console.error('Could not open a new window')
      return
    }

    newWin.postMessage({ data: 'message' }, '*')
    newWin.document.write(printPageTemplate)
    newWin.document.close()
  }

  return (
    <div className='drop-menu' style={ directionStyle }>
      <ul>
        {menuOp.map((op: IconDefinition) => (
          <li key={ op.label } onClick={ () => {
            if (docName && styleHtmlTemplate) handleLabel(op)
          }}>
            { firstItemIconKey && op.icon }
            { op.label }
          </li>
        ))}
      </ul>
    </div>
  )
})