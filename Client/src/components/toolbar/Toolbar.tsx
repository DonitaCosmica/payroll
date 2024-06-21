import { useContext, useMemo, useState } from "react"
import { type IconDefinition } from "../../types"
import { ICON_OPTIONS } from "../../utils/icons"
import { NavigationContext, NavigationActionKind } from "../../context/Navigation"
import { AiOutlineSearch } from "react-icons/ai"
import { BsThreeDotsVertical } from "react-icons/bs"
import { DropMenu } from "../dropmenu/DropMenu"
import './Toolbar.css'

interface Props {
  selectedId: string
  setToolbarOption: React.Dispatch<React.SetStateAction<number>>
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>
}

const IconSection = ({ options, handleForm }: { options: IconDefinition[], handleForm: (index: number) => void }): JSX.Element => (
  <>
    { options.map((option: IconDefinition, index: number) => (
      <div className="option" key={ option.label } onClick={() => handleForm(index)}>
        { option.icon }
        <p>{ option.label }</p>
      </div>
    )) }
  </>
)

export const Toolbar: React.FC<Props> = ({ selectedId, setToolbarOption, setShowForm }): JSX.Element => {
  const { option, url } = useContext(NavigationContext)
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

  const handleForm = async (index: number): Promise<void> => {
    const isInvalidSelection = (index === 1 || index === 2) && selectedId === ''
    if (isInvalidSelection) return


    (index === 2) ? await deleteResource() : showFormAndSetToolbar(index)
  }

  const deleteResource = async (): Promise<void> => {
    const requestOptions: { method: string } = {
      method: 'DELETE'
    }
    
    await fetch(`${url}/${selectedId}`, requestOptions)
  }

  const showFormAndSetToolbar = (index: number): void => {
    setShowForm(true)
    setToolbarOption(index)
  }

  return (
    <section className='toolbar' style={{ margin: `${ option === 1 ? '5px 0' : '0 0 5px 0' }` }}>
      <div 
        className="container" 
        style={{ 
          gridTemplateColumns: `${ showMoreOptions ? 'auto auto': 'auto' }`,
          width: `${ showMoreOptions ? '45%': '30%' }`
        }}
      >
        <div className='main-options'>
          <IconSection 
            options={ showMoreOptions ? options.slice(0, end) : options }
            handleForm={ handleForm } 
          />
        </div>
        {showMoreOptions && (
          <div className='other-options'>
            <IconSection 
              options={ options.slice(end) }
              handleForm={ handleForm } 
            />
          </div>
        )}
      </div>
      <div className='search'>
        <input type="text" placeholder="Busqueda..." autoComplete='off'></input>
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