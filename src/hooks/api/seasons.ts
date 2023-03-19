import { Fetcher } from '@models/api/fetcher'
import { Season } from '@models/quest'
import useSWR from 'swr'
import { returnFetcher, fetcher } from './index'

export function useSeasons(): Fetcher<Season[]> {
  return returnFetcher(
    useSWR('/api/admin/seasons', fetcher, {
      revalidateOnFocus: false,
    })
  )
}

export function useSeasonsMutate() {
  const seasons = useSeasons()

  function put(season: Season) {
    fetch(`/api/admin/seasons`, {
      method: 'PUT',
      body: JSON.stringify(season),
    })
      .then((response) => {
        if (!response.ok) {
          // TODO print error
          return
        }

        mutateSeason.update(seasons, season)
      })
      .catch((error) => {
        // TODO print error
        console.log(error)
      })
  }

  return {
    update: async (season: Season) => {
      put(season)
    },
  }
}

const mutateSeason = {
  update(fetcher: Fetcher<Season[]>, season: Season) {
    fetcher.mutate(
      (data: Season[] | undefined) => {
        console.log('Mutating season')
        if (!data) {
          return data
        }

        const index = data.findIndex((s) => s.id === season.id)
        if (index === -1) {
          return data
        }

        data[index] = season
        console.log('Season mutated: ', data[index])

        return data
      },
      {
        optimisticData: true,
        revalidate: false,
      }
    )
  },
}
