import { Team } from '@models/team'
import fsClient from './firestore'

export default class TeamRepo {
  async getTeam(teamName: string): Promise<Team | null> {
    const teamDoc = await fsClient.collection('teams').doc(teamName).get()
    const teamData = teamDoc.data()

    if (!teamData) {
      return null
    }

    return teamData as Team
  }
}
