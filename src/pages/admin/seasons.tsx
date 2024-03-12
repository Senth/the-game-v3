import React from "react"
import AdminPage from "@components/pages/Admin"
import styled from "styled-components"
import { SeasonPostRequest } from "@models/api/season"
import { useSeasons, useSeasonsMutate } from "@hooks/api/seasons"
import { useRouter } from "next/router"
import { Season } from "@models/quest"

export default function SeasonsPage(): JSX.Element {
  return (
    <AdminPage>
      <Seasons />
      <NewSeason />
    </AdminPage>
  )
}

function Seasons(): JSX.Element {
  const seasons = useSeasons()
  const router = useRouter()

  return (
    <div>
      <h2>Seasons</h2>
      {seasons.isLoading && <p>Loading...</p>}
      {seasons.error && <p>Error</p>}
      {seasons.data && (
        <SeasonsTable>
          <thead>
            <tr>
              <th>Title</th>
              <th>Length</th>
              <th>Start</th>
              <th>End</th>
              <th>Reset</th>
            </tr>
          </thead>
          <tbody>
            {seasons.data.map((season) => (
              <tr
                key={season.id}
                onClick={() => {
                  router.push(`/admin/seasons/${season.id}`)
                }}
              >
                <td>{season.title}</td>
                <td>{season.length}</td>
                <td>{season.start ? season.start.toString() : <StartButton season={season} />}</td>
                <td>{season.end ? season.end.toString() : ""}</td>
                <td>{season.start ? <ResetButton season={season} /> : ""}</td>
              </tr>
            ))}
          </tbody>
        </SeasonsTable>
      )}
    </div>
  )
}

const Input = styled.input`
  margin-left: ${(props) => props.theme.spacing.normal};
`

const SeasonsTable = styled.table``

function StartButton(prop: { season: Season }): JSX.Element {
  const { season } = prop
  const mutateSeason = useSeasonsMutate()

  function startSeason(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()

    if (!season.length) {
      console.log("No length for the season")
      // TODO Error message
      return
    }

    // Set start and end times
    const now = new Date()
    season.start = new Date(now.getTime() + 15 * 1000)

    // Add length to start time
    season.end = new Date(season.start.getTime() + season.length * 60 * 1000)

    mutateSeason.update(season)
  }

  return <button onClick={startSeason}>Start</button>
}

function ResetButton(prop: { season: Season }): JSX.Element {
  const { season } = prop
  const mutateSeason = useSeasonsMutate()

  function resetSeason(e: React.MouseEvent<HTMLButtonElement>) {
    e.stopPropagation()
    console.log("reset season")

    // Reset start and end times
    season.start = undefined
    season.end = undefined

    mutateSeason.update(season)
  }

  return <button onClick={resetSeason}>Reset</button>
}

function NewSeason(): JSX.Element {
  const [season, setSeason] = React.useState<string>("")

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (season.length < 3) {
      // TODO Error message
      return
    }

    const body: SeasonPostRequest = {
      title: season,
    }

    const response = await fetch("/api/admin/seasons", {
      method: "POST",
      body: JSON.stringify(body),
    })
    if (response.ok) {
      // TODO add the season to the list
      setSeason("")
    } else {
      console.log("error")
      // TODO Error message
    }
  }

  return (
    <form onSubmit={submit}>
      New Season:
      <Input type="text" placeholder="Season" value={season} onChange={(e) => setSeason(e.target.value)} />
    </form>
  )
}
