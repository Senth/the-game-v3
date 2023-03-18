import React from 'react'
import AdminPage from '@components/pages/Admin'

export default function Seasons(): JSX.Element {
  return (
    <AdminPage>
      <SeasonTable />
    </AdminPage>
  )
}

function SeasonTable(): JSX.Element {
  return <h2>Seasons</h2>
}
