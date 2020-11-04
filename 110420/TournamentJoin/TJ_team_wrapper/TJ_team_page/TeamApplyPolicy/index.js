import React, { useState, useContext, useEffect, useRef } from 'react'

import Checkbox from "components/DesignSystem/Input/Checkbox";
import Button from "components/DesignSystem/Input/Button";


import { teamhandleDd } from '../../TJ_team_handlebtn'


import { FormattedMessage } from 'react-intl'


import { Link } from "react-router-dom";


//global state
import { Teamgameprovider } from '../../TJ_team_state_store'

//apis
import { useCreateTeamReg, useKillReg } from '../../useTJteamfetch'

//images
import ico_global from 'images/TournamentJoin/ico_global.png'
import ico_lvl from 'images/TournamentJoin/ico_lvl.png'
import ico_schedule from 'images/TournamentJoin/ico_schedule.png'

//CSS
import classes from '../../../style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const TeamApplyPolicy = () => {
    const [isChecked, setIsChecked] = useState(false);

    const { gameType, history, location, gameStartTime, configData, intl, authData, dialogData, setCurrentPage, gamedetail, gameserial, setRegId, visitorhasteams, regid } = useContext(Teamgameprovider)
    const { apiWithTokenWrapper } = authData
    const { closeDialogFunc } = dialogData;

    const [createreg, setCreateReg] = useState(false)
    const { team_reg_id } = useCreateTeamReg({ createreg, gameserial, apiWithTokenWrapper })
    useEffect(() => {
        if (team_reg_id === '') return
        //取回team_reg_id 更新給global
        setRegId(team_reg_id)
        //判斷vistor有沒有隊伍，沒有轉2
        //利用default狀態擋住fetch，改狀態後觸發fetch
        if (visitorhasteams.length === 0) {
            setCurrentPage(2)
            return
        }
        setCurrentPage(3)
        // p1_TeamApplyPolicy p2_NoJoinTeam p3_SelectTeam p4_TeamJoinCodeAndRequireData p5_TeamConfirmation
        // if (visitorhasteams.length !== 0) {
        //     console.log('here')
        //     setCurrentPage(3)
        // } else {
        //     setCurrentPage(2)
        // }

    }, [team_reg_id])


    const handlenextbtn = () => {
        if (!isChecked) return
        //已經拿過reg直接轉頁不fetch
        if (regid) {
            if (visitorhasteams.length === 0) {
                setCurrentPage(2)
                return
            }
            setCurrentPage(3)
            return
        }
        setCreateReg(true)

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

    const InPageOne = true

    //already reg before
    let regBefore = gamedetail.myself?.participant;


    const hadeleDiscardBtn = () => {
        teamhandleDd({ dialogData, setProcessRegKill, intl, gameserial, history, location, configData, InPageOne, regBefore })
    }

    // const hadeleDiscardBtn = () => {
    //     const InPageOne = true
    //     //TODO此頁直接轉頁//不會走到創建reg id
    //     teamhandleDd({ dialogData, intl, history, location, configData, gameserial, InPageOne })
    // }



    return (
        <>
            <div className={classes.formWrapper}>
                <div className={cx('infoTitle')}>
                    {/* Format */}
                    {intl.formatMessage({ id: 'TournamentJoin_Format' })}
                </div>
                <div className={cx('infoInner')}>
                    <div className={cx("clubIco", "global")}>
                        <img src={ico_global} alt="" />
                        {/* Bracket */}
                        <p>{gamedetail.region} | {intl.formatMessage({ id: 'TournamentJoin_Bracket' })}</p>
                    </div>
                    <div className={cx("clubIco", "lvl")}>
                        <img src={ico_lvl} alt="" />
                        {/* TvT-Single Elimination */}
                        <p>{`${intl.formatMessage({ id: 'TournamentJoin_Team' })} - ${gameType.current}`}</p>
                    </div>
                    <div className={cx("clubIco", "schedule")}>
                        <img src={ico_schedule} alt="" />
                        {/* 比賽開始時間 */}
                        <p>[{intl.formatMessage({ id: 'TournamentJoin_Start' })}]{` ${gameStartTime}`}</p>
                    </div>
                </div>
                <div className={cx('infoTitle')}>
                    {intl.formatMessage({ id: 'TournamentJoin_Ticket' })}
                    {/* Ticket */}
                </div>
                <div className={cx('infoInner')}>
                    {/* 需要票券 */}
                    <p className={cx('value')}>{intl.formatMessage({ id: `common_${gamedetail.ticket_type}` })}</p>
                    {/* TODO */}
                    {/* <p className={cx('message')}>Warning message!</p> */}
                </div>
                <div className={cx('infoTitle')}>
                    {/* Rule */}
                    {intl.formatMessage({ id: 'TournamentJoin_Rule' })}
                </div>
                <div className={cx('infoInner')}><p>{gamedetail.rule || intl.formatMessage({ id: "TournamentJoin_The Organizer doesn't provide rules." })}</p>
                    {/* <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et viv kerra justo c o mm odo. Proin sodales pulvi nar tempor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam fermentum, nulla luctus pharetra vulput ate, feldis tel lus m ollis orc i, sed rho ncus sap ien nunc eget odio.</p> */}
                    <div className={cx('agreement')}>
                        <Checkbox
                            title=''
                            checked={isChecked}
                            onChange={() => setIsChecked(!isChecked)}
                            customClass={classes.checkAgreement}
                        />
                        <p>
                            <FormattedMessage
                                id={"TournamentJoin_I agree the Tournament Rule, {term_of_use} and {privacy_policy}"}
                                values={{
                                    term_of_use: <Link to={`${configData.pathPrefix}/policy/member-terms-of-use`} target="_BLANK"><FormattedMessage id="TournamentJoin_Term of Use" /></Link>,
                                    privacy_policy: <Link to={`${configData.pathPrefix}/policy/privacy-policy`} target="_BLANK"><FormattedMessage id="TournamentJoin_Privacy Policy" /></Link>
                                }}
                            />
                            .
                        </p>
                    </div>
                </div>
                <section className={cx('btnArea')}>
                    <div><Button title={intl.formatMessage({ id: 'TournamentJoin_[btn]Discard' })}
                        theme="dark_2" onClick={() => { hadeleDiscardBtn() }} /></div>
                    {/* //往內判斷轉2或轉3 */}
                    <div><Button title={intl.formatMessage({ id: 'TournamentJoin_[btn]Next' })}
                        theme="dark_2" disabled={!isChecked} onClick={() => handlenextbtn()} /></div>
                </section>

            </div>
        </>
    )
}


export default TeamApplyPolicy