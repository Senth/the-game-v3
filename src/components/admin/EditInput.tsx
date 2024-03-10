import styled from "styled-components"
import { Label, EditWrapper } from "./Edit"

export interface EditInputProps {
	name: string
	type: string
	placeholder?: string
	value?: string
	onChange: (value: string) => void
	onSubmit?: () => void
}

const InputStyled = styled.input`
  display: inline-block;
`

export function Input(props: EditInputProps): JSX.Element {
  function handleKeyDown(e: React.KeyboardEvent<any>) {
    if (e.key === "Enter") {
      e.preventDefault()
			if (props.onSubmit) {
				props.onSubmit()
			}
      e.currentTarget.blur()
    } else if (e.key === "Escape") {
			props.onChange(props.value || "")
      e.currentTarget.blur()
    }
  }

	function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
		props.onChange(e.currentTarget.value)
	}

	return (
			<InputStyled
				name={props.name}
				type={props.type}
				placeholder={props.placeholder}
				value={props.value}
				onChange={handleChange}
				onKeyDown={handleKeyDown} />
	)
}

export function EditInput(props: EditInputProps): JSX.Element {
	return (
		<EditWrapper>
			<Label>{props.name}</Label>
			<Input {...props} />
		</EditWrapper>
	)
}
