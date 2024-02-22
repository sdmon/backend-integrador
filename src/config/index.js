const { connect } = require("mongoose")
const dotenv = require('dotenv')
const { program } = require('../utils/commander.js')
const { MongoSingleton } = require("../utils/mongoSingleton.js")

const { mode } = program.opts()
dotenv.config({
  path: mode === 'production' ? './.env.production' : './.env.development'
})

exports.configObject = {
  PORT: process.env.PORT,
  mongo_url: process.env.MONGO_URL,
  persistence: process.env.PERSISTENCE,
  jwt_private_key: process.env.JWT_PRIVATE_KEY,
  gh_client_key: process.env.GH_CLIENT_KEY,
  gh_secret_key: process.env.GH_SECRET_KEY,
}

exports.connectDb = async () => {
  try {
    //await connect(process.env.MONGO_URL)
    MongoSingleton.getInstance(process.env.MONGO_URL)      
  } catch (error) {
    console.log(error)
  }
}
