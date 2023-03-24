import React, { PropsWithChildren } from 'react'
import styled from 'styled-components'
import StatsHeader from '@components/stats/stats'

export default function AdminPage(props: PropsWithChildren<{}>): JSX.Element {
  // TODO Make sure user is logged in

  return (
    <>
      <StatsHeader />
      <AdminWrapper>
        <h1>Admin</h1>
        <AdminContent>{props.children}</AdminContent>
      </AdminWrapper>
    </>
  )
}

const AdminWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin: ${(props) => props.theme.spacing.large};
`

const AdminContent = styled.div`
  flex: 1;
`
