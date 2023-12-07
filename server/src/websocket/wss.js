const {WebSocketServer} = require("ws");
const {server} = require("../app");
const wss = new WebSocketServer({ server });

module.exports = { wss };