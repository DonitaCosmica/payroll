import { createContext, ReactNode } from "react"

interface Props {
  children: ReactNode
}

export const PeriodContext = createContext

export const PeriodProvider: React.FC<Props> = ({ children }) => {
  return (
    <>
      { children }
    </>
  )
}