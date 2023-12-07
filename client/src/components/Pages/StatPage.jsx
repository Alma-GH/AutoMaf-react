import React, {useEffect, useState} from 'react';
import WindowInput from "../main/WindowInput/WindowInput";
import API from "../../tools/Services/API";
import Loader from "../Notification/Loader";
import clsWin from "../main/WindowInput/WindowInput.module.scss";
import BtnText from "../UI/BtnText/BtnText";
import GameService from "../../tools/Services/GameService";
import {useNavigate} from "react-router-dom";
import {LINK_START} from "../../tools/const";

const StatPage = () => {
  const nav = useNavigate()
  const [stat, setStat] = useState(null)

  useEffect(() => {

    async function fetchStat() {
      const res = await API.getStatistic()
      if(!res)
        return

      const data = await res.json()
      if(data?.statistic)
        setStat(data.statistic)
      console.log(data)
    }

    fetchStat()
  }, [])

  if(stat === null)
    <Loader/>

  return (
    <div className='statPage'>
      <h1>Статистика</h1>
      <WindowInput>
        <div className='statWindow'>
          <div className='row'>
            <h2>Всего игр</h2>
            <span>{stat?.games}</span>
          </div>
          <div className='row'>
            <h2>Игр за мафию</h2>
            <span>{stat?.gamesMafia}</span>
          </div>
          <div className='row'>
            <h2>Игр за детектива</h2>
            <span>{stat?.gamesDet}</span>
          </div>
          <div className='row'>
            <h2>Игр за доктора</h2>
            <span>{stat?.gamesDoc}</span>
          </div>
          <br/><br/><br/><br/><br/>
          <div className='row'>
            <h2>Всего побед</h2>
            <span>{stat?.win}</span>
          </div>
          <div className='row'>
            <h2>Побед за мафию</h2>
            <span>{stat?.winMafia}</span>
          </div>
          <div className='row'>
            <h2>Побед за детектива</h2>
            <span>{stat?.winDet}</span>
          </div>
          <div className='row'>
            <h2>Побед за доктора</h2>
            <span>{stat?.winDoc}</span>
          </div>

          <div className={clsWin.btnCont}>
            <BtnText text="Выйти" color="red" cb={() => nav(LINK_START)}/>
          </div>
        </div>
      </WindowInput>
    </div>
  );
};

export default StatPage;