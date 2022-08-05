import React from 'react';
import cls from "./CheckboxC.module.scss";

const CheckboxC = ({choices, setChoices}) => {

  /**
   * choices:
   * [
   * {name:"ON", value: true},
   * {name:"OFF", value: false}
   * ]
   *
  **/

  return (
    <ol className={cls.radio}>
      {choices.map((choice,ind)=>
        <li key={choice.name} className={cls.choice}>
          <input type="checkbox"
                 id={`custom-checkbox-${choice.name}`}
                 name={choice.name}
                 checked={choice.value}
                 onChange={()=> {
                   const arr = [...choices];
                   arr[ind].value = !arr[ind].value
                   setChoices(arr)
                 }}
          />
          <label htmlFor={`custom-checkbox-${choice.name}`}>{choice.name}</label>
        </li>
      )}

    </ol>
  );
};

export default CheckboxC;