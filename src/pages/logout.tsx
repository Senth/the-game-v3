import React, { useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'

export default function LoginPage(): JSX.Element {
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogout = async () => {
    fetch('/api/logout', {
      method: 'POST',
      body: '',
    })
      .then((response) => {
        if (response.ok) {
          router.push('/login')
        } else {
          setError('Could not log out')
        }
      })
      .catch(() => {
        setError('Something went wrong')
      })
  }

  return (
    <PageContainer>
      <LoginContainer>
        <Title>Logout</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <HR />
        <Form>
          <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
        </Form>
      </LoginContainer>
    </PageContainer>
  )
}

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${(props) => props.theme.colors.background.z0};
  color: ${(props) => props.theme.colors.text.primary};
`

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  border-radius: ${(props) => props.theme.spacing.small};
  background-color: ${(props) => props.theme.colors.background.z1};
  padding: ${(props) => props.theme.spacing.normal};
`

const Title = styled.h1`
  font-size: ${(props) => props.theme.font.size.header};
  margin-bottom: ${(props) => props.theme.spacing.medium};
`

const Form = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const LogoutButton = styled.button`
  width: 100%;
  font-weight: bold;
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.text.primary};
  font-size: ${(props) => props.theme.font.size.body};
`

const RegisterButton = styled.button`
  width: 100%;
  font-weight: bold;
  margin-top: ${(props) => props.theme.spacing.normal};
  background: none;
  border: 1px solid ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.text.primary};
  font-size: ${(props) => props.theme.font.size.body};
`

const ErrorMessage = styled.div`
  position: absolute;
  top: ${(props) => props.theme.spacing.normal};
  right: ${(props) => props.theme.spacing.normal};
  background-color: ${(props) => props.theme.colors.error};
  color: ${(props) => props.theme.colors.text.primary};
  padding: ${(props) => props.theme.spacing.small} ${(props) => props.theme.spacing.normal};
  border-radius: ${(props) => props.theme.spacing.small};
  color: ${(props) => props.theme.colors.text.error};
`

const HR = styled.hr`
  width: 100%;
  margin: ${(props) => props.theme.spacing.normal} 0;
`
