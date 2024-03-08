export interface User {
  _id: number
  username: string
  email: string
  passwordHash: string
  image?: string
  token?: string
}
