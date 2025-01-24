import { useCallback, useState } from "react"

interface IFetchOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE',
  body?: any,
  headers?: HeadersInit
}

export const useFetchData = <T,>() => {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const fetchData = useCallback(async (url: string, options?: IFetchOptions): Promise<T | null> => {
    setLoading(true)
    setError(null)

    const requestOptions: RequestInit = {
      method: options?.method || 'GET',
      headers: { 'Content-Type': 'application/json', ...options?.headers },
      body: options?.body ? JSON.stringify(options.body) : undefined,
    }

    try {
      const response = await fetch(url, requestOptions)
      if (!response.ok) {
        const errorMessage = response.headers.get('content-type')?.includes('application/json')
          ? `Request failed: ${ response.status } - ${ (await response.json()).message || 'Unknown error' }`
          : `Request failed: ${ response.status }`

        setError(errorMessage)
        return null
      }

      const hasBody = response.headers.get('content-length') !== '0' 
        && response.headers.get('content-type')?.includes('application/json')

      const responseData: T | null = hasBody ? await response.json() : undefined
      return responseData
    } catch (error) {
      const errorMsg = `Network error: ${ error instanceof Error ? error.message : 'Unknown error' }`
      setError(errorMsg)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  return { loading, error, fetchData }
}