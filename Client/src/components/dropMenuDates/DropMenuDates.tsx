import { useEffect } from 'react'
import { usePeriodContext } from '../../context/Period'
import { type IconDefinition } from '../../types'
import { ICON_OPTIONS } from '../../utils/icons'
import { Accordion } from '../accordion/Accordion'
import './DropMenuDates.css'

interface Props {
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>
}

export const DropMenuDates: React.FC<Props> = ({  }): JSX.Element => {
  const { years, dates, setActionType } = usePeriodContext()

  useEffect(() => setActionType('FETCH_DATA'), [])
  
  return (
    <div className='drop-menu-dates'>
      <div className='title-menu'>
        <p>Seleccionar Periodo</p>
        <div className='title-menu-options'>
          {ICON_OPTIONS.common.map((iconOption: IconDefinition) => (
            <div key={ iconOption.label } className='title-menu-option-box'>
              { iconOption.icon }
            </div>
          ))}
        </div>
      </div>
      <ul>
        {years.map((year: number, index: number) => 
          <Accordion 
            key={ year }
            year={ year }
            period={ dates[index] }
          />
        )}
      </ul>
    </div>
  )
}