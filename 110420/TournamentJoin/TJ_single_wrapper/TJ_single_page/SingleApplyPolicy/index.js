import React, { useState, useContext, useEffect } from 'react'

//state store
import { Singlegameprovider } from '../../TJ_single_state_store'
//translate
import { FormattedMessage } from 'react-intl'
import { Link } from "react-router-dom";
// btn func
import { teamhandleDd } from '../../TJ_single_handlebtn2'
//style  component
import Checkbox from "components/DesignSystem/Input/Checkbox";
import Button from "components/DesignSystem/Input/Button";
//fetch hook
import { useCreateSingleReg, useKillReg } from '../../useTJsinglefetch'

//images
import ico_global from 'images/TournamentJoin/ico_global.png'
import ico_lvl from 'images/TournamentJoin/ico_lvl.png'
import ico_schedule from 'images/TournamentJoin/ico_schedule.png'


//CSS
import classes from '../../../style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const SingleApplyPolicy = () => {
    const { gameType, history, location, gameStartTime, configData, intl, dialogData, authData, setCurrentPage, gamedetail, gameserial, setRegId, needjoincode, requireddatatitles, regid, dialog_V2Data } = useContext(Singlegameprovider)
    const { apiWithTokenWrapper } = authData
    const { closeDialogFunc } = dialogData;
    const { openDialog_V2Func, closeDialog_V2Func } = dialog_V2Data

    // useEffect(()=>{
    //     openDialog_V2Func({
    //         title: 'hello', message: '', type: 'Warning', buttons: []
    //     })


    // },[])

    // btnUI
    const [isChecked, setIsChecked] = useState(false);
    const [createreg, setCreateReg] = useState(false)

    const { single_reg_id } = useCreateSingleReg({ createreg, gameserial, apiWithTokenWrapper })

    useEffect(() => {
        if (single_reg_id === '' || !createreg) return
        //取回single_reg_id 更新給global
        setRegId(single_reg_id)
        // //TODO重置給Back回來的註冊流程
        // setCreateReg(false)
        //改變後依據data轉component
        if (needjoincode || requireddatatitles.length !== 0) {
            setCurrentPage(2)
        } else {
            setCurrentPage(3)
        }

    }, [single_reg_id])


    const handleNext = () => {
        //利用default狀態擋住fetch，改狀態後觸發fetch
        if (!isChecked) return
        //如果已經拿過regid//直接進行導頁
        if (regid) {
            if (needjoincode || requireddatatitles.length !== 0) {
                setCurrentPage(2)
            } else {
                setCurrentPage(3)
            }
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
        teamhandleDd({ dialog_V2Data, dialogData, setProcessRegKill, intl, gameserial, history, location, configData, InPageOne, regBefore })
    }

    return (
        <>
            <div className={classes.formWrapper}>
                <div className={cx('infoTitle')}>
                    {/* Format     */}
                    {intl.formatMessage({ id: 'TournamentJoin_Format' })}
                </div>
                <div className={cx('infoInner')}>
                    <div className={cx("clubIco", "global")}>
                        <img src={ico_global} alt="ico_global" />
                        <p>{gamedetail.region} | Bracket</p>
                    </div>
                    <div className={cx("clubIco", "lvl")}>
                        <img src={ico_lvl} alt="ico_lvl" />
                        {/* 1v1- Single Elimination Double Elimination Round Robin Swiss */}
                        <p>{`${intl.formatMessage({ id: 'TournamentJoin_Solo' })} - ${gameType.current}`}</p>
                    </div>
                    <div className={cx("clubIco", "schedule")}>
                        <img src={ico_schedule} alt="ico_schedule" />
                        <p>[{intl.formatMessage({ id: 'TournamentJoin_Start' })}]{` ${gameStartTime}`}</p>
                    </div>
                </div>
                <div className={cx('infoTitle')}>
                    {/* Ticket */}
                    {intl.formatMessage({ id: 'TournamentJoin_Ticket' })}
                </div>
                <div className={cx('infoInner')}>
                    <p className={cx('value')}>{intl.formatMessage({ id: `common_${gamedetail.ticket_type}` })}</p>
                    {/* TODO */}
                    {/* <p className={cx('message')}>Warning message!</p> */}
                </div>
                <div className={cx('infoTitle')}>
                    {/* Rule */}
                    {intl.formatMessage({ id: 'TournamentJoin_Rule' })}
                </div>
                <div className={cx('infoInner')}>
                    <p>{gamedetail.rule || intl.formatMessage({ id: "TournamentJoin_The Organizer doesn't provide rules." })}</p>
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
                    {/* 判斷isChecked擋往下頁 */}
                    <div><Button title={intl.formatMessage({ id: 'TournamentJoin_[btn]Next' })} theme="dark_2" disabled={!isChecked} onClick={() => { handleNext() }} /></div>
                </section>

            </div>
        </>
    )
}


export default SingleApplyPolicy



