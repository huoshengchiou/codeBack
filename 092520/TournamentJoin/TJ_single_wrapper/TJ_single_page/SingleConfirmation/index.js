import React, { useContext, useEffect, useState } from 'react'

//state store
import { Singlegameprovider } from '../../TJ_single_state_store'


//styled component
import Button from "components/DesignSystem/Input/Button";

//format time
import moment from 'moment-timezone';


//reuse components
import Thumbnail from "components/DesignSystem/DataDisplay/Thumbnail";


//btn func
import { singlehandleDIL, singlehandleRg, teamhandleDd } from '../../TJ_single_handlebtn2'

//fetch hook
import { useSendSingleReg, useKillReg } from '../../useTJsinglefetch'


//CSS
import classes from '../../../style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

// const RegistrationFinished = ({ }) => {
//     return (
//         <div className={classes.registrationFinishedBox}>
//             <div className={cx('messageBox')}>
//                 <div className={cx('messageCol')}>
//                     <div className={cx('imgBlock')}>
//                         {/* <YesIcon /> */}
//                     </div>
//                     <div className={cx('logoBlock')}>
//                         <img src={require('../../../imgs/img_logo.png')} alt="" />
//                         <p>Planet9 League</p>
//                     </div>
//                 </div>
//                 <div className={cx('messageCol')}>
//                     <h5>Organizer</h5>
//                     <p>ClubName</p>
//                 </div>
//                 <div className={cx('messageCol')}>
//                     <h5>Organizer</h5>
//                     <p>ClubName</p>
//                 </div>
//             </div>
//             <Button title="Browse Other Battles" customClass={classes.finishBtn} />
//         </div>
//     )
// }



// const TournamentPending = ({ }) => {
//     return (
//         <div className={classes.tournamePendingBox}>
//             <div className={cx('messageBox')}>
//                 <p>You haven’t finished the registration flow. Registration will close on</p>
//                 <div className={cx('messageCol')}>
//                     <h5>2019/9/16 9:00AM~10:00AM | Asia/Taipei(+8)</h5>
//                 </div>
//                 <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet. Proin gravida dolor sit amet lacus accumsan et</p>
//             </div>
//             <Button title="Confirm" customClass={classes.confirmBtn} />
//         </div>
//     )
// }

// main component

const SingleConfirmation = () => {

    const { playGameIcon, holdingClubName, tournamentName, gameType, setProcessDIL, history, location, gameStartTime, intl, gameRegEtime, dialogData, popWindowData, configData, authData, gameserial, regid, setCurrentPage, gamedetail, visitorinfo, needjoincode, requrieddata, readytosend, setReadyToSend, finalregdata, regbtnclick, regitsterfinish, setRegitsterFinish, requireddatatitles } = useContext(Singlegameprovider)


    // console.log('visitorinfo', visitorinfo)
    //拿照片URL
    const { getImageUrl } = configData;

    const { apiWithTokenWrapper } = authData
    const { closeDialogFunc } = dialogData;

    // let regFinishFlag = false

    //TODO  處理最後api打兩次的問題
    const { fetchfinish, RegBkOK } = useSendSingleReg({ readytosend, apiWithTokenWrapper, finalregdata, setReadyToSend })


    useEffect(() => {
        if (!fetchfinish) return
        // return console.log('RegBkOK', RegBkOK.current)
        if (RegBkOK.current) {
            //遊戲Icon
            const readIcon = playGameIcon.current ? getImageUrl(playGameIcon.current) : ''
            //當註冊成功觸發時才會轉頁過跳窗
            singlehandleRg({ popWindowData, visitorinfo, gamedetail, intl, history, location, configData, tournamentName, holdingClubName, readIcon })
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
                            {/* <img src={getImageUrl(visitorinfo.profile.profile_picture)} alt="" /> */}
                            <p>{visitorinfo.profile.username}</p>
                        </div>
                    </div>
                    {/* <div className={cx('col')}>
                        <h4>Team</h4>
                        <p className={cx('status')}>%TeamName%</p>
                    </div> */}

                    <div className={cx('col')}>
                        {/* Format */}
                        <h4>{intl.formatMessage({ id: 'TournamentJoin_Format' })}</h4>
                        <div className={cx('content')}>
                            <div className={cx("clubIco", "global")}>
                                <img src={require('../../../imgs/ico_global.png')} alt="" />
                                {/* Bracket */}
                                <p>{gamedetail.region} | {intl.formatMessage({ id: 'TournamentJoin_Bracket' })}</p>
                            </div>
                            <div className={cx("clubIco", "lvl")}>
                                <img src={require('../../../imgs/ico_lvl.png')} alt="" />
                                {/* 1v1- Single Elimination */}
                                <p>{`${intl.formatMessage({ id: 'TournamentJoin_Solo' })} - ${gameType.current}`}</p>
                            </div>
                            <div className={cx("clubIco", "schedule")}>
                                <img src={require('../../../imgs/ico_schedule.png')} alt="" />
                                <p>[{intl.formatMessage({ id: 'TournamentJoin_Start' })}]{` ${gameStartTime}`}</p>
                            </div>
                        </div>
                    </div>
                    <div className={cx('col')}>
                        {/* Ticket */}
                        <h4>{intl.formatMessage({ id: 'TournamentJoin_Ticket' })}</h4>
                        <p className={cx('status')}>{gamedetail.ticket_type}</p>
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
                                theme="dark_2" onClick={() => { singlehandleDIL({ popWindowData, gameRegEtime, intl, history, location, configData, gameserial, setProcessDIL }) }} />
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