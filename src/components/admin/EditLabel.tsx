import React from "react"
import { Edit, Label, Value, EditWrapper } from "./Edit"

export interface EditLabelProps {
  name: string
  value?: string
  onChange: (value: string) => void
}

export function EditLabel(props: EditLabelProps): JSX.Element {
  return (
    <EditWrapper>
      <Label>{props.name}</Label>
      <Edit element={Value} value={props.value} onChange={props.onChange} />
    </EditWrapper>
  )
}
