export interface AnswerResponse {
  correct: boolean
}

export interface GamePostRequest {
  answer?: string
  revealHint?: number
}
