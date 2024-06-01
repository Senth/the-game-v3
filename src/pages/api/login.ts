import UserRepo from "@repo/user"
import teamRepo from "@repo/team"
import { LoginResponse, LoginTypes } from "@models/api/login"
import { IronSession, getIronSession } from "iron-session"
import { IronSessionData, sessionOptions } from "@utils/session"
import { NextApiRequest, NextApiResponse } from "next"

export async function post(req: NextApiRequest, res: NextApiResponse) {
  const { team, password } = JSON.parse(req.body)

  if (!team || !password) {
    return res.status(400).json({ message: "Missing team or password" })
  }
  const session = await getIronSession<IronSessionData>(req, res, sessionOptions)
  console.log(session)

  const userStatus = tryLoginUser(team, password, session)
  const teamStatus = tryLoginTeam(team, password, session)

  let userStatusCode = 0
  let teamStatusCode = 0

  userStatus.then((status) => {
    if (status === 200) {
      const responseBody: LoginResponse = { type: LoginTypes.USER }
      res.status(200).json(responseBody)
    } else {
      userStatusCode = status
    }
  })

  teamStatus.then((status) => {
    if (status === 200) {
      const responseBody: LoginResponse = { type: LoginTypes.TEAM }
      res.status(200).json(responseBody)
    } else {
      teamStatusCode = status
    }
  })

  return Promise.all([userStatus, teamStatus]).then(() => {
    if (userStatusCode === 401 && teamStatusCode === 401) {
      res.status(401).json({ message: "Invalid username or password" })
    } else if (userStatusCode === 500 || teamStatusCode === 500) {
      res.status(500).json({ message: "Internal server error" })
    }
  })
}
export default post

async function tryLoginUser(
  username: string,
  password: string,
  session: IronSession<IronSessionData>
): Promise<number> {
  try {
    const userRepo = new UserRepo()
    const user = await userRepo.getUser(username)

    if (!user) {
      return 401
    }

    // Verify password
    if (password !== user.password) {
      return 401
    }

    // Delete password from user data
    delete user.password

    // Set user data to the session
    session.user = user

    await session.save()

    return 200
  } catch (error) {
    console.error(error)
    return 500
  }
}

async function tryLoginTeam(
  teamName: string,
  password: string,
  session: IronSession<IronSessionData>
): Promise<number> {
  try {
    const team = await teamRepo.getTeam(teamName)

    if (!team) {
      return 401
    }

    // Verify password
    if (password !== team.password) {
      return 401
    }

    // Set team data to the session
    session.team = team

    await session.save()

    return 200
  } catch (error) {
    console.error(error)
    return 500
  }
}
