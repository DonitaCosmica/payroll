import ReactDOMServer from 'react-dom/server'
import { useCallback, useState } from "react"
import { useGeneratePrintPage } from '../../hooks/useGeneratePrintPage'
import { type IconDefinition } from "../../types"
import { Titlebar } from '../titlebar/Titlebar'
import { DropMenu } from "../dropmenu/DropMenu"
import { NavigationActionKind } from "../../context/Navigation"
import { REPORTING_ACTIONS } from "../../consts"
import './IconSection.css'

interface Props {
  action?: NavigationActionKind,
  options: IconDefinition[],
  handleForm: (index: number, label: string) => void
}

export const IconSection: React.FC<Props> = ({ action, options, handleForm }): JSX.Element => {
  const { printPageTemplate } =  useGeneratePrintPage({
    titlebar: ReactDOMServer.renderToStaticMarkup(<Titlebar action='print' />),
    tableId: 'data-list'
  })
  const [activeOption, setActiveOption] = useState<string | null>(null)

  const printData = useCallback(() => {
    const currentUrl = window.location.href
    const newWin = window.open(`${ currentUrl }documents`, '_blank')
    if (!newWin) {
      console.error('Could not open a new window')
      return
    }
      
    newWin.postMessage({ data: 'message' }, '*')
    newWin.document.write(printPageTemplate)
    newWin.document.close()
  }, [ printPageTemplate ])

  const handleClick = useCallback((index: number, label: string) => {
    handleForm(index, label)
    if (label === 'Reportes') setActiveOption(prev => (prev === label) ? null : label)
  }, [ handleForm ])

  const menuWidth = action === NavigationActionKind.PAYROLLRECEIPTS ? 280 :
    action === NavigationActionKind.EMPLOYEES ? 210 : 125
  
  return (
    <>
      {options.map((option: IconDefinition, index: number) => {
        const { label, icon } = option
        const isActive = activeOption === 'Reportes' && label === 'Reportes'

        return (
          <div 
            className="option" 
            key={ label } 
            onClick={ () => handleClick(index, label) }
          >
            { icon }
            <p>{ label }</p>
            {isActive &&
              <DropMenu 
                menuOp={REPORTING_ACTIONS[action ?? NavigationActionKind.ERROR].map(op => ({
                  ...op,
                  onClick: () => printData()
                }))} 
                dir="right" 
                width={ menuWidth } 
              />}
          </div>
        )
      })}
    </>
  )
}