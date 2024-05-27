export type SeasonId = string

export interface Season {
  id?: SeasonId
  start?: Date
  end?: Date
  length?: number // In Minutes
  title: string
  themes: QuestTheme[]
  order: Order
}

export function newSeason(): Season {
  return {
    title: "",
    themes: [],
    order: Order.ordered,
  }
}

export enum Order {
  ordered = "Ordered",
  randomAll = "Random All",
  randomTheme = "Random Theme",
  randomQuest = "Random Quest",
}

export interface QuestTheme {
  quests: Quest[]
  title: string
  random: boolean
}

export type QuestId = string

export interface Quest {
  id: QuestId
  title?: string
  description?: string
  displayTitle?: string
  points: number
  imageUrl?: string
  asset?: string
  content?: string
  answer?: string
	code?: string
  hints: Hint[]
}

export interface Hint {
  text?: string
  points: number
}

// The game quest that is displayed to the team
export interface Game {
  quest?: Quest
  start?: Date
  end?: Date
  score: number
  completed: boolean
}
