import React, { useEffect } from 'react'
import AdminPage from '@components/pages/Admin'
import { useSeasons, useSeasonsMutate } from '@hooks/api/seasons'
import { useRouter } from 'next/router'
import { Quest, QuestTheme, Season } from '@models/quest'
import EditLabel from '@components/admin/EditLabel'
import styled from 'styled-components'
import seasons from '@pages/api/admin/seasons'

export default function SeasonPage(): JSX.Element {
  const router = useRouter()
  const seasons = useSeasons()
  const mutateSeason = useSeasonsMutate()

  // Find the season
  const { id } = router.query
  const season = seasons.data?.find((season) => season.id === id) || { title: '', themes: [] }
  console.log('Season', season)

  function handleTitleKeyDown(e: React.KeyboardEvent<HTMLHeadingElement>) {
    // If enter is pressed, save the title
    if (e.key === 'Enter') {
      e.preventDefault()

      const newSeason: Season = {
        ...season,
        title: e.currentTarget.innerText,
      }
      mutateSeason.update(newSeason)

      // Remove focus from the element
      e.currentTarget.blur()
    } else if (e.key === 'Escape') {
      // If escape is pressed, revert the title
      e.currentTarget.innerText = season?.title || ''
      e.currentTarget.blur()
    }
  }

  return (
    <AdminPage>
      {seasons.isLoading && <p>Loading...</p>}
      {seasons.error && <p>Error</p>}
      {season && (
        <>
          <h2 contentEditable={true} onKeyDown={handleTitleKeyDown}>
            {season.title}
          </h2>
          <EditLabel
            name="Length"
            value={season.length?.toString()}
            onChange={(value) => {
              const newSeason: Season = {
                ...season,
                length: parseInt(value),
              }
              mutateSeason.update(newSeason)
            }}
          />
          <Themes season={season} />
          <AddSection season={season} />
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
                    router.push(`/admin/seasons/${id}/quests/${themeIndex}-${questIndex}`)
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
          <form onSubmit={addQuest}>
            <Label htmlFor="quest">Quest</Label>
            <Input type="text" id="quest" value={questTitle} onChange={(e) => setQuestTitle(e.target.value)} />
            <select onChange={(e) => setThemeIndex(Number(e.target.value))}>
              {season.themes.map((theme: QuestTheme, index: number) => (
                <option key={index} value={index} selected={themeIndex === index}>
                  {theme.title}
                </option>
              ))}
            </select>
          </form>
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
