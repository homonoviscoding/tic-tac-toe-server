import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from "../utils/config.js"

let io

export const initializeSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true
    }
  })

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token
    if (!token) {
      return next(new Error('Authentication error'))
    }
    try {
      const decoded = jwt.verify(token, JWT_SECRET)
      socket.user = decoded
      next()
    } catch (error) {
      next(new Error('Authentication error'))
    }
  })

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id)

    // Join a room with the user's ID for private messages
    socket.join(socket.user.id)

    socket.on('sendGameInvitation', (data) => handleGameInvitation(socket, data))

    socket.on('acceptGameInvitation', (data) => handleAcceptInvitation(socket, data))

    socket.on('rejectGameInvitation', (data) => handleRejectInvitation(socket, data))

    socket.on('joinGame', (gameId) => {
      socket.join(`game:${gameId}`)
      console.log(`User ${socket.id} joined game ${gameId}`)
    })

    socket.on('leaveGame', (gameId) => {
      socket.leave(`game:${gameId}`)
      console.log(`User ${socket.id} left game ${gameId}`)
    })

    socket.on('gameMove', (data) => handleGameMove(socket, data))

    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id)
    })
  })

  return io
}

const handleGameInvitation = (socket, data) => {
  const { inviteeId } = data
  io.to(inviteeId).emit('gameInvitation', {
    inviterId: socket.user.id,
    inviterName: socket.user.username
  })
}

const handleAcceptInvitation = (socket, data) => {
  const { inviterId, gameId } = data
  io.to(inviterId).emit('gameAccepted', { opponentId: socket.user.id, gameId })
  socket.emit('gameAccepted', { opponentId: inviterId, gameId })
}

const handleRejectInvitation = (socket, data) => {
  const { inviterId } = data
  io.to(inviterId).emit('gameRejected', { rejecterId: socket.user.id })
}

const handleGameMove = (socket, data) => {
  const { gameId, move } = data
  socket.to(`game:${gameId}`).emit('opponentMove', move)
}

export const emitGameUpdate = (gameId, gameState) => {
  if (io) {
    io.to(`game:${gameId}`).emit('gameUpdate', gameState)
  }
}
