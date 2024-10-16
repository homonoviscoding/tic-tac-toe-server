import dbClient from "../utils/dbClient.js"



export const getUserById = async (id) => {
  return dbClient.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      avatar: true,
      points: true,
      status: true,
      createdAt: true,
      profileData: true,
    },
  })
}

export const updateUser = async (id, data) => {
  return dbClient.user.update({
    where: { id },
    data,
  })
}

export const findUserByEmail = async (email) => {
    try {
      return await dbClient.user.findUnique({
        where: { email },
      })
    } catch (error) {
      console.error('Error finding user by email:', error)
      throw error
    }
  }