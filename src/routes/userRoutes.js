import { Router } from "express"
import { validateToken } from "../middleware/auth.js"
import { getUser } from "../controllers/userController.js"

const router = Router()


router.get("/:id", getUser)
router.put("/profile", validateToken, updateUserProfile)
router.get("/leaderboard", getLeaderboardData)



export default router