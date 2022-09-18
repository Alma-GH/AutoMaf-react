import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import WebSocketTest from "./components/WebSocketTest";
import {DEBUG_SERVER_COMMANDS} from "./tools/const";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    DEBUG_SERVER_COMMANDS ? <WebSocketTest/> : <App />
);
