import { useContext, useMemo, useState } from "react"
import { type IconDefinition } from "../../types"
import { ICON_OPTIONS } from "../../utils/icons"
import { NavigationContext, NavigationActionKind } from "../../context/Navigation"
import { AiFillHome, AiOutlineSearch } from "react-icons/ai"
import { BsThreeDotsVertical } from "react-icons/bs"
import { DropMenu } from "../dropmenu/DropMenu"
import './Toolbar.css'

interface Props {
  setShowForm: React.Dispatch<React.SetStateAction<Boolean>>
  showForm: Boolean
}

const IconSection = ({ options, handleForm }: { options: IconDefinition[], handleForm: () => void }): JSX.Element => (
  <>
    { options.map((option) => (
      <div className="option" key={ option.label } onClick={handleForm}>
        { option.icon }
        <p>{ option.label }</p>
      </div>
    )) }
  </>
)

export const Toolbar: React.FC<Props> = ({ setShowForm, showForm }): JSX.Element => {
  const { option } = useContext(NavigationContext)
  const [showDropMenu, setShowDropMenu] = useState<boolean>(false)

  const { options, menuOp, end } = useMemo(() => {
    const commonOptions = ICON_OPTIONS.common
    const specialOptions = ICON_OPTIONS.special[option] || []
    const menuOptions = ICON_OPTIONS.menu[option] || []
    setShowDropMenu(false)
    
    return {
      options: [...commonOptions, ...specialOptions],
      menuOp : menuOptions,
      end: commonOptions.length
    }
  }, [ option ])

  const showMoreOptions = [
    NavigationActionKind.PAYROLLRECEIPTS,
    NavigationActionKind.EMPLOYEES,
    NavigationActionKind.PROJECTCATALOG
  ].includes(option)

  const handleForm = () => setShowForm(!showForm)

  return (
    <section className='toolbar' style={{ margin: `${ option === 1 ? '5px 0' : '0 0 5px 0' }` }}>
      <div 
        className="container" 
        style={{ 
          gridTemplateColumns: `${ showMoreOptions ? '10% auto auto': '15% auto' }`,
          width: `${ showMoreOptions ? '45%': '30%' }`
        }}
      >
        <div className='home'>
          <AiFillHome fontSize='1.25rem' color="#333" />
        </div>
        <div className='main-options'>
          <IconSection options={ showMoreOptions ? options.slice(0, end) : options } handleForm={handleForm} />
        </div>
        {showMoreOptions && (
          <div className='other-options'>
            <IconSection options={ options.slice(end) } handleForm={handleForm} />
          </div>
        )}
      </div>
      <div className='search'>
        <input type="text" placeholder="Busqueda..."></input>
        <AiOutlineSearch />
      </div>
      {
        showMoreOptions && (
          <div className="more-options">
            <BsThreeDotsVertical onClick={ () => setShowDropMenu(!showDropMenu) } />
            { showDropMenu && <DropMenu menuOp={ menuOp ?? [] } dir={ 'right' } width={ 35 } /> }
          </div>
        )
      }
    </section>
  )
}