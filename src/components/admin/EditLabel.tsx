import styled from 'styled-components'
import React, { useState } from 'react'

export interface EditLabelProps {
  name: string
  value?: string
  onChange: (value: string) => void
}

function EditLabel(props: EditLabelProps): JSX.Element {
  const value = props.value || ''
  const [tempValue, setTempValue] = useState(value)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const newValue = e.currentTarget.innerText
      props.onChange(newValue)
      setTempValue(newValue)
      e.currentTarget.blur()
    } else if (e.key === 'Escape') {
      e.currentTarget.innerText = value
      e.currentTarget.blur()
    }
  }

  const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    if (tempValue !== value) {
      e.target.innerText = value
    }
  }

  return (
    <Wrapper>
      <Label>{props.name}</Label>
      <Value contentEditable={true} suppressContentEditableWarning={true} onKeyDown={handleKeyDown} onBlur={handleBlur}>
        {tempValue}
      </Value>
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
`

const Label = styled.div`
  display: block;
  font-weight: bold;
  min-width: 150px;
`

const Value = styled.div`
  display: block;
  min-width: 200px;
  white-space: pre-wrap;
`

export default EditLabel
