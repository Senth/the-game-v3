import { SWRResponse } from 'swr'
import { Fetcher } from '@models/api/fetcher'

export async function fetcher(url: string, config?: any) {
  console.log('Fetching')
  let res: any | Response
  if (config) {
    res = await fetch(url, config)
  } else {
    res = await fetch(url)
  }
  if (!res.ok) {
    // Attach extra info to the error object.
    const info = await res.json()
    const status = res.status

    let message = 'An error occurred while fetching the data.'
    if (info && info.message) {
      message = info.message
    }
    if (status) {
      message = `${status}: ${message}`
    }

    throw new Error(message)
  }

  return res.json()
}

export function returnFetcher<T>(swr: SWRResponse<any, any, any>): Fetcher<T> {
  return {
    data: swr.data,
    error: swr.error,
    isLoading: !swr.data && !swr.error,
    mutate: swr.mutate,
  }
}
