import React from 'react';
import CheckboxC from "../../UI/CheckboxC/CheckboxC";
import InputC from "../../UI/InputC/InputC";

const CreateAddPass = ({addPass,setAddPass, op, pass, setPass}) => {
  return (
    <>
      <CheckboxC choices={addPass} setChoices={setAddPass}/>
      <div style={{ visibility: (op ? "visible" : "hidden") }}>
        <InputC
          placeholder="Пароль"
          val={pass}
          setVal={setPass}
        />
      </div>
    </>
  );
};

export default CreateAddPass;