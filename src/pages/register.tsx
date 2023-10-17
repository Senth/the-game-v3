import React, { useState } from 'react'
import styled from 'styled-components'
import { useRouter } from 'next/router'

export default function RegisterPage(): JSX.Element {
  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function handleRegister() {
    // No empty fields
    if (!name || !password || !confirmPassword) {
      setError('Please fill out all fields')
      return
    }

    // Make sure the passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    fetch('/api/register', {
      method: 'POST',
      body: JSON.stringify({ name, password }),
    })
      .then((response) => {
        if (response.status === 200) {
          router.push('/login')
        } else {
          return response.json()
        }
      })
      .then((data) => {
        console.log(data)
        if (data && data.message) {
          setError(data.message)
        } else {
          setError('Something went wrong')
        }
      })
      .catch(() => {
        setError('Something went wrong')
      })
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleRegister()
    }
  }

  return (
    <PageContainer>
      <LoginContainer>
        <Title>Register</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <HR />
        <Form>
          <InputContainer>
            <InputLabel>Team</InputLabel>
            <Input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Enter your team"
            />
          </InputContainer>
          <InputContainer>
            <InputLabel>Password</InputLabel>
            <Input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Enter your password"
            />
          </InputContainer>
          <InputContainer>
            <InputLabel>Confirm Password</InputLabel>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Confirm your password"
            />
          </InputContainer>
          <RegisterButton onClick={handleRegister}>Register</RegisterButton>
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

const InputContainer = styled.div`
  display: block;
  width: 70vw;
  margin-bottom: ${(props) => props.theme.spacing.normal};
`

const InputLabel = styled.label`
  display: block;
  font-size: ${(props) => props.theme.font.size.body};
`

const Input = styled.input`
  display: block;
  width: calc(100% - ${(props) => props.theme.spacing.normal});
  margin-top: ${(props) => props.theme.spacing.tiny};
`

const RegisterButton = styled.button`
  width: 100%;
  font-weight: bold;
  background-color: ${(props) => props.theme.colors.primary};
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
