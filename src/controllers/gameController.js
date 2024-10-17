// controllers/game.js
import { sendDataResponse, sendErrorResponse } from "../utils/errorResponses.js"
import { 
  createGameInDB, 
  makeMoveinDB, 
  getGameFromDB, 
  getActiveGamesFromDB, 
  forfeitGameInDB, 
  getGameHistoryFromDB, 
  createGameInvitationInDB, 
  checkUserTurnInDB 
} from "../models/game.js"
import { validateGameCreation, validateGameMove } from "../utils/validateFunctions.js"

export const createGame = async (req, res) => {
  try {
    const { opponentId } = req.body
    const errors = validateGameCreation(opponentId)
    if (errors.length > 0) {
      return sendErrorResponse(res, 400, errors.join(", "))
    }
    const game = await createGameInDB(req.user.id, opponentId)
    return sendDataResponse(res, 201, game)
  } catch (error) {
    return sendErrorResponse(res, 500, error.message)
  }
}

export const makeMove = async (req, res) => {
  try {
    const { gameId } = req.params
    const { move } = req.body
    const errors = validateGameMove(move)
    if (errors.length > 0) {
      return sendErrorResponse(res, 400, errors.join(", "))
    }
    const isUserTurn = await checkUserTurnInDB(gameId, req.user.id)
    if (!isUserTurn) {
      return sendErrorResponse(res, 400, "It's not your turn")
    }
    const updatedGame = await makeMoveinDB(gameId, req.user.id, move)
    return sendDataResponse(res, 200, updatedGame)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

export const getGame = async (req, res) => {
  try {
    const { gameId } = req.params
    const game = await getGameFromDB(gameId)
    if (!game.players.includes(req.user.id)) {
      return sendErrorResponse(res, 403, "You are not a participant in this game")
    }
    return sendDataResponse(res, 200, game)
  } catch (error) {
    return sendErrorResponse(res, 404, "Game not found")
  }
}

export const inviteToGame = async (req, res) => {
  try {
    const { opponentId } = req.body
    const invitation = await createGameInvitationInDB(req.user.id, opponentId)
    return sendDataResponse(res, 201, invitation)
  } catch (error) {
    return sendErrorResponse(res, 500, error.message)
  }
}

export const getActiveGames = async (req, res) => {
  try {
    const games = await getActiveGamesFromDB(req.user.id)
    return sendDataResponse(res, 200, games)
  } catch (error) {
    return sendErrorResponse(res, 500, error.message)
  }
}

export const forfeitGame = async (req, res) => {
  try {
    const { gameId } = req.params
    const result = await forfeitGameInDB(gameId, req.user.id)
    return sendDataResponse(res, 200, result)
  } catch (error) {
    return sendErrorResponse(res, 400, error.message)
  }
}

export const getGameHistory = async (req, res) => {
  try {
    const history = await getGameHistoryFromDB(req.user.id)
    return sendDataResponse(res, 200, history)
  } catch (error) {
    return sendErrorResponse(res, 500, error.message)
  }
}
