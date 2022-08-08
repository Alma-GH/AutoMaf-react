import React, {useState} from 'react';
import cls from "./GameLog.module.scss"
import Loader from "../../Notification/Loader";
import BtnIco from "../../UI/BtnIco/BtnIco";
import imgVote from "./../../../assets/imgs/megaphone.png"
import imgCross from "./../../../assets/imgs/cancel.png"
import GameVote from "./../GameVote/GameVote"

const GameLog = () => {

  //temp data
  const info = {
    phase: "Подготовка",
    day: 0,
    prepare: "1/4"
  }
  const log = [
    {from:"Log", text: "Лобби создано"},
    {from:"Log", text: "Игрок Роман присоединился"},
    {from:"Log", text: "Игрок Никита присоединился"},
    {from:"Log", text: "Игрок Артур присоединился"},
    {from:"Log", text: "Игрок Дарья присоединился"},
  ]
  const [visVote, setVisVote] = useState(false);


  return (
    <div className={cls.parent}>
      <ul className={cls.info}>

        <li>
          Фаза:
          <br/> {info?.phase ? info.phase : <Loader/>}
        </li>
        <li>
          Номер дня:
          <br/> {info?.day !== undefined ? info.day : <Loader/>}
        </li>


        <li>
          Готовность:
          <br/> {info?.prepare ? info.prepare : <Loader/>}
        </li>

      </ul>

      <ul className={cls.log}>
        {log.map((message,ind)=>(
          //TODO: change key-index on key-id(time)
          <li key={ind}>
            {message.from}: {message.text}
          </li>
        ))}
      </ul>

      <div className={cls.vote}>
        <BtnIco
          cb={()=>setVisVote(prev=>!prev)}
          img={visVote?imgCross:imgVote}
          disabled={false}
          isAnimStyle={true}
        />
      </div>


      <GameVote vis={visVote}/>
    </div>
  );
};

export default GameLog;