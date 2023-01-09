import User from '../classes/interfaceuser'

class FakeDatastore {
  private users: { [teamId: string]: User[] } = {}

  constructor() {}

  addUser(user: User, teamId: string) {
    if (!this.users[teamId]) {
      this.users[teamId] = []
    }

    // Check if a user with the same ID already exists in the team
    const existingUser = this.users[teamId].find(
      (u) => u.GetUserId() === user.GetUserId()
    )
    if (existingUser) {
      throw new Error(`User with ID "${user.GetUserId()}" already exists`)
    }

    this.users[teamId].push(user)
  }

  deleteUser(userId: string, teamId: string) {
    if (!this.users[teamId]) {
      return
    }
    this.users[teamId] = this.users[teamId].filter(
      (user) => user.GetUserId() !== userId
    )
  }

  getUser(userId: string, teamId: string) {
    if (!this.users[teamId]) {
      return
    }
    return this.users[teamId].find((user) => user.GetUserId() === userId)
  }

  getAllUsers(teamId: string) {
    if (!this.users[teamId]) {
      return []
    }
    return this.users[teamId]
  }
}

export default FakeDatastore
