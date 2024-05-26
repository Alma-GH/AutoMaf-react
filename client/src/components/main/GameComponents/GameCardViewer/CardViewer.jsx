import React, {useContext} from 'react';
import BtnIco from "../../../UI/BtnIco/BtnIco";
import imgUP from "../../../../assets/imgs/up-chevron.png";
import cn from './CardViewer.module.scss'
import { CARD_CIVIL, CARD_DETECTIVE, CARD_DOCTOR, CARD_MAFIA} from "../../../../tools/const";
import {CardContext} from "../../../../context/contexts";
import GameService from "../../../../tools/Services/GameService";
import clsx from "clsx";


function getImageByRole(role){
  const map = {
    [CARD_MAFIA]:
      <>
        <img src={GameService.getImgByRole(CARD_MAFIA)} alt="CARD"/>
        <div className={cn.description}>
          <h4>МАФИЯ</h4>
          <p>Вы можете убивать других. Ваша задача убить всех и не спалиться.</p>
        </div>
      </>,

    [CARD_CIVIL]:
      <>
        <img src={GameService.getImgByRole(CARD_CIVIL)} alt="CARD"/>
        <div className={cn.description}>
          <h4>МИРНЫЙ</h4>
          <p>Вы можете только голосовать днем. Ваша задача найти мафию и посадить</p>
        </div>
      </>,

    [CARD_DETECTIVE]:
      <>
        <img src={GameService.getImgByRole(CARD_DETECTIVE)} alt="CARD"/>
        <div className={cn.description}>
          <h4>ДЕТЕКТИВ</h4>
          <p>Вы можете проверять других на вшивость. Ваша задача найти мафию и посадить</p>
        </div>
      </>,

    [CARD_DOCTOR]:
      <>
        <img src={GameService.getImgByRole(CARD_DOCTOR)} alt="CARD"/>
        <div className={cn.description}>
          <h4>ДОКТОР</h4>
          <p>Вы можете лечить других. Ваша задача найти мафию и посадить</p>
        </div>
      </>,
  }

  return map[role]
}

const CardViewer = ({role}) => {

  const {visCard, setVisCard} = useContext(CardContext)

  const handlerClick = () => setVisCard(prev=>!prev)

  return (
    <div
      className={clsx(
        cn.container,
        role === CARD_MAFIA && cn.maf,
        role === CARD_CIVIL && cn.civ,
        role === CARD_DOCTOR && cn.doc,
        role === CARD_DETECTIVE && cn.det,
        visCard && cn.vis
      )}
    >
      <BtnIco img={imgUP} cb={handlerClick} addCls={cn.button} />

      <div className={cn.myCard}>
        {role
          ? getImageByRole(role)
          : "ВОЗЬМИ КАРТУ"
        }
      </div>
    </div>
  );
};

export default CardViewer;