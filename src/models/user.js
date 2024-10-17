import dbClient from "../utils/dbClient.js"



export const getUserById = async (id) => {
  try {
    return await dbClient.user.findUnique({
      where: { id: String(id) },
      select: {
        id: true,
        username: true,
        email: true,
        createdAt: true
      },
    })
  } catch (error) {
    console.error('Error finding user by ID:', error)
    throw error
  }
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