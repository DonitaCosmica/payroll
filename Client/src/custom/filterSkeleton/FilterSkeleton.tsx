import { JSX } from "react"
import './FilterSkeleton.css'

export const FilterSkeleton = (): JSX.Element => {
  return (
    <section className="filters-skeleton">
      <div className="container-filter-skeleton"></div>
    </section>
  )
}