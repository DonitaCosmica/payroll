import ReactDOMServer from 'react-dom/server'
import React, { JSX, useCallback } from 'react'
import { useGeneratePrintPage } from '../../hooks/useGeneratePrintPage'
import { useFileProcessor } from '../../hooks/useFileProcessor'
import { type IPageComponents, type IIconDefinition } from "../../types"
import { FilterReport } from '../filterReport/FilterReport'
import { Titlebar } from '../titlebar/Titlebar'
import { Each } from '../../utils/Each'
import './DropMenu.css'

interface Props {
  menuOp: IIconDefinition[],
  dir: 'left' | 'right',
  context: string
}

export const DropMenu: React.FC<Props> = React.memo(({ menuOp, dir, context }): JSX.Element => {
  const { handlePrint, docName } = useGeneratePrintPage()
  const { handleOnChange } = useFileProcessor()

  const getHtmlComponent = useCallback((op: IIconDefinition): IPageComponents => {
    const titlebar = ReactDOMServer.renderToStaticMarkup(<Titlebar action='print' />)
    const filterReport = ReactDOMServer.renderToStaticMarkup(<FilterReport fields={ op.id } />)
    return { titlebar, filterReport }
  }, [])

  return (
    <div className='drop-menu' style={{ [dir]: 0 }}>
      <ul>
        <Each of={ menuOp } render={(op) => (
          op.id !== 'upload'
            ? (<li key={ op.label } onClick={() => {
                  if (context === 'report' && docName ) {
                    const { titlebar, filterReport } = getHtmlComponent(op)
                    handlePrint(op, titlebar, filterReport)
                    return
                  }

                  if (op.onClick) op.onClick(op.id, op.label)
                }}>
                  { op.icon }
                  <p>{ op.label }</p>
                </li>)
            : (<li key={ op.label } className='upload-data'>
                { op.icon }
                <p>{ op.label }</p>
                <input
                  id='fill-data'
                  name='fill-data'
                  type='file'
                  accept='.csv'
                  onChange={ (e) => { handleOnChange(e, op.url ?? '') } }
                />
              </li>)
        )} />
      </ul>
    </div>
  )
})