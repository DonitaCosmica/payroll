import { useState } from 'react'
import { PeriodProvider } from './context/Period'
import { useNavigationContext } from './context/Navigation'
import { Titlebar } from './components/titlebar/Titlebar'
import { Navbar } from './components/navbar/Navbar'
import { Filter } from './components/filter/Filter'
import { Toolbar } from './components/toolbar/Toolbar'
import { List } from './components/list/List'
import { Footer } from './components/footer/Footer'
import { Form } from './components/form/Form'
import './App.css'

function App(): JSX.Element {
  const { option } = useNavigationContext()
  const [showForm, setShowForm] = useState<boolean>(false)
  const [searchFilter, setSearchFilter] = useState<string>('')
  const [content, setContent] = useState<boolean>(false)

  const renderForm = () => showForm && <Form setShowForm={setShowForm} />
  const renderFilter = () => option === 1 && <Filter />

  return (
    <main className='payroll'>
      <PeriodProvider>
        { renderForm() }
        <Titlebar action='payroll' />
        { !content && <Navbar /> }
        { renderFilter() }
      </PeriodProvider>
      <Toolbar
        setSearchFilter={ setSearchFilter }
        setShowForm={ setShowForm }
        setContent={ setContent }
      />
      <List 
        setShowForm={ setShowForm }
        searchFilter={ searchFilter }
      />
      <Footer />
    </main>
  )
}

export default App