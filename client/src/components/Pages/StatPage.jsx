import React, {useEffect, useState} from 'react';
import API from "../../tools/Services/API";
import Loader from "../Notification/Loader";
import BtnText from "../UI/BtnText/BtnText";
import {useNavigate} from "react-router-dom";
import {LINK_START} from "../../tools/const";
import MainCard from "../main/MainCard/MainCard";
import Header from "../main/Header/Header";

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
      <Header />

      <MainCard addCls="statBlock">
        <h2>Статистика</h2>

        <div className="info" >
          <div className='row'>
            <h3>Всего игр</h3>
            <span>{stat?.games}</span>
          </div>
          <div className='row'>
            <h3>Игр за мафию</h3>
            <span>{stat?.gamesMafia}</span>
          </div>
          <div className='row'>
            <h3>Игр за детектива</h3>
            <span>{stat?.gamesDet}</span>
          </div>
          <div className='row'>
            <h3>Игр за доктора</h3>
            <span>{stat?.gamesDoc}</span>
          </div>
          <br/><br/>
          <div className='row'>
            <h3>Всего побед</h3>
            <span>{stat?.win}</span>
          </div>
          <div className='row'>
            <h3>Побед за мафию</h3>
            <span>{stat?.winMafia}</span>
          </div>
          <div className='row'>
            <h3>Побед за детектива</h3>
            <span>{stat?.winDet}</span>
          </div>
          <div className='row'>
            <h3>Побед за доктора</h3>
            <span>{stat?.winDoc}</span>
          </div>
        </div>

        <BtnText text="Выйти" color="red" cb={() => nav(LINK_START)}/>
      </MainCard>
    </div>
  );
};

export default StatPage;