import React, { useState, useEffect, useRef } from "react";

import { withConfigConsumer } from "contexts/Config";
import { withAuthConsumer } from "contexts/Auth";
import { Link, Route, Switch, withRouter } from "react-router-dom";
import { injectIntl } from 'react-intl';

import classes from "./styles.module.scss";



const HeaderBar = (props) => {
    const { getImageUrl } = props.configData;
    const { t8t_lite, status, participants_count } = props.detail;
    const { game } = t8t_lite;
    const { intl } = props

    const getStatusValue = (status) => {
        switch (status) {
            case 'draft':
                return intl.formatMessage({ id: 'Tournament-Management-Page_Draft' });
            case 'registration_opened':
                return intl.formatMessage({ id: 'Tournament-Management-Page_Registration Open' });
            case 'registration_closed':
                return intl.formatMessage({ id: 'Tournament-Management-Page_Registration Closed' });
            case 'ongoing':
                return intl.formatMessage({ id: 'Tournament-Management-Page_Event Onging' });
            case 'completed':
                return intl.formatMessage({ id: 'Tournament-Management-Page_Completed' });
            default:
                return;
        }
    }

    return (
        <div className={classes.titlebar}>
            <div className={classes.name}>
                {game.icon_image === null ? "" : <img src={getImageUrl(game.icon_image)} />}
                {game.name}
                {/* Draft */}
                {status === "draft" ? <span>{intl.formatMessage({ id: 'Tournament-Management-Page_Draft' })}</span> : ""}
            </div>
            <div className={classes.colorBox}>
                <div>
                    <span>{intl.formatMessage({ id: 'Tournament-Management-Page_Participants' })}</span>{props.participants_count !== undefined ? props.participants_count : participants_count}
                </div>
                <div>
                    <span>{intl.formatMessage({ id: 'Tournament-Management-Page_Status' })}</span>{getStatusValue(status)}
                </div>
            </div>
        </div>
    );
};

export default withRouter(
    withAuthConsumer(withConfigConsumer(withConfigConsumer(injectIntl(HeaderBar))))
);
