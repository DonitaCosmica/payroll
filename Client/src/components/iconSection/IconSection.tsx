import React, { JSX, useCallback, useState } from "react"
import { usePeriodContext } from "../../context/Period"
import { useSortEmployeesContext } from "../../context/SortEmployees"
import { type IIconDefinition } from "../../types"
import { NavigationActionKind } from "../../context/Navigation"
import { REPORTING_ACTIONS } from "../../consts"
import { DropMenu } from "../dropmenu/DropMenu"
import './IconSection.css'

interface Props {
  token: number,
  action?: NavigationActionKind,
  options: IIconDefinition[],
  handleForm: (id: string, index: number) => void
}

export const IconSection: React.FC<Props> = ({ token, action, options, handleForm }): JSX.Element => {
  const { statuses, dispatch } = useSortEmployeesContext()
  const { isCurrentWeek } = usePeriodContext()
  const [showDropMenu, setShowDropMenu] = useState<Boolean>(false)

  const handleClick = useCallback((id: string, index: number, isActive: boolean) => {
    handleForm(id, index)
    if (isActive) setShowDropMenu(currentState => !currentState)
  }, [ handleForm ])

  const generateDropMenuOptions = useCallback((id: string) => {
    const reportingOptions = REPORTING_ACTIONS[action ?? NavigationActionKind.ERROR][id]
    return reportingOptions ? reportingOptions.map(({ id, label }) => ({ id, label })) : []
  }, [ action ])
  
  return (
    <>
      {options.map((option: IIconDefinition, index: number) => {
        const { id, label, icon } = option
        const dropMenuoptions = generateDropMenuOptions(id)
        const isActive = dropMenuoptions.length > 0 && token !== 1

        return (
          <div className="option" key={ label }
            onClick={ !isCurrentWeek ? () => handleClick(id, index, isActive) : () => {} }
          >
            { icon }
            <p>{ label }</p>
            {isActive && showDropMenu &&
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
            }
          </div>
        )
      })}
    </>
  )
}