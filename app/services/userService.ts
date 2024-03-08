import { User } from '../models/user'

export class UserService {
  private users: User[] = [
    {
      _id: 1,
      username: 'johndoe',
      email: 'johndoe@mydomain.com',
      passwordHash: 'passwordhash',
      image: 'https://via.placeholder.com/150',
    },
    {
      _id: 2,
      username: 'janedoe',
      email: 'janedoe@mydomain.com',
      passwordHash: 'passwordhash',
      image: 'https://via.placeholder.com/150',
    },
  ]

  static getInstance(): UserService {
    return UserService._instance
  }

  private static _instance: UserService = new UserService()

  getUsers(): User[] {
    return this.users
  }

  getUserById(id: number): User | undefined {
    return this.users.find(user => user._id === id) || undefined
  }
}
