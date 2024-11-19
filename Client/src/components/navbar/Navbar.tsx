import { NavigationActionKind, useNavigationContext } from '../../context/Navigation'
import { LINKS } from '../../consts'
import './Navbar.css'

export const Navbar = (): JSX.Element => {
  const { dispatch, option } = useNavigationContext()

  return (
    <nav className='navbar'>
      {LINKS.map((link: string, index: number) => (
        <div 
          className={ `link ${ option === index + 1 ? 'selected' : '' }` } 
          key={ link } 
          onClick={() => {
            dispatch({ type: index + 1 })
            dispatch({
              type: NavigationActionKind.UPDATESELECTEDID,
              payload: { selectedId: '' }
            })
          }}
        >
          <p>{ link }</p>
        </div>
      ))}
    </nav>
  )
}