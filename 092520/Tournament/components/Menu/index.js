import React, { useState } from "react";

import classes from "./styles.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(classes);

const Menu = props => {
    const { menuList } = props;

    return (
        <>
            {menuList.map((item, index) => {
                switch (item.layer) {
                    case 0:
                        return (
                            <div className={classes.layer0} key={index}>
                                {item.title}
                            </div>
                        );
                    default:
                        return (
                            <div
                                className={cx(
                                    classes.layer1,
                                    item.key === props.activeIndex ? classes.action : "",
                                    props.is_editFinish ? classes.finish : "",
                                )}
                                onClick={() => props.setSelectIndex({ item, index })}
                                key={index}
                            >
                                {item.title}
                            </div>
                        );
                }
            })}
        </>
    );
};

export default Menu;
