import React from 'react';
import {Navigate, Route, Routes} from "react-router-dom";
import {
  LINK_CREATE,
  LINK_ENTER,
  LINK_GAME,
  LINK_INVITE,
  LINK_LOGIN,
  LINK_PREPARE,
  LINK_REGISTRATION,
  LINK_START,
  LINK_STAT
} from "../tools/const";
import EnterPage from "./Pages/EnterPage";
import StartPage from "./Pages/StartPage";
import CreatePage from "./Pages/CreatePage";
import PreparePage from "./Pages/PreparePage";
import GamePage from "./Pages/GamePage";
import AuthGuard from "./guards/AuthGuard";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import StatPage from "./Pages/StatPage";
import InvitePage from "./Pages/InvitePage";

const AppRouter = () => {

  const Redirect = <Navigate to={LINK_ENTER} />

  return (
    <Routes>
      <Route path={LINK_REGISTRATION} element={<RegisterPage/>} />
      <Route path={LINK_LOGIN} element={<LoginPage/>} />

      <Route path={LINK_ENTER} element={<EnterPage/>}/>
      <Route path={LINK_START} element={<StartPage/>}/>
      <Route path={LINK_CREATE} element={<CreatePage/>}/>
      <Route path={LINK_INVITE} element={<InvitePage />}/>

      <Route path={LINK_PREPARE} element={<PreparePage/>}/>
      <Route path={LINK_GAME} element={<GamePage/>}/>

      <Route path="*" element={Redirect}/>

      <Route element={<AuthGuard/>}>
        <Route path={LINK_STAT} element={<StatPage/>}/>
      </Route>

      {/*<Route path="*" element={<Login/>}/>*/}
    </Routes>
  );
};

export default AppRouter;