import React from 'react';
import cn from "./Header.module.scss"

const Header = () => {
    return (
        <div className={cn.container}>
            <p>Auto<span>MAF</span>online</p>
        </div>
    );
};

export default Header;