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

  return (
    <main className='payroll'>
      <Titlebar action='payroll' />
      <Navbar />
      {option === 1 &&  
        <PeriodProvider>
          <Filter />
        </PeriodProvider>
      }
      <Toolbar
        setSearchFilter={ setSearchFilter }
        setShowForm={ setShowForm }
      />
      <List 
        setShowForm={ setShowForm }
        searchFilter={ searchFilter }
      />
      <Footer />
      {showForm && 
        <PeriodProvider>
          <Form setShowForm={ setShowForm } />  
        </PeriodProvider>
      }
    </main>
  )
}

export default App