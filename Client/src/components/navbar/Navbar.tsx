import { useContext } from 'react'
import { NavigationContext } from '../../context/Navigation'
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
  const { dispatch, option } = useContext(NavigationContext)

  return (
    <nav className='navbar'>
      {
        links.map((link: string, index: number) => (
          <div 
            className={`link ${ option === index + 1 ? 'selected' : '' }`} 
            key={ link } 
            onClick={ () => dispatch({ type: index + 1 }) }
          >
            <p>{ link }</p>
          </div>
        ))
      }
    </nav>
  )
}