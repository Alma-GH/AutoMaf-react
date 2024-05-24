import React, {useContext} from 'react';
import cls from "./Modal.module.scss";
import Modal from "react-modal";
import Avatar from "../../main/Avatar/Avatar";
import {AvatarContext} from "../../../context/contexts";

const avatars = [1,2,3,4,5,6,7,8,9]

const ModalAvatarPicker = ({isOpen, onClose}) => {

  const {setAvatar} = useContext(AvatarContext)

  const getHandlerAvatarClick = (avatar) => () => {
    setAvatar(avatar)
    onClose()
  }

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className={cls.content_avatar}
      overlayClassName={cls.overlay}
    >
      {avatars.map(avatar => (
        <Avatar
          key={avatar}
          index={avatar}
          cb={getHandlerAvatarClick(avatar)}
        />
      ))}
    </Modal>
  );
};

export default ModalAvatarPicker;