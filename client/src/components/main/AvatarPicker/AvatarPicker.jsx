import React, {useContext} from 'react';
import cn from "./AvatarPicker.module.scss"
import ModalAvatarPicker from "../../UI/Modal/ModalAvatarPicker";
import useBoolean from "../../../hooks/useBoolean";
import {AvatarContext} from "../../../context/contexts";

const AvatarPicker = () => {

  const [isOpenModal, openModal, closeModal] = useBoolean(false)
  const {avatar} = useContext(AvatarContext)

  return (
    <>
      <button className={cn.container} onClick={openModal} type="button">
        {avatar}
      </button>

      <ModalAvatarPicker isOpen={isOpenModal} onClose={closeModal} />
    </>
  );
};

export default AvatarPicker;