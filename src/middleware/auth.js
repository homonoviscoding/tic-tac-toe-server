import jwt from "jsonwebtoken"
import { JWT_SECRET } from "../utils/config.js"
import { sendDataResponse, sendMessageResponse, sendErrorResponse } from "../utils/errorResponses.js"

export const validateToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]
  
  if (!token) return sendMessageResponse(res, 401, 'not_authorized')

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.user = decoded
    next()
  } catch (err) {
    sendMessageResponse(res, 401, 'not_authorized')
  }
}