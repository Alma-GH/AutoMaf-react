import React from 'react';
import cls from "./GameTable.module.scss"

//temp
const Avatar = ()=>{

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    }}>
      <div style={{
        height: "30px",
        aspectRatio:"1/1",
        borderRadius:"50%",
        backgroundColor: "#D9D9D9",
        border: "1px solid black"
      }} />
      <div style={{
        height: "40px",
        width:"80px",
        backgroundColor: "#D9D9D9",
        border: "1px solid black",
        borderRadius: "50% 50% 0 0 / 100% 100% 0 0"
      }} />
    </div>
  )
}


const GameTable = ({cards=[]}) => {

  //TODO: Card component

  return (
    <div className={cls.parent}>
      {cards.map(card=>(
        <div className={cls.card}>
          {card}
          <Avatar/>
        </div>
      ))}
    </div>
  );
};

export default GameTable;