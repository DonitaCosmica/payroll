import { useCallback, useMemo, useState } from "react"
import { useCurrentWeek } from "../../hooks/useCurrentWeek"
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
  const { isDisabled } = useCurrentWeek({ input: [] })
  const [activeOption, setActiveOption] = useState<string | null>(null)

  const handleClick = useCallback((index: number, label: string) => {
    handleForm(index, label)
    if (label === 'Reportes' || label === 'Layout Bancos')
      setActiveOption(prev => (prev === label ? null : label))
  }, [ handleForm ])

  const menuWidth = useMemo(() => {
    switch (action) {
      case NavigationActionKind.PAYROLLRECEIPTS:
        return 280
      case NavigationActionKind.EMPLOYEES:
        return 210
      default:
        return 125
    }
  }, [ action ])

  const generateDropMenuOptions = useMemo(() =>
    REPORTING_ACTIONS[action ?? NavigationActionKind.ERROR].map(op => op)
  , [ action ])
  
  return (
    <>
      {options.map((option: IconDefinition, index: number) => {
        const { label, icon } = option
        const isActive = activeOption
          && (activeOption === 'Reportes' || activeOption === 'Layout Bancos')
          && label === activeOption

        return (
          <div className="option" key={ label }
            onClick={ isDisabled && label !== 'Reportes'
              && label !== 'Tabla de trabajo' 
              && label !== 'Layout Bancos'
              ? () => {} : () => handleClick(index, label) }
          >
            { icon }
            <p>{ label }</p>
            {isActive &&
              <DropMenu 
                menuOp={ generateDropMenuOptions } 
                dir="right" 
                width={ menuWidth } 
              />}
          </div>
        )
      })}
    </>
  )
}