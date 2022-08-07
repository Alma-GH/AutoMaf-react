import React, {useState} from 'react';
import BtnIco from "../../UI/BtnIco/BtnIco";
import imgUP from "../../../assets/imgs/up-chevron.png";
import cls from './CardViewer.module.scss'

const CardViewer = ({enabled=true}) => {

  const [visCard, setVisCard] = useState(false);
  let styleCard = [cls.parent]
  if(visCard) styleCard.push(cls.vis)
  if(!enabled) styleCard.push(cls.disable)

  return (
    <div className={styleCard.join(" ")}>
      <BtnIco img={imgUP} isAnimStyle={true} cb={()=>setVisCard(prev=>!prev)} disabled={!enabled}/>
      <div className={cls.myCard}>

      </div>
    </div>
  );
};

export default CardViewer;