import { useContext } from 'react'
import { NavigationContext } from '../../context/Navigation'
import { LINKS } from '../../consts'
import './Navbar.css'

interface Props {
  setId: React.Dispatch<React.SetStateAction<string>>
}

export const Navbar: React.FC<Props> = ({ setId }): JSX.Element => {
  const { dispatch, option } = useContext(NavigationContext)

  return (
    <nav className='navbar'>
      {
        LINKS.map((link: string, index: number) => (
          <div 
            className={ `link ${ option === index + 1 ? 'selected' : '' }` } 
            key={ link } 
            onClick={ () => {
              dispatch({ type: index + 1 })
              setId('')
            } }
          >
            <p>{ link }</p>
          </div>
        ))
      }
    </nav>
  )
}