import React, { useContext, useEffect, useState } from 'react'

//state store
import { Singlegameprovider } from '../../TJ_single_state_store'


//styled component
import Button from "components/DesignSystem/Input/Button";

//reuse components
import Thumbnail from "components/DesignSystem/DataDisplay/Thumbnail";

//images
import ico_global from 'images/TournamentJoin/ico_global.png'
import ico_lvl from 'images/TournamentJoin/ico_lvl.png'
import ico_schedule from 'images/TournamentJoin/ico_schedule.png'

//btn func
import { singlehandleDIL, singlehandleRg, teamhandleDd } from '../../TJ_single_handlebtn2'

//fetch hook
import { useSendSingleReg, useKillReg } from '../../useTJsinglefetch'

//CSS
import classes from '../../../style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);
// main component

const SingleConfirmation = () => {

    const { playGameIcon, holdingClubName, tournamentName, gameType, setProcessDIL, history, location, gameStartTime, intl, gameRegEtime, dialogData, popWindowData, configData, authData, gameserial, regid, setCurrentPage, gamedetail, visitorinfo, needjoincode, readytosend, setReadyToSend, finalregdata, regitsterfinish, setRegitsterFinish, requireddatatitles, popWindowData_V2 } = useContext(Singlegameprovider)


    // console.log('visitorinfo', visitorinfo)
    //拿照片URL
    const { getImageUrl } = configData;

    const { apiWithTokenWrapper } = authData
    const { closeDialogFunc } = dialogData;

    // let regFinishFlag = false
    // useEffect(() => {
    //     const readIcon = playGameIcon.current ? getImageUrl(playGameIcon.current) : ''
    //     singlehandleRg({ popWindowDataV2, popWindowData_V2, popWindowData, visitorinfo, gamedetail, intl, history, location, configData, tournamentName, holdingClubName, readIcon })
    // }, [])
    //TODO  處理最後api打兩次的問題
    const { fetchfinish, RegBkOK } = useSendSingleReg({ readytosend, apiWithTokenWrapper, finalregdata, setReadyToSend })


    useEffect(() => {
        if (!fetchfinish) return
        // return console.log('RegBkOK', RegBkOK.current)
        if (RegBkOK.current) {
            //遊戲Icon
            const readIcon = playGameIcon.current ? getImageUrl(playGameIcon.current) : ''
            //當註冊成功觸發時才會轉頁過跳窗
            singlehandleRg({ popWindowData_V2, popWindowData, visitorinfo, gamedetail, intl, history, location, configData, tournamentName, holdingClubName, readIcon })
            history.replace({
                ...location,
                pathname: `${configData.pathPrefix}/tournament/list/${gameserial}/home`,
            });
            return
        }

    }, [fetchfinish])


    useEffect(() => {
        if (!regitsterfinish) return
        console.log('發動註冊')
        return setReadyToSend(true)

    }, [regitsterfinish])



    const handleregbtn = () => {
        // regFinishFlag = true
        // setReadyToSend(true)
        setRegitsterFinish(true)
        // await setReadyToSend(true)
    }
    // const handleregbtn = async () => {
    //     await setRegitsterFinish(true)
    //     await setReadyToSend(true)




    //TODO adjust畫面
    // useEffect(() => { singlehandleRg({ popWindowData, visitorinfo, gamedetail }) }, [])

    const handlebackbtn = () => {

        // console.log('needjoincode', needjoincode)

        if (needjoincode || requireddatatitles.length !== 0) {
            setCurrentPage(2)
        } else {
            setCurrentPage(1)
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
            {/* {console.log('requireddatatitles.length', requireddatatitles.length)} */}
            <div className={classes.formWrapper}>
                <div className={cx('infoTitle')}>
                    {/* Confirmation */}
                    {intl.formatMessage({ id: 'TournamentJoin_Confirmation' })}
                </div>
                <div className={cx('infoInner')}>
                    <div className={cx('col')}>
                        {/* Applier */}
                        <h4>{intl.formatMessage({ id: 'TournamentJoin_Applier' })}</h4>
                        <div className={cx('user')}>
                            <Thumbnail border={{ gap: 2 }} size="46px" imgUrl={getImageUrl(visitorinfo.profile.profile_picture)} />
                            <p>{visitorinfo.profile.username}</p>
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
                                <img src={ico_lvl} alt="ico_lvl" />
                                {/* 1v1- Single Elimination */}
                                <p>{`${intl.formatMessage({ id: 'TournamentJoin_Solo' })} - ${gameType.current}`}</p>
                            </div>
                            <div className={cx("clubIco", "schedule")}>
                                <img src={ico_schedule} alt="ico_schedule" />
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
                            {/* TODO */}
                            <Button title={intl.formatMessage({ id: 'TournamentJoin_[btn]Back' })} theme="dark_2" onClick={() => {
                                handlebackbtn()
                            }} />
                            <Button title={intl.formatMessage({ id: 'TournamentJoin_[btn]Discard' })} theme="dark_2" customClass={classes.Btn} onClick={() => { hadeleDiscardBtn() }} />
                        </li>
                        <li>
                            <Button title={intl.formatMessage({ id: 'TournamentJoin_[btn]Do it later' })}
                                theme="dark_2" onClick={() => { singlehandleDIL({ popWindowData_V2, popWindowData, gameRegEtime, intl, history, location, configData, gameserial, setProcessDIL }) }} />
                            <Button title={intl.formatMessage({ id: 'TournamentJoin_[btn]Register' })}
                                theme="dark_2" customClass={classes.Btn} disabled={regitsterfinish} onClick={() => {
                                    handleregbtn()
                                }} />

                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}


export default SingleConfirmation