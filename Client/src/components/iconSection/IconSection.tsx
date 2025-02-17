import ReactDOMServer from 'react-dom/server'
import React, { JSX, useCallback, useState } from "react"
import { usePeriodContext } from "../../context/Period"
import { useSortEmployeesContext } from "../../context/SortEmployees"
import { useGeneratePrintPage } from "../../hooks/useGeneratePrintPage"
import { type IPageComponents, type IDropMenu, type IIconDefinition } from "../../types"
import { NavigationActionKind, useNavigationContext } from "../../context/Navigation"
import { REPORTING_ACTIONS } from "../../consts"
import { Each } from '../../utils/Each'
import { DropMenu } from "../dropmenu/DropMenu"
import { Titlebar } from '../titlebar/Titlebar'
import { FilterReport } from '../filterReport/FilterReport'
import './IconSection.css'

interface Props {
  token: number,
  action?: NavigationActionKind,
  options: IIconDefinition[],
  handleForm: (id: string, index: number) => void
}

export const IconSection: React.FC<Props> = ({ token, action, options, handleForm }): JSX.Element => {
  const { setUpdateTableWork } = useNavigationContext()
  const { statuses, dispatch } = useSortEmployeesContext()
  const { isCurrentWeek } = usePeriodContext()
  const { handlePrint, docName } = useGeneratePrintPage()
  const [showDropMenu, setShowDropMenu] = useState<Boolean>(false)

  const getHtmlComponent = useCallback((op: IIconDefinition): IPageComponents => {
    const titlebar = ReactDOMServer.renderToStaticMarkup(<Titlebar action='print' />)
    const filterReport = ReactDOMServer.renderToStaticMarkup(<FilterReport fields={ op.id } />)
    return { titlebar, filterReport }
  }, [])

  const handleClick = useCallback((id: string, label: string, index: number, isActive: boolean): void => {    
    if (id.includes('layout') && docName) {
      const op: IIconDefinition = { id, label }
      const { titlebar, filterReport } = getHtmlComponent(op)
      handlePrint(op, titlebar, filterReport)
      setUpdateTableWork(true)
      return
    }

    handleForm(id, index)
    if (isActive) setShowDropMenu(currentState => !currentState)
  }, [ handleForm ])

  const generateDropMenuOptions = useCallback((id: string): IDropMenu[] => {
    const reportingOptions = REPORTING_ACTIONS[action ?? NavigationActionKind.ERROR][id]
    return reportingOptions ? reportingOptions.map(({ id, label }) => ({ id, label })) : []
  }, [ action ])
  
  return (
    <Each of={ options } render={(option, index) => {
      const { id, label, icon } = option
      const dropMenuoptions = generateDropMenuOptions(id)
      const isActive = dropMenuoptions.length > 0 && token !== 1

      return (
        <div className="option" key={ label } onClick={ !isCurrentWeek ? () => handleClick(id, label, index, isActive) : () => {} }>
          { icon }
          <p>{ label }</p>
          {isActive && showDropMenu &&
            <DropMenu
              menuOp={(id !== 'filter' ? generateDropMenuOptions(id) : statuses).map(op => ({
                ...op,
                onClick: id === 'filter' ? (id, label): void => {
                  if (id && label)
                    dispatch({
                      type: "SET_FILTER",
                      payload: { filter: id, label: label }
                    })
                } : (): void => {}
              }))}
              dir='left'
              context={ id }
            />
          }
        </div>
      )
    }} />
  )
}