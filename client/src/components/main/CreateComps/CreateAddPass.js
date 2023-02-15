import React from 'react';
import InputC from "../../UI/InputC/InputC";
import CheckboxAdd from "../../UI/CheckboxAdd/CheckboxAdd";

const CreateAddPass = ({addPass,setAddPass, op, pass, setPass}) => {
  return (
    <CheckboxAdd choices={addPass} setChoices={setAddPass} op={op}>
      <InputC placeholder="Пароль" val={pass} setVal={setPass}/>
    </CheckboxAdd>
  );
};

export default CreateAddPass;