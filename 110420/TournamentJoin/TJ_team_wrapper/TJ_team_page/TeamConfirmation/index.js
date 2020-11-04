import React, { useState, useContext, useEffect } from 'react'


//styled component
import Button from "components/DesignSystem/Input/Button";


//format time
import moment from 'moment-timezone';


//global state
import { Teamgameprovider } from '../../TJ_team_state_store'

//outside global
import { withConfigConsumer } from 'contexts/Config';
import { withAuthConsumer } from 'contexts/Auth';

//footer btn control
import { teamhandleDIL, teamhandleRg, teamhandleDd } from '../../TJ_team_handlebtn'
import { withPopWindowConsumer } from 'components/layouts/PopWindow/Context';
import { withDialogConsumer } from 'components/layouts/Dialog/Context';

//reuse components
import Thumbnail from "components/DesignSystem/DataDisplay/Thumbnail";



//images
import ico_global from 'images/TournamentJoin/ico_global.png'
import ico_lvl from 'images/TournamentJoin/ico_lvl.png'
import ico_schedule from 'images/TournamentJoin/ico_schedule.png'

//api
import { useSendTeamReg, useKillReg } from '../../useTJteamfetch'

//隨機字串
import { generateRandomString } from 'components/utils';

//HOC context擇一使用
import { PopWindowStorage, withPopWindowConsumer as withPopWindowConsumer_2 } from 'components/DesignSystem/PopWindow_V2'


//CSS
import classes from '../../../style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);



const TeamConfirmation = () => {
    const { playGameIcon, holdingClubName, tournamentName, gameType, setProcessDIL, history, location, gameStartTime, intl, authData, popWindowData, configData, dialogData, gameserial, regid, starterarr, bencharr, currentselectteamname, gamedetail, setCurrentPage, needjoincode, requireddatatitles, readytosend, setReadyToSend, finalregdata, regitsterfinish, setRegitsterFinish, visitorinfo, gameRegEtime, popWindowData_V2 } = useContext(Teamgameprovider)

    const { getImageUrl } = configData;

    const { apiWithTokenWrapper } = authData
    const { closeDialogFunc } = dialogData;


    //POST Reg data
    const { fetchfinish, RegBkOK } = useSendTeamReg({ readytosend, apiWithTokenWrapper, finalregdata, setReadyToSend })

    useEffect(() => {
        // if (fetchfinish) {
        //     setReadyToSend(false)
        // }
        if (!fetchfinish) return

        if (RegBkOK.current) {
            //遊戲Icon
            const readIcon = playGameIcon.current ? getImageUrl(playGameIcon.current) : ''
            //當註冊成功觸發時才會轉頁過跳窗
            teamhandleRg({ popWindowData_V2, popWindowData, visitorinfo, gamedetail, intl, history, location, configData, tournamentName, holdingClubName, readIcon })
            history.replace({
                ...location,
                pathname: `${configData.pathPrefix}/tournament/list/${gameserial}/home`,
            });
        }




    }, [fetchfinish])

    useEffect(() => {
        if (!regitsterfinish) return
        console.log('發動隊伍註冊')
        return setReadyToSend(true)

    }, [regitsterfinish])



    const handleregbtn = () => {
        setRegitsterFinish(true)
    }



    const handlebackbtn = () => {
        // p1_TeamApplyPolicy p2_NoJoinTeam p3_SelectTeam p4_TeamJoinCodeAndRequireData p5_TeamConfirmation
        if (needjoincode || requireddatatitles.length !== 0) {
            setCurrentPage(4)
        } else {
            setCurrentPage(3)
        }
    }

    // --------------------------kill reg-----------------------------


    const [ProcessRegKill, setProcessRegKill] = useState(false)
    const { IsRegDelete } = useKillReg({ ProcessRegKill, apiWithTokenWrapper, gameserial, regid })
    useEffect(() => {
        // TODO//變動後轉頁
        if (IsRegDelete) {
            history.replace({
                ...location,
                pathname: `${configData.pathPrefix}/tournament/list/${gameserial}/home`,
            });
            closeDialogFunc()
        }
    }, [IsRegDelete])

    const hadeleDiscardBtn = () => {
        teamhandleDd({ dialogData, setProcessRegKill, intl, gameserial })
    }




    return (
        <>
            <div className={classes.formWrapper}>
                <div className={cx('infoTitle')}>
                    {/* Confirmation */}
                    {intl.formatMessage({ id: 'TournamentJoin_Confirmation' })}
                </div>
                <div className={cx('infoInner')}>
                    <div className={cx('col')}>
                        {/* Applier */}
                        <h4>{intl.formatMessage({ id: 'TournamentJoin_Applier' })}</h4>
                        {/* TODO使用登入者資料 */}
                        <div className={cx('user')}>
                            <Thumbnail border={{ gap: 2 }} size="46px" imgUrl={getImageUrl(visitorinfo.profile.profile_picture)} />
                            {/* <img src={getImageUrl(visitorinfo.profile.profile_picture)} alt="" /> */}
                            <p>{visitorinfo.getUsername()}</p>
                        </div>
                    </div>
                    <div className={cx('col')}>
                        {/* Team */}
                        <h4>{intl.formatMessage({ id: 'TournamentJoin_Team' })}</h4>
                        <p className={cx('status')}>{currentselectteamname}</p>
                    </div>
                    <div className={cx('col')}>
                        <h4>{`Lineup ( ${starterarr.length + bencharr.length} )`}</h4>
                        <div className={cx('user')}>

                            {starterarr.map(val => {
                                return (<div key={generateRandomString(5)} className={cx('imgWrapper')}><Thumbnail border={{ gap: 2 }} size="46px" imgUrl={getImageUrl(val.profile_picture)} key={generateRandomString(5)} /></div>
                                )
                            })}
                            {bencharr.map(val => {
                                return (<div key={generateRandomString(5)} className={cx('imgWrapper')}><Thumbnail border={{ gap: 2 }} size="46px" imgUrl={getImageUrl(val.profile_picture)} key={generateRandomString(5)} /></div>
                                )
                            })}
                        </div>
                    </div>
                    <div className={cx('col')}>
                        {/* Format */}
                        <h4>{intl.formatMessage({ id: 'TournamentJoin_Format' })}</h4>
                        <div className={cx('content')}>
                            <div className={cx("clubIco", "global")}>
                                <img src={ico_global} alt="ico_global" />
                                {/* Bracket */}
                                <p>{gamedetail.region} | {intl.formatMessage({ id: 'TournamentJoin_Bracket' })}</p>
                            </div>
                            <div className={cx("clubIco", "lvl")}>
                                <img src={ico_lvl} alt="clubIco" />
                                {/* TvT- Single Elimination */}
                                <p>{`${intl.formatMessage({ id: 'TournamentJoin_Team' })} - ${gameType.current}`}</p>
                            </div>
                            <div className={cx("clubIco", "schedule")}>
                                <img src={ico_schedule} alt="" />
                                <p>[{intl.formatMessage({ id: 'TournamentJoin_Start' })}]{` ${gameStartTime}`}</p>
                            </div>
                        </div>
                    </div>
                    <div className={cx('col')}>
                        {/* Ticket */}
                        <h4>{intl.formatMessage({ id: 'TournamentJoin_Ticket' })}</h4>
                        <p className={cx('status')}>{intl.formatMessage({ id: `common_${gamedetail.ticket_type}` })}</p>
                    </div>
                </div>
                <div className={cx('fourbtnArea')}>
                    <ul>
                        <li>
                            <Button title={intl.formatMessage({ id: 'TournamentJoin_[btn]Back' })}
                                theme="dark_2" onClick={() => { handlebackbtn() }} />
                            <Button title={intl.formatMessage({ id: 'TournamentJoin_[btn]Discard' })}
                                theme="dark_2" customClass={classes.Btn} onClick={() => { hadeleDiscardBtn() }} />
                        </li>
                        <li>
                            <Button title={intl.formatMessage({ id: 'TournamentJoin_[btn]Do it later' })}
                                theme="dark_2" onClick={() => { teamhandleDIL({ popWindowData_V2, popWindowData, gameRegEtime, intl, history, location, configData, gameserial, setProcessDIL }) }} />
                            <Button title={intl.formatMessage({ id: 'TournamentJoin_[btn]Register' })}
                                theme="dark_2" customClass={classes.Btn} onClick={() => { handleregbtn() }} />

                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}


export default TeamConfirmation