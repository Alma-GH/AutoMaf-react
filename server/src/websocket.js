import http from "http"
import express from "express"
import {WebSocketServer} from "ws";



const PORT = process.env.PORT || 5000
const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server });


export {wss,server,PORT}



