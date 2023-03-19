export interface Season {
  id?: string
  start?: Date
  end?: Date
  length?: number // In Minutes
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
  displayTitle?: string
  points: number
  imageUrl?: string
  text?: string
  answer?: string
  hints: Hint[]
}

export interface Hint {
  text: string
  pointDecrease: number
}
