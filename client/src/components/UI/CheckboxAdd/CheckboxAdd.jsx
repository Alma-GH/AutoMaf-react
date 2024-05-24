import React from 'react';
import CheckboxC from "../../UI/CheckboxC/CheckboxC";

const CheckboxAdd = ({choice,setChoice, op, children, contClass}) => {
  return (
    <>
      <CheckboxC checked={choice.value} setChecked={setChoice} name={choice.name}/>
      <div style={{ visibility: (op ? "visible" : "hidden") }} className={contClass}>
        {children}
      </div>
    </>
  );
};

export default CheckboxAdd;