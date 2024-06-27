import { useCallback, useState } from "react"
import { type IconDefinition } from "../../types"
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
  const [activeOption, setActiveOption] = useState<string | null>(null)

  const handleClick = useCallback((index: number, label: string) => {
    handleForm(index, label)
    if (label === 'Reportes') setActiveOption(prev => (prev === label) ? null : label)
  }, [ handleForm ])

  const menuWidth = action === NavigationActionKind.PAYROLLRECEIPTS ? 280 :
    action === NavigationActionKind.EMPLOYEES ? 210 : 125
  
  return (
    <>
      { options.map((option: IconDefinition, index: number) => {
        const { label, icon } = option
        const isActive = activeOption === 'Reportes' && label === 'Reportes'

        return (
          <div 
            className="option" 
            key={ label } 
            onClick={ () => handleClick(index, label) }>
            { icon }
            <p>{ label }</p>
            {isActive &&
              <DropMenu 
                menuOp={ REPORTING_ACTIONS[action ?? NavigationActionKind.ERROR] } 
                dir="right" 
                width={ menuWidth } 
              />}
          </div>
        )
      }) }
    </>
  )
}