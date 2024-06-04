import { useContext, useState } from 'react'
import { NavigationContext } from './context/Navigation'
import { Titlebar } from './components/titlebar/Titlebar'
import { Navbar } from './components/navbar/Navbar'
import { Filter } from './components/filter/Filter'
import { Toolbar } from './components/toolbar/Toolbar'
import { List } from './components/list/List'
import { Footer } from './components/footer/Footer'
import { Form } from './components/form/Form'
import './App.css'

function App(): JSX.Element {
  const { option } = useContext(NavigationContext)
  const [showForm, setShowForm] = useState<boolean>(false)

  return (
    <main className='payroll'>
      <Titlebar />
      <Navbar />
      { option === 1 && <Filter /> }
      <Toolbar setShowForm={setShowForm} showForm={showForm} />
      <List />
      <Footer />
      { showForm && <Form setShowForm={setShowForm} /> }
    </main>
  )
}

export default App