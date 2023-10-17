import React from 'react'
import AdminPage from '@components/pages/Admin'
import { useSeasons, useSeasonsMutate } from '@hooks/api/seasons'
import { useRouter } from 'next/router'
import { Quest, QuestTheme, Season } from '@models/quest'
import EditLabel from '@components/admin/EditLabel'
import styled from 'styled-components'
import Edit from '@components/admin/Edit'
import { Team } from '@models/team'

export default function SeasonPage(): JSX.Element {
  const router = useRouter()
  const seasons = useSeasons()
  const mutateSeason = useSeasonsMutate()

  // Find the season
  const { id } = router.query
  const season = seasons.data?.find((season) => season.id === id) || { title: '', themes: [] }
  console.log('Season', season)

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

  return (
    <AdminPage>
      {seasons.isLoading && <p>Loading...</p>}
      {seasons.error && <p>Error</p>}
      {season && (
        <>
          <Edit element="h2" value={season.title} onChange={onTitleChange} />
          <EditLabel name="Length" value={season.length?.toString()} onChange={onLengthChange} />
          <Themes season={season} />
          <AddSection season={season} />
          <AddTeam season={season} />
        </>
      )}
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
  const seasonsMutate = useSeasonsMutate()
  const [themeTitle, setThemeTitle] = React.useState('')
  const [questTitle, setQuestTitle] = React.useState('')
  const [themeIndex, setThemeIndex] = React.useState(0)

  function addTheme(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    season.themes.push({ title: themeTitle, quests: [] })

    seasonsMutate.update(season).then(() => {
      setThemeTitle('')
    })
  }

  function addQuest(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    season.themes[themeIndex].quests.push({ title: questTitle, points: 0, hints: [] })

    seasonsMutate.update(season).then(() => {
      setQuestTitle('')
    })
  }

  return (
    <Section>
      <hr />
      <p>
        <form onSubmit={addTheme}>
          <Label htmlFor="theme">Theme</Label>
          <Input type="text" id="theme" value={themeTitle} onChange={(e) => setThemeTitle(e.target.value)} />
        </form>
        {season.themes.length > 0 && (
          <>
            <form onSubmit={addQuest}>
              <Label htmlFor="quest">Quest</Label>
              <Select value={themeIndex} onChange={(e) => setThemeIndex(Number(e.target.value))}>
                {season.themes.map((theme: QuestTheme, index: number) => (
                  <option key={index} value={index}>
                    {theme.title}
                  </option>
                ))}
              </Select>
              <Input type="text" id="quest" value={questTitle} onChange={(e) => setQuestTitle(e.target.value)} />
            </form>
          </>
        )}
      </p>
    </Section>
  )
}

const Label = styled.label`
  display: inline-block;
  width: 125px;
`
const Input = styled.input`
  display: inline-block;
  margin: ${(props) => props.theme.spacing.small};
`

const Select = styled.select`
  display: inline-block;
  margin: ${(props) => props.theme.spacing.small};
`

const MultilineForm = styled.form`
  margin-left: 0px;
`

function AddTeam(props: { season: Season }): JSX.Element {
  const { season } = props

  const [name, setName] = React.useState<string>('')
  const [password, setPassword] = React.useState<string>('')

  function submit(event: React.FormEvent<HTMLFormElement>) {
    console.log('onSubmit')
    event.preventDefault()

    const newTeam: Team = {
      name: name,
      password: password,
      seasonId: season.id || '',
      score: 0,
      questIndex: 0,
      themeIndex: 0,
      hintsRevealed: 0,
    }

    console.log('New team', newTeam)

    const response = fetch('/api/admin/teams', {
      method: 'POST',
      body: JSON.stringify(newTeam),
    })

    response
      .then((response) => {
        console.log('Response', response)
        if (response.ok) {
          // TODO Success message
          setName('')
          setPassword('')
        } else {
          console.error('Error adding team', response)
          // TODO Error message
        }
      })
      .catch((error) => {
        console.error('Error adding team', error)
        // TODO Error message
      })
  }

  return (
    <p>
      <form onSubmit={submit}>
        <Label htmlFor="team">New team</Label>
        <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <Input type="text" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <Input type="submit" value="Add" />
      </form>
    </p>
  )
}
