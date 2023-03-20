import styled from 'styled-components'
import React, { useState } from 'react'
import Edit from './Edit'

export interface EditLabelProps {
  name: string
  value?: string
  onChange: (value: string) => void
}

function EditLabel(props: EditLabelProps): JSX.Element {
  return (
    <Wrapper>
      <Label>{props.name}</Label>
      <Edit element={Value} value={props.value} onChange={props.onChange} />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  margin: ${(props) => props.theme.spacing.small} 0;
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
