import dbClient from "../utils/dbClient.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_SECRET, JWT_EXPIRY } from "../utils/config.js"
import { findUserByEmail } from "../domain/userQueries.js"

export const createUser = async (email, username, password) => {
  const hashedPassword = await bcrypt.hash(password, 10)
  return dbClient.user.create({
    data: { email, username, password: hashedPassword },
  })
}

export const generateToken = (userId) => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY })
}

export const verifyUser = async (email, password) => {
  const user = await findUserByEmail(email)
  if (!user) return null

  const isMatch = await bcrypt.compare(password, user.password)
  return isMatch ? user : null
}