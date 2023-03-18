import { withSessionApi } from '@utils/session'
import { SeasonPostRequest } from '@models/api/season'
import seasonRepo from '@repo/season'

export default withSessionApi(async function handler(req, res) {
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

async function post(req, res) {
  // TODO
  const body = req.body as SeasonPostRequest

  if (!body.title) {
    return res.status(400).json({ message: 'Missing season name' })
  }

  return seasonRepo
    .addSeason(body.title)
    .then((season) => {
      return res.status(200).json(season)
    })
    .catch((err) => {
      console.error(err)
      return res.status(500).json({ message: 'Internal server error' })
    })
}

async function get(req, res) {
  return res.status(200).json({ message: 'Hello' })
}
