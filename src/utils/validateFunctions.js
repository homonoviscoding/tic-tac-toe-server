import { emailRegex, passwordRegex } from "../utils/regexMatchers.js"

export const validateSignup = (email, password) => {
  const errors = [];
  if (!emailRegex.test(email)) errors.push("Invalid email format.")
  if (!passwordRegex.test(password)) errors.push("Password must be at least 8 characters long and contain at least one letter and one number.")
  
  return errors
}