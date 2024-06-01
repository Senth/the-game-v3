// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import { SessionOptions, getIronSession } from "iron-session"
import { Team } from "@models/team"
import { User } from "@models/user"
import config from "@config"
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next"

export const sessionOptions: SessionOptions = {
  cookieName: config.cookieName,
  password: config.cookiePassword,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
}

export function withAdmin(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getIronSession<IronSessionData>(req, res, sessionOptions)

    if (!session.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    return handler(req, res)
  }
}

export function withTeam(handler: NextApiHandler) {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const session = await getIronSession<IronSessionData>(req, res, sessionOptions)

    if (!session.team) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    return handler(req, res)
  }
}

export interface IronSessionData {
  user?: User
  team?: Team
}
