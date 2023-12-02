import React, {useState} from 'react';
import InputC from "../UI/InputC/InputC";
import BtnText from "../UI/BtnText/BtnText";
import useAuth from "../../hooks/useAuth";
import {useNavigate} from "react-router-dom";
import {LINK_ENTER, LINK_LOGIN} from "../../tools/const";
import Loader from "../Notification/Loader";

const Register = () => {
    const nav = useNavigate()
    const {register} = useAuth()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    const handleRegister = () => {
        setLoading(true)
        register(username, password)
            .then(isSuccess => {
                if(isSuccess) nav(LINK_ENTER)
                setLoading(false)
            })
    }
    const handleNavLogin = () => {
        nav("../../" + LINK_LOGIN)
    }

    if(loading)
        return <Loader />

    return (
        <div className="authPage">
            <div className="inputCont">
                <h1>Регистрация</h1>
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
                <BtnText text="Создать" cb={handleRegister} disabled={loading}/>
                <BtnText text="Вход" cb={handleNavLogin} disabled={loading} color={"yellow"}/>
            </div>
        </div>
    );
};

export default Register;