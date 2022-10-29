import React, {useContext} from 'react';
import BtnIco from "../../../UI/BtnIco/BtnIco";
import imgUP from "../../../../assets/imgs/up-chevron.png";
import cls from './CardViewer.module.scss'
import {CARD_CIVIL, CARD_MAFIA, SECOND_STYLE} from "../../../../tools/const";
import imgCivil from "../../../../assets/imgs/civil-card.png"
import imgCivil2 from "../../../../assets/imgs/civil-card2.png"
import imgMafia from "../../../../assets/imgs/mafia-card.png"
import imgMafia2 from "../../../../assets/imgs/mafia-card2.png"
import {CardContext} from "../../../../context/contexts";

const CardViewer = ({enabled=true, role}) => {

  function getImageByRole(role){
    const map = {
      [CARD_MAFIA]:
        <>
          <img src={!SECOND_STYLE ? imgMafia : imgMafia2} alt="CARD"/>
          <div className={cls.description}>
            <h4>МАФИЯ</h4>
            <p>Вы можете убивать других. Ваша задача убить всех и не спалиться.</p>
          </div>
        </>,

      [CARD_CIVIL]:
        <>
          <img src={!SECOND_STYLE ? imgCivil : imgCivil2} alt="CARD"/>
          <div className={cls.description}>
            <h4>МИРНЫЙ</h4>
            <p>Вы можете только голосовать днем. Ваша задача найти мафию и посадить</p>
          </div>
        </>,
    }

    return map[role]
  }

  const {visCard, setVisCard} = useContext(CardContext)
  let styleCard = [cls.parent]
  if(SECOND_STYLE){
    styleCard.push(cls.parent_v2)
    if(role === CARD_MAFIA)
      styleCard.push(cls.maf)
    else if(role === CARD_CIVIL)
      styleCard.push(cls.civ)
  }
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