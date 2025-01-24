import { useEffect, useRef, useState } from "react"
import { useNavigationContext } from "../context/Navigation"
import { LINKS } from "../consts"

export const useGeneratePrintPage = (): Record<string, string> => {
  const { option } = useNavigationContext()
  const [htmlText, setHtmlText] = useState<string>('')
  const docName = useRef<string>('')
  
  useEffect(() => {
    const getHtmlText = async (): Promise<void> => {
      const res: Response = await fetch('/src/pages/print.html')
      const text: string = await res.text()
      setHtmlText(text)
    }

    const tableName = LINKS[option - 1] ?? 'Layout'
    docName.current = tableName.toLowerCase().split(' ').join('-')
    getHtmlText()
  }, [ option ])
  
  const getStyleSheets = (): string =>
    Array.from(document.styleSheets).map((styleSheet: CSSStyleSheet) => {
      try {
        return Array.from(styleSheet.cssRules)
          .map(rule => rule.cssText)
          .filter(cssText => (cssText.startsWith('.titlebar') || cssText.startsWith('.content') || cssText.startsWith('*')) && cssText.trim() !== '')
          .join('\n')
      } catch (error) {
        console.warn('You cannot access the CSS rules of a style sheet.')
        return ''
      }
    }).join(' ')

  const styles = `<style>${ getStyleSheets() }</style>`
  const styleHtmlTemplate = htmlText.replace('</head>', `${ styles }</head>`)
  return { styleHtmlTemplate, docName: docName.current }
}