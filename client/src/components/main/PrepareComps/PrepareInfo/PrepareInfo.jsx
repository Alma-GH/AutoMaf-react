import React, {useContext} from 'react';
import {RoomContext} from "../../../../context/contexts";
import cls from "./PrepareInfo.module.scss"
import GameService from "../../../../tools/Services/GameService";

const PrepareInfo = () => {


  const rContext = useContext(RoomContext)
  const room = rContext.room

  const password = GameService.getPassword(room)
  const name = GameService.getNameRoom(room)


  return (
    <div className={cls.parent}>
      <div>
        <h1>Название:</h1>
        <span>{name}</span>
      </div>
      {password &&
        <div>
          <h1>Пароль:</h1>
          <div className={cls.pass}>{password}</div>
        </div>
      }

    </div>
  );
};

export default PrepareInfo;