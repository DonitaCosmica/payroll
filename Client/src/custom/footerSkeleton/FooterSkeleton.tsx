import { JSX } from "react"
import './FooterSkeleton.css'

export const FooterSkeleton = (): JSX.Element => {
  return (
    <section className="footer-skeleton">
      {Array.from({ length: 4 }, (_, index: number) => (
        <div key={ `total-box-${ index }` } className="total-container-skeleton">
          <div className="total-box-skeleton"></div>
        </div>
      ))}
    </section>
  )
}