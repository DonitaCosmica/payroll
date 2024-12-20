import React, { Suspense, useEffect, useState } from 'react'
import { PeriodProvider } from './context/Period'
import { NavigationActionKind, useNavigationContext } from './context/Navigation'
import { Titlebar } from './components/titlebar/Titlebar'
import { Navbar } from './components/navbar/Navbar'
import './App.css'

const Filter = React.lazy(() => import('./components/filter/Filter').then(module => ({ default: module.Filter })))
const Toolbar = React.lazy(() => import('./components/toolbar/Toolbar').then(module => ({ default: module.Toolbar })))
const List = React.lazy(() => import('./components/list/List').then(module => ({ default: module.List })))
const Footer = React.lazy(() => import('./components/footer/Footer').then(module => ({ default: module.Footer })))
const Form = React.lazy(() => import('./components/form/Form').then(module => ({ default: module.Form })))
const UploadBanks = React.lazy(() => import('./components/uploadBanks/UploadBanks').then(module => ({ default: module.UploadBanks })))

export const App = (): JSX.Element => {
  const { option } = useNavigationContext()
  const [showForm, setShowForm] = useState<boolean>(false)
  const [searchFilter, setSearchFilter] = useState<string>('')
  const [content, setContent] = useState<boolean>(false)
  const [updateTableWork, setUpdateTableWork] = useState<boolean>(false)
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res: Response = await fetch('', {
          method: 'GET',
          credentials: 'include'
        })
        const data: { loggedIn: boolean } = await res.json()
        setIsLoggedIn(data.loggedIn)
      } catch (error) {
        console.error('Error Loggin: ', error)
        setIsLoggedIn(false)
      }
    }

    checkLogin()
  }, [])

  const renderForm = () =>
    showForm && (
      <Suspense fallback={ <div>Loading Form...</div> }>
        <Form setShowForm={ setShowForm } />
      </Suspense>
    )
  const renderFilter = () =>
    option === 1 && (
      <Suspense fallback={ <div>Loading Filter...</div> }>
        <Filter />
      </Suspense>
    ) 
  const renderFooter = () =>
    option === 1 && (
      <Suspense fallback={ <div>Loading Footer...</div> }>
        <Footer />
      </Suspense>
    )

  return (
    <main className='payroll'>
      <PeriodProvider>
        { renderForm() }
        <Titlebar action='payroll' />
        { !content && <Navbar /> }
        { renderFilter() }
        {option !== NavigationActionKind.BANKS ?
          (<>
            <Suspense fallback={ <div>Loading Toolbar...</div> }>
              <Toolbar
                setSearchFilter={ setSearchFilter }
                setShowForm={ setShowForm }
                setContent={ setContent }
                setUpdateTableWork={ setUpdateTableWork }
              />
            </Suspense>
            <Suspense fallback={ <div>Loading List...</div> }>
              <List
                searchFilter={ searchFilter }
                updateTableWork={ updateTableWork }
                setShowForm={ setShowForm }
                setUpdateTableWork={ setUpdateTableWork }
              />
            </Suspense>
          </>) : (
            <Suspense fallback={ <div>Loading Banks...</div> }>
              <UploadBanks />
            </Suspense>
          )}
      </PeriodProvider>
      { renderFooter() }
    </main>
  )
}