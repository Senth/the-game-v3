export interface Stats {
  start: Date
  end: Date
  totalQuests: number
  teams: TeamStat[]
}

export interface TeamStat {
  name: string
  score: number
  completed: number
}
