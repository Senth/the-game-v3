import { Team } from '@models/team'
import { User } from '@models/user'

declare module 'iron-session' {
  interface IronSessionData {
    user?: User
    team?: Team
  }
}
