import { createGlobalStyle } from 'styled-components'
import { theme } from './theme'

export const GlobalStyle = createGlobalStyle`
  body {
    background-color: ${theme.colors.background.z0};
    font-family: ${theme.font.family.body};
    color: ${theme.colors.text.primary};
    margin: 0;
    padding: 0;
    height: 100vh;
    width: 100vw;
  }
  h1, h2, h3, h4, h5, h6 {
    font-family: ${theme.font.family.header};
    color: ${theme.colors.text.header};
  }
  input {
    padding: ${theme.spacing.small};
    font-family: ${theme.font.family.input};
    background-color: ${theme.colors.background.input};
    border: 0px solid ${theme.colors.border.input};
    border-radius: ${theme.spacing.small};
    color: ${theme.colors.text.primary};
    font-size: ${theme.font.size.body};
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
