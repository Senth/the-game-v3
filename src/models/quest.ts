export interface Season {
  id?: string
  date: Date
  title: string
  themes: QuestTheme[]
}

export interface QuestTheme {
  quests: Quest[]
  title: string
}

export interface Quest {
  title?: string
  description?: string
  points: number
  data: string
  answer?: string
  hints: Hint[]
}

export interface Hint {
  text: string
  pointDecrease: number
}
