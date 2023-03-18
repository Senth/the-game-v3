import React from 'react'
import AdminPage from '@components/pages/Admin'
import styled from 'styled-components'
import { SeasonPostRequest } from '@models/api/season'

export default function Seasons(): JSX.Element {
  return (
    <AdminPage>
      <SeasonTable />
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

    const response = await fetch('/api/admin/season', {
      method: 'POST',
      body: JSON.stringify(body),
    })
    if (response.ok) {
      setSeason('')
      // TODO Success message
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

function SeasonTable(): JSX.Element {
  return <h2>Seasons</h2>
}

const Input = styled.input`
  margin-left: ${(props) => props.theme.spacing.normal};
`
