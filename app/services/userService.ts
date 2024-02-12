import { UserModel } from '../models/user'

export class UserService {
  private users: UserModel[] = [
    {
      id: 1,
      username: 'johndoe',
      email: 'johndoe@mydomain.com',
      passwordHash: 'passwordhash',
      profileImageThumbnail: 'https://via.placeholder.com/150',
    },
    {
      id: 2,
      username: 'janedoe',
      email: 'janedoe@mydomain.com',
      passwordHash: 'passwordhash',
      profileImageThumbnail: 'https://via.placeholder.com/150',
    },
  ]

  static getInstance(): UserService {
    return UserService._instance
  }

  private static _instance: UserService = new UserService()

  getUsers(): UserModel[] {
    return this.users
  }

  getUserById(id: number): UserModel | undefined {
    return this.users.find(user => user.id === id) || undefined
  }
}
