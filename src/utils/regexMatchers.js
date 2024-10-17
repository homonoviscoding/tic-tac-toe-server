// Email regex: Allows for most common email formats
export const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/

// Password regex: At least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number, and 1 special character
export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/

// Username regex: 3-20 characters, letters, numbers, and underscores only
export const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/
