const express = require("express");
const http = require("http");
const cors = require("cors")
const AuthController = require("./authController")
const authMiddleware = require("./authMiddleware")

const app = express();

app.use(cors())
app.use(express.json())
app.post('/login', AuthController.login);
app.post('/register', AuthController.registration);
app.get('/me', authMiddleware, AuthController.me)


const server = http.createServer(app);


module.exports = {
    server
}