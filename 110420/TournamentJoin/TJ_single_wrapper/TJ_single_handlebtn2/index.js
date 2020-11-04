// 專責管理1v1 all btn  JSX及function


import React from 'react'

import Button from "components/DesignSystem/Input/Button";

import { EmptySucessIcon } from 'components/utils/Icons'
import DialogBlock from 'components/blocks/DialogBlock';

import classes from '../../style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);





// -------------------------------doItLater(DIL)------------------------
export const singlehandleDIL = ({ popWindowData_V2, popWindowData, gameRegEtime, intl, history, location, configData, gameserial, setProcessDIL }) => {
    // const { openPopWindow, closePopWindow } = popWindowData_V2;
    // openPopWindow({
    //     title: intl.formatMessage({ id: 'TournamentJoin_Tournament Pending' }),
    //     component: (<>
    //         <pop-content>
    //             <div className={cx('tournamePendingBox')}>
    //                 <div className={cx('messageBox')}>
    //                     <p>{intl.formatMessage({ id: "TournamentJoin_You haven't finished the registration flow. Registration will close on" })}</p>
    //                     <div className={cx('messageCol')}>
    //                         <h5>{gameRegEtime}</h5>
    //                     </div>
    //                     <p>{intl.formatMessage({ id: 'TournamentJoin_1v1PendingMsg' })}</p>
    //                 </div>
    //             </div>
    //         </pop-content>
    //         <btn-group>
    //             <Button title={intl.formatMessage({ id: 'TournamentJoin_[btn]Confirm' })}
    //                 customClass={classes.confirmBtn} onClick={() => {
    //                     setProcessDIL(true)
    //                 }} />
    //             <Button title={intl.formatMessage({ id: 'TournamentJoin_[btn]Cancel' })}
    //                 customClass={classes.confirmBtn} theme="light_2" onClick={() => {
    //                     closePopWindow()
    //                 }} />
    //         </btn-group>
    //     </>),
    // })


    const { openPopWindowFunc, closePopWindowFunc } = popWindowData;
    const popWindowAttributes = {
        component: TournamentPending,
        componentProps: {
            title: intl.formatMessage({ id: 'TournamentJoin_Tournament Pending' }),
            gameRegEtime,
            intl,
            history,
            location,
            configData,
            gameserial,
            setProcessDIL,
            closePopWindowFunc,
        },
        closeByButtonOnly: true,
        isFullModeForMobile: false,
    };
    openPopWindowFunc(popWindowAttributes);
}



//----------------------------doItLater(DIL)  JSX 

export const TournamentPending = props => {
    return (
        <>
            <div className={classes.tournamePendingBox}>
                <div className={cx('messageBox')}>
                    <p>{props.intl.formatMessage({ id: "TournamentJoin_You haven't finished the registration flow. Registration will close on" })}</p>
                    <div className={cx('messageCol')}>
                        <h5>{props.gameRegEtime}</h5>
                    </div>
                    <p>{props.intl.formatMessage({ id: 'TournamentJoin_1v1PendingMsg' })}</p>
                </div>
                <div className={cx('btnwrapper')}>
                    <Button title={props.intl.formatMessage({ id: 'TournamentJoin_[btn]Confirm' })}
                        customClass={classes.confirmBtn} onClick={() => {
                            props.setProcessDIL(true)
                        }} />
                    <Button title={props.intl.formatMessage({ id: 'TournamentJoin_[btn]Cancel' })}
                        customClass={classes.confirmBtn} theme="light_2" onClick={() => {
                            props.closePopWindowFunc()
                        }} />
                </div>
            </div>
        </>
    )
}

// -----------------------------Registration(Rg) ------------------
export const singlehandleRg = ({ popWindowData_V2, popWindowData, visitorinfo, gamedetail, intl, history, location, configData, tournamentName, holdingClubName, readIcon }) => {

    const { openPopWindow, closePopWindow } = popWindowData_V2;
    openPopWindow({
        title: intl.formatMessage({ id: 'TournamentJoin_Registration Finished!' }),
        component: (<>
            <pop-content>
                <div className={cx('RegMessageBox')}>
                    <div className={cx('RegMessageCol')}>
                        <div className={cx('imgBlock')}>
                            <EmptySucessIcon />
                        </div>
                        <div className={cx('logoBlock')}>
                            <img src={readIcon} alt="gameIconLost" />
                            <p>{tournamentName.current}</p>
                        </div>
                    </div>
                    <div className={cx('RegMessageCol')}>
                        <h5>{intl.formatMessage({ id: 'TournamentJoin_Organizer' })}</h5>
                        <p>{holdingClubName.current}</p>
                    </div>
                    <div className={cx('RegMessageCol')}>
                        <h5>{intl.formatMessage({ id: 'TournamentJoin_Payment Detail' })}</h5>
                        {/* use DB key as translate ref */}
                        <p>{intl.formatMessage({ id: `common_${gamedetail.ticket_type}` })}</p>
                    </div>
                </div>
            </pop-content>
            <btn-group>
                <Button title={intl.formatMessage({ id: 'TournamentJoin_[btn]Browse Other Battles' })}
                    customClass={classes.finishBtn} onClick={() => {
                        history.push({
                            ...location,
                            pathname: `${configData.pathPrefix}/tournament`,
                        });
                        closePopWindow()
                        return
                    }} />
            </btn-group>
        </>),
    })

    // console.log('gamedetail', gamedetail)
    // const { openPopWindowFunc, closePopWindowFunc } = popWindowData;
    // const { getUsername } = visitorinfo

    // const popWindowAttributes = {
    //     component: RegistrationFinished,
    //     componentProps: {
    //         title: intl.formatMessage({ id: 'TournamentJoin_Registration Finished!' }),
    //         visitorinfo: getUsername(),
    //         ticket_type: gamedetail.ticket_type,
    //         intl,
    //         history,
    //         location,
    //         configData,
    //         tournamentName,
    //         holdingClubName,
    //         readIcon,
    //     },
    //     closeByButtonOnly: true,
    //     isFullModeForMobile: false,
    // };
    // openPopWindowFunc(popWindowAttributes);
}

// -----------------------------Registration(Rg) ----JSX--------------



// const RegistrationFinished = props => {
//     return (
//         <>
//             <div className={classes.registrationFinishedBox}>
//                 <div className={cx('messageBox')}>
//                     <div className={cx('messageCol')}>
//                         <div className={cx('imgBlock')}>
//                             <EmptySucessIcon />
//                         </div>
//                         <div className={cx('logoBlock')}>
//                             {/* <img src={require('../../imgs/img_logo.png')} alt="" /> */}
//                             <img src={props.readIcon} alt="gameIconLost" />
//                             <p>{props.tournamentName.current}</p>
//                         </div>
//                     </div>
//                     <div className={cx('messageCol')}>
//                         <h5>{props.intl.formatMessage({ id: 'TournamentJoin_Organizer' })}</h5>
//                         {/* <p>{props.visitorinfo}</p> */}
//                         <p>{props.holdingClubName.current}</p>
//                     </div>
//                     <div className={cx('messageCol')}>
//                         <h5>{props.intl.formatMessage({ id: 'TournamentJoin_Payment Detail' })}</h5>
//                         <p>{props.ticket_type}</p>
//                     </div>
//                 </div>
//                 <div className={cx('btnwrapper')}>
//                     <Button title={props.intl.formatMessage({ id: 'TournamentJoin_[btn]Browse Other Battles' })}
//                         customClass={classes.finishBtn} onClick={() => {
//                             props.history.push({
//                                 ...props.location,
//                                 pathname: `${props.configData.pathPrefix}/tournament`,
//                             });
//                             props.closePopWindowFunc()
//                             return
//                             // props.closePopWindowFunc() 
//                         }} />
//                 </div>
//             </div>
//         </>
//     )
// }




// --------------------------discard-------------------------

export const teamhandleDd = ({ dialog_V2Data, dialogData, setProcessRegKill, intl, history, location, configData, gameserial, InPageOne = false, regBefore }) => {
    // console.log('setProcessRegKill', setProcessRegKill)
    const { openDialogFunc, closeDialogFunc } = dialogData;
    // const { openDialog_V2Func, closeDialog_V2Func } = dialog_V2Data

    openDialogFunc({
        component: DialogBlock,
        componentProps: {
            // Close
            closeButton: true,
            type: 'warning',
            // Discard Registration ?
            title: intl.formatMessage({ id: 'TournamentJoin_Discard Registration ?' }),
            // Are you sure you want to discard this registration ?
            message: intl.formatMessage({ id: 'TournamentJoin_Are you sure you want to discard this registration ?' }),
            buttons: [
                <Button
                    key="dialog_button_confirm"
                    title={intl.formatMessage({ id: 'TournamentJoin_[btn]Yes' })}
                    type=''
                    onClick={() => {
                        // if (InPageOne || !setProcessRegKill) {
                        //     history.replace({
                        //         ...location,
                        //         pathname: `${configData.pathPrefix}/tournament/list/${gameserial}/home`,
                        //     });
                        //     closeDialogFunc()
                        //     return

                        // }
                        // console.log('第一頁未註冊discard', InPageOne, regBefore)
                        if (InPageOne && !regBefore) {
                            console.log('第一頁未註冊discard')
                            history.replace({
                                ...location,
                                pathname: `${configData.pathPrefix}/tournament/list/${gameserial}/home`,
                            });
                            closeDialogFunc()
                            return
                        }
                        setProcessRegKill(true);
                    }}
                />
            ]
        },
        closeByButtonOnly: true,
    });
}