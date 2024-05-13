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
    const {login} = useAuth()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleLogin = () => {
        setLoading(true)
        login(username, password)
          .then((res) => {
              if(res.status === 201) nav(LINK_ENTER)
              else toast(res.message, {toastId: res.message})
              setLoading(false)
          })
    }
    const handleNavRegister = () => {
        nav("../../" + LINK_REGISTRATION)
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
                <BtnText text="Войти" cb={handleLogin} disabled={loading}/>
                <BtnText text="Регистрация" cb={handleNavRegister} disabled={loading} color={"yellow"}/>
            </div>
        </div>
    );
};

export default LoginPage;