const cors = require("cors")
const express = require("express")
const { graphqlHTTP } = require("express-graphql")
const Sentry = require("@sentry/node")
const path = require("path");

// Importing @sentry/tracing patches the global hub for tracing to work.
const SentryTracing = require("@sentry/tracing");

Sentry.init({
  dsn: "https://7be09d9523de40bc84b57affd0b45e22@o100308.ingest.sentry.io/6475421",

  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

process.send("Hello :)");

const schema = require("./schema")

const app = express()

const resources = path.join(__dirname, "/../../resources/images")
app.use('/public', express.static(resources))

app.use(function (req, res, next) {
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' 'unsafe-eval' 'unsafe-inline'; connect-src 'self', o100308.ingest.sentry.io app://rse"
  );
  next();
});

app.use(cors())

app.use("/gql", graphqlHTTP({ schema: schema.schema, graphiql: true}));

app.get("/healthcheck", (req, res) => {
  res.send("OK")
})

const init = (port) => {
  app.listen(port, () => {
    console.log(`[server] Listening on port ${port}`)
  })
}

// main
if (process.argv[2] === "--port") {
  const port = process.argv[3]
  console.log(`[server] express server started, listenning on port ${port}`)
  init(port)
}
