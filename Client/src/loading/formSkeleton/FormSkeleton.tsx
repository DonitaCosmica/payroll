import { JSX } from "react"
import './FormSkeleton.css'

export const FormSkeleton = (): JSX.Element => {
  return (
    <section className="background-skeleton">
      <div className="form-container-skeleton"></div>
    </section>
  )
}