import { Firestore } from '@google-cloud/firestore'
import config from '../config'

const fsClient = new Firestore({
  projectId: config.projectId,
})

export default fsClient
