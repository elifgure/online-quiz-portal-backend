// express app setup
const express = require("express")
const cors = require("cors")
const morgan = require("morgan")

function expressLoader() {
    const app = express()

    // middlewares
    app.use(cors())
    app.use(express.json())
    app.use(morgan("dev"))
    
    // routes

    return app
}

module.exports = express