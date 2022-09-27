import React from 'react';
import {Route, Routes} from "react-router-dom";
import {
  PATH_CREATE,
  PATH_ENTER,
  PATH_FIND, PATH_GAME,
  PATH_PREPARE,
  PATH_ROOT_APP,
  PATH_ROOT_ROOM,
  PATH_START
} from "../tools/const";
import EnterPage from "./Pages/EnterPage";
import StartPage from "./Pages/StartPage";
import CreatePage from "./Pages/CreatePage";
import FindPage from "./Pages/FindPage";
import PreparePage from "./Pages/PreparePage";
import GamePage from "./Pages/GamePage";

const AppRouter = () => {

  const nick = localStorage.getItem("nick")
  const Redirect = nick ? <StartPage/> : <EnterPage/>

  return (
    <Routes>
      <Route path={PATH_ROOT_APP}>
        <Route path={PATH_ENTER} element={<EnterPage/>}/>
        <Route path={PATH_START} element={<StartPage/>}/>
        <Route path={PATH_CREATE} element={<CreatePage/>}/>
        <Route path={PATH_FIND} element={<FindPage/>}/>

        <Route path={PATH_ROOT_ROOM}>
          <Route path={PATH_PREPARE} element={<PreparePage/>}/>
          <Route path={PATH_GAME} element={<GamePage/>}/>
        </Route>
      </Route>

      <Route path="*" element={Redirect}/>
    </Routes>
  );
};

export default AppRouter;