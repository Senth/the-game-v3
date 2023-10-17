import { IronSession } from 'iron-session'
import { withSessionApi } from '@utils/session'

export default withSessionApi(async function loginRoute(req, res) {
  tryLogoutUser(req.session).then((status) => {
    if (status === 200) {
      res.status(200).json({ message: 'Logged out' })
    } else {
      res.status(status).json({ message: 'Internal server error' })
    }
  })
})

async function tryLogoutUser(session: IronSession): Promise<number> {
  try {
    delete session.user
    delete session.team
    await session.save()
    return 200
  } catch (error) {
    console.error(error)
    return 500
  }
}
