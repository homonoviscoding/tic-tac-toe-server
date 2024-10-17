import { signup, login, verify, logout, requestPasswordReset, resetPassword, refreshToken } from '../controllers/auth.js'
import { Router } from "express"
import { validateToken } from '../middleware/auth.js'

const router = Router()

// Public routes
router.post("/signup", signup)
router.post("/login", login)
router.get("/loginverify", verify)
router.post("/request-password-reset", requestPasswordReset)
router.post("/reset-password", resetPassword)
router.post("/refresh-token", refreshToken)

// Protected routes
router.post('/logout', validateToken, logout)

export default router
