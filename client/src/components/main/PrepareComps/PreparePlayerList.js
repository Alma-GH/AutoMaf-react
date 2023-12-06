import React from 'react';
import clsWin from "../WindowInput/WindowInput.module.scss";
import PlayerSlot from "./PlayerSlot/PlayerSlot";
import GameService from "../../../tools/Services/GameService";

function getStringNumber(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash += str.charCodeAt(i);
  }
  return hash % 5;
}


const colors = ["red", "#00c509", "pink", "#ff6200", "#0f2fff", "lightblue"]

const PreparePlayerList = ({players, me}) => {

  return (
    <div className={clsWin.players}>
      {players.map(pl=>
        <PlayerSlot name={GameService.getName(pl)} col={colors[getStringNumber(GameService.getID(pl))]}
                    isLead={GameService.isLeader(pl,players)}
                    you={GameService.getID(pl) === GameService.getID(me)}
                    key={GameService.getID(pl)}
        />
      )}
    </div>
  );
};

export default PreparePlayerList;