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
const io = socketService.init(server)
io.on('get_user_info', () => {
  io.emit('user_info', {
    name: socket.userName,
    role: socket.userRole
  });
});

// Socket.IO error handling
io.engine.on("connection_error", (err) => {
  console.log('Socket.IO Connection Error:', err.req);
  console.log('Error Code:', err.code);
  console.log('Error Message:', err.message);
  console.log('Error Context:', err.context);
});

// mongoDB Bağlantısı
connectDB()

server.listen(PORT, ()=>{
    logger.info(chalk.green(`Server is running on port ${PORT}`));
    logger.info(chalk.blue(`Socket.IO is ready for real-time notifications`));
})

