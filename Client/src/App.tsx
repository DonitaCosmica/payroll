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
  const [toolbarOption, setToolbarOption] = useState<number>(-1)
  const [id, setId] = useState<string>('')

  return (
    <main className='payroll'>
      <Titlebar />
      <Navbar />
      { option === 1 && <Filter /> }
      <Toolbar
        selectedId={ id }
        setToolbarOption={ setToolbarOption }
        setShowForm={ setShowForm }
      />
      <List 
        setId={ setId }
        setShowForm={ setShowForm }
        setToolbarOption={ setToolbarOption }
      />
      <Footer />
      {showForm && 
        <Form 
          setShowForm={ setShowForm }
          toolbarOption={ toolbarOption }
          idSelected={ id }
        />}
    </main>
  )
}

export default App