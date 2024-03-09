import React, { useState } from "react"
import styled from "styled-components"

export interface EditProps {
  value?: string
  onChange: (value: string) => void
}

export default function EditArea(props: EditProps): JSX.Element {
  const value = props.value || ""
  const [tempValue, setTempValue] = useState(value)

  function handleKeyDown(e: React.KeyboardEvent<any>) {
    if (e.key === "Escape") {
      setTempValue(value)
      e.currentTarget.blur()
    }
  }

  const handleBlur = (e: React.FocusEvent<any>) => {
    props.onChange(tempValue)
  }

  return (
    <TextArea
      onChange={(e) => {
        setTempValue(e.currentTarget.value)
      }}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
      value={tempValue}
    />
  )
}

const TextArea = styled.textarea`
  width: 100%;
  height: 200px;
`
