import { useMemo, useState } from "react"
import { ICON_OPTIONS } from "../../utils/icons"
import { NavigationActionKind, useNavigationContext } from "../../context/Navigation"
import { AiOutlineSearch } from "react-icons/ai"
import { BsThreeDotsVertical } from "react-icons/bs"
import { DropMenu } from "../dropmenu/DropMenu"
import { IconSection } from "../iconSection/IconSection"
import './Toolbar.css'

interface Props {
  setSearchFilter: React.Dispatch<React.SetStateAction<string>>
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>
  setContent: React.Dispatch<React.SetStateAction<boolean>>
}

export const Toolbar: React.FC<Props> = ({ setSearchFilter, setShowForm, setContent }): JSX.Element => {
  const { option, url, submitCount, selectedId, setSubmitCount, dispatch } = useNavigationContext()
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
    NavigationActionKind.PROJECTCATALOG,
    NavigationActionKind.TABLEWORK
  ].includes(option)

  const handleChangeSearch = (e: React.ChangeEvent<HTMLInputElement>): void =>
    setSearchFilter(e.target.value)

  const handleForm = async (index: number, label: string): Promise<void> => {
    const isInvalidAction = label !== 'Nuevo' && label !== 'Editar' && label !== 'Eliminar' && label !== 'Tabla de trabajo' && label !== 'Actualizar'
    if (isInvalidAction) return

    if (label === 'Tabla de trabajo') {
      dispatch({ type: 10 })
      setContent(prev => !prev)
      return
    }

    if (label === 'Actualizar') {
      console.log('Actualizado')
      return
    }

    const isInvalidSelection = (index === 1 || index === 2) && selectedId === ''
    if (isInvalidSelection) return

    (index === 2) ? await deleteResource() : showFormAndSetToolbar(index)
  }

  const deleteResource = async (): Promise<void> => {
    if (!selectedId) return
    const requestOptions = { method: 'DELETE' }

    try {
      const res: Response = await fetch(`${url}/${selectedId}`, requestOptions)
      if (!res.ok) {
        const errorData = await res.json()
        console.error('Request error: ', errorData)
      } else
        setSubmitCount(submitCount + 1)
    } catch (error) {
      console.error('Request error: ', error)
    }
  }

  const showFormAndSetToolbar = (index: number): void => {
    setShowForm(true)
    dispatch({
      type: NavigationActionKind.UPDATETOOLBAROPT,
      payload: { toolbarOption: index }
    })
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
            options={ showMoreOptions 
              ? option !== NavigationActionKind.TABLEWORK
                ? options.slice(0, end)
                : options.slice(end)
              : options }
            handleForm={ handleForm }
          />
        </div>
        {showMoreOptions && option !== NavigationActionKind.TABLEWORK && (
          <div className='other-options'>
            <IconSection
              action={ option }
              options={ options.slice(end) }
              handleForm={ handleForm }
            />
          </div>
        )}
      </div>
      <div className='search'>
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Busqueda..."
          autoComplete='off'
          onChange={ handleChangeSearch }
        />
        <AiOutlineSearch />
      </div>
      {showMoreOptions && option !== NavigationActionKind.TABLEWORK && (
        <div className="more-options">
          <BsThreeDotsVertical onClick={ () => setShowDropMenu(!showDropMenu) } />
          { showDropMenu && <DropMenu menuOp={ menuOp ?? [] } dir={ 'right' } width={ 35 } /> }
        </div>
      )}
    </section>
  )
}