import "./style/App.scss"
import React from "react";
import Debug from "./components/Debug";
import {BrowserRouter} from "react-router-dom";
import ErrorMessage from "./components/Notification/ErrorMessage";
import AppRouter from "./components/AppRouter";
import {DEBUG_PANEL} from "./tools/const";
import Reconnect from "./components/Reconnect";
import AuthProvider from "./components/providers/AuthProvider";
import GlobalProvider from "./components/providers/GlobalProvider";


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <GlobalProvider>
          <div className="App">
            <AppRouter/>
            {DEBUG_PANEL && <Debug/>}
            <ErrorMessage />
            <Reconnect/>
          </div>
        </GlobalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
