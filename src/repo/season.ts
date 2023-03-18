import fsClient, { Collections } from './firestore'
import { Season } from '@models/season'

export class SeasonRepo {
  async add(title: string): Promise<Season> {
    const season: Season = {
      date: new Date(),
      title,
      themes: [],
    }

    const promise = fsClient.collection(Collections.SEASONS).add(season)

    return promise.then((doc) => {
      season.id = doc.id
      return season
    })
  }

  async getAll(): Promise<Season[]> {
    const promise = fsClient.collection(Collections.SEASONS).get()

    return promise.then((snapshot) => {
      const seasons: Season[] = []
      snapshot.forEach((doc) => {
        const season = doc.data() as Season
        season.id = doc.id
        seasons.push(season)
      })
      return seasons
    })
  }
}

const seasonRepo = new SeasonRepo()
export default seasonRepo
