import React from 'react';
import { withConfigConsumer } from 'contexts/Config';

import classNames from "classnames/bind";
import classes from '../styles.module.scss';
//共用元件
import Thumbnail from "components/DesignSystem/DataDisplay/Thumbnail"
import {
    TrashIcon,
} from 'components/utils/Icons';

const cx = classNames.bind(classes);

const otherJudge = (props) => {
    const getImageUrl = props.configData.getImageUrl;
    return (
        <>
            <div className={cx("box")}>
                <div className={cx("mm")}>
                    <div className={cx("delete")} onClick={props.onDelete.bind(this, props.member_id)}>
                        <TrashIcon></TrashIcon>
                    </div>
                </div>
                <div className={classes.hand}>
                    <Thumbnail border={{ gap: 2 }} size="52px" imgUrl={getImageUrl(props.icon_image)} />
                </div>
                <div className={classes.info}>
                    <div className={classes.tt}>
                        {props.username}
                    </div>
                    <div className={classes.word}>{props.member_id}</div>
                </div>
            </div>
        </>
    )
}

export default withConfigConsumer(otherJudge)