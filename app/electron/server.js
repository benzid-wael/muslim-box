const express = require("express")
const app = express()

app.get("/", (req, res) => {
  res.send("Hello World!")
})

const init = (port) => {
  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
}


// main
if (process.argv[2] === "--port") {
  const port = process.argv[3]
  console.log(`[server] espress server started, listenning on port ${port}`)
  init(port)
}
