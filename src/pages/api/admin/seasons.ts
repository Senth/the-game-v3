import { withAdmin } from "@utils/session"
import { SeasonPostRequest } from "@models/api/season"
import seasonRepo from "@repo/season"
import { NextApiRequest, NextApiResponse } from "next"
import { Season } from "@models/quest"

export default withAdmin(async function handler(req, res) {
  const { method } = req
  switch (method) {
    case "GET":
      return get(req, res)
    case "POST":
      return post(req, res)
    case "PUT":
      return put(req, res)
    default:
      return res.status(405).json({ message: "Method not allowed" })
  }
})

async function get(req: NextApiRequest, res: NextApiResponse) {
  return seasonRepo
    .getAll()
    .then((seasons) => {
      return res.status(200).json(seasons)
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({ message: "Internal server error" })
    })
}

async function post(req: NextApiRequest, res: NextApiResponse) {
  if (!req.body) {
    return res.status(400).json({ message: "Missing request body" })
  }

  const body = JSON.parse(req.body) as SeasonPostRequest

  if (!body.title) {
    return res.status(400).json({ message: "Missing season name" })
  }

  return seasonRepo
    .add(body.title)
    .then((season) => {
      return res.status(200).json(season)
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({ message: "Internal server error" })
    })
}

async function put(req: NextApiRequest, res: NextApiResponse) {
  if (!req.body) {
    return res.status(400).json({ message: "Missing request body" })
  }

  const season = JSON.parse(req.body) as Season

  if (!season.id) {
    return res.status(400).json({ message: "Missing season id" })
  }

  if (!season.title) {
    return res.status(400).json({ message: "Missing season name" })
  }

  return seasonRepo
    .update(season)
    .then((season) => {
      return res.status(200).json(season)
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({ message: "Internal server error" })
    })
}
