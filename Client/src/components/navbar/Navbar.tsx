import './Navbar.css'

const links: string[] = [
  'RECIBOS DE NOMINA',
  'TRABAJADORES',
  'PUESTOS',
  'DEPARTAMENTOS',
  'AREAS COMERCIALES',
  'PERCEPCIONES',
  'DEDUCCIONES',
  'CATALOGO DE PROYECTOS'
]

export const Navbar = (): JSX.Element => {
  return (
    <nav className='navbar'>
      {
        links.map((link: string) => (
          <div className='link' key={ link }>
            <p>{ link }</p>
          </div>
        ))
      }
    </nav>
  )
}