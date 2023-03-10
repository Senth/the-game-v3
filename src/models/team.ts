export interface Team {
  id: string
  name: string
  password: string
  seasonId: string
  themeIndex: number
  questIndex: number
}

export interface Guess {
  teamId: string
  questId: string
  guess: string
}
