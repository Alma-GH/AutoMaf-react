import React, {useState} from 'react';
import InputC from "../UI/InputC/InputC";
import BtnText from "../UI/BtnText/BtnText";
import useAuth from "../../hooks/useAuth";
import {LINK_ENTER, LINK_REGISTRATION} from "../../tools/const";
import {useNavigate} from "react-router-dom";
import Loader from "../Notification/Loader";
import {toast} from "react-toastify";

const LoginPage = () => {
    const nav = useNavigate()
    const {login, logout} = useAuth()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handlerLogin = () => {
        setLoading(true)
        login(username, password)
          .then((res) => {
              if(res.status === 201) nav(LINK_ENTER)
              else toast(res.message, {toastId: res.message})
              setLoading(false)
          })
    }
    const handlerNavRegister = () => {
        nav("../../" + LINK_REGISTRATION)
    }
    const handlerGuestEnter = () => {
      logout()
      nav("../../" + LINK_ENTER)
    }

    if(loading)
        return <Loader />

    return (
        <div className="authPage">
            <div className="inputCont">
                <h1>Вход</h1>
                <InputC
                    placeholder="Ваш логин"
                    val={username}
                    setVal={setUsername}
                />
                <InputC
                    type='password'
                    placeholder="Ваш пароль"
                    val={password}
                    setVal={setPassword}
                />
                <BtnText text="Войти" cb={handlerLogin} disabled={loading}/>
                <BtnText text="Регистрация" cb={handlerNavRegister} disabled={loading} type="secondary" />
                <BtnText text="Как гость" cb={handlerGuestEnter} disabled={loading} type="secondary"/>
            </div>
        </div>
    );
};

export default LoginPage;