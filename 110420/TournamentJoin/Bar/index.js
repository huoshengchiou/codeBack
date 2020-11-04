import React, { useState, useEffect, useCallback, useContext, createElement, useRef } from 'react';

import { Link, Route, Switch, withRouter } from "react-router-dom";

import { withConfigConsumer } from "contexts/Config";
import { withAuthConsumer } from "contexts/Auth";
import { withDialogConsumer } from 'components/layouts/Dialog/Context';
import { injectIntl, FormattedMessage } from 'react-intl';

// import cx from 'classnames';
import classes from './style.module.scss';
import Button from "components/DesignSystem/Input/Button";
import classNames from 'classnames/bind';
import DialogBlock from 'components/blocks/DialogBlock';
import {
    TrashIcon,
} from 'components/utils/Icons';
import { getMemberClubList } from 'apis/club';
import { deleteTournament } from "apis/tournament";
import { from, range } from "rxjs";

const cx = classNames.bind(classes);


const Bar = (props) => {

    const { contentData } = props

    useEffect(() => {
    }, []);

    return (
        <div className={cx('full-width', 'box')}>
            <div className={cx('context', 'topBar')}>
                {/* Right */}
                <div className={classes.clubName}>
                    {contentData?.t8t_lite?.club.name}
                </div>
                {/* Left */}
                <div className={classes.rightContainer}>

                </div>
            </div>
        </div>
    )
}

export default withRouter(withConfigConsumer(withDialogConsumer(withAuthConsumer(injectIntl(Bar)))))