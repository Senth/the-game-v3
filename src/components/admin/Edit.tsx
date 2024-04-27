import React from "react"
import styled from "styled-components"

export interface EditProps {
  value?: string
  element: React.ComponentType<any> | string
  onChange: (value: string) => void
}

export function Edit(props: EditProps): JSX.Element {
  const value = props.value || ""

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === "Enter") {
      e.preventDefault()
      e.currentTarget.blur()
    } else if (e.key === "Escape") {
      e.currentTarget.innerText = value
      e.currentTarget.blur()
    }
  }

  const handleBlur = (e: React.FocusEvent<any>) => {
    if (value !== e.target.innerText) {
      props.onChange(e.target.innerText)
    }
  }

  return (
    <props.element
      contentEditable={true}
      suppressContentEditableWarning={true}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      {value}
    </props.element>
  )
}

export const EditWrapper = styled.div`
  margin: ${(props) => props.theme.spacing.small} 0;
  display: flex;
  gap: ${(props) => props.theme.spacing.small};
  flex-direction: row;
`

export const Label = styled.label`
  display: flex;
  font-weight: bold;
  min-width: 150px;
  min-height: 30px;
  align-items: center;
`

export const Value = styled.div`
  display: block;
  min-width: 200px;
  white-space: pre-wrap;
`
