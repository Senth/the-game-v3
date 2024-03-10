import React, { useState } from "react"
import styled from "styled-components"

export interface TextAreaProps {
  value?: string
  onChange: (value: string) => void
}

export function TextArea(props: TextAreaProps): JSX.Element {
  const value = props.value || ""
  const [tempValue, setTempValue] = useState(value)

  function handleKeyDown(e: React.KeyboardEvent<any>) {
    if (e.key === "Escape") {
      setTempValue(value)
      e.currentTarget.blur()
    }
  }

  const handleBlur = (_: React.FocusEvent<any>) => {
    props.onChange(tempValue)
  }

  return (
    <TextAreaStyled
      onChange={(e) => {
        setTempValue(e.currentTarget.value)
      }}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      value={tempValue}
    />
  )
}

const TextAreaStyled = styled.textarea`
  width: 100%;
  height: 200px;
`
