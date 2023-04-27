import React from 'react'
import { Wrapper, Label, Value } from './EditLabel'

export interface EditFileProps {
  name: string
  value?: string
  onSubmit: (file: File) => void
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

  return (
    <Wrapper>
      <Label>{props.name}</Label>
      {props.value ? (
        <Value>{props.value}</Value>
      ) : (
        <form onSubmit={handleSubmit}>
          <input type="file" onChange={handleFileChange} />
          <button type="submit">Upload</button>
        </form>
      )}
    </Wrapper>
  )
}

export default EditFile
