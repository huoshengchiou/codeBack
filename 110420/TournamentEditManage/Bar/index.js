import React, { useState, useEffect, useRef } from 'react';

import { Link, withRouter } from "react-router-dom";

import { withConfigConsumer } from "contexts/Config";
import { withAuthConsumer } from "contexts/Auth";
import { withDialog_V2Consumer } from 'components/layouts/Dialog_V2/Context';
import { injectIntl } from 'react-intl';

import classes from './style.module.scss';

import Button from "components/DesignSystem/Input/Button";
import classNames from 'classnames/bind';

import Icon from 'components/DesignSystem/Base/Icons'
import { deleteTournament } from "apis/tournament";
import { from } from "rxjs";

const cx = classNames.bind(classes);


const Bar = (props) => {

    const { configData, match, history, location, authData, dialog_V2Data, intl, contentData } = props
    const { profile } = authData;
    const { openDialog_V2Func, closeDialog_V2Func } = dialog_V2Data;
    const fetchListener = useRef();
    const { apiWithTokenWrapper } = authData;
    const [isAdmin, setIsAdmin] = useState(false);
    const [isJudge, setIsJudge] = useState(false);
    const [status, setStatus] = useState(undefined);

    const [bracketType, setBracketType] = useState(null);


    useEffect(() => {
        if (contentData?.t8tdetail) {
            const { t8t_lite, t8t_staff, status, bracket_type } = contentData?.t8tdetail;
            setBracketType(bracket_type);
            setIsAdmin(t8t_lite.club.is_admin || t8t_lite.club.is_owner);
            if (t8t_staff.length > 0 && profile) {
                let staffArr = t8t_staff.find(item => item.member_id === profile.member_id);
                if (staffArr) {
                    setIsJudge(staffArr.role === "judge" ? true : false);
                }
            }
            setStatus(status);
        }
        return () => {
            if (fetchListener.current) {
                fetchListener.current.unsubscribe();
            }
        };
    }, [contentData,]);


    const deletTournament = () => {
        openDialog_V2Func({
            type: 'Warning',
            title: intl.formatMessage({
                id: "Tournament-Management-Bracket-Settings-Reset-Bracket_Delete Bracket",
            }),
            message: intl.formatMessage({
                id: "Tournament-Management-Bracket-Settings-Reset-Bracket_[content]Delete Bracket"
            }),
            buttons: [
                <Button
                    key="cancel"
                    title={intl.formatMessage({
                        id: "Tournament-Management-Bracket-Settings-Reset-Bracket_[btn]Cancel",
                    })}
                    theme="dark_2"
                    onClick={() => { closeDialog_V2Func(); }}
                />,
                <Button
                    key="confirm"
                    title={intl.formatMessage({
                        id: "Tournament-Management-Bracket-Settings-Reset-Bracket_[btn]Confirm",
                    })}
                    onClick={() => {
                        const data = {
                            t8t_serial: match.params.t8t_serial
                        }
                        fetchListener.current = from(
                            apiWithTokenWrapper(deleteTournament, data)
                        ).subscribe(res => {
                            if (res.status === 200) {
                                if (res.data.header.status.toUpperCase() === "OK") {
                                    closeDialog_V2Func();
                                    history.replace({
                                        ...location,
                                        pathname: `${configData.pathPrefix}/tournament/management/${match.params.clubid}`,
                                    });
                                }
                            }
                        });
                    }}
                />
            ],
        });
    }

    return (
        <div className={cx('full-width', 'box')}>
            <div className={cx('context', 'topBar')}>
                {/* Right */}
                <div>
                    <Link to={`${configData.pathPrefix}/tournament/management/${match.params.clubid}`}>&lt; Tournament management</Link>
                </div>
                {/* Left */}
                <div className={classes.rightContainer}>
                    {!match.params.t8t_serial ? "" : <>
                        <Button title={intl.formatMessage({ id: "Tournament-Management-Create-New-Tournament_View Public Page" })} theme="dark_2" size='sm_1' onClick={() => {
                            history.push({
                                ...location,
                                hash: "",
                                pathname: `${configData.pathPrefix
                                    }/tournament/list/${match.params.t8t_serial}/home`,
                            });
                        }} />
                        {status === undefined || status === "draft" || !isJudge ?
                            <Button title={intl.formatMessage({ id: "Tournament-Management-Create-New-Tournament_Bracket Master" })} theme="dark_1" size='sm_1' icon={{ name: "BracketMaster", dark: "dark", sm: 1 }} disabled={true} />
                            :
                            <Button title={intl.formatMessage({ id: "Tournament-Management-Create-New-Tournament_Bracket Master" })} theme="dark_2" size='sm_1' icon={{ name: "BracketMaster", dark: "dark", sm: 1 }} onClick={() => {

                                switch (bracketType) {
                                    case "ffa":
                                        history.push({
                                            ...location,
                                            pathname: `${configData.pathPrefix
                                                }/ffa/bracket-master/${match.params.t8t_serial}`,
                                        });
                                        break;

                                    default:
                                        history.push({
                                            ...location,
                                            pathname: `${configData.pathPrefix
                                                }/bracket-master/${match.params.t8t_serial}/room-service`,
                                        });
                                        break;
                                }
                            }} />
                        }
                        {isAdmin && status === "draft" ?
                            <div className={cx('icon')} onClick={() => deletTournament()}>
                                <Icon name={"Delete"} isButton={true} />
                            </div> : ""}

                    </>}
                </div>
            </div>
        </div>
    )
}

export default withRouter(withConfigConsumer(withDialog_V2Consumer(withAuthConsumer(injectIntl(Bar)))))