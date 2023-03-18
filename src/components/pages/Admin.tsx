import React, { PropsWithChildren } from 'react'
import styled from 'styled-components'

export default function AdminPage(props: PropsWithChildren<{}>): JSX.Element {
  return (
    <AdminWrapper>
      <h1>Admin</h1>
      <AdminContent>{props.children}</AdminContent>
    </AdminWrapper>
  )
}

const AdminWrapper = styled.div`
  display: flex;
  margin: 0 auto;
`

const AdminContent = styled.div`
  flex: 1;
`
