import { withSessionApi } from "@utils/session"
import teamRepo from "@repo/team"
import { NextApiRequest, NextApiResponse } from "next"
import { Team, teamHelper } from "@models/team"

export default withSessionApi(async function handler(req, res) {
  const { method } = req
  switch (method) {
    case "POST":
      return post(req, res)
    default:
      return res.status(405).json({ message: "Method not allowed" })
  }
})

async function post(req: NextApiRequest, res: NextApiResponse) {
  if (!req.body) {
    return res.status(400).json({ message: "Missing request body" })
  }

  let team = JSON.parse(req.body) as Team

  if (!team.name) {
    return res.status(400).json({ message: "Missing team name" })
  }
  if (!team.password) {
    return res.status(400).json({ message: "Missing team password" })
  }

  // Make sure team name is unique
  const existingTeam = await teamRepo.getTeam(team.name)
  if (existingTeam) {
    return res.status(400).json({ message: "Team name already exists" })
  }

  // Add default values
  team = {
    ...teamHelper.new(),
    ...team,
  }

  return teamRepo
    .add(team)
    .then((team) => {
      return res.status(200).json(team)
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({ message: "Internal server error" })
    })
}
