import React, {useState} from 'react';
import GameTable from "../main/GameTable/GameTable";
import BtnText from "../UI/BtnText/BtnText";
import CardViewer from "../main/GameCardViewer/CardViewer";
import GameLog from "../main/GameLog/GameLog";

const GamePage = () => {


  //temp data
  const cards = [
    "mafia",
    "civil",
    "civil",
    "civil",
  ]
  const [isNight
    // , setIsNight
  ] = useState(false)


  return (
    <div className="gamePage">

      <div className="gameTable">
        <GameTable cards={cards}/>
      </div>

      <div className="btnCont">
        <BtnText text="Выйти" color="red"/>
        <BtnText text="Готов" disabled/>
      </div>

      <CardViewer enabled={true}/>

      <div className="gameLog">
        <GameLog/>
      </div>

      {isNight && <div className="gameBack"/>}
    </div>
  );
};

export default GamePage;