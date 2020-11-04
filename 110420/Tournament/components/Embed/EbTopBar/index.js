import React from 'react';
//logo src
// import logoImg from './planet9logo.png'
import logoImg from '../../../../../../images/core/logo_planet.png'
//CSS
import classes from './style.module.scss';

const EbTopBar = () => {
    return (
        <>
            <div className={classes.logoBar}>
                <figure className={classes.logoWrapper}>
                    <img src={logoImg} alt="planet9logo" />
                </figure>
            </div>
        </>
    )
}

export default EbTopBar
