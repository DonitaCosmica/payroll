import React, { Suspense, useCallback, useState } from "react"
import { useSortEmployeesContext } from "../../context/SortEmployees"
import { useCurrentWeek } from "../../hooks/useCurrentWeek"
import { type IconDefinition } from "../../types"
import { NavigationActionKind } from "../../context/Navigation"
import { REPORTING_ACTIONS } from "../../consts"
import './IconSection.css'

interface Props {
  token: number,
  action?: NavigationActionKind,
  options: IconDefinition[],
  handleForm: (id: string, index: number) => void
}

const DropMenu = React.lazy(() => import('../dropmenu/DropMenu').then(module => ({ default: module.DropMenu })))

export const IconSection: React.FC<Props> = ({ token, action, options, handleForm }): JSX.Element => {
  const { statuses, dispatch } = useSortEmployeesContext()
  const { isDisabled } = useCurrentWeek({ input: [] })
  const [showDropMenu, setShowDropMenu] = useState<Boolean>(false)

  const handleClick = useCallback((id: string, index: number, isActive: boolean) => {
    handleForm(id, index)
  
    if (isActive)
      setShowDropMenu(currentState => !currentState)
  }, [ handleForm ])

  const generateDropMenuOptions = useCallback((id: string) => {
    const reportingOptions = REPORTING_ACTIONS[action ?? NavigationActionKind.ERROR][id]
    return reportingOptions ? reportingOptions.map(({ id, label }) => ({ id, label })) : []
  }, [ action ])
  
  return (
    <>
      {options.map((option: IconDefinition, index: number) => {
        const { id, label, icon } = option
        const dropMenuoptions = generateDropMenuOptions(id)
        const isActive = dropMenuoptions.length > 0 && token !== 1

        return (
          <div className="option" key={ label }
            onClick={ !isDisabled ? () => handleClick(id, index, isActive) : () => {} }
          >
            { icon }
            <p>{ label }</p>
            {isActive && showDropMenu &&
              <Suspense fallback={ <div>Loading menu...</div> }>
                <DropMenu 
                  menuOp={(id !== 'filter' ? generateDropMenuOptions(id) : statuses).map(op => ({
                    ...op,
                    onClick: id === 'filter' ? (id, label) => {
                      if (id && label)
                        dispatch({
                          type: "SET_FILTER",
                          payload: { filter: id, label: label }
                        })
                    } : () => {}
                  }))} 
                  dir='left'
                  context={ id }
                />  
              </Suspense>}
          </div>
        )
      })}
    </>
  )
}