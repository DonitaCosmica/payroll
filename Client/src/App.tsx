import { Titlebar } from './components/titlebar/Titlebar'
import { Navbar } from './components/navbar/Navbar'
import { Filter } from './components/filter/Filter'
import { Toolbar } from './components/toolbar/Toolbar'
import { List } from './components/list/List'
import { Footer } from './components/footer/Footer'
import './App.css'

function App(): JSX.Element {
  return (
    <main className='payroll'>
      <Titlebar />
      <Navbar />
      <Filter />
      <Toolbar />
      <List />
      <Footer />
    </main>
  )
}

export default App