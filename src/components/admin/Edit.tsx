import React, { useState } from 'react'

export interface EditProps {
  value?: string
  element: React.ComponentType<any> | string
  onChange: (value: string) => void
}

export default function Edit(props: EditProps): JSX.Element {
  const value = props.value || ''
  const [tempValue, setTempValue] = useState(value)

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
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

  const handleBlur = (e: React.FocusEvent<any>) => {
    if (tempValue !== e.target.innerText) {
      e.target.innerText = value
    }
  }

  return (
    <props.element
      contentEditable={true}
      suppressContentEditableWarning={true}
      onKeyDown={handleKeyDown}
      onBlur={handleBlur}
    >
      {tempValue}
    </props.element>
  )
}
