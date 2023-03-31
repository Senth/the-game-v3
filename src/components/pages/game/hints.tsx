import { GamePostRequest } from '@models/api/game'
import { Game, Hint } from '@models/quest'
import styled, { keyframes } from 'styled-components'
import React, { useRef, useState } from 'react'

const REVEAL_TIME = 2000

export default function Hints(props: { game: Game }): JSX.Element {
  const { game } = props
  let points = calculateWorth(game)

  const hints = game.quest?.hints

  return (
    <HintContainer>
      <WorthInfo>Currently worth {points}p</WorthInfo>
      <HintList>
        {hints?.map((hint, index) => (
          <Hint key={hint.text} hint={hint} index={index} />
        ))}
      </HintList>
    </HintContainer>
  )
}

function Hint(props: { hint: Hint; index: number }): JSX.Element {
  const { hint, index } = props
  const [isHolding, setIsHolding] = useState(false)
  const [isRevealing, setIsRevealing] = useState(false)
  const isHoldingRef = useRef(false)
  let holdTimer: NodeJS.Timeout

  function handleTouchStart(event: React.TouchEvent<HTMLButtonElement>) {
    event?.preventDefault()
    setIsHolding(true)
    isHoldingRef.current = true
    holdTimer = setTimeout(revealHint, REVEAL_TIME)
  }

  function handleTouchEnd() {
    setIsHolding(false)
    isHoldingRef.current = false
    clearTimeout(holdTimer)
  }

  function handleContextMenu(event: React.MouseEvent<HTMLButtonElement>) {
    event?.preventDefault()
  }

  function revealHint() {
    if (!isHoldingRef.current) {
      return
    }

    setIsRevealing(true)
    const request: GamePostRequest = {
      revealHint: index,
    }

    fetch('/api/game', {
      method: 'POST',
      body: JSON.stringify(request),
    })
  }

  return (
    <HintText>
      {hint.text || (
        <>
          {isRevealing ? (
            <Fetching>Fetching...</Fetching>
          ) : (
            <RevealButton onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd} onContextMenu={handleContextMenu}>
              {isHolding && <HoldSlider />}
              Reveal Hint <HintPoints>(-{hint.points}p)</HintPoints>
            </RevealButton>
          )}
        </>
      )}
    </HintText>
  )
}

function calculateWorth(game: Game): number {
  let points = 0

  if (game.quest) {
    points = game.quest.points

    // Decrease points for each hint
    for (const hint of game.quest.hints) {
      if (hint.text) {
        points -= hint.points
      }
    }
  }

  return points
}

const HintContainer = styled.div``

const WorthInfo = styled.h4`
  margin-top: ${(props) => props.theme.spacing.normal};
  margin-bottom: ${(props) => props.theme.spacing.normal};
`

const HintList = styled.ul`
  padding: 0;
`

const HintText = styled.li`
  list-style-type: none;
  display: flex;
  align-items: center;
  font-size: ${(props) => props.theme.font.size.small};
  margin: ${(props) => props.theme.spacing.small} 0;

  ::before {
    content: '📜';
    font-size: ${(props) => props.theme.font.size.normal};
    padding-right: ${(props) => props.theme.spacing.small};
  }
`

const slideKeyframes = keyframes`
  from {
    width: 0;
  }
  to {
    width: 100%;
  }
`

const RevealButton = styled.button`
  position: relative;
  user-select: none;
  flex-grow: 1;
`

const HintPoints = styled.span`
  color: ${(props) => props.theme.colors.text.error};
  padding-left: ${(props) => props.theme.spacing.small};
`

const HoldSlider = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  height: 100%;
  animation: ${slideKeyframes} ${REVEAL_TIME}ms linear forwards;
  border-radius: ${(props) => props.theme.spacing.small};
  background-color: ${(props) => props.theme.colors.primary};
  filter: brightness(1.5);
  z-index: -1;
`

const Fetching = styled.div`
  color: ${(props) => props.theme.colors.text.secondary};
`
