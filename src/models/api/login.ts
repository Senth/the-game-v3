export interface LoginResponse {
  type: LoginTypes
}

export enum LoginTypes {
  USER = "user",
  TEAM = "team",
}
