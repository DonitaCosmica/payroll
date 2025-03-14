import React, { JSX, Suspense, useEffect, useState } from 'react'
import { PeriodProvider } from './context/Period'
import { SortEmployeesProvider } from './context/SortEmployees'
import { NavigationActionKind, useNavigationContext } from './context/Navigation'
import { Titlebar } from './components/titlebar/Titlebar'
import { Navbar } from './components/navbar/Navbar'
import { Form } from './components/form/Form'
import { FilterSkeleton } from './custom/filterSkeleton/FilterSkeleton'
import { ListSkeleton } from './custom/listSkeleton/ListSkeleton'
import { FooterSkeleton } from './custom/footerSkeleton/FooterSkeleton'
import './App.css'

const Filter = React.lazy(() => import('./components/filter/Filter').then(module => ({ default: module.Filter })))
const Toolbar = React.lazy(() => import('./components/toolbar/Toolbar').then(module => ({ default: module.Toolbar })))
const List = React.lazy(() => import('./components/list/List').then(module => ({ default: module.List })))
const Footer = React.lazy(() => import('./components/footer/Footer').then(module => ({ default: module.Footer })))
const UploadBanks = React.lazy(() => import('./components/uploadBanks/UploadBanks').then(module => ({ default: module.UploadBanks })))

export const App = (): JSX.Element => {
  const { option } = useNavigationContext()
  const [showForm, setShowForm] = useState<boolean>(false)
  const [searchFilter, setSearchFilter] = useState<string>('')

  useEffect(() => {
    const checkLogin = async (): Promise<void> => {
      const authUrl: string = 'http://localhost:1234/api/auth/check-login'
      const loginUrl: string = 'http://localhost:5173/login'

      try {
        const res: Response = await fetch(authUrl, {
          method: 'POST',
          credentials: 'include'
        })
        const data: { loggedIn: boolean } = await res.json()
        if (!data.loggedIn)
          window.location.href = loginUrl
      } catch (error) {
        console.error('Error Loggin: ', error)
        window.location.href = loginUrl
      }
    }

    checkLogin()
  }, [ option ])

  const renderWithSuspense = (Component: React.FC<any>, props = {}, fallback: React.ReactNode): JSX.Element => (
    <Suspense fallback={ fallback }>
      <Component { ...props } />
    </Suspense>
  )

  return (
    <main className='payroll'>
      <PeriodProvider>
        { showForm && <Form setShowForm={ setShowForm } /> }
        <Titlebar action='payroll' />
        <Navbar />
        { option === 1 && renderWithSuspense(Filter, {}, <FilterSkeleton />) }
        {option !== NavigationActionKind.BANKS ?
          (<SortEmployeesProvider>
            {renderWithSuspense(Toolbar, {
              setSearchFilter,
              setShowForm,
            }, <div>Loading Toolbar...</div>)}
            {renderWithSuspense(List, {
              searchFilter,
              setShowForm,
            }, <ListSkeleton />)}
          </SortEmployeesProvider>) : (
            renderWithSuspense(UploadBanks, {}, <div>Loading Banks...</div>)
          )}
        { option === 1 && renderWithSuspense(Footer, {}, <FooterSkeleton />) }
      </PeriodProvider>
    </main>
  )
}