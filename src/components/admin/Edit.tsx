import React from 'react'

export interface EditProps {
  value?: string
  element: React.ComponentType<any> | string
  onChange: (value: string) => void
}

export default function Edit(props: EditProps): JSX.Element {
  const value = props.value || ''

  const handleKeyDown = (e: React.KeyboardEvent<any>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      e.currentTarget.blur()
    } else if (e.key === 'Escape') {
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
