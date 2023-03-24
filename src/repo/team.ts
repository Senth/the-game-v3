import { Team } from '@models/team'
import fsClient, { Collections } from './firestore'

export class TeamRepo {
  async add(team: Team): Promise<Team> {
    const promise = fsClient.collection(Collections.TEAMS).doc(team.name).set(team)

    return promise.then(() => {
      return team
    })
  }

  async getTeam(teamName: string): Promise<Team | null> {
    const teamDoc = await fsClient.collection(Collections.TEAMS).doc(teamName).get()
    const teamData = teamDoc.data()

    if (!teamData) {
      return null
    }

    return teamData as Team
  }

  async update(team: Team): Promise<void> {
    const teamId = team.name

    if (!teamId) {
      throw new Error('Missing team id')
    }

    await fsClient.collection(Collections.TEAMS).doc(teamId).set(team)
  }
}

const teamRepo = new TeamRepo()
export default teamRepo
