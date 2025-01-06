import React, { Suspense, useCallback, useState } from "react"
import { useSortEmployeesContext } from "../../context/SortEmployees"
import { useCurrentWeek } from "../../hooks/useCurrentWeek"
import { SortState, type IconDefinition } from "../../types"
import { NavigationActionKind } from "../../context/Navigation"
import { REPORTING_ACTIONS } from "../../consts"
import './IconSection.css'

interface Props {
  action?: NavigationActionKind,
  options: IconDefinition[],
  handleForm: (index: number, label: string) => void
}

const DropMenu = React.lazy(() => import('../dropmenu/DropMenu').then(module => ({ default: module.DropMenu })))

export const IconSection: React.FC<Props> = ({ action, options, handleForm }): JSX.Element => {
  const { dispatch } = useSortEmployeesContext()
  const { isDisabled } = useCurrentWeek({ input: [] })
  const [activeOption, setActiveOption] = useState<string | null>(null)

  const handleClick = useCallback((index: number, label: string) => {
    handleForm(index, label)
    if (label === 'Reportes' || label === 'Layout Bancos' || label === 'ACTIVO/REINGRESO')
      setActiveOption(prev => (prev === label ? null : label))
  }, [ handleForm ])

  const generateDropMenuOptions = useCallback((label: string) => {
    const reportingOptions = REPORTING_ACTIONS[action ?? NavigationActionKind.ERROR][label]
    return reportingOptions ? reportingOptions.map(({ label }) => ({ label })) : []
  }, [ action ])
  
  return (
    <>
      {options.map((option: IconDefinition, index: number) => {
        const { label, icon } = option
        const isActive = activeOption
          && (activeOption === 'Reportes' || activeOption === 'Layout Bancos' || activeOption === 'ACTIVO/REINGRESO')
          && label === activeOption

        return (
          <div className="option" key={ label }
            onClick={ isDisabled && label !== 'Reportes'
              && label !== 'Tabla de trabajo' 
              && label !== 'Layout Bancos'
              && label !== 'ACTIVO/REINGRESO'
              ? () => {} : () => handleClick(index, label) }
          >
            { icon }
            <p>{ label }</p>
            {isActive &&
              <Suspense fallback={ <div>Loading menu...</div> }>
                <DropMenu 
                  menuOp={ generateDropMenuOptions(label).map(op => ({
                    ...op,
                    onClick: (filter = 'Todos') => {
                      if (filter && ['Todos', 'Activos', 'Reingreso', 'Activos y Reingreso', 'Baja'].includes(filter))
                        dispatch({ type: "SET_FILTER", payload: filter as SortState['filter'] })
                    }
                  })) } 
                  dir="right"
                  context={ label }
                />  
              </Suspense>}
          </div>
        )
      })}
    </>
  )
}