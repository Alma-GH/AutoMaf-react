import React from 'react';
import cn from "./MainCard.module.scss"
import clsx from "clsx";

const MainCard = ({children, addCls}) => {
    return (
        <div className={clsx(cn.container, addCls)}>
            <div>
                {children}
            </div>
        </div>
    );
};

export default MainCard;