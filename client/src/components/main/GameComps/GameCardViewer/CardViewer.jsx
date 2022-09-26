import React, {useState} from 'react';
import BtnIco from "../../../UI/BtnIco/BtnIco";
import imgUP from "../../../../assets/imgs/up-chevron.png";
import cls from './CardViewer.module.scss'
import {CARD_CIVIL, CARD_MAFIA} from "../../../../tools/const";
import imgCivil from "../../../../assets/imgs/civil-card.png"
import imgMafia from "../../../../assets/imgs/mafia-card.png"

const CardViewer = ({enabled=true, role}) => {

  function getImageByRole(role){
    const map = {
      [CARD_MAFIA]:
        <>
          <img src={imgMafia} alt="CARD"/>
          <div className={cls.description}>
            <h4>МАФИЯ</h4>
            <p>Вы можете убивать других. Ваша задача убить всех и не спалиться.</p>
          </div>
        </>,

      [CARD_CIVIL]:
        <>
          <img src={imgCivil} alt="CARD"/>
          <div className={cls.description}>
            <h4>МИРНЫЙ</h4>
            <p>Вы можете только голосовать днем. Ваша задача найти мафию и посадить</p>
          </div>
        </>,
    }

    return map[role]
  }

  //TODO: auto visible(take card)
  const [visCard, setVisCard] = useState(false);
  let styleCard = [cls.parent]
  if(visCard) styleCard.push(cls.vis)
  if(!enabled) styleCard.push(cls.disable)

  return (
    <div className={styleCard.join(" ")}>
      <BtnIco img={imgUP} isAnimStyle={true} cb={()=>setVisCard(prev=>!prev)} disabled={!enabled}/>
      <div className={cls.myCard}>
        {role
          ? getImageByRole(role)
          : "ВОЗЬМИ КАРТУ"
        }
      </div>
    </div>
  );
};

export default CardViewer;