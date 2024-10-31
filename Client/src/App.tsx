import { useState } from 'react'
import { PeriodProvider } from './context/Period'
import { NavigationActionKind, useNavigationContext } from './context/Navigation'
import { Titlebar } from './components/titlebar/Titlebar'
import { Navbar } from './components/navbar/Navbar'
import { Filter } from './components/filter/Filter'
import { Toolbar } from './components/toolbar/Toolbar'
import { List } from './components/list/List'
import { Footer } from './components/footer/Footer'
import { Form } from './components/form/Form'
import './App.css'
import { FilterReport } from './components/filterReport/FilterReport'

function App(): JSX.Element {
  const { option } = useNavigationContext()
  const [showForm, setShowForm] = useState<boolean>(false)
  const [searchFilter, setSearchFilter] = useState<string>('')
  const [content, setContent] = useState<boolean>(false)
  const [updateTableWork, setUpdateTableWork] = useState<boolean>(false)

  const renderForm = () => showForm && <Form setShowForm={setShowForm} />
  const renderFilter = () => option === 1 && <Filter />

  return (
    <main className='payroll'>
      <PeriodProvider>
        { renderForm() }
        <Titlebar action='payroll' />
        {option !== NavigationActionKind.BANKS &&
          <>
            { !content && <Navbar /> }
            { renderFilter() }
            <Toolbar
              setSearchFilter={ setSearchFilter }
              setShowForm={ setShowForm }
              setContent={ setContent }
              setUpdateTableWork={ setUpdateTableWork }
            />
            <List
              searchFilter={ searchFilter }
              updateTableWork={ updateTableWork }
              setShowForm={ setShowForm }
              setUpdateTableWork={ setUpdateTableWork }
            />
          </>}
      </PeriodProvider>
      <Footer />
      <FilterReport />
    </main>
  )
}

export default App