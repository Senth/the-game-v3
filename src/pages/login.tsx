import React, { useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'

export default function LoginPage(): JSX.Element {
  const [teamname, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async () => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ username: teamname, password }),
      })
      if (response.ok) {
        router.push('/game')
      } else {
        setError('Invalid username or password')
      }
    } catch (error) {
      setError('An error occurred while logging in')
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleLogin()
    }
  }

  return (
    <PageContainer>
      <LoginContainer>
        <Title>Login</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <Form>
          <InputContainer>
            <InputLabel>Team</InputLabel>
            <Input
              type="text"
              value={teamname}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter your username"
            />
          </InputContainer>
          <InputContainer>
            <InputLabel>Password</InputLabel>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your password"
            />
          </InputContainer>
          <Button onClick={handleLogin}>Login</Button>
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
  border: 1px solid ${(props) => props.theme.colors.border.wrapper};
  border-radius: ${(props) => props.theme.spacing.small};
  background-color: ${(props) => props.theme.colors.background.z1};
  padding: ${(props) => props.theme.spacing.normal};
`

const Title = styled.h1`
  font-size: ${(props) => props.theme.font.size.header};
  margin-bottom: ${(props) => props.theme.spacing.large};
`

const Form = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const InputContainer = styled.div`
  width: 100%;
  margin-bottom: ${(props) => props.theme.spacing.normal};
`

const InputLabel = styled.label`
  font-size: ${(props) => props.theme.font.size.body};
  margin-bottom: ${(props) => props.theme.spacing.small};
`

const Input = styled.input`
  width: 100%;
  padding: ${(props) => props.theme.spacing.small};
  border-radius: ${(props) => props.theme.spacing.small};
  color: ${(props) => props.theme.colors.text.primary};
  font-size: ${(props) => props.theme.font.size.body};
`

const Button = styled.button`
  padding: ${(props) => props.theme.spacing.small} ${(props) => props.theme.spacing.normal};
  border-radius: ${(props) => props.theme.spacing.small};
  border: none;
  background-color: ${(props) => props.theme.colors.primary};
  color: ${(props) => props.theme.colors.text.primary};
  font-size: ${(props) => props.theme.font.size.body};
  cursor: pointer;
`

const ErrorMessage = styled.div`
  position: absolute;
  top: ${(props) => props.theme.spacing.normal};
  right: ${(props) => props.theme.spacing.normal};
  background-color: ${(props) => props.theme.colors.error};
  color: ${(props) => props.theme.colors.text.primary};
  padding: ${(props) => props.theme.spacing.small} ${(props) => props.theme.spacing.normal};
  border-radius: ${(props) => props.theme.spacing.small};
`
