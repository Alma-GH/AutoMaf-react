import React from 'react';
import cls from "./CheckboxC.module.scss";

const CheckboxC = ({checked, setChecked, name}) => {
  return (
    <div className={cls.radio}>
      <div className={cls.choice}>
        <input type="checkbox"
               id={`custom-checkbox-${name}`}
               name={name}
               checked={checked}
               onChange={(e) => {setChecked({name, value: e.target.checked}) }}
        />
        <label htmlFor={`custom-checkbox-${name}`}>{name}</label>
      </div>
    </div>
  );
};

export default CheckboxC;