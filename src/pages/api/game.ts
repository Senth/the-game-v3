import { withTeam } from "@utils/session"
import { NextApiRequest, NextApiResponse } from "next"
import seasonRepo from "@repo/season"
import teamRepo from "@repo/team"
import { Season, Quest, Game, Order, QuestTheme } from "@models/quest"
import { Team, teamHelper } from "@models/team"
import { AnswerResponse, GamePostRequest } from "@models/api/game"

export default withTeam(async function handler(req, res) {
  const { method } = req
  switch (method) {
    case "GET":
      return get(req, res)
    case "POST":
      return post(req, res)
    default:
      return res.status(405).json({ message: "Method not allowed" })
  }
})

async function get(req: NextApiRequest, res: NextApiResponse) {
  let team = req.session.team
  if (!team) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  // Get the current team information from the database
  team = (await teamRepo.getTeam(team.name)) as Team

  // Team has not been added to a season yet
  if (!team.seasonId) {
    const activeSeason = await getActiveSeason()
    if (!activeSeason) {
      return res.status(200).json({})
    }

    // Found active season, add team to it
    team.seasonId = activeSeason.id!
    teamRepo.update(team)
  }

  // Get the season for the team
  return seasonRepo.get(team.seasonId).then((season) => {
    // Check and make sure the season exists
    if (!season) {
      return res.status(404).json({ message: "Season not found" })
    }
    if (!team) {
      return res.status(404).json({ message: "Team not found" })
    }

    // Initialize the quest order
    if (team.questOrder.length === 0) {
      initializeQuestOrder(season, team)
      teamRepo.update(team)
    }

    const response: Game = {
      start: season.start,
      end: season.end,
      score: team.score,
      completed: team.completed,
    }

    if (team.completed) {
      return res.status(200).json(response)
    }

    // Skip getting the current quest
    if (!hasSeasonStarted(season)) {
      return res.status(200).json(response)
    }

    // Get the current quest
    const quest = getCurrentQuest(season, team, true)
    if (quest) {
      response.quest = quest
    }

    return res.status(200).json(response)
  })
}

async function getActiveSeason(): Promise<Season | undefined> {
  // Get all seasons
  return seasonRepo
    .getAll()
    .then((seasons) => {
      if (!seasons) {
        return []
      }
      return seasons
    })
    .then((seasons) => {
      for (const season of seasons) {
        if (!season.start || !season.end) {
          continue
        }

        // Check if it will start within the next minute and is still running
        if (season.start.getTime() < Date.now() + 60000 && season.end.getTime() > Date.now()) {
          return season
        }
      }
    })
}

function hasSeasonStarted(season: Season): boolean {
  if (!season.start) {
    return false
  }

  return season.start.getTime() < Date.now()
}

function getCurrentQuest(season: Season, team: Team, filter: boolean): Quest | undefined {
  const questId = team.questOrder[team.questIndex]
  // console.log(questId)

  let quest: Quest | undefined
  for (const theme of season.themes) {
    for (const q of theme.quests) {
      if (q.id === questId) {
        quest = q
        break
      }
    }
  }
  if (!quest) {
    return undefined
  }

  // Strip out answers and valuable information
  if (filter) {
    delete quest.title
    delete quest.description
    delete quest.answer

    // Strip out hint texts they haven't been unlocked yet
    for (let i = 0; i < quest.hints.length; i++) {
      if (!teamHelper.isHintRevealed(team, i)) {
        delete quest.hints[i].text
      }
    }
  }

  return quest
}

function initializeQuestOrder(season: Season, team: Team) {
  // Randomize the theme order?
  const themes: QuestTheme[] = [...season.themes]
  if (season.order === Order.randomAll || season.order === Order.randomTheme) {
    themes.sort(() => Math.random() - 0.5)
  }

  // Randomize the quest order?
  for (let theme of themes) {
    const quests: Quest[] = [...theme.quests]
    if (theme.random) {
      quests.sort(() => Math.random() - 0.5)
    }

    for (let quest of quests) {
      team.questOrder.push(quest.id)
    }
  }
}

async function post(req: NextApiRequest, res: NextApiResponse) {
  if (!req.body) {
    return res.status(400).json({ message: "Missing request body" })
  }

  let team = req.session.team
  if (!team) {
    return res.status(401).json({ message: "Unauthorized" })
  }

  // Get the current team information from the database
  team = (await teamRepo.getTeam(team.name)) as Team

  // Get the season for the team
  return seasonRepo
    .get(team.seasonId)
    .then((season) => {
      // Check and make sure the season exists
      if (!season) {
        return res.status(404).json({ message: "Season not found" })
      }
      if (!team) {
        return res.status(404).json({ message: "Team not found" })
      }

      const quest = getCurrentQuest(season, team, false)
      if (!quest) {
        return res.status(404).json({ message: "Quest not found" })
      }

      const request = JSON.parse(req.body) as GamePostRequest

      if (request.answer) {
        return checkAnswer(request, res, team, season, quest)
      } else if (request.revealHint !== undefined && request.revealHint !== null) {
        return revealHint(request, res, team, quest)
      } else {
        return res.status(400).json({ message: "Invalid request body" })
      }
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({ message: "Internal server error" })
    })
}

async function checkAnswer(req: GamePostRequest, res: NextApiResponse, team: Team, season: Season, quest: Quest) {
  console.log(req, quest.answer)

  // Check if the answer is correct
  if (req.answer?.toLowerCase() !== quest.answer?.toLowerCase()) {
    const body: AnswerResponse = { correct: false }
    return res.status(200).json(body)
  }

  const response: AnswerResponse = {
    correct: true,
  }
  res.status(200).json(response)

  // Check how many hints they have revealed
  let hintPoints = 0
  for (let i = 0; i <= quest.hints.length; i++) {
    // Skip hints that haven't been revealed
    if (!teamHelper.isHintRevealed(team, i)) {
      continue
    }

    const points = quest.hints[i].points
    if (points) {
      hintPoints += quest.hints[i].points
    }
  }

  // Update the team score
  team.score = team.score + quest.points - hintPoints
  team.hintsRevealed = 0

  // Move to the next quest
  team.questIndex++
  if (team.questIndex >= team.questOrder.length) {
    team.questIndex = 0
    team.completed = true
  }
  await teamRepo.update(team)

  return
}

async function revealHint(req: GamePostRequest, res: NextApiResponse, team: Team, quest: Quest) {
  // Check if the hint index is valid
  if (req.revealHint === undefined || req.revealHint >= quest.hints.length) {
    return res.status(400).json({ message: "Invalid hint index" })
  }

  res.status(200).json({})

  // Unlock the next hint
  teamHelper.revealHint(team, req.revealHint)

  await teamRepo.update(team)
}
