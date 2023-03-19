import React from 'react'
import AdminPage from '@components/pages/Admin'
import styled from 'styled-components'
import { SeasonPostRequest } from '@models/api/season'
import { useSeasons } from '@hooks/api/seasons'
import { useRouter } from 'next/router'

export default function SeasonsPage(): JSX.Element {
  return (
    <AdminPage>
      <Seasons />
      <NewSeason />
    </AdminPage>
  )
}

function NewSeason(): JSX.Element {
  const [season, setSeason] = React.useState<string>('')

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (season.length < 3) {
      // TODO Error message
      return
    }

    const body: SeasonPostRequest = {
      title: season,
    }

    const response = await fetch('/api/admin/seasons', {
      method: 'POST',
      body: JSON.stringify(body),
    })
    if (response.ok) {
      // TODO add the season to the list
      setSeason('')
    } else {
      console.log('error')
      // TODO Error message
    }
  }

  return (
    <p>
      <form onSubmit={onSubmit}>
        New Season: <Input type="text" value={season} onChange={(e) => setSeason(e.target.value)} />
      </form>
    </p>
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
                <td>{season.start ? season.start.toString() : ''}</td>
                <td>{season.end ? season.end.toString() : ''}</td>
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
