import { useEffect, useRef } from "react"

export const usePrevious = (value: unknown) => {
  const ref = useRef<unknown>(null)

  useEffect(() => {
    ref.current = value
  }, [ value ])

  return { prevValue: ref.current }
}