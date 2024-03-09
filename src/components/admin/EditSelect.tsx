import { Label, Wrapper } from "./EditLabel"

export interface EditSelectProps {
	name: string
	selected: string
	options: string[]
	onChange: (value: string) => void
}

export default function EditSelect(props: EditSelectProps): JSX.Element {
	const { selected, options, onChange } = props

	const handleBlur = (e: React.FocusEvent<HTMLSelectElement>) => {
		if (selected !== e.target.value) {
			onChange(e.target.value)
		}
	}

	return (
		<Wrapper>
			<Label>{props.name}</Label>
			<select value={selected} onBlur={handleBlur} onChange={(e) => onChange(e.target.value)}>
				{options.map((option) => (
					<option key={option} value={option}>
						{option}
					</option>
				))}
			</select>
		</Wrapper>
	)
}
