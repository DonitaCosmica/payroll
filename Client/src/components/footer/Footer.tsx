import { JSX, useEffect, useRef, useState } from "react"
import { useNavigationContext } from "../../context/Navigation"
import { usePeriodContext } from "../../context/Period"
import { type ITotals } from "../../types"
import { Each } from "../../utils/Each"
import { FooterSkeleton } from "../../custom/footerSkeleton/FooterSkeleton"
import { RiMoneyDollarCircleLine } from "react-icons/ri"
import { totalTitles } from "../../consts"
import './Footer.css'

export const Footer = (): JSX.Element => {
  const { data, payroll } = useNavigationContext()
  const { selectedPeriod } = usePeriodContext()
  const totalOtherPeriod = useRef<ITotals>({ name: '', total: 0 })
  const [totals, setTotals] = useState<number[]>([])

  useEffect(() => {
    const fetchTotals = async (): Promise<void> => {
      try {
        const { week, year } = selectedPeriod
        const payrollType = payroll && payroll.name ? payroll.name : 'Principal'
        const url = `http://localhost:5239/api/Ticket/amount?week=${ week }&year=${ year }&payrollType=${ payrollType }`
        const res: Response = await fetch(url)
        totalOtherPeriod.current = await res.json() as ITotals
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
    
    fetchTotals()
    setTotals([totalPeriod, totalOtherPeriod.current.total ?? 0, 0, totalPeriod])
    totalTitles.splice(1, 1, `Total ${ totalOtherPeriod.current.name }`)
  }, [ data, payroll ])

  if (totals.length === 0)
    return <FooterSkeleton />

  return (
    <footer className='footer'>
      <Each of={ totals } render={(total, index) => (
        <div key={ `${ index }-${ total }` } className='total-container'>
          <div className='title'>{ totalTitles[index] }</div>
          <div className='total-box'>
            <p>{ `$${ total.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',') }` }</p>
          </div>
        </div>
      )} />
      <div className='payments'>
        <RiMoneyDollarCircleLine color="#de9400" fontSize="1.5rem" />
        <p>Pagos</p>
      </div>
    </footer>
  )
}