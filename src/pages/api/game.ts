import { withTeam } from '@utils/session'
import { NextApiRequest, NextApiResponse } from 'next'
import seasonRepo from '@repo/season'
import teamRepo from '@repo/team'
import { Season, Quest, Game } from '@models/quest'
import { Team } from '@models/team'

export default withTeam(async function handler(req, res) {
  const { method } = req
  switch (method) {
    case 'GET':
      return get(req, res)
    case 'POST':
      return post(req, res)
    default:
      return res.status(405).json({ message: 'Method not allowed' })
  }
})

async function get(req: NextApiRequest, res: NextApiResponse) {
  let team = req.session.team
  if (!team) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  // Get the current team information from the database
  team = (await teamRepo.getTeam(team.name)) as Team

  // Get the season for the team
  return seasonRepo.get(team.seasonId).then((season) => {
    // Check and make sure the season exists
    if (!season) {
      return res.status(404).json({ message: 'Season not found' })
    }
    if (!team) {
      return res.status(404).json({ message: 'Team not found' })
    }

    const response: Game = {
      start: season.start,
      end: season.end,
      score: team.score,
      completed: false,
    }

    // Skip getting the current quest
    if (!hasSeasonStarted(season)) {
      return res.status(200).json(response)
    }

    // Get the current quest
    const quest = getCurrentQuest(season, team)
    if (quest) {
      response.quest = quest
    } else {
      response.completed = true
    }

    return res.status(200).json(response)
  })
}

async function post(req: NextApiRequest, res: NextApiResponse) {
  if (!req.body) {
    return res.status(400).json({ message: 'Missing request body' })
  }
}

function hasSeasonStarted(season: Season): boolean {
  if (!season.start) {
    return false
  }

  return season.start.getTime() < Date.now()
}

function hasSeasonEnded(season: Season): boolean {
  if (!season.end) {
    return false
  }

  return season.end.getTime() < Date.now()
}

function getCurrentQuest(season: Season, team: Team): Quest | undefined {
  // Get the current theme for the team
  const theme = season.themes[team.themeIndex]
  if (!theme) {
    return undefined
  }

  // Get the current quest for the team
  const quest = theme.quests[team.questIndex]
  if (!quest) {
    return undefined
  }

  // Strip out answers and valuable information
  delete quest.title
  delete quest.description
  delete quest.answer

  // Strip out hint texts they haven't been unlocked yet
  for (let i = 0; i < quest.hints.length; i++) {
    if (i >= team.hintIndex) {
      delete quest.hints[i].text
    }
  }

  return quest
}
