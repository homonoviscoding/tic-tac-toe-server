import { getUserById, updateUser } from "../models/user.js"
import { sendDataResponse, sendErrorResponse } from "../utils/errorResponses.js"

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
    const user = await getUserById(parseInt(req.params.id))
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
    const updatedUser = await updateUser(req.user.id, req.body)
    return sendDataResponse(res, 200, updatedUser)
  } catch (error) {
    return sendErrorResponse(res, 500, error.message)
  }
}

export const getLeaderboardData = async (req, res) => {
  try {
    const leaderboard = await getLeaderboard(10)
    return sendDataResponse(res, 200, leaderboard)
  } catch (error) {
    return sendErrorResponse(res, 500, error.message)
  }
}