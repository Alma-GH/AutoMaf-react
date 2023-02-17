import React, {useEffect, useState} from 'react';
import Modal from "react-modal";
import cls from "./Modal.module.scss"

const ModalAlert = () => {

  const [alert, setAlert] = useState(
    window.screen.orientation.type  === "portrait-primary"
  )

  useEffect(()=>{

    function changeOrientation(){
      const type = window.screen.orientation.type  === "portrait-primary"
      setAlert(type)
    }

    window.addEventListener("orientationchange", changeOrientation)

    return ()=>{
      window.removeEventListener("orientationchange", changeOrientation)
    }

  }, [])

  return (
    <Modal
      isOpen={alert}
      className={cls.content}
      overlayClassName={cls.overlay}
    >
      <p>Переверните экран</p>
    </Modal>
  );
};

export default ModalAlert;