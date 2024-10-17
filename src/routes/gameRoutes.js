// routes/gameRoutes.js
import { Router } from "express"
import { validateToken } from "../middleware/auth.js"
import { 
  createGame, 
  makeMove, 
  getGame, 
  getActiveGames,
  forfeitGame,
  getGameHistory
} from "../controllers/gameController.js"

const router = Router()

// All game routes require authentication
router.use(validateToken)

// Create a new game
router.post("/create", createGame)

// Make a move in a game
router.post("/:gameId/move", makeMove)

// Get details of a specific game
router.get("/:gameId", getGame)

// Get all active games for the current user
router.get("/active", getActiveGames)

// Forfeit a game
router.post("/:gameId/forfeit", forfeitGame)

// Get game history for the current user
router.get("/history", getGameHistory)

export default router
