import React, { JSX, useState } from "react"
import { useFetchData } from "../../hooks/useFetchData"
import { FaCircleCheck } from "react-icons/fa6"
import { IoCloudUploadOutline } from "react-icons/io5"
import './UploadBanks.css'

interface IData {
  message: string,
  success: boolean
}

export const UploadBanks = (): JSX.Element => {
  const { fetchData } = useFetchData<IData>()
  const [successUpload, setSuccessUpload] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const csvToObjectsArray = (csvText: string): Record<string, string>[] => {
    const lines = csvText.trim().split('\n')
    if (lines.length < 2)
      throw new Error('The CSV file does not have enough data.')

    const headers = lines[0].split(",").map(header => header.trim())
    if (headers.some(header => header === ''))
      throw new Error('The headers in the CSV are invalid.')

    return lines.slice(1).map(line => {
      const values = line.split(",")
      if (values.length !== headers.length)
        throw new Error('The number of values does not match the headers.');

      return headers.reduce((obj, header, index) => {
        obj[header] = values[index]?.trim() || ''
        return obj
      }, {} as Record<string, string>)
    })
  }

  const processFile = async (file: File): Promise<void> => {
    const reader = new FileReader()
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      const text = e.target?.result

      if (typeof text !== 'string') {
        console.error('Error: The file does not contain valid text.')
        setErrorMessage('Error processing the file.')
        return
      }

      const url: string = 'http://localhost:5239/api/Bank/csv'
      const method = 'POST'
      const objectsArray = csvToObjectsArray(text)
      const result = await fetchData(url, { method, body: objectsArray })
      if (!result) return

      setSuccessUpload(result.success)
      if (!result.success) setErrorMessage(result.message || 'Unknown error on the server.')
    }

    reader.onerror = () => {
      console.error('Error reading the file.')
      setErrorMessage('The file could not be read.')
    }

    reader.readAsText(file)
  }

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setErrorMessage(null)
    setSuccessUpload(false)
    const files = e.target.files
    if (!files || files.length === 0) {
      setErrorMessage('No file was selected.')
      return
    }

    processFile(files[0])
  }

  return (
    <section className="upload-container">
      <div className="upload-items">
        {successUpload ? (
          <FaCircleCheck color="#73ba69" />
        ) : (
          <IoCloudUploadOutline color="#848484a5" />
        )}
        <h1 style={{ color: successUpload ? '#73ba69' : '#848484a5' }}>
          { successUpload ? 'Archivo subido con éxito' : 'Subir Archivo .CSV' }
        </h1>
        { errorMessage && <p className="error-message">{ errorMessage }</p> }
      </div>
      <input
        id="file-banks"
        name="file-banks"
        type="file"
        accept=".csv"
        onChange={ (e) => handleOnChange(e) }
      />
    </section>
  )
}