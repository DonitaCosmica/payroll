import { Accordion } from '../accordion/Accordion'
import './DropMenuDates.css'

const years: string[] = [
  '2024', '2023', '2022', '2021', '2020', '2019', '2018'
]

export const DropMenuDates = (): JSX.Element => {
  return (
    <div className='drop-menu-dates'>
      <div className='title-menu'>
        <p>Seleccionar Periodo</p>
      </div>
      <ul>
        {
          years.map((year: string) => (
            <Accordion key={ year } year={ year } />
          ))
        }
      </ul>
    </div>
  )
}