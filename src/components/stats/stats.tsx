import React, { useEffect } from "react"
import styled from "styled-components"
import { Stats } from "@models/stats"
import { theme } from "@styles/theme"

export default function StatsHeader(): JSX.Element {
  const [stats, setStats] = React.useState<Stats>({
    start: new Date(),
    end: new Date(),
    totalQuests: 0,
    teams: [],
  })

  function updateStats() {
    fetch("/api/stats")
      .then((response) => {
        if (response.status === 404) {
          return stats
        }
        if (response.status !== 200) {
          throw new Error("Failed to fetch stats")
        }
        return response.json()
      })
      .then((stats) => {
        // Fix dates
        if (typeof stats.start === "string") {
          stats.start = new Date(stats.start)
          stats.end = new Date(stats.end)
        }
        setStats(stats)
      })
      .catch((err) => {
        console.error(err)
      })
  }

  useEffect(() => {
    const intervalId = setInterval(updateStats, 1000)
    return () => {
      clearInterval(intervalId)
    }
  })

  useEffect(() => {
    updateStats()
  })

  if (!stats.teams?.length) {
    return <></>
  }

  const [elapsed, remaining, percentage] = calculateTime(stats.start, stats.end)

  return (
    <Wrapper>
      <LineInfo left={elapsed} percentage={percentage} right={remaining} color={theme.colors.statusbar.time} />
      {stats.teams?.map((team) => {
        const percentage = Math.round((team.completed / stats.totalQuests) * 100)
        const completed = `(${team.completed}/${stats.totalQuests})`
        return (
          <LineInfo
            key={team.name}
            left={team.name}
            center={completed}
            right={team.score.toString() + "p"}
            percentage={percentage.toString()}
          />
        )
      })}
    </Wrapper>
  )
}

function LineInfo(props: {
  left?: string
  center?: string
  right?: string
  percentage?: string
  color?: string
}): JSX.Element {
  return (
    <>
      <Line>
        <LineInner>
          <Left>{props.left}</Left>
          <Center>{props.center}</Center>
          <Right>{props.right}</Right>
        </LineInner>
        <LineBackground color={props.color} />
        <LineProgress percentage={props.percentage} color={props.color} />
      </Line>
    </>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
`

interface LineBackgroundProps {
  color?: string
}

const LineBackground = styled.div<LineBackgroundProps>`
  position: absolute;
  left: 0;
  top: 0;
  height: 1.2rem;
  width: 100%;
  background-color: ${(props) => props.color || props.theme.colors.statusbar.teams};
  z-index: -1000;
  filter: brightness(0.5);
`

interface LineProgressProps {
  percentage?: string
  color?: string
}

const LineProgress = styled.div<LineProgressProps>`
  position: absolute;
  left: 0;
  top: 0;
  width: ${(props) => props.percentage || "0"}%;
  height: 1.2rem;
  background-color: ${(props) => props.color || props.theme.colors.statusbar.teams};
  z-index: -100;
  /* &:first-child {
    background-color: ${(props) => props.theme.colors.statusbar.time};
  } */
`

const Line = styled.div`
  position: relative;
  width: 100%;
`

const LineInner = styled.div`
  padding: 0.1rem ${(props) => props.theme.spacing.small};
  display: flex;
  flex-direction: row;
  font-size: ${(props) => props.theme.font.size.small};
  z-index: 1;
  /* background-color: ${(props) => props.theme.colors.statusbar.teams}; */
  border-bottom: 1px solid ${(props) => props.theme.colors.statusbar.border};

  /* &:first-child {
    background-color: ${(props) => props.theme.colors.statusbar.time};
  } */
`

const Left = styled.div`
  flex-grow: 1;
`

const Center = styled.div`
  flex-grow: 1;
`

const Right = styled.div``

function calculateTime(start: Date, end: Date): [string, string, string] {
  const now = new Date()

  // Calculate elapsed time formatted as MM:SS
  let elapsed = "00:00"
  if (now > start && now < end) {
    const secondsElapsed = Math.round((now.getTime() - start.getTime()) / 1000)
    const minutes = Math.floor(secondsElapsed / 60)
    const seconds = secondsElapsed % 60
    elapsed = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Calculate remaining time formatted as MM:SS
  let remaining = "00:00"
  if (now < end) {
    const secondsRemaining = Math.round((end.getTime() - now.getTime()) / 1000)
    const minutes = Math.floor(secondsRemaining / 60)
    const seconds = secondsRemaining % 60
    remaining = `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
  }

  // Calculate percentage of time elapsed
  let percentage = 0
  if (now > end) {
    percentage = 100
  } else if (now > start && now < end) {
    percentage = Math.round(((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100)
  }

  return [elapsed, remaining, percentage.toString()]
}
