export interface Team {
  name: string
  password?: string
  seasonId: string
  score: number
  themeIndex: number
  questIndex: number
  hintsRevealed: number
}

export interface Guess {
  teamId: string
  questId: string
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
