import { createGlobalStyle } from 'styled-components'
import { theme } from './theme'

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${theme.colors.background.z0};
    font-family: ${theme.font.family.body};
    margin: 0;
    padding: 0;
    height: 100vh;
    width: 100vw;
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.font.family.header};
  }
  input {
    font-family: ${theme.font.family.input};
    background-color: ${theme.colors.background.input};
    border: 0px solid ${theme.colors.border.input};
  }
  button {
    text-transform: uppercase;
    font-family: ${theme.font.family.button};
  }
  hr {
    border-color: ${theme.colors.primary};
    filter: brightness(1.5);
  }
`
