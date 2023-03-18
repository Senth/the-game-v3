import React, { PropsWithChildren } from 'react'
import styled from 'styled-components'

export default function AdminPage(props: PropsWithChildren<{}>): JSX.Element {
  // TODO Make sure user is logged in

  return (
    <AdminWrapper>
      <h1>Admin</h1>
      <AdminContent>{props.children}</AdminContent>
    </AdminWrapper>
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
