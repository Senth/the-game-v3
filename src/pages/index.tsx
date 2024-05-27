"use client"

import { Game } from "@models/quest"
import React, { useEffect, useState } from "react"
import styled, { keyframes } from "styled-components"
import Parser from "react-html-parser"
import { GamePostRequest } from "@models/api/game"
import Stats from "@components/stats/stats"
import Hints from "@components/pages/game/hints"
import Icons from "@components/icons/material"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { nightOwl } from "react-syntax-highlighter/dist/cjs/styles/prism"

export default function GamePage(): JSX.Element {
  return (
    <div>
      <Stats />
      <GamePrepare />
    </div>
  )
}

function GamePrepare(): JSX.Element {
  const [fetched, setFetched] = useState(false)
  const [game, setGame] = useState<Game>({ completed: false, score: 0 })
  const now = new Date()

  function updateGame() {
    fetch("/api/game")
      .then((response) => {
        // User not logged in, forward to login page
        if (response.status === 401) {
          window.location.href = "/login"
        } else if (response.status !== 200) {
          throw new Error("Failed to fetch game")
        }
        return response.json()
      })
      .then((game) => {
        // Fix dates
        if (game.start) {
          game.start = new Date(game.start)
        }
        if (game.end) {
          game.end = new Date(game.end)
        }
        setGame(game)
        setFetched(true)
      })
  }

  useEffect(() => {
    const intervalId = setInterval(updateGame, 250)
    return () => {
      clearInterval(intervalId)
    }
  }, [])

  if (!fetched) {
    return <></>
  }

  // Game has not started
  if (!game.start) {
    return <Info text="Waiting for game to start" />
  }

  // Game is about to start
  if (game.start > now) {
    const startsIn = Math.round((game.start.getTime() - now.getTime()) / 1000) + 1
    return <Info text="Game starts in" value={startsIn} />
  }

  // Team has completed the game
  if (game.completed) {
    const value = `Score: ${game.score}`
    return <Info text="You have completed the game!" value={value} />
  }

  // Game has ended
  if (game.end && game.end < now) {
    const value = `Score: ${game.score}`
    return <Info text="Game has ended" value={value} />
  }

  return <GameSection game={game} />
}

function Info(props: { text: string; value?: any }): JSX.Element {
  const { text, value } = props

  return (
    <PageContainer>
      <MiddleContainer>
        <H1>{text}</H1>
        {value && <Value>{value}</Value>}
      </MiddleContainer>
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
  padding: ${(props) => props.theme.spacing.normal};
`

const MiddleContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  border-radius: ${(props) => props.theme.spacing.small};
  background-color: ${(props) => props.theme.colors.background.z1};
  padding: ${(props) => props.theme.spacing.large} ${(props) => props.theme.spacing.normal};
`

const H1 = styled.h1`
  margin: 0;
`

const Value = styled.h1`
  margin-bottom: 0;
`

function GameSection(props: { game: Game }): JSX.Element {
  const { game } = props
  const quest = game.quest

  let content: any = ""
	if (quest?.code && quest?.content) {
		content = (
			<SyntaxHighlighter style={nightOwl} language={quest.code}>{quest.content}</SyntaxHighlighter>
			)
  } else if (quest?.content) {
    content = Parser(quest.content)
  }

  return (
    <GameContainer>
      {quest?.displayTitle && <GameTitle>{quest.displayTitle}</GameTitle>}
      {quest?.imageUrl && <GameImage src={quest.imageUrl} />}
      {quest?.asset && <GameAsset asset={quest.asset} />}
      {content}
      <hr />
      <Hints game={game} />
      <hr />
      <Answer />
    </GameContainer>
  )
}

const GameContainer = styled.div`
  padding: ${(props) => props.theme.spacing.large};
`

const GameTitle = styled.h3`
  margin-top: 0;
`

const GameImage = styled.img`
  width: 100%;
`

function Answer(): JSX.Element {
  const [answer, setAnswer] = useState("")
  const [wrong, setWrong] = useState(false)
  const [correct, setCorrect] = useState(false)
  const [key, setKey] = useState(0)
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null)

  function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()

    const request: GamePostRequest = {
      answer: answer.trim(),
    }

    fetch("/api/game", {
      method: "POST",
      body: JSON.stringify(request),
    })
      .then((response) => response.json())
      .then((response) => {
        setAnswer("")
        setKey((prevKey) => prevKey + 1)
        if (timeoutId) {
          clearTimeout(timeoutId)
        }
        if (response && response.correct) {
          setCorrect(true)
          setTimeoutId(setTimeout(() => setCorrect(false), 3000))
        } else {
          setWrong(true)
          setTimeoutId(setTimeout(() => setWrong(false), 4000))
        }
      })
  }

  return (
    <AnswerContainer>
      <AnswerTitle>Answer</AnswerTitle>
      <AnswerForm onSubmit={submit}>
        <AnswerInput value={answer} onChange={(e) => setAnswer(e.target.value)} />
        <AnswerSendButton type="submit">{Icons.chevronRight}</AnswerSendButton>
      </AnswerForm>
      {wrong && <AnswerWrong key={key}>Wrong answer!</AnswerWrong>}
      {correct && <AnswerCorrect key={key}>correct answer!</AnswerCorrect>}
    </AnswerContainer>
  )
}

const AnswerContainer = styled.div``

const AnswerTitle = styled.h4`
  margin-top: ${(props) => props.theme.spacing.normal};
  margin-bottom: ${(props) => props.theme.spacing.small};
`

const AnswerForm = styled.form`
  display: flex;
  flex-direction: row;
`

const AnswerInput = styled.input`
  flex: 1 1 auto;
`

const AnswerSendButton = styled.button`
  flex: 0 0 auto;
  min-width: 50px;
  margin-left: ${(props) => props.theme.spacing.small};
`

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`

const AnswerWrong = styled.div`
  color: ${(props) => props.theme.colors.text.error};
  font-size: ${(props) => props.theme.font.size.small};
  margin-top: ${(props) => props.theme.spacing.small};

  animation: ${fadeOut} 4.2s ease-in-out;
`

const AnswerCorrect = styled.div`
  color: ${(props) => props.theme.colors.text.success};
  font-size: ${(props) => props.theme.font.size.small};
  margin-top: ${(props) => props.theme.spacing.small};

  animation: ${fadeOut} 3.2s ease-in-out;
`

function GameAsset(props: { asset: string }): JSX.Element {
  const { asset } = props
  const ext = asset.split(".").pop() || ""

  if (isImage(ext)) {
    return <GameImage src={asset} />
  }

  return <></>
}

function isImage(ext: string): boolean {
  ext = ext.toLowerCase()

  return ext === "jpg" || ext === "jpeg" || ext === "png" || ext === "gif"
}
