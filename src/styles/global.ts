import { createGlobalStyle } from "styled-components"
import { theme } from "./theme"

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
  input, select, textarea {
    padding: ${theme.spacing.small};
    font-family: ${theme.font.family.input};
    background-color: ${theme.colors.background.input};
    border: 0px solid ${theme.colors.border.input};
    border-radius: ${theme.spacing.small};
    color: ${theme.colors.text.primary};
    font-size: ${theme.font.size.body};
  }
  select {
    min-width: 150px;
  }
  button, .button {
    color: ${theme.colors.text.primary};
    text-transform: uppercase;
    font-family: ${theme.font.family.button};
    font-weight: bold;
    font-size: ${theme.font.size.small};
    padding: ${theme.spacing.small} ${theme.spacing.normal};
    min-width: 150px;
    cursor: pointer;
    border: none;
    border-radius: ${theme.spacing.small};
    background-color: ${theme.colors.primary};
    transition: all 0.2s ease-in-out;
    &:hover {
      filter: brightness(1.2);
    }
    &:active {
      filter: brightness(0.9);
    }
  }
  hr {
    border-color: ${theme.colors.primary};
    filter: brightness(1.5);
  }
  table {
    border-collapse: collapse;
  }
  th, td {
    padding: ${theme.spacing.small};
  }
  td {
    border-top: 1px solid ${theme.colors.border.wrapper};
  }
  tbody tr:hover {
    background-color: ${theme.colors.background.z1};
    cursor: pointer;
  }
  a {
    color: ${theme.colors.primary};
    &:hover {
      filter: brightness(1.2);
    }
    &:active {
      filter: brightness(0.9);
    }
  }
  
  // Material Icons
  .material-symbols-outlined {
    font-variation-settings:
    'FILL' 0,
    'wght' 400,
    'GRAD' 0,
    'opsz' 24
  }
`
