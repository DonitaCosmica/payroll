import React from "react"
import { useState } from "react"
import { useFetchData } from "./useFetchData"
import { useNavigationContext } from "../context/Navigation"
import { translateColumns } from "../utils/modifyData"

interface IData {
  message: string,
  success: boolean
}

export const useFileProcessor = () => {
  const { option } = useNavigationContext()
  const { fetchData } = useFetchData<IData>()
  const [successUpload, setSuccessUpload] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const parseCSVLine = (line: string): string[] => {
    const regex = /"(.*?)"|([^,]+)/g
    const matches = [...line.matchAll(regex)]
    return matches.map(match => (match[1] !== undefined ? match[1] : match[2] || ''))
  }

  const csvToObjectsArray = async (csvText: string): Promise<Record<string, string>[]> => {
    const lines = csvText.trim().split('\n')
    if (lines.length < 2)
      throw new Error('The CSV file does not have enough data.')

    const headers = lines[0].split(",").map(header => header.trim().replace(/"/g, ''))
    const keys = await translateColumns({ opt: option, columnsNames: headers })

    if (headers.some(header => header === ''))
      throw new Error('The headers in the CSV are invalid.')

    return lines.slice(1).map(line => {
      const values = parseCSVLine(line).filter(val => val !== '\r')
      if (values.length !== headers.length)
        throw new Error('The number of values does not match the headers.');

      return headers.reduce((obj, header, index) => {
        if (header !== keys[index])
          obj[keys[index]] = values[index]?.trim() || ''

        return obj
      }, {} as Record<string, string>)
    })
  }

  const processFile = async (file: File, url: string): Promise<void> => {
    const reader = new FileReader()
    reader.onload = async (e: ProgressEvent<FileReader>) => {
      const text = e.target?.result

      if (typeof text !== 'string') {
        console.error('Error: The file does not contain valid text.')
        setErrorMessage('Error processing the file.')
        return
      }

      const method = 'POST'
      const objectsArray = await csvToObjectsArray(text)
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

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>, url: string): void => {
      setErrorMessage(null)
      setSuccessUpload(false)
      const files = e.target.files
      if (!files || files.length === 0) {
        setErrorMessage('No file was selected.')
        return
      }
  
      processFile(files[0], url)
    }

  return { successUpload, errorMessage, handleOnChange }
}