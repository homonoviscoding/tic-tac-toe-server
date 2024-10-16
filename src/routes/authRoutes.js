import { signup, login, verify, logout } from '../controllers/auth.js'
import { Router } from "express"
import { validateToken } from '../middleware/auth.js'

const router = Router()

router.post("/signup", signup)
router.post("/login", login)
router.get("/loginverify", verify)
router.post('/logout', validateToken, logout)

export default router