import React, {useState} from 'react';
import BtnText from "../UI/BtnText/BtnText";
import InputC from "../UI/InputC/InputC";

const EnterPage = () => {

  const [name, setName] = useState("")


  return (
    <div className="enterPage">
      <div className="inputCont">
        <InputC
                placeholder="Ваше имя"
                val={name}
                setVal={setName}
        />
        <BtnText text="Войти"/>
      </div>
    </div>
  );
};

export default EnterPage;