const expressLoader = require("./loaders/express")
require("dotenv").config()
const chalk = require("chalk")
const app = expressLoader()
const connectDB = require("./config/db")
const logger = require("./config/logger")

const PORT = process.env.PORT || 5000


// mongoDB Bağlantısı
connectDB()

app.listen(PORT, ()=>{
    logger.info(chalk.green(`Server is running on port ${PORT}`));
})

