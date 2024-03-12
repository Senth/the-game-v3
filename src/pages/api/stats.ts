import { NextApiRequest, NextApiResponse } from "next"
import seasonRepo from "@repo/season"
import teamRepo from "@repo/team"
import { Season } from "@models/quest"
import { Team } from "@models/team"
import { Stats, TeamStat } from "@models/stats"
import { Status } from "@models/api/status"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req
  switch (method) {
    case "GET":
      return get(req, res)
    default:
      return res.status(405).json({ message: "Method not allowed" })
  }
}

async function get(req: NextApiRequest, res: NextApiResponse) {
  await seasonRepo
    .getAll()
    .then(async (seasons) => {
      // Get the season that started today
      const today = new Date()
      const currentSeason = seasons.find((season) => {
        let year,
          month,
          day = 0
        if (season.start) {
          year = season.start.getFullYear()
          month = season.start.getMonth()
          day = season.start.getDate()
        }
        return year === today.getFullYear() && month === today.getMonth() && day === today.getDate()
      })

      if (!currentSeason || !currentSeason.id) {
        throw new Status(404, "Season not found")
      }

      // Get the teams for this season
      return teamRepo.getTeams(currentSeason.id).then((teams) => {
        if (!teams) {
          throw new Status(404, "Teams not found")
        }
        return [currentSeason, teams] as [Season, Team[]]
      })
    })
    .then(([currentSeason, teams]) => {
      // Create the stats object
      const stats: Stats = {
        start: currentSeason.start || new Date(),
        end: currentSeason.end || new Date(),
        totalQuests: calculateTotalQuests(currentSeason),
        teams: [],
      }

      // Add the team stats
      for (const team of teams) {
        const teamStat: TeamStat = {
          name: team.name,
          score: team.score,
          completed: calculateCompletedQuests(team),
        }
        stats.teams.push(teamStat)
      }

      return res.status(200).json(stats)
    })
    .catch((err) => {
      if (err instanceof Status) {
        return res.status(200).json({})
      } else {
        return res.status(500).json({ message: "Internal Server Error" })
      }
    })
}

function calculateTotalQuests(season: Season): number {
  let total = 0

  for (const theme of season.themes) {
    total += theme.quests.length
  }

  return total
}

function calculateCompletedQuests(team: Team): number {
  let completed = team.questIndex

  if (team.completed) {
    completed = team.questOrder.length
  }

  return completed
}
