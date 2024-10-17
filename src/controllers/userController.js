import { getUserById, updateUser } from "../models/user.js"
import { sendDataResponse, sendErrorResponse } from "../utils/errorResponses.js"
import { validateUserUpdate, validateGameInvitation } from "../utils/validateFunctions.js"
import { sendInvitationEmail } from "../services/emailService.js"

// export const getAllUsers = async (req, res) => {
//   try {
//     const users = await getAllTheUsers();
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// }

export const getUser = async (req, res) => {
  try {
    const user = await getUserById(req.params.id)
    if (!user) {
      return sendErrorResponse(res, 404, "User not found")
    }
    return sendDataResponse(res, 200, user)
  } catch (error) {
    return sendErrorResponse(res, 500, error.message)
  }
}

export const updateUserProfile = async (req, res) => {
  try {
    const errors = validateUserUpdate(req.body)
    if (errors.length > 0) {
      return sendErrorResponse(res, 400, errors.join(", "))
    }
    const updatedUser = await updateUser(req.user.id, req.body)
    return sendDataResponse(res, 200, updatedUser)
  } catch (error) {
    return sendErrorResponse(res, 500, error.message)
  }
}

export const getUserStats = async (req, res) => {
  try {
    const stats = await getUserStatsFromDB(req.user.id)
    return sendDataResponse(res, 200, stats)
  } catch (error) {
    return sendErrorResponse(res, 500, error.message)
  }
}

export const getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await getLeaderboardFromDB()
    return sendDataResponse(res, 200, leaderboard)
  } catch (error) {
    return sendErrorResponse(res, 500, error.message)
  }
}

export const inviteUser = async (req, res) => {
  try {
    const { inviteeId } = req.body
    const errors = validateGameInvitation(inviteeId)
    if (errors.length > 0) {
      return sendErrorResponse(res, 400, errors.join(", "))
    }
    const invitation = await createGameInvitation(req.user.id, inviteeId)
    const invitee = await getUserById(inviteeId)
    await sendInvitationEmail(invitee.email, req.user.username, invitation.id)
    return sendDataResponse(res, 201, invitation)
  } catch (error) {
    return sendErrorResponse(res, 500, error.message)
  }
}

export const getGameInvitations = async (req, res) => {
  try {
    const invitations = await getGameInvitationsFromDB(req.user.id)
    return sendDataResponse(res, 200, invitations)
  } catch (error) {
    return sendErrorResponse(res, 500, error.message)
  }
}
