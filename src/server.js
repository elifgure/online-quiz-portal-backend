const expressLoader = require("./loaders/express")
require("dotenv").config()
const chalk = require("chalk")
const http = require('http')
const socketService = require('./config/socket')
const app = expressLoader()
const connectDB = require("./config/db")
const logger = require("./config/logger")

const PORT = process.env.PORT || 5000

// HTTP server oluştur
const server = http.createServer(app)

// Socket.IO'yu başlat
socketService.init(server)

// mongoDB Bağlantısı
connectDB()

server.listen(PORT, ()=>{
    logger.info(chalk.green(`Server is running on port ${PORT}`));
    logger.info(chalk.blue(`Socket.IO is ready for real-time notifications`));
})

