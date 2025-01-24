import { JSX } from "react"
import './ListSkeleton.css'

export const ListSkeleton = (): JSX.Element => {
  return (
    <section className="list-skeleton">
      <div className="list-skeleton-container">
        <table id="data-list" className="content-skeleton">
          <tbody>
            {[...Array(20)].map((_, index) => (
              <tr key={ `row-${ index }` }>
                {[...Array(8)].map((_, id) => (
                  <td key={ `cell-${ index }-${ id }` } className="cell-skeleton"></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}