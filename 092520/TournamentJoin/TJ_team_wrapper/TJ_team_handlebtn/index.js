import React from 'react'

import DialogBlock from 'components/blocks/DialogBlock';

import Button from "components/DesignSystem/Input/Button";
//icon
import { EmptySucessIcon } from 'components/utils/Icons'
//CSS
import classes from '../../style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);





// -------------------------------doItLater(DIL)------------------------
export const teamhandleDIL = ({ popWindowData, gameRegEtime, intl, history, location, configData, gameserial, setProcessDIL }) => {
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
            closePopWindowFunc,
            gameserial,
            setProcessDIL,
        },
        closeByButtonOnly: true,
        isFullModeForMobile: false,
    };
    openPopWindowFunc(popWindowAttributes);
}



//----------------------------doItLater(DIL)   JSX ---------------

export const TournamentPending = props => {
    // console.log('測試', props)



    return (
        <>
            <div className={classes.tournamePendingBox}>
                <div className={cx('messageBox')}>
                    <p>{props.intl.formatMessage({ id: "TournamentJoin_You haven't finished the registration flow. Registration will close on" })}</p>
                    <div className={cx('messageCol')}>
                        <h5>{props.gameRegEtime}</h5>
                    </div>
                    <p>{props.intl.formatMessage({ id: 'TournamentJoin_TvTPendingMsg' })}</p>
                </div>
                <div className={cx('btnwrapper')}>
                    <Button title={props.intl.formatMessage({ id: 'TournamentJoin_[btn]Confirm' })}
                        customClass={classes.confirmBtn} onClick={() => {
                            // props.history.replace({
                            //     ...props.location,
                            //     pathname: `${props.configData.pathPrefix}/tournament/list/${props.gameserial}/home`,
                            // });
                            // props.closePopWindowFunc()
                            // return
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

// -----------------------------Registration------------------
export const teamhandleRg = ({ popWindowData, visitorinfo, gamedetail, intl, history, location, configData, tournamentName, holdingClubName, readIcon }) => {
    const { getUsername } = visitorinfo
    // console.log('gamedetail', gamedetail)
    const { openPopWindowFunc, closePopWindowFunc } = popWindowData;
    const popWindowAttributes = {
        component: RegistrationFinished,
        componentProps: {
            title: intl.formatMessage({ id: 'Registration Finished!' }),
            visitorinfo: getUsername(),
            ticket_type: gamedetail.ticket_type,
            intl,
            history,
            location,
            configData,
            tournamentName,
            holdingClubName,
            readIcon,
        },
        closeByButtonOnly: true,
        isFullModeForMobile: false,
    };
    openPopWindowFunc(popWindowAttributes);
}


// -----------------------------Registration--------JSX----------


const RegistrationFinished = props => {
    return (
        <>
            <div className={classes.registrationFinishedBox}>
                <div className={cx('messageBox')}>
                    <div className={cx('messageCol')}>
                        <div className={cx('imgBlock')} >
                            <EmptySucessIcon />
                        </div>
                        <div className={cx('logoBlock')}>
                            <img src={props.readIcon} alt="gameIconLost" />
                            <p>{props.tournamentName.current}</p>
                        </div>
                    </div>
                    <div className={cx('messageCol')}>
                        {/* Organizer */}
                        <h5>{props.intl.formatMessage({ id: 'TournamentJoin_Organizer' })}</h5>
                        {/* <p>{props.visitorinfo}</p> */}
                        <p>{props.holdingClubName.current}</p>
                    </div>
                    <div className={cx('messageCol')}>
                        {/* Payment Detail */}
                        <h5>{props.intl.formatMessage({ id: 'TournamentJoin_Payment Detail' })}</h5>
                        <p>{props.ticket_type}</p>
                    </div>
                </div>
                <div className={cx('btnwrapper')}>
                    <Button title={props.intl.formatMessage({ id: 'TournamentJoin_[btn]Browse Other Battles' })} customClass={classes.finishBtn} onClick={() => {
                        props.history.push({
                            ...props.location,
                            pathname: `${props.configData.pathPrefix}/tournament`,
                        });
                        props.closePopWindowFunc()
                        return
                        // props.closePopWindowFunc() 
                    }} />
                </div>
            </div>
        </>
    )
}




// --------------------------discard-------------------------



export const teamhandleDd = ({ dialogData, setProcessRegKill, intl, history, location, configData, gameserial, InPageOne = false, regBefore }) => {
    // console.log('setProcessRegKill', setProcessRegKill)
    const { openDialogFunc, closeDialogFunc } = dialogData;
    openDialogFunc({
        component: DialogBlock,
        componentProps: {
            // Close
            closeButton: true, //自帶cancel func
            type: "warning",
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