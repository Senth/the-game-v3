import React, { useState } from "react"
import styled from "styled-components"
import { useRouter } from "next/router"
import { LoginResponse, LoginTypes } from "@models/api/login"

export default function LoginPage(): JSX.Element {
  const [team, setTeam] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async () => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        body: JSON.stringify({ team, password }),
      })
      if (response.ok) {
        const loginResponse: LoginResponse = await response.json()
        if (loginResponse.type === LoginTypes.USER) {
          router.push("/admin/seasons")
        } else {
          router.push("/")
        }
      } else {
        setError("Invalid username or password")
      }
    } catch (error) {
      setError("An error occurred while logging in")
    }
  }

  const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      handleLogin()
    }
  }

  return (
    <PageContainer>
      <LoginContainer>
        <Title>Login</Title>
        {error && <ErrorMessage>{error}</ErrorMessage>}
        <HR />
        <Form>
          <InputContainer>
            <InputLabel>Team</InputLabel>
            <Input
              type="text"
              value={team}
              onChange={(event) => setTeam(event.target.value)}
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
          <LoginButton onClick={handleLogin}>Login</LoginButton>
          <RegisterButton
            onClick={() => {
              router.push("/register")
            }}
          >
            Register
          </RegisterButton>
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

const LoginButton = styled.button`
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
