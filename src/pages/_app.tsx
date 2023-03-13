import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import { ThemeProvider, createGlobalStyle } from 'styled-components'
import { theme } from '@styles/theme'

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Component {...pageProps} />
      </ThemeProvider>
    </>
  )
}

const GlobalStyle = createGlobalStyle`
  body {
    font-family: ${theme.font.family.body};
    margin: 0;
    padding: 0;
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.font.family.header};
  }
  input {
    background-color: ${theme.colors.background.z0};
    border: 1px solid ${theme.colors.border.input};
  }
`
