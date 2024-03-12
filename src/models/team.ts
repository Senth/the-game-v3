import { QuestId, SeasonId } from "./quest"

export type TeamId = string

export interface Team {
  name: string
  password?: string
  seasonId: SeasonId
  score: number
  questOrder: QuestId[]
  questIndex: number
  completed: boolean
  hintsRevealed: number
}

export interface Guess {
  teamId: TeamId
  questId: QuestId
  guess: string
}

export const teamHelper = {
  revealHint(team: Team, hintIndex: number): void {
    team.hintsRevealed |= 1 << hintIndex
  },

  isHintRevealed(team: Team, hintIndex: number): boolean {
    return (team.hintsRevealed & (1 << hintIndex)) !== 0
  },
}
