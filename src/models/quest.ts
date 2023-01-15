class Season {
  id: string
  date: Date
  title: string
  themes: QuestTheme[]
}


class QuestTheme {
  quests: Quest[]
  title: string
}

class Quest {
  id: string
  title: string
  description: string
  points: number
  data: string
  answer: string
  hints: Hint[]
}

class Hint {
  text: string
  pointDecrease: number
}
