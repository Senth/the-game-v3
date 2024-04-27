import fsClient, { Collections } from "./firestore"
import { Order, Season } from "@models/quest"

export class SeasonRepo {
  async add(title: string): Promise<Season> {
    const season: Season = {
      title,
      order: Order.randomAll,
      themes: [],
    }

    const promise = fsClient.collection(Collections.SEASONS).add(season)

    return promise.then((doc) => {
      season.id = doc.id
      return season
    })
  }

  async update(season: Season): Promise<Season> {
    const seasonId = season.id

    if (!seasonId) {
      throw new Error("Missing season id")
    }
    delete season.id

    const promise = fsClient.collection(Collections.SEASONS).doc(seasonId).set(season)

    return promise.then(() => {
      return season
    })
  }

  async get(seasonId: string): Promise<Season> {
    const promise = fsClient.collection(Collections.SEASONS).doc(seasonId).get()

    return promise.then((doc) => {
      const season = doc.data() as Season
      season.id = doc.id

      // Fix date
      if (season.start) {
        season.start = new Date(season.start)
      }
      if (season.end) {
        season.end = new Date(season.end)
      }

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

        // Fix date
        if (season.start) {
          season.start = new Date(season.start)
        }
        if (season.end) {
          season.end = new Date(season.end)
        }

        seasons.push(season)
      })
      return seasons
    })
  }
}

const seasonRepo = new SeasonRepo()
export default seasonRepo
