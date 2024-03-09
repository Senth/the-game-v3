import type { AppProps } from "next/app"
import { ThemeProvider } from "styled-components"
import { theme } from "@styles/theme"
import { GlobalStyle } from "@styles/global"
import { Provider } from "react-redux"
import { store } from "@redux/store"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <GlobalStyle />
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Component {...pageProps} />
        </Provider>
      </ThemeProvider>
    </>
  )
}
