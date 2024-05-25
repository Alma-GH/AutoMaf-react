import React from 'react';
import cn from "./PrepareCountPlayers.module.scss"

function getColorNum(num, max){
  if(num<4)
    return "red"
  if(num === max)
    return "#11ff00"
  return "yellow"
}

const PrepareCountPlayers = ({max,num, stage=0}) => {
  return (
    <div className={cn.container}>
      {(stage===0) &&
        <>
          <span>Количество игроков</span>
          <span style={{color: getColorNum(num, max)}}>
            {num}/{max}
          </span>
        </>
      }

      <StartLoader stage={stage}/>
    </div>
  );
};

export default PrepareCountPlayers;


const StartLoader = ({stage})=>{

  const list = [...Array(5).keys()]

  if(stage===0)
    return
  return (
    <div className={cn.load}>
      <ul>
        {list.map(ind=>{
          if(ind+1<=stage)  return <li key={ind} style={{opacity: 1}}/>
          else              return <li key={ind}/>
        })}
      </ul>
    </div>
  );
}