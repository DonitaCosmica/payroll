import { useEffect, useMemo, useState } from "react"
import { IDropDownMenu } from "../../types"
import './MultiDropDown.css'

interface Props {
  id: string
  options: IDropDownMenu[] | []
  value: string[]
  setFormData: React.MutableRefObject<{ [key: string]: string | number | boolean | string[] }>
}

export const MultiDropDown: React.FC<Props> = ({ id, options, value, setFormData }): JSX.Element => {  
  const [filteredOptions, setFilteredOptions] = useState<IDropDownMenu[]>([])
  const [isOptionSelected, setIsOptionSelected] = useState<boolean[]>([])
  const [selectedProjects, setSelectedProjects] = useState<IDropDownMenu[]>([])
  const [isAllOptionsSelected, setIsAllOptionsSelected] = useState<boolean>(false)
  const [showMenu, setShowMenu] = useState<boolean>(false)

  const sortedOptions = useMemo(() =>
    Array.isArray(options) ? [...options].sort((a, b) => a.name.localeCompare(b.name)) : [],
    [ options ]
  )

  useEffect(() => {
    const selected = sortedOptions.map((project: IDropDownMenu) => value.includes(project.name))
    const filteredValues = sortedOptions.filter((project: IDropDownMenu) => value.includes(project.name))
    const allSelected = selected.every(Boolean)

    setIsOptionSelected(selected)
    setSelectedProjects(filteredValues)
    setIsAllOptionsSelected(allSelected)
    setFilteredOptions(sortedOptions)
  
  }, [ sortedOptions, value ])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const filter = e.target.value.toLowerCase().trim()
    const filtered = sortedOptions.filter((opt: IDropDownMenu) => 
      opt.name.toLowerCase().includes(filter))

    setFilteredOptions(filtered)
  }

  const updateFormData = (projects: any[]): void => {
    setFormData.current[id] = projects
      .map((proj) => Object.keys(proj)
        .filter(key => key.endsWith('Id'))
        .map(idKey => proj[idKey]))
      .flat() as string[]
  }
  
  const handleSelectAllOptions = (): void => {
    const newSelectedProjects = !isAllOptionsSelected ? [...sortedOptions] : []
    const newIsOptionSelected = Array(sortedOptions.length).fill(!isAllOptionsSelected)
    
    setIsOptionSelected(newIsOptionSelected)
    setSelectedProjects(newSelectedProjects)
    setIsAllOptionsSelected(!isAllOptionsSelected)
    updateFormData(newSelectedProjects)
  }

  const handleSelectOption = (index: number): void => {
    const newSelectedProjects = [...selectedProjects]
    const newIsOptionSelected = [...isOptionSelected]

    if (newIsOptionSelected[index]) {
      const projectIndex = newSelectedProjects.findIndex(project => project.name === sortedOptions[index].name)
      newSelectedProjects.splice(projectIndex, 1)
    }
    else newSelectedProjects.push(sortedOptions[index])

    const sortedNewSelectedProjects = newSelectedProjects.sort((a, b) => a.name.localeCompare(b.name))
    newIsOptionSelected[index] = !newIsOptionSelected[index]

    setSelectedProjects(sortedNewSelectedProjects)
    setIsOptionSelected(newIsOptionSelected)
    setIsAllOptionsSelected(newIsOptionSelected.every(Boolean))
    updateFormData(sortedNewSelectedProjects)
  }

  return(
    <div className="multi-select" role="listbox" aria-labelledby="projects-label">
      <select id={ id } style={{ display: 'none' }}></select>
      <div className="multi-select-header">
        {selectedProjects.length === 0 ? (
          <span className="multi-select-header-placeholder">Selecciona Proyecto</span>
        ) : (
          <div className="multi-select-header-option-box">
            {selectedProjects.map((project: IDropDownMenu) => (
              <span key={ `values-${ project.value }-${ project.name }` } className="multi-select-header-option" aria-selected="false">{ project.name }</span>
            ))}
          </div>
        )}
        <div className="multi-select-header-box" onClick={ () => setShowMenu(!showMenu) }>
          <i className="multi-select-header-max"></i>
        </div>
      </div>
      {showMenu && (
        <div className="multi-select-options">
          <input
            id="search-option"
            name="search-option"
            type="text"
            placeholder="Buscar..."
            autoComplete="off"
            onChange={ handleSearchChange }
          />
          <div className="multi-select-all" onClick={ handleSelectAllOptions }>
            <span className={ `multi-select-option-radio ${ isAllOptionsSelected ? 'active' : '' }` }></span>
            <span className="multi-select-option-text">Seleccionar todos</span>
          </div>
          {filteredOptions.map((opt: IDropDownMenu, index: number) => (
            <div 
              key={ `option-${ index }-${ opt.value }` }
              className="multi-select-option"
              onClick={ () => handleSelectOption(index) }
            >
              <span className={ `multi-select-option-radio ${ isOptionSelected[index] ? 'active' : '' }` }></span>
              <span className="multi-select-option-text">{ opt.name }</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}