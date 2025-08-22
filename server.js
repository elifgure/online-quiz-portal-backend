const expressLoader = require("./src/loaders/express")
const dotenv = require("dotenv")
const chalk = require("chalk")

dotenv.config()

const app = expressLoader()
const PORT = process.env.PORT || 5000

app.listen(PORT, ()=>{
    console.log(chalk.green(`Server is running on port ${PORT}`));
})