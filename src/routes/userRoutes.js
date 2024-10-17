import { Router } from "express"
import { validateToken } from "../middleware/auth.js"
import { 
  getUser, 
  updateUserProfile, 
  getUserStats, 
  getLeaderboard, 
  inviteUser,
  getGameInvitations
} from "../controllers/userController.js"

const router = Router()

// Public routes
router.get("/:id", getUser)
router.get("/leaderboard", getLeaderboard)

// Protected routes (require authentication)
router.use(validateToken)
router.put("/profile", updateUserProfile)
router.get("/stats", getUserStats)
router.post("/invite", inviteUser)
router.get("/invitations", getGameInvitations)

export default router
