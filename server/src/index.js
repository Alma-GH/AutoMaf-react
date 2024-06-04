require('dotenv').config()
const {server} = require("./httpServer");
const {connection} = require("./websocket/connection");
const {wss} = require("./websocket/wss");


const PORT = process.env.PORT || 5000

connection(wss)

server.listen(PORT, () => console.log("Server started on port: "+PORT))

