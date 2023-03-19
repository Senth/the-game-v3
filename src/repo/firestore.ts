import { Firestore } from '@google-cloud/firestore'
import config from '../config'

const fsClient = new Firestore({
  projectId: config.projectId,
})

export const Collections = {
  SEASONS: config.dbPrefix + 'seasons',
  TEAMS: config.dbPrefix + 'teams',
  USERS: config.dbPrefix + 'users',
} as const

export default fsClient
