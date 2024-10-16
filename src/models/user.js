import dbClient from "../utils/dbClient.js"


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