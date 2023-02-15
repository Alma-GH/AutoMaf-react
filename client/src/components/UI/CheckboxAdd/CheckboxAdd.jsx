import React from 'react';
import CheckboxC from "../../UI/CheckboxC/CheckboxC";

const CheckboxAdd = ({choices,setChoices, op, children, contClass}) => {
  return (
    <>
      <CheckboxC choices={choices} setChoices={setChoices}/>
      <div style={{ visibility: (op ? "visible" : "hidden") }} className={contClass}>
        {children}
      </div>
    </>
  );
};

export default CheckboxAdd;