import { RiMoneyDollarCircleLine } from "react-icons/ri"
import './Footer.css'

const amountElements: number = 4
const totalTitles: string[] = ['Total de periodo', 'Total Extraordinario', 'Total Pagado', 'Saldo']
const elements: JSX.Element[] = Array.from({ length: amountElements }, (_, index: number) => (
  <div key={index} className='total-container'>
    <div className='title'>{ totalTitles[index] }</div>
    <div className='total-box'>
      <p>$ 7,000.00</p>
    </div>
  </div>
))

export const Footer = (): JSX.Element => {
  return (
    <footer className='footer'>
      { elements.map((element: JSX.Element) => element) }
      <div className='payments'>
        <RiMoneyDollarCircleLine color="#de9400" fontSize="1.5rem" />
        <p>Pagos</p>
      </div>
    </footer>
  )
}