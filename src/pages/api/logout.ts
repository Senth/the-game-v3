import { IronSessionData, sessionOptions } from "@utils/session"
import { getIronSession } from "iron-session"
import { NextApiRequest, NextApiResponse } from "next"

export async function post(req: NextApiRequest, res: NextApiResponse) {
  return getIronSession<IronSessionData>(req, res, sessionOptions)
    .then((session) => {
      delete session.user
      delete session.team
      return session.save()
    })
    .then(() => {
      return res.status(200).json({ message: "Logged out" })
    })
    .catch((error) => {
      console.error(error)
      return res.status(500).json({ message: "Internal server error" })
    })
}

export default post
