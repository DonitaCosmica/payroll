import React, { JSX, Suspense, useMemo, useState } from "react"
import { NavigationActionKind, useNavigationContext } from "../../context/Navigation"
import { useSortEmployeesContext } from "../../context/SortEmployees"
import { DropMenu } from "../dropmenu/DropMenu"
import { AiOutlineSearch } from 'react-icons/ai'
import { ICON_OPTIONS } from "../../utils/icons"
import './Toolbar.css'

interface Props {
  setSearchFilter: React.Dispatch<React.SetStateAction<string>>
  setShowForm: React.Dispatch<React.SetStateAction<boolean>>
}

const BsThreeDotsVertical = React.lazy(() => import('react-icons/bs').then(module => ({ default: module.BsThreeDotsVertical })))
const IconSection = React.lazy(() => import('../iconSection/IconSection').then(module => ({ default: module.IconSection })))
const GrSort = React.lazy(() => import('react-icons/gr').then(module => ({ default: module.GrSort })))

export const Toolbar: React.FC<Props> = ({ setSearchFilter, setShowForm }): JSX.Element => {
  const { option, url, submitCount, selectedId, setSubmitCount, dispatch } = useNavigationContext()
  const { label } = useSortEmployeesContext()
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

  const handleForm = async (id: string, index: number): Promise<void> => {
    if (!id.includes('basic') && id !== 'table') return

    if (id === 'table') {
      dispatch({ type: 11 })
      return
    }

    if ((!id.includes('basic')) && selectedId === '') return
    id.includes('delete') ? await deleteResource() : showFormAndSetToolbar(index)
  }

  const deleteResource = async (): Promise<void> => {
    if (!selectedId) return
    const requestOptions = { method: 'DELETE' }

    try {
      const res: Response = await fetch(`${ url }/${ selectedId }`, requestOptions)
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
          gridTemplateColumns: `${ options.slice(end).length > 0 ? 'auto auto': 'auto' }`,
          width: `${ options.slice(end).length > 0 ? 'auto' : '20%' }`
        }}
      >
        <div className='main-options'>
          <Suspense fallback={ <div>Loading icons...</div> }>
            <IconSection
              token={ 1 }
              options={option !== NavigationActionKind.TABLEWORK
                ? options.slice(0, end)
                : options.slice(end)}
              action={ option }
              handleForm={ handleForm }
            />
          </Suspense>
        </div>
        {options.slice(end).length > 0 && option !== NavigationActionKind.TABLEWORK && (
          <div className='other-options'>
            <Suspense fallback={ <div>Loading icons...</div> }>
              <IconSection
                token={ 2 }
                action={ option }
                options={ options.slice(end) }
                handleForm={ handleForm }
              />
            </Suspense>
          </div>
        )}
      </div>
      {option !== NavigationActionKind.TABLEWORK &&
        <div className='search'>
          <input
            type="text"
            name="search"
            id="search"
            placeholder="Busqueda..."
            autoComplete='off'
            onChange={ (e) => setSearchFilter(e.target.value) }
          />
          <AiOutlineSearch />
        </div>}
      {option === NavigationActionKind.EMPLOYEES && 
        <div className="container">
          <div className="sorting-employees">
            <Suspense fallback={ <div>Loading icons...</div> }>
              <IconSection
                token={ 3 }
                action={ option }
                options={ [{ id: 'filter', icon: <GrSort />, label: label }] }
                handleForm={ handleForm }
              />
            </Suspense>
          </div>
        </div>}
      {![NavigationActionKind.TABLEWORK, NavigationActionKind.COMPANIES, NavigationActionKind.BANKS].includes(option) && (
        <div className="more-options">
          <Suspense fallback={ <div>Loading dots...</div> }>
            <BsThreeDotsVertical onClick={ () => setShowDropMenu(!showDropMenu) } />
          </Suspense>
          { showDropMenu && <DropMenu menuOp={ menuOp ?? [] } dir={ 'right' } context="doc" /> }
        </div>
      )}
    </section>
  )
}