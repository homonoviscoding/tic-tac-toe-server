import { emailRegex, passwordRegex, usernameRegex } from "../utils/regexMatchers.js"

export const validateSignup = (email, password, username) => {
  const errors = [];
  if (!emailRegex.test(email)) errors.push("Invalid email format.")
  if (!passwordRegex.test(password)) errors.push("Password must be at least 8 characters long, include an uppercase letter, a lowercase letter, a number, and a special character.")
  if (!usernameRegex.test(username)) errors.push("Username must be 3-20 characters long and can only contain letters, numbers, and underscores.")
  
  return errors
}

export const validateLogin = (email, password) => {
  const errors = [];
  if (!email) errors.push("Email is required.")
  if (!password) errors.push("Password is required.")
  
  return errors
}

export const validateGameInvitation = (inviteeId) => {
  const errors = [];
  if (!inviteeId) errors.push("Invitee ID is required.")
  // Add any other validations for game invitations
  return errors
}

export const validateGameMove = (move) => {
  const errors = []
  if (!move || typeof move !== 'object') {
    errors.push("Move must be a valid object")
  } else {
    if (typeof move.row !== 'number' || move.row < 0 || move.row > 2) {
      errors.push("Invalid row")
    }
    if (typeof move.col !== 'number' || move.col < 0 || move.col > 2) {
      errors.push("Invalid column")
    }
  }
  // Add any other validations for game moves
  return errors
}

export const validateUpdateProfile = (username, email) => {
  const errors = [];
  if (username && !usernameRegex.test(username)) errors.push("Invalid username format.")
  if (email && !emailRegex.test(email)) errors.push("Invalid email format.")
  
  return errors
}

export const validateUserUpdate = (userData) => {
  const errors = []
  if (userData.email && !emailRegex.test(userData.email)) {
    errors.push("Invalid email format")
  }
  if (userData.username && !usernameRegex.test(userData.username)) {
    errors.push("Invalid username format")
  }
  // Add any other validations you need for user updates
  return errors
}

export const validateGameCreation = (opponentId) => {
  const errors = []
  if (!opponentId) {
    errors.push("Opponent ID is required")
  }
  // Add any other validations for game creation
  return errors
}
