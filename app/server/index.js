const express = require("express")
const { graphqlHTTP } = require("express-graphql")

const schema = require("./schema")

const app = express()

app.use("/gql", graphqlHTTP({ schema: schema.schema, graphiql: true}));

app.get("/healthcheck", (req, res) => {
  res.send("OK")
})

const init = (port) => {
  app.listen(port, () => {
    console.log(`Listening on port ${port}`)
  })
}

// main
if (process.argv[2] === "--port") {
  const port = process.argv[3]
  console.log(`[server] espress server started, listenning on port ${port}`)
  init(port)
}
