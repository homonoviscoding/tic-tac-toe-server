import { createUser, generateToken, verifyUser, generateResetToken, updatePasswordWithToken, generateNewAccessToken } from "../utils/services.js"
import { sendDataResponse, sendMessageResponse, sendErrorResponse } from "../utils/errorResponses.js"
import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../utils/config.js"
import { validateSignup, validateLogin } from "../utils/validateFunctions.js"


export const signup = async (req, res) => {
    const { email, username, password } = req.body
  
    const validationErrors = validateSignup(email, password)
    if (validationErrors.length > 0) {
      return sendMessageResponse(res, 400, validationErrors.join(", "))
    }
  
    try {
      const user = await createUser(email, username, password)
      const token = generateToken(user.id)
  
      return sendDataResponse(res, 201, { token, userId: user.id, username })
    } catch (error) {
      return sendErrorResponse(res, 500, error.message)
    }
}

export const login = async (req, res) => {
    const { email, password } = req.body

    const validationErrors = validateLogin(email, password)
    if (validationErrors.length > 0) {
      return sendMessageResponse(res, 400, validationErrors.join(", "))
    }

    try {
        const user = await verifyUser(email, password)
        if (!user) {
            return sendMessageResponse(res, 401, "Invalid credentials")
        }

        const token = generateToken(user.id)

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        })

        return sendDataResponse(res, 200, { token, user: { id: user.id, email: user.email, username: user.username } })
    } catch (error) {
        console.error('Login error:', error)
        return sendErrorResponse(res, 500, error.message)
    }
}

export const verify = async (req, res) => {
    console.log('Cookies:', req.cookies)
    const token = req.cookies?.token

    if (!token) {
      console.log('No token provided')
      return sendMessageResponse(res, 401, 'No token provided')
    }

    try {
      console.log('Attempting to verify token')
      const decoded = jwt.verify(token, JWT_SECRET)
      console.log('Token verified successfully:', decoded)
      return sendDataResponse(res, 200, { user: decoded })
    } catch (error) {
      console.error('Token verification failed:', error.message)
      return sendMessageResponse(res, 401, 'Invalid token')
    }
}

export const logout = async (req, res) => {
    const userId = req.user.id

    try {
        console.log('Attempting to revoke token for user:', userId)
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        })
        return sendMessageResponse(res, 200, "Logged out successfully")
    } catch (error) {
        console.error('Logout error:', error)
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        })
        return sendErrorResponse(res, 500, `Logout partially failed: ${error.message}`)
    }
}

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body
    const resetToken = await generateResetToken(email)
    await sendPasswordResetEmail(email, resetToken)
    return sendMessageResponse(res, 200, "Password reset email sent")
  } catch (error) {
    return sendErrorResponse(res, 500, error.message)
  }
}

export const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body
    await updatePasswordWithToken(token, newPassword)
    return sendMessageResponse(res, 200, "Password reset successful")
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body
    const newAccessToken = await generateNewAccessToken(refreshToken)
    return sendDataResponse(res, 200, { accessToken: newAccessToken })
  } catch (error) {
    return sendErrorResponse(res, 401, "Invalid refresh token")
  }
}
