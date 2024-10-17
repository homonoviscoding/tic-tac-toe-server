import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../utils/config.js"
import { sendDataResponse, sendMessageResponse, sendErrorResponse } from "../utils/errorResponses.js"

const TOKEN_PREFIX = "Bearer"

export const validateToken = (requireAuth = true) => (req, res, next) => {
  // Check for token in Authorization header
  const authHeader = req.headers.authorization
  let token = authHeader && authHeader.startsWith(TOKEN_PREFIX) 
    ? authHeader.slice(TOKEN_PREFIX.length + 1) 
    : null

  // If no token in header, check cookies
  if (!token) {
    token = req.cookies.token
  }

  if (!token) {
    if (requireAuth) {
      return sendMessageResponse(res, 401, 'Authentication required')
    } else {
      return next()
    }
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return sendMessageResponse(res, 401, 'Token expired')
    } else if (err.name === 'JsonWebTokenError') {
      return sendMessageResponse(res, 401, 'Invalid token')
    } else {
      return sendErrorResponse(res, 500, 'Failed to authenticate token')
    }
  }
}

export const optionalAuth = validateToken(false)
