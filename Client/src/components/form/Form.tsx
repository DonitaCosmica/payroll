import { useEffect, useState } from 'react'
import { DropDown } from '../dropdown/DropDown'
import './Form.css'

const FIELDS: {
  
} = {
  url: {
    1: [

    ],
    2: [
      'Bank', 'Project', 'Regimen', 'Puesto', 'Departamento', 'Area Comercial',
      'Contrato', 'Entidad Federativa'
    ]
  }
}

export const Form = (): JSX.Element => {
  const [banks, setBanks] = useState([])

  useEffect(() => {
    const fetchFunc = async (): Promise<void> => {
      const res: Response = await fetch('http://localhost:5239/api/Bank')
      const data = await res.json()
      console.log(data)
      setBanks(data)
    }

    fetchFunc()
  }, [])

  return (
    <section className='background'>
      <div className='form-container'>
        <h2>Titulo</h2>
        <div className='fields-container'>
          <DropDown options={banks} selectedId='123456' />
        </div>
      </div>
    </section>
  )
}