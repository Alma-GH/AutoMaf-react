import React from 'react';
import PlayerSlot from "../PlayerSlot/PlayerSlot";
import GameService from "../../../../tools/Services/GameService";
import cn from "./PreparePlayerList.module.scss"

const PreparePlayerList = ({players, me}) => {
  return (
    <div className={cn.container}>
      {players.map(pl=>
        <PlayerSlot
          name={GameService.getName(pl)}
          isLead={GameService.isLeader(pl,players)}
          isYou={GameService.getID(pl) === GameService.getID(me)}
          avatar={GameService.getAvatar(pl)}
          key={GameService.getID(pl)}
        />
      )}
    </div>
  );
};

export default PreparePlayerList;