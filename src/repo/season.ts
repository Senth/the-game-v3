import fsClient, { Collections } from './firestore'
import { Season } from '@models/quest'

export class SeasonRepo {
  async add(title: string): Promise<Season> {
    const season: Season = {
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

  async update(season: Season): Promise<Season> {
    const seasonId = season.id

    if (!seasonId) {
      throw new Error('Missing season id')
    }
    delete season.id

    const promise = fsClient.collection(Collections.SEASONS).doc(seasonId).set(season)

    return promise.then(() => {
      return season
    })
  }
}

const seasonRepo = new SeasonRepo()
export default seasonRepo