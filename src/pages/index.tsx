import { Game } from '@models/quest'
import React, { ReactNode, useEffect } from 'react'
import styled from 'styled-components'

export default function GamePage(): JSX.Element {
  return (
    <div>
      <GameSection />
    </div>
  )
}

function GameSection(): JSX.Element {
  const [fetched, setFetched] = React.useState(false)
  const [game, setGame] = React.useState<Game>({ completed: false, score: 0 })
  const now = new Date()

  function updateGame() {
    fetch('/api/game')
      .then((response) => response.json())
      .then((game) => {
        // Fix dates
        if (game.start) {
          game.start = new Date(game.start)
        }
        if (game.end) {
          game.end = new Date(game.end)
        }
        setGame(game)
        console.log(game.completed)
        setFetched(true)
      })
  }

  useEffect(() => {
    const intervalId = setInterval(updateGame, 1000)
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

  return <div></div>
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
