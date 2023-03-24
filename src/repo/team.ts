import { Team } from '@models/team'
import fsClient, { Collections } from './firestore'

export class TeamRepo {
  async add(team: Team): Promise<Team> {
    const promise = fsClient.collection(Collections.TEAMS).doc(team.name).set(team)

    return promise.then(() => {
      return team
    })
  }

  async update(team: Team): Promise<void> {
    const teamId = team.name

    if (!teamId) {
      throw new Error('Missing team id')
    }

    await fsClient.collection(Collections.TEAMS).doc(teamId).set(team)
  }

  async getTeam(teamName: string): Promise<Team | undefined> {
    const teamDoc = await fsClient.collection(Collections.TEAMS).doc(teamName).get()
    const teamData = teamDoc.data()

    if (!teamData) {
      return
    }

    return teamData as Team
  }

  async getTeams(seasonId: string): Promise<Team[] | undefined> {
    const teamDocs = await fsClient.collection(Collections.TEAMS).where('seasonId', '==', seasonId).get()

    return teamDocs.docs.map((team) => team.data() as Team) as Team[]
  }
}

const teamRepo = new TeamRepo()
export default teamRepo
