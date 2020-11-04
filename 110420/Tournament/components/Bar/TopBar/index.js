import React, { useState, useEffect, useCallback, useContext, createElement } from 'react';

//state store
import { TournamentContext } from '../../../TournamentContext'
import { Link } from 'react-router-dom';

// import cx from 'classnames';
import classes from '../style.module.scss';
import Button from "components/DesignSystem/Input/Button";
import classNames from 'classnames/bind';

const cx = classNames.bind(classes);


const HeaderTopBar = () => {
    const { authData, match, history, location, configData, CbId, GameSerial, intl, isClubAdmin, isThisGameJudge, VisitorStatus, bracketType } = useContext(TournamentContext)

    // history.replace({
    //     ...location,
    //     pathname: `${
    //         configData.pathPrefix
    //         }/player/${authData.getUsername()}`,
    // });


    // let isClubAdminFlag = null
    // let isThisGameJudgeFlag = null
    // const [isClubAdminRender, setIsClubAdminRender] = useState(true)
    // const [isThisGameJudgeRender, setIsThisGameJudgeRender] = useState(true)

    // useEffect(() => {
    //     setIsClubAdminRender(isClubAdmin.current)
    //     setIsThisGameJudgeRender(isThisGameJudge.current)
    // }, [authData, VisitorStatus])


    // console.log(configData.pathPrefix)

    return (
        <div className={cx('full-width', 'box')}>
            <div className={cx('context', 'topBar')}>
                {/* Right */}
                {/* intl.formatMessage({ id: 'Single-Tournament-Page_Contact' }) */}
                <div>
                    <Link to={`${configData.pathPrefix}/tournament/`}>&lt; {intl.formatMessage({ id: 'Single-Tournament-Page_Tournament Main Page' })}</Link>
                </div>
                {/* Left */}
                <div className={classes.rightContainer}>
                    {/* TODO only sense*/}
                    {/* !isThisGameJudge.current */}
                    {isThisGameJudge.current && (<Button disabled={!isThisGameJudge.current} title={intl.formatMessage({ id: 'Single-Tournament-Page_Bracket Master' })} theme="dark_2" size='sm_1' icon={{ name: "BracketMaster", dark: "dark", sm: 1 }} onClick={() => {
                        switch (bracketType.current) {
                            case 'ffa':
                                history.push({
                                    ...location,
                                    pathname: `${
                                        configData.pathPrefix
                                        }/ffa/bracket-master/${match.params.t8t_serial}`,
                                });
                                break;
                            default:
                                history.push({
                                    ...location,
                                    pathname: `${
                                        configData.pathPrefix
                                        }/bracket-master/${match.params.t8t_serial}/room-service`,
                                });
                                break;
                        }
                        // history.push({
                        //     ...location,
                        //     pathname: `${
                        //         configData.pathPrefix
                        //         }/bracket-master/${GameSerial}`,
                        // });
                    }} />)}
                    {/* disabled={!isClubAdmin.current} */}
                    {isClubAdmin.current && (<Button title={intl.formatMessage({ id: 'Single-Tournament-Page_Management' })} theme="dark_2" size='sm_1' icon={{ name: "Management", dark: "dark", sm: 1 }} onClick={() => {
                        history.push({
                            ...location,
                            pathname: `${
                                configData.pathPrefix
                                }/tournament/management/${CbId}`,
                        });
                    }} />)}
                </div>
            </div>
        </div>
    )
}

export default HeaderTopBar