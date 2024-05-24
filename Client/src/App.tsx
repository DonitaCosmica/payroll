import { useContext, useState } from 'react'
import { NavigationContext } from './context/Navigation'
import { Titlebar } from './components/titlebar/Titlebar'
import { Navbar } from './components/navbar/Navbar'
import { Filter } from './components/filter/Filter'
import { Toolbar } from './components/toolbar/Toolbar'
import { List } from './components/list/List'
import { Footer } from './components/footer/Footer'
import './App.css'
import { Form } from './components/form/Form'

function App(): JSX.Element {
  const { option } = useContext(NavigationContext)
  const [showBackGround, setShowBackGround] = useState<Boolean>(true)

  return (
    <main className='payroll'>
      <Titlebar />
      <Navbar />
      {
        option === 1 && (
          <Filter />
        )
      }
      <Toolbar />
      <List />
      <Footer />
      {
        showBackGround && (
          <Form />
        )
      }
    </main>
  )
}

export default App