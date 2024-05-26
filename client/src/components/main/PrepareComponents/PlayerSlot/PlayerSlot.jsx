import React from 'react';
import cn from "./PlayerSlot.module.scss"
import clsx from "clsx";
import Avatar from "../../Avatar/Avatar";

const PlayerSlot = ({name, avatar, isLead, isYou}) => {

  return (
    <div className={clsx(cn.container, isYou && cn.you)}>
      <Avatar index={avatar} withCrown={isLead} addCls={cn.avatar} />

      <div className={cn.name}>
        {name}
      </div>
    </div>
  );
};

export default PlayerSlot;