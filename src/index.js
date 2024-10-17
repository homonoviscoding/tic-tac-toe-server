import app from './server.js'
import { createServer } from 'http'
import { initializeSocket } from './services/socketService.js'

const httpServer = createServer(app);
initializeSocket(httpServer);

const port = process.env.PORT || 4000

httpServer.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})
