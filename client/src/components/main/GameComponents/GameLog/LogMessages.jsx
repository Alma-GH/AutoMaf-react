import React, {useEffect, useRef} from 'react';
import cls from "./GameLog.module.scss";

const LogMessages = ({log}) => {
  const ref = useRef()

  useEffect(()=>{

    ref.current.scrollTo({
      top: ref.current.scrollHeight,
      behavior: "smooth"
    });

  }, [log])

  return (
    <ul className={cls.log} ref={ref}>
      {log?.map((message,ind)=>(
        //TODO: change key-index on key-id(time)
        <li key={ind}>
          {message.who}: {message.message}
        </li>
      ))}
    </ul>
  )
};

export default LogMessages;