import { JSX, useEffect, useState } from "react"
import { useNavigationContext } from "../../context/Navigation"
import { RiMoneyDollarCircleLine } from "react-icons/ri"
import { totalTitles } from "../../consts"
import './Footer.css'

export const Footer = (): JSX.Element => {
  const { data, payroll } = useNavigationContext()
  const [totals, setTotals] = useState<number[]>([])

  useEffect(() => {
    const fetchTotals = async (): Promise<number | undefined> => {
      try {
        const payrollType = payroll && payroll.name ? payroll.name : 'Principal'
        const res: Response = await fetch(`http://localhost:5239/api/Ticket/amount?payrollType=${ payrollType }`)
        return await res.json() as number
      } catch (error) {
        console.error('Error fetching totals: ', error)
      }
    }

    const totalPeriod = data.reduce((acc, item) => {
      if (item['total'] !== undefined && !isNaN(Number(item['total']))) {
        const value = parseFloat(item['total'] as string)
        return acc + value
      }
      return acc
    }, 0)
    
    fetchTotals().then((otherTotals) => setTotals([totalPeriod, otherTotals ?? 0, 0, 0]))
  }, [ data, payroll ])

  return (
    <footer className='footer'>
      {totals.map((total: number, index: number) => (
        <div key={ `${ index }-${ total }` } className='total-container'>
          <div className='title'>{ totalTitles[index] }</div>
          <div className='total-box'>
            <p>{ `$${ total.toFixed(2) }` }</p>
          </div>
        </div>
      ))}
      <div className='payments'>
        <RiMoneyDollarCircleLine color="#de9400" fontSize="1.5rem" />
        <p>Pagos</p>
      </div>
    </footer>
  )
}