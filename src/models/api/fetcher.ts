import { KeyedMutator } from 'swr'

export interface Fetcher<T> {
  data: T | undefined
  error: any
  isLoading: boolean
  mutate: KeyedMutator<any>
}
