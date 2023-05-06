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
          <UploadButton className="button" htmlFor="asset-upload">
            Choose File
          </UploadButton>
          <FileInput id="asset-upload" type="file" onChange={handleFileChange} />
          <button type="submit">Upload</button>
        </form>
      )}
    </Wrapper>
  )
}

const FileInput = styled.input`
  width: 200px;
  background-color: ${(props) => props.theme.colors.background};

  &::file-selector-button {
    display: none;
  }
`

const UploadButton = styled.label`
  filter: saturate(0.5) brightness(1);

  :hover {
    filter: saturate(0.5) brightness(1.2);
  }

  :active {
    filter: saturate(0.5) brightness(0.8);
  }

  &::file-selector-button {
    display: none;
  }
`

const DeleteButton = styled.button`
  margin-left: ${(props) => props.theme.spacing.normal};
  background-color: ${(props) => props.theme.colors.danger};
`

export default EditFile
