const http = require("http")
const express = require("express")
const {WebSocketServer} = require("ws")



const PORT = process.env.PORT || 5000
const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server });


module.exports = {wss,server,PORT}



