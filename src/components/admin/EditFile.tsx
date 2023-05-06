import React from 'react'
import { Wrapper, Label, Value } from './EditLabel'
import styled from 'styled-components'

export interface EditFileProps {
  name: string
  value?: string
  onSubmit: (file: File) => void
  onDelete?: () => void
}

function EditFile(props: EditFileProps): JSX.Element {
  const [file, setFile] = React.useState<File | null>(null)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    if (file) {
      props.onSubmit(file)
    }
    e.preventDefault()
  }

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      setFile(file)
    }
  }

  let shortValue = ''
  if (props.value) {
    const parts = props.value.split('/')
    shortValue = parts[parts.length - 1]
  }

  return (
    <Wrapper>
      <Label>{props.name}</Label>
      {props.value ? (
        <Value>
          <a href={props.value}>{shortValue}</a>
          <DeleteButton onClick={props.onDelete}>Delete</DeleteButton>
        </Value>
      ) : (
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} />
          <button type="submit">Upload</button>
        </form>
      )}
    </Wrapper>
  )
}

const DeleteButton = styled.button`
  margin-left: ${(props) => props.theme.spacing.normal};
  background-color: ${(props) => props.theme.colors.danger};
`

export default EditFile
