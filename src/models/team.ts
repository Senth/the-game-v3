export interface Team {
  name: string
  password?: string
  seasonId: string
  score: number
  themeIndex: number
  questIndex: number
  hintIndex: number
}

export interface Guess {
  teamId: string
  questId: string
  guess: string
}
