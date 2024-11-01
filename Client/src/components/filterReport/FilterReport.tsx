import './FilterReport.css'

export const FilterReport = (): JSX.Element => {
  return (
    <section className="filter-report-background">
      <div className="filter-report-container">
        <h1>Parametros del Reporte</h1>
        <div className="fields-container">

        </div>
        <div className="report-buttons-container">
          <div className='button-container'>
            <button className='accept-report'>Aceptar</button>
          </div>
          <div className='button-container'>
            <button className='cancel-report'>Cancelar</button>
          </div>
        </div>
      </div>
    </section>
  )
}