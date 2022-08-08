import React, {useState} from 'react';
import GameTable from "../main/GameTable/GameTable";
import BtnText from "../UI/BtnText/BtnText";
import CardViewer from "../main/GameCardViewer/CardViewer";
import GameTimer from "../main/GameTimer/GameTimer"
import GameLog from "../main/GameLog/GameLog";
import {CARD_MAFIA,CARD_CIVIL} from "./../../tools/const"

const GamePage = () => {


  //temp data
  const cards = [
    CARD_MAFIA,
    CARD_CIVIL,
    CARD_CIVIL,
    CARD_CIVIL,
  ]
  const [isNight
    // , setIsNight
  ] = useState(false)
  const [endGame,
    // setEndGame
  ] = useState(false)


  return (
    <div className="gamePage">

      <div className="gameTable">
        <GameTable cards={cards}/>
      </div>

      <div className="btnCont">
        <BtnText text="Выйти" color="red"/>
        <BtnText text="Готов" disabled/>
        {endGame
          ? <BtnText text="Новая игра" color="yellow"/>
          : <GameTimer/>
        }
      </div>

      <CardViewer enabled={true}/>

      <div className="gameTimer">

      </div>


      <div className="gameLog">
        <GameLog/>
      </div>

      {isNight && <div className="gameBack"/>}
    </div>
  );
};

export default GamePage;