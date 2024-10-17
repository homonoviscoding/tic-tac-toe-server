import dbClient from "../utils/dbClient.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { JWT_SECRET, JWT_EXPIRY, JWT_REFRESH_SECRET } from "../utils/config.js"
import { findUserByEmail } from "../models/user.js"
import crypto from 'crypto'

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

// New function to find a user by username
export const findUserByUsername = async (username) => {
  return dbClient.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      email: true,
    },
  })
}

// New function to create a game invitation
export const createGameInvitation = async (inviterId, inviteeId) => {
  return dbClient.gameInvitation.create({
    data: {
      inviterId,
      inviteeId,
      status: 'PENDING',
    },
  })
}

// New function to update a game invitation status
export const updateGameInvitationStatus = async (invitationId, status) => {
  return dbClient.gameInvitation.update({
    where: { id: invitationId },
    data: { status },
  })
}

// New function to create a game
export const createGame = async (player1Id, player2Id) => {
  return dbClient.game.create({
    data: {
      player1Id,
      player2Id,
      status: 'IN_PROGRESS',
      currentTurn: player1Id,
      board: JSON.stringify(Array(9).fill(null)), // For a 3x3 board
    },
  })
}

// New function to update a game state
export const updateGameState = async (gameId, board, currentTurn, status) => {
  return dbClient.game.update({
    where: { id: gameId },
    data: {
      board: JSON.stringify(board),
      currentTurn,
      status,
    },
  })
}

export const generateResetToken = async (email) => {
  const user = await findUserByEmail(email)
  if (!user) {
    throw new Error('User not found')
  }

  const resetToken = crypto.randomBytes(32).toString('hex')
  const hashedToken = await bcrypt.hash(resetToken, 10)

  // Store the hashed token in the database
  await dbClient.user.update({
    where: { id: user.id },
    data: {
      resetToken: hashedToken,
      resetTokenExpiry: new Date(Date.now() + 3600000) // Token expires in 1 hour
    }
  })

  return resetToken // Return the unhashed token
}

export const updatePasswordWithToken = async (token, newPassword) => {
  const user = await dbClient.user.findFirst({
    where: {
      resetToken: { not: null },
      resetTokenExpiry: { gt: new Date() }
    }
  })

  if (!user) {
    throw new Error('Invalid or expired reset token')
  }

  const isValid = await bcrypt.compare(token, user.resetToken)
  if (!isValid) {
    throw new Error('Invalid reset token')
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10)

  await dbClient.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      resetToken: null,
      resetTokenExpiry: null
    }
  })
}

export const generateNewAccessToken = async (refreshToken) => {
  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET)
    const accessToken = jwt.sign({ userId: decoded.userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY })
    return accessToken
  } catch (error) {
    throw new Error('Invalid refresh token')
  }
}


