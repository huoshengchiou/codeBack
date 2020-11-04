import React from 'react';
import { withConfigConsumer } from 'contexts/Config';

import classNames from "classnames/bind";
import classes from '../styles.module.scss';
//共用元件
import Thumbnail from "components/DesignSystem/DataDisplay/Thumbnail"

const cx = classNames.bind(classes);

const fixedJudge = (props) => {
    const getImageUrl = props.configData.getImageUrl;
    return (
        <>
            <div className={cx("box", "disable")}>
                <div className={classes.hand}>
                    <Thumbnail border={{ gap: 2 }} size="52px" imgUrl={getImageUrl(props.icon_image)} />
                </div>
                <div className={classes.info}>
                    <div className={classes.tt}>
                        {props.username}
                    </div>
                    <div className={classes.word}>{props.Id}</div>
                </div>
            </div>
        </>
    )
}

export default withConfigConsumer(fixedJudge)