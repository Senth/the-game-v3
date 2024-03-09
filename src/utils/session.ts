// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import type { IronSessionOptions } from "iron-session"
import { Team } from "@models/team"
import { User } from "@models/user"
import config from "@config"
import { GetServerSidePropsContext, GetServerSidePropsResult, NextApiHandler } from "next"
import { withIronSessionApiRoute, withIronSessionSsr } from "iron-session/next"

const sessionOptions: IronSessionOptions = {
  cookieName: config.cookieName,
  password: config.cookiePassword,
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
}

export function withAdmin(handler: NextApiHandler) {
  return withSessionApi((req, res) => {
    // Check if user is logged in
    if (!req.session.user) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    // Forward request to handler
    return handler(req, res)
  })
}

export function withTeam(handler: NextApiHandler) {
  return withSessionApi((req, res) => {
    // Check if user has a team
    if (!req.session.team) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    // Forward request to handler
    return handler(req, res)
  })
}

export function withSessionApi(handler: NextApiHandler) {
  return withIronSessionApiRoute(handler, sessionOptions)
}

export function withSessionSsr<P extends { [key: string]: unknown } = { [key: string]: unknown }>(
  handler: (context: GetServerSidePropsContext) => GetServerSidePropsResult<P> | Promise<GetServerSidePropsResult<P>>
) {
  return withIronSessionSsr(handler, sessionOptions)
}

declare module "iron-session" {
  interface IronSessionData {
    user?: User
    team?: Team
  }
}
