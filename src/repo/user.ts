import { User } from "@models/user"
import fsClient from "./firestore"
import { Collections } from "./firestore"

export default class UserRepo {
  async getUser(username: string): Promise<User | null> {
    const userDoc = await fsClient.collection(Collections.USERS).doc(username).get()
    const userData = userDoc.data()

    if (!userData) {
      return null
    }

    return userData as User
  }
}
