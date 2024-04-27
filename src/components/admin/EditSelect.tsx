import { Label, EditWrapper } from "./Edit"

export interface EditSelectProps {
  name: string
  selected: string
  options: string[]
  onChange: (value: string) => void
}

export function Select(props: EditSelectProps): JSX.Element {
  const { selected, options, onChange } = props

  const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
    if (selected !== e.target.value) {
      onChange(e.target.value)
    }
  }

  return (
    <select value={selected} onBlur={handleBlur} onChange={(e) => onChange(e.target.value)}>
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  )
}

export function EditSelect(props: EditSelectProps): JSX.Element {
  return (
    <EditWrapper>
      <Label>{props.name}</Label>
      <Select {...props} />
    </EditWrapper>
  )
}
