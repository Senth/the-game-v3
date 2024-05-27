import React, {useEffect, useState} from "react"

export default class Icons {

  static readonly chevronRight = (<Icon icon="chevron_right" />)
}

function Icon(props: { icon: string }) {
	const [fontLoaded, setFontLoaded] = useState(false);

	useEffect(() => {
		document.fonts.load("1em Material Symbols Outlined").then(() => {
			setFontLoaded(true)
		})
	}, [])

	if (!fontLoaded) {
		return <i></i>
	}
	
	return <i className="material-symbols-outlined">{props.icon}</i>
}
