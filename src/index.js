import app from './server.js'
const port = process.env.PORT || 4000

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})