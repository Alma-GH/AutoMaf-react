const {WebSocketServer} = require("ws");
const {server} = require("../httpServer");

const wss = new WebSocketServer({ server });

module.exports = { wss };