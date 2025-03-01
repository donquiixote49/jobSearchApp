import express from "express";
import bootStrap from "./src/app.controller.js";
import { runSocket } from "./src/socket/index.js";
import chalk from "chalk";
import dotenv from "dotenv"
dotenv.config()
const app = express();
const port = process.env.PORT;
await bootStrap(app, express);
const server = app.listen(port, () => console.log(chalk.blue.bgRed.bold(`search job app listening on port ${port}!`)));

runSocket(server)


