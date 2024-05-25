import React, {useContext} from 'react';
import BtnIco from "../../../UI/BtnIco/BtnIco";
import imgUP from "../../../../assets/imgs/up-chevron.png";
import cls from './CardViewer.module.scss'
import {
  CARD_BUTTERFLY,
  CARD_CIVIL,
  CARD_DETECTIVE,
  CARD_DOCTOR,
  CARD_MAFIA,
  SECOND_STYLE
} from "../../../../tools/const";
import {CardContext} from "../../../../context/contexts";
import GameService from "../../../../tools/Services/GameService";

const CardViewer = ({enabled=true, role}) => {


  const {visCard, setVisCard} = useContext(CardContext)
  let styleCard = [cls.parent]
  if(SECOND_STYLE){
    //DEP NIGHT PHASES 2
    styleCard.push(cls.parent_v2)
    if(role === CARD_MAFIA)
      styleCard.push(cls.maf)
    else if(role === CARD_CIVIL)
      styleCard.push(cls.civ)
  }
  if(visCard) styleCard.push(cls.vis)
  if(!enabled) styleCard.push(cls.disable)


  function getImageByRole(role){
    //DEP NIGHT PHASES 4
    const map = {
      [CARD_MAFIA]:
        <>
          <img src={GameService.getImgByRole(CARD_MAFIA)} alt="CARD"/>
          <div className={cls.description}>
            <h4>МАФИЯ</h4>
            <p>Вы можете убивать других. Ваша задача убить всех и не спалиться.</p>
          </div>
        </>,

      [CARD_CIVIL]:
        <>
          <img src={GameService.getImgByRole(CARD_CIVIL)} alt="CARD"/>
          <div className={cls.description}>
            <h4>МИРНЫЙ</h4>
            <p>Вы можете только голосовать днем. Ваша задача найти мафию и посадить</p>
          </div>
        </>,

      [CARD_DETECTIVE]:
        <>
          <img src={GameService.getImgByRole(CARD_DETECTIVE)} alt="CARD"/>
          <div className={cls.description}>
            <h4>ДЕТЕКТИВ</h4>
            <p>Вы можете проверять других на вшивость. Ваша задача найти мафию и посадить</p>
          </div>
        </>,

      [CARD_DOCTOR]:
        <>
          <img src={GameService.getImgByRole(CARD_DOCTOR)} alt="CARD"/>
          <div className={cls.description}>
            <h4>ДОКТОР</h4>
            <p>Вы можете лечить других. Ваша задача найти мафию и посадить</p>
          </div>
        </>,

      [CARD_BUTTERFLY]:
        <>
          <img src={GameService.getImgByRole(CARD_BUTTERFLY)} alt="CARD"/>
          <div className={cls.description}>
            <h4>БАБОЧКА</h4>
            <p>Вы можете предоставить другим алиби. Ваша задача найти мафию и посадить</p>
          </div>
        </>,
    }

    return map[role]
  }

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