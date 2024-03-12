import React from "react"
import AdminPage from "@components/pages/Admin"
import { useSeasons, useSeasonsMutate } from "@hooks/api/seasons"
import { useRouter } from "next/router"
import { Order, Quest, QuestId, QuestTheme, Season, newSeason } from "@models/quest"
import styled from "styled-components"
import { Team } from "@models/team"
import { v4 as uuidv4 } from "uuid"
import { Select, Edit, EditInput, EditLabel, EditSelect, EditWrapper, Label, Input } from "@components/admin"

export default function SeasonPage(): JSX.Element {
  const router = useRouter()
  const seasons = useSeasons()
  const mutateSeason = useSeasonsMutate()

	if (seasons.isLoading) {
		return <AdminPage><p>Loading...</p></AdminPage>
	}
	if (seasons.error) {
		return <AdminPage><p>Error</p></AdminPage>
	}
	if (!seasons.data) {
		return <AdminPage><p>No data</p></AdminPage>
	}
	const data = seasons.data

  // Find the season
  const { id } = router.query
  const season: Season = data.find((season) => season.id === id) || newSeason()

  function onTitleChange(value: string) {
    const newSeason: Season = {
      ...season,
      title: value,
    }
    mutateSeason.update(newSeason)
  }

  function onLengthChange(value: string) {
    const newSeason: Season = {
      ...season,
      length: parseInt(value),
    }
    mutateSeason.update(newSeason)
  }

	function onOrderChange(value: string) {
		const newSeason: Season = {
			...season,
			order: value as Order,
		}
		mutateSeason.update(newSeason)
	}

  return (
    <AdminPage>
			<Edit element="h2" value={season.title} onChange={onTitleChange} />
			<EditLabel name="Length" value={season.length?.toString()} onChange={onLengthChange} />
			<EditSelect name="Order" selected={season.order} options={Object.values(Order)} onChange={onOrderChange} />
			<Themes season={season} />
			<AddSection season={season} />
			<AddTeam season={season} />
    </AdminPage>
  )
}

function Themes(props: { season: Season }): JSX.Element {
  const { season } = props
  const router = useRouter()
  const { id } = router.query

  return (
    <Section>
      <hr />
      <h3>Themes</h3>
      <table>
        <thead>
          <tr>
            <th>Theme</th>
            <th>Quest</th>
            <th>Description</th>
          </tr>
        </thead>
        <tbody>
          {season.themes.map((theme: QuestTheme, themeIndex: number) => (
            <React.Fragment key={themeIndex}>
              {theme.quests.map((quest: Quest, questIndex: number) => (
                <tr
                  key={questIndex}
                  onClick={() => {
                    router.push(`/admin/seasons/${id}/quests/${themeIndex}/${questIndex}`)
                  }}
                >
                  {questIndex === 0 && <td rowSpan={theme.quests.length}>{theme.title}</td>}
                  <td>{quest.title}</td>
                  <td>{quest.description && quest.description}</td>
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </Section>
  )
}

const Section = styled.div`
  margin-top: ${(props) => props.theme.spacing.large};
`

function AddSection(props: { season: Season }): JSX.Element {
  const { season } = props
	const themes = season.themes.map((theme) => theme.title)

  const seasonsMutate = useSeasonsMutate()
  const [themeTitle, setThemeTitle] = React.useState("")
  const [questTitle, setQuestTitle] = React.useState("")
  const [questTheme, setQuestTheme] = React.useState(themes.length > 0 ? themes[0] : "")

  function addTheme(e?: React.FormEvent<HTMLFormElement>) {
		if (e) {
			e.preventDefault()
		}
		console.log("Adding theme", themeTitle)

		const random = season.order === Order.randomAll || season.order === Order.randomTheme
    season.themes.push({ title: themeTitle, quests: [], random: random})

    seasonsMutate.update(season).then(() => {
      setThemeTitle("")
    })
  }

  function addQuest(e?: React.FormEvent<HTMLFormElement>) {
		if (e) {
			e.preventDefault()
		}

		const quest: Quest = {
			id: uuidv4() as QuestId,
			title: questTitle,
			points: 0,
			hints: [],
		}

		const themeIndex = season.themes.findIndex((theme) => theme.title === questTheme)
		if (themeIndex === -1) {
			console.error("Theme not found", questTheme)
			return
		}

    season.themes[themeIndex].quests.push(quest)

    seasonsMutate.update(season).then(() => {
      setQuestTitle("")
    })
  }


  return (
    <Section>
      <hr />
        <form onSubmit={addTheme}>
					<EditInput name="Theme" type="text" value={themeTitle} onChange={setThemeTitle} onSubmit={addTheme} />
        </form>
        {season.themes.length > 0 && (
          <>
            <form onSubmit={addQuest}>
							<EditWrapper>
								<Label htmlFor="quest">Quest</Label>
								<Select name="quest-theme" selected={questTheme} options={themes} onChange={setQuestTheme} />
								<Input name="quest-name" type="text" value={questTitle} onChange={setQuestTitle} onSubmit={addQuest} />
							</EditWrapper>
            </form>
          </>
        )}
    </Section>
  )
}

function AddTeam(props: { season: Season }): JSX.Element {
  const { season } = props

  const [name, setName] = React.useState<string>("")
  const [password, setPassword] = React.useState<string>("")

  function submit(event?: React.FormEvent<HTMLFormElement>) {
		if (event) {
			event.preventDefault()
		}

    const newTeam: Team = {
      name: name,
      password: password,
      seasonId: season.id || "",
      score: 0,
			questOrder: [],
      questIndex: 0,
			completed: false,
      hintsRevealed: 0,
    }

    console.log("New team", newTeam)

    const response = fetch("/api/admin/teams", {
      method: "POST",
      body: JSON.stringify(newTeam),
    })

    response
      .then((response) => {
        console.log("Response", response)
        if (response.ok) {
          // TODO Success message
          setName("")
          setPassword("")
        } else {
          console.error("Error adding team", response)
          // TODO Error message
        }
      })
      .catch((error) => {
        console.error("Error adding team", error)
        // TODO Error message
      })
  }

  return (
    <form onSubmit={submit}>
			<EditWrapper>
				<Label htmlFor="team">New team</Label>
				<Input type="text" name="name" placeholder="Name" value={name} onChange={setName} onSubmit={submit} />
				<Input type="text" name="password" placeholder="Password" value={password} onChange={setPassword} onSubmit={submit} />
				<button type="button" onClick={() => submit()}>Add</button>
			</EditWrapper>
    </form>
  )
}
