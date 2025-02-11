const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const mongoose = require('mongoose')
const assert = require('assert')
const compression = require('compression')
const cors = require('cors')
const { ApolloServer, gql } = require('apollo-server-express')
const { ApolloEngine } = require('apollo-engine')

mongoose.Promise = global.Promise

const dtLogs = require('./logs/distributeToken')
const rrLogs = require('./logs/reputationRegistry')
const prLogs = require('./logs/projectRegistry')
const trLogs = require('./logs/tokenRegistry')
const plLogs = require('./logs/projectLibrary')
const typeDefs = require('./data/typeDefs')
const resolvers = require('./data/resolvers')

const app = express()

app.set('port', process.env.PORT || 3001)

const ENGINE_API_KEY = 'service:distribute1000:kJ_c9KYFatDESVsmhHL-4w'

const engine = new ApolloEngine({
  apiKey: ENGINE_API_KEY
})

app.use(bodyParser.urlencoded({
  extended: true
}))

app.use(bodyParser.json())
app.use(cors())
app.options('*', cors())
app.use(express.static(path.resolve(__dirname, '../frontend/public')))

const url = process.env.MONGODB_URI || 'mongodb://localhost:27017/distribute'

app.use(compression())
// The GraphQL endpoint
const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: true,
  cacheControl: true,
  engine: false,
  cors: true
  //   // By setting this to "false", we avoid using Apollo Server 2's
  //   // integrated metric reporting and fall-back to using the Apollo
  //   // Engine Proxy (running separately) for metric collection.
  // engine: {
  //   apiKey: ENGINE_API_KEY
  // }
})
server.applyMiddleware({ app, cors: true })

// app.use('/graphql', cors(), bodyParser.json(), graphqlExpress({ schema, tracing: true, cacheControl: true }))
//
// // GraphiQL, a visual editor for queries
// app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

// connect to mongoose
mongoose.connect(url, { useNewUrlParser: true }, (err) => {
  assert.equal(null, err)
  console.log('connected to mongoose')
})

// fire logs --> network model initalized in dtLog ONLY
dtLogs()
rrLogs()
prLogs()
trLogs()
plLogs()

engine.listen({
  port: app.get('port'),
  graphqlPaths: ['/api/graphql'],
  expressApp: app,
  launcherOptions: {
    startupTimeout: 3000
  }
}, () => {
  console.log('Listening!')
})

// app.listen(app.get('port'), () => console.log(`Server started! ${server.graphqlPath}`))

// engine.listen({
//   port: app.get('port'),
//   expressApp: app
// })
// app.listen(app.get('port'), () => {
//   console.log(`app listening on port ${app.get('port')}`)
// })
