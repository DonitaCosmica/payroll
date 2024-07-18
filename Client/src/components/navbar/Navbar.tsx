import { useContext } from 'react'
import { NavigationContext } from '../../context/Navigation'
import { LINKS } from '../../consts'
import './Navbar.css'

export const Navbar = (): JSX.Element => {
  const { dispatch, option } = useContext(NavigationContext)

  return (
    <nav className='navbar'>
      {
        LINKS.map((link: string, index: number) => (
          <div 
            className={ `link ${ option === index + 1 ? 'selected' : '' }` } 
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