import React, { useState, useContext, useEffect, useRef } from 'react';
//state store
import { TournamentContext } from '../../TournamentContext';
//jump dialog
import DialogBlock from 'components/blocks/DialogBlock';
//pop 
import { withPopWindowConsumer } from 'components/layouts/PopWindow/Context';
import { PopWindow_V2, withPopWindowProvider_V2, PopWindowStorage, withPopWindowConsumer as withPopWindowConsumer_V2 } from 'components/DesignSystem/PopWindow_V2'
import { withDialog_V2Consumer } from 'components/layouts/Dialog_V2/Context'
//style Comp
import Button from 'components/DesignSystem/Input/Button';
import Thumbnail from "components/DesignSystem/DataDisplay/Thumbnail";
//api
import { useCkInT8T } from '../../hooks/useCkInT8T';
import { useKillReg } from '../../hooks/useKillReg';

//translate
import { injectIntl, FormattedMessage } from 'react-intl'

//CSS
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

export const Banner_btn = ({ size, adjustStyle, popWindowData, dialog_V2Data }) => {
    const {
        setProcessFch,
        configData,
        history,
        location,
        IsApplier,
        RegId,
        authData,
        GameStatus,
        UserBtnSkin,
        RenderRegStatus,
        RenderGameStatus,
        VisitorStatus,
        renderT8tInfo,
        dialogData,
        GameSerial,
        renderCbInfo,
        intl,
        passTimeToBtn,
        finalCkInStart,
        finalCkEndToOngo,
        IsPrivateImport,
        teamParticipateList,
    } = useContext(TournamentContext);
    const { apiWithTokenWrapper, isLoggedIn } = authData;
    const { openPopWindowFunc, closePopWindowFunc } = popWindowData;
    const { getImageUrl } = configData;

    const IsBtnClose = useRef(null)
    const recordSkin = useRef(null)

    const [regOpenBasicSkin, setRegOpenBasicSkin] = useState('')
    const [regOpenSkin, setRegOpenSkin] = useState('')
    const [regEndSkin, setRegEndSkin] = useState('')

    const popWindowData_V2 = useContext(PopWindowStorage);
    const { openPopWindow } = popWindowData_V2;
    const { openDialog_V2Func, closeDialog_V2Func } = dialog_V2Data

    // useEffect(() => {

    //     openPopWindow({


    //         title: 'pop without Btn',
    //         component: (<><div>123</div></>),


    //     })
    //     // 'Warning', 'Error', 'Info', 'Success'
    //     openDialog_V2Func({ title: 'hello', message: '', type: 'Info', buttons: [] })
    // }, [])


    useEffect(() => {
        if (Object.keys(renderT8tInfo).length === 0) return
        //當null時為不限制報名
        // if (renderT8tInfo.participant_limit === null) return ''
        if (renderT8tInfo.participant_limit === null) {
            setRegOpenBasicSkin('dark_1')
            return
        }
        //limit非null時為觀察spot數量關閉報名//若已經有reg身分則取消disabled
        if (
            (renderT8tInfo.participant_limit -
                renderT8tInfo.participants_count <=
                0)
            && VisitorStatus === null) {

            IsBtnClose.current = true
            setRegOpenBasicSkin('')
            return
        }

    }, [renderT8tInfo])

    useEffect(() => {
        if (!UserBtnSkin) return
        console.log(UserBtnSkin)
        switch (UserBtnSkin) {
            case 'SingleJFinish':
                return setRegOpenSkin('dark_2')
            case 'SingleJKpReg':
                setRegOpenSkin('dark_1_flash')
                return
            case 'ApplierTeamJFinish':
                setRegOpenSkin('dark_2')
                return
            case 'TeamJKpReg':
                setRegOpenSkin('dark_1_flash')
                return
            case 'TeamJFinish':
                setRegOpenSkin('dark_2')
                return
            case 'TeamJWaitReg':
                IsBtnClose.current = true
                setRegOpenSkin('')
                return

            // ----------Reg E  switch--------    
            case 'WaitForCk':
                IsBtnClose.current = true
                setRegEndSkin('')
                return
            case 'SingleCkFinish':
                setRegEndSkin('dark_1')
                return
            case 'SingleNotCk':
                setRegEndSkin('dark_1')
                return
            case 'ckNotOpen':
                IsBtnClose.current = true
                setRegEndSkin('')
                return
            // case 'WaitForCk':
            //     IsBtnClose.current = true
            //     return ''
            case 'TeamWaitCkFinish':
                setRegEndSkin('dark_2')
                return
            //未ckeckin //default btn
            case 'TeamNotCk':
                setRegEndSkin('dark_1')
                return
            //所有人都checkin完成 //default btn
            case 'TeamAllCk':
                setRegEndSkin('dark_1')
                return
            // case 'ckNotOpen':
            //     IsBtnClose.current = true
            //     return


            // --------Ongo-----
            case 'regOnGo':
                setRegEndSkin('dark_1')
                return
            default:
                return;
        }
        //TODO else if  not work?

        // switch (UserBtnSkin) {
        //     // -----applier---S---
        //     case 'ApplierTeamJFinish':
        //         setRegOpenSkin('dark_2')
        //         return
        //     case 'TeamJKpReg':
        //         setRegOpenSkin('dark_1_flash')
        //         return
        //     case 'TeamJFinish':
        //         setRegOpenSkin('dark_2')
        //         return
        //     case 'TeamJWaitReg':
        //         IsBtnClose.current = true
        //         setRegOpenSkin('')
        //         return 
        //     default:
        //         return;
        // }


    }, [UserBtnSkin])




    // -------------------Timer------------------
    const [firstTimer, setFirstTimer] = useState(0);
    const timerUsedBefore = useRef(false)

    useEffect(() => {

        setFirstTimer(passTimeToBtn)

    }, [passTimeToBtn])



    //動作提前1秒執行 //unit sec
    const adjustTimeLength = 1
    useEffect(() => {
        //強制刷新
        if (GameStatus === 'registration_closed' && firstTimer === 0) {
            setProcessFch(true)
            return
        }
        if (firstTimer === 0) return;
        const timerId = setInterval(() => {
            // currentGameStatus.current
            // console.log('前', timerId)
            switch (GameStatus) {
                case 'registration_not_open':
                    // console.log('timer=>registration_not_open', firstTimer)
                    break;
                case 'registration_opened':
                    // console.log('timer=>registration_opened', firstTimer)
                    break;
                case 'registration_closed':
                    // console.log('timer=>registration_closed', firstTimer)
                    if (firstTimer === (finalCkInStart.current + adjustTimeLength)) {
                        setProcessFch(true)
                    }
                    if (firstTimer === (finalCkEndToOngo.current + adjustTimeLength)) {
                        setProcessFch(true)
                    }

                    break;
                case 'ongoing':
                    //不會進
                    break;
                case 'completed':
                    //不會進
                    break;
                default:
                    break;
            }

            if (firstTimer === (0 + adjustTimeLength)) {
                setProcessFch(true)
            }
            timerUsedBefore.current = true
            setFirstTimer((t) => t - 1);
        }, 1000);
        return () => {
            // console.log('解timer', timerId)
            clearInterval(timerId)
        };
    }, [firstTimer]);

    //no reg person
    const RegOpenBasicSkin = () => {
        //當null時為不限制報名
        // if (renderT8tInfo.participant_limit === null) return ''
        if (renderT8tInfo.participant_limit === null) return 'dark_1'
        //非null時為觀察spot數量關閉報名
        if (
            renderT8tInfo.participant_limit -
            renderT8tInfo.participants_count <=
            0
        ) {
            // return classes.btn_disable;
            // return setIsBtnClose(true)
            IsBtnClose.current = true
            return
        }
    };

    const RegOpenSkin = () => {
        // if (recordSkin.current === UserBtnSkin) return
        // recordSkin.current = UserBtnSkin
        //participant_limit非null時為觀察spot數量關閉報名
        if ((renderT8tInfo.participant_limit !== null) &&
            renderT8tInfo.participant_limit -
            renderT8tInfo.participants_count <=
            0
        ) {
            // return classes.btn_disable;
            // return setIsBtnClose(true)
            IsBtnClose.current = true
            return
        }

        console.log('註冊skin')
        if (renderT8tInfo.tournament_format === '1v1') {
            switch (UserBtnSkin) {
                case 'SingleJFinish':
                    // return classes.btn_joinedFuc;
                    return 'dark_2'

                case 'SingleJKpReg':
                    // return classes.btn_keepregister;
                    // return 'dark_1'
                    return 'dark_1_flash'
                default:
                    return;
            }
            //TODO else if  not work?
        } else if (renderT8tInfo.tournament_format === 'TvT') {
            switch (UserBtnSkin) {
                // -----applier---S---
                case 'ApplierTeamJFinish':
                    // return classes.btn_joinedFuc;
                    return 'dark_2'
                case 'TeamJKpReg':
                    // return classes.btn_keepregister;
                    // return 'dark_1'
                    return 'dark_1_flash'
                // TODO 之後用狀態碼切換功能 在reg完成部分和繼續部分
                // -----applier----E--
                case 'TeamJFinish':
                    // return classes.btn_joinedFuc;
                    return 'dark_2'
                case 'TeamJWaitReg':
                    // return classes.btn_disable;
                    // setIsBtnClose(true)
                    IsBtnClose.current = true
                    return ''
                default:
                    return;
            }
        } else {
            return;
        }
    };



    const RegEOnGoSkin = () => {
        if (recordSkin.current === UserBtnSkin) return
        recordSkin.current = UserBtnSkin
        if (renderT8tInfo.tournament_format === '1v1') {
            console.log('1v1 skin on');
            console.log('UserBtnSkin', UserBtnSkin);
            switch (UserBtnSkin) {
                case 'WaitForCk':
                    // return classes.btn_disable;
                    // setIsBtnClose(true)
                    IsBtnClose.current = true
                    return ''
                case 'SingleCkFinish':
                    // return '';
                    return 'dark_1'
                //未ckeckin //default btn
                case 'SingleNotCk':
                    // return '';
                    return 'dark_1'
                case 'ckNotOpen':
                    IsBtnClose.current = true
                    return ''
                default:
                    return;
            }
        } else if (renderT8tInfo.tournament_format === 'TvT') {
            console.log('TvT skin on');
            console.log('UserBtnSkin', UserBtnSkin);
            switch (UserBtnSkin) {
                case 'WaitForCk':
                    // return classes.btn_disable;
                    // setIsBtnClose(true)
                    IsBtnClose.current = true
                    return ''
                case 'TeamWaitCkFinish':
                    // return classes.btn_lineUp;
                    return 'dark_2'
                //未ckeckin //default btn
                case 'TeamNotCk':
                    // return '';
                    return 'dark_1'
                //所有人都checkin完成 //default btn
                case 'TeamAllCk':
                    // return '';
                    return 'dark_1'
                case 'ckNotOpen':
                    IsBtnClose.current = true
                    return
                default:
                    return;
            }
        } else {
            return;
        }
    };

    //    -------------------------------------------btn funcs---------------------------------

    // --------------------------discard---btn-------------------------
    //  TODO associate api

    const [ProcessRegKill, setProcessRegKill] = useState(false);

    const { IsRegDelete } = useKillReg({
        ProcessRegKill,
        apiWithTokenWrapper,
        RegId,
        GameSerial,
    });

    useEffect(() => {
        if (IsRegDelete) {
            console.log('註冊刪除執行完畢');
            //refetch
            setProcessFch(true);
            closeDialog_V2Func();

            // TODO 轉頁設定
        }
    }, [IsRegDelete]);

    const teamhandleDd = () => {
        openDialog_V2Func({
            title: intl.formatMessage({ id: 'TournamentJoin_Discard Registration ?' }),
            message: intl.formatMessage({ id: 'TournamentJoin_Are you sure you want to discard this registration ?' }),
            type: 'Warning',
            btnsDisplay: 'vertical',
            buttons: [<Button
                title={intl.formatMessage({ id: 'TournamentJoin_[btn]Yes' })}
                onClick={() => {
                    setProcessRegKill(true);
                }}
            />,]
        })
    };

    //toggle discard btn for TvT applier during Join
    const [Toggle, setToggle] = useState(false);

    // ------------------Join btn-----------------------

    const handleRO_A = () => {
        console.log('A')
        switch (UserBtnSkin) {
            case 'SingleJKpReg':
                history.replace({
                    ...location,
                    pathname: `${configData.pathPrefix}/tournament/join/${GameSerial}`,
                });
                return
            case 'SingleJFinish':
                return setToggle(!Toggle);
            case 'TeamJKpReg':
                history.replace({
                    ...location,
                    pathname: `${configData.pathPrefix}/tournament/join/${GameSerial}`,
                });
                return
            case 'ApplierTeamJFinish':
                return setToggle(!Toggle);
            default:
                return console.log('根據skin啟動function 失敗')
        }
        // //TODO具有註冊身分1v1的人就可以開啟刪除
        // if (renderT8tInfo.tournament_format === '1v1' && VisitorStatus)
        //     return setToggle(!Toggle);
        // //具有註冊身分並且是TvT比賽申請人才可以開啟
        // if (renderT8tInfo.tournament_format === 'TvT' && IsApplier)
        //     return setToggle(!Toggle);
    };
    const handleRO_B = () => {
        // console.log('b func')
        if ((renderT8tInfo.participant_limit !== null) && (renderT8tInfo.participant_limit -
            renderT8tInfo.participants_count <=
            0)) return
        if (!VisitorStatus) {
            //TODO先檢驗登入狀態(未登入身分必須重新登入)//當authdata有變動時就會re-render  control in context
            if (!isLoggedIn) {
                history.push({
                    ...location,
                    hash: '#sign-in',
                });
                return;
            }
            //is_need_in_game_id_verified=>true=>進行對應遊戲Id驗證   需要驗但是沒有Id的處理
            if (
                renderT8tInfo.is_need_in_game_id_verified &&
                (!renderT8tInfo.myself.is_in_game_id_verified)
            ) {
                openDialog_V2Func({
                    title: intl.formatMessage({ id: 'Single-Tournament-Banner-Status_Please Verify Your Game ID' }),
                    message: intl.formatMessage({ id: 'Single-Tournament-Banner-Status_[content]Please Verify Your Game ID' }),
                    type: 'Warning',
                    btnsDisplay: 'vertical',
                    buttons: [<Button
                        title={intl.formatMessage({ id: 'Single-Tournament-Banner-Status_Game ID setting' })}
                        onClick={() => {
                            history.replace({
                                ...location,
                                pathname: `${configData.pathPrefix}/player/${authData.getUsername()}`,
                            });
                            closeDialog_V2Func();
                        }}
                    />,]
                })
                return;
            }
            //open_rule: "public" //當public才開啟驗club
            // 不是club member//導引到該club頁面
            // 當不是public且不屬於member時
            if ((renderT8tInfo.open_rule !== 'public') && (!renderCbInfo.is_member)) {
                openDialog_V2Func({
                    title: intl.formatMessage({ id: 'Single-Tournament-Banner-Status_Club Member Only' }),
                    message: `${intl.formatMessage({ id: 'Single-Tournament-Banner-Status_[content]Club Member Only' })} ${renderCbInfo.name}`,
                    type: 'Warning',
                    btnsDisplay: 'vertical',
                    buttons: [<Button
                        title={intl.formatMessage({ id: 'Single-Tournament-Banner-Status_[btn]Confirm' })}
                        onClick={() => {
                            history.replace({
                                ...location,
                                pathname: `${configData.pathPrefix}/club/my-club/${renderCbInfo.url_key}`,
                            });
                            closeDialog_V2Func();
                        }}
                    />,]
                })
                return;
            }

            history.replace({
                ...location,
                pathname: `${configData.pathPrefix}/tournament/join/${GameSerial}`,
            });
        }
    };

    // ---------Ckeck in btn-------------------------
    const [ProcessCk, setProcessCk] = useState(false);
    const { FchCkFin, ckInOK } = useCkInT8T({
        apiWithTokenWrapper,
        ProcessCk,
        GameSerial,
    });

    useEffect(() => {
        // TODO 完成報名後執行行為
        // 重整頁面
        if (!FchCkFin) return

        //完成CKin提示
        openDialog_V2Func({
            title: ckInOK.current ? intl.formatMessage({ id: 'TournamentJoin_Check-in successfully !' }) : intl.formatMessage({ id: 'TournamentJoin_Check-in failed !' }),
            type: ckInOK.current ? 'Success' : 'Error',
            btnsDisplay: 'vertical',
            buttons: [<Button
                title={intl.formatMessage({ id: 'TournamentJoin_[btn]Yes' })}
                onClick={() => {
                    closeDialog_V2Func();
                }}
            />,]
        })
        //refetch banner 
        setProcessFch(true);

    }, [FchCkFin]);
    //lineUp展現列表
    const lineUpList = () => {
        return (<>
            <div className={classes.lineupListWrapper}>
                <ul className={classes.lineupList}>

                    {teamParticipateList.current && teamParticipateList.current.map((val, idx) => {
                        return <li className={classes.lineupUnit} key={idx}>
                            <div className={classes.Ava}>
                                <Thumbnail size="53px" border={{ double: true, gap: 4 }} imgUrl={getImageUrl(val.icon_image)} />
                            </div>
                            <div className={classes.Des}>
                                <h3>{val.username}</h3>
                                <p>{val.in_game_id}</p>
                            </div>
                            <div className={classes.Status}>
                                {val.t8t_checkin_at && (<span>{intl.formatMessage({ id: 'TournamentJoin_Checked-in' })}</span>)}
                            </div>
                        </li>
                    })}

                </ul>
                <div className={classes.lineupBtnWrapper}><Button title="Continue" customClass={classes.continueBtn} onClick={() => closePopWindowFunc()} /></div>
            </div>
        </>)
    }

    const handleCK = () => {

        //  TODO 利用dresscode切換功能 
        if (UserBtnSkin === 'TeamNotCk' || UserBtnSkin === 'SingleNotCk') {
            setProcessCk(true);
            return;
        }
        //  090220
        if (UserBtnSkin === 'SeeBracket' || UserBtnSkin === 'regOnGo') {
            //TODO 觀看階段導向
            history.replace({
                ...location,
                pathname: `${configData.pathPrefix}/tournament/list/${GameSerial}/brackets`,
            });
            return;
        }
        //TODO還有line up status還沒確認  /追加api
        if (UserBtnSkin === 'TeamWaitCkFinish' && (teamParticipateList.current !== null)) {
            const popWindowAttributes = {
                component: lineUpList,
                componentProps: {
                    title: intl.formatMessage({ id: 'TournamentJoin_Lineup Status' }),
                },
                closeByButtonOnly: true,
                isFullModeForMobile: false,
            };
            openPopWindowFunc(popWindowAttributes);
        }
    };
    // ---------------------------------------additional JSX------------------------------------
    //有註冊資料//單人雙人  //TODO沒有註冊資料持續打開//功能再處理登入區分 //在有PrivateImport條件下，無論有無註冊身分都關閉btn，皆關閉join btn
    const RegOpenTask = (
        <>
            {GameStatus === 'registration_opened' && VisitorStatus ? (
                <>
                    <Button
                        title={RenderRegStatus || RenderGameStatus}
                        disabled={IsPrivateImport.current || (IsBtnClose.current && true)}
                        size={size ? size : ""}
                        // customClass={RegOpenSkin()}
                        theme={regOpenSkin}
                        onClick={() => {
                            handleRO_A();
                        }}
                    />
                </>
            ) : (
                    <>
                        <Button
                            disabled={IsPrivateImport.current || (IsBtnClose.current && true)}
                            title={RenderGameStatus}
                            size={size ? size : ""}
                            // customClass={RegOpenBasicSkin()}
                            theme={regOpenBasicSkin}
                            onClick={() => {
                                handleRO_B();
                            }}
                        />
                    </>
                )}
        </>
    );

    const RegCloseOngoTask = (
        <>
            {(GameStatus === 'registration_closed' ||
                GameStatus === 'ongoing') &&
                VisitorStatus ? (
                    <>
                        <Button
                            title={RenderRegStatus || RenderGameStatus}
                            disabled={IsBtnClose.current && true}
                            // disabled={BtnClose}
                            size={size ? size : ""}
                            // customClass={RegEOnGoSkin()}
                            theme={regEndSkin}
                            onClick={() => {
                                handleCK();
                            }}
                        />
                    </>
                ) : (
                    <>
                        <div className={cx('BtnDisplayBanner', (GameStatus === 'ongoing') && 'OnGo')} style={{ paddingLeft: `${adjustStyle === 'true' ? '20px' : '4px'}`, fontSize: (adjustStyle === 'true') && '16px' }}>
                            {RenderRegStatus || RenderGameStatus}
                        </div>
                    </>
                )}
        </>
    );





    return (
        <>
            {/* 透過gameStatus先區分render需要材料，再往下區分需要reg身分與否 */}
            {/* <div style={{ height: '135px' }}> */}
            <div style={{ position: 'relative', padding: (adjustStyle === 'true') ? '' : '0 30%' }}>
                {GameStatus === 'registration_not_open' && (
                    <>
                        <Button
                            title={intl.formatMessage({ id: 'TournamentJoin_Join' })}
                            size={size ? size : ""}
                            // customClass={classes.btn_disable}
                            disabled={true}
                        />
                    </>
                )}
                {GameStatus === 'registration_opened' && RegOpenTask}
                {Toggle && (
                    <>
                        <div
                            className={`${classes.DisCardBtn} ${adjustStyle === 'true' && classes.adjust}`}
                            onClick={() => {
                                teamhandleDd();
                            }}
                        >
                            {intl.formatMessage({ id: 'TournamentJoin_Discard' })}
                        </div>
                    </>
                )}
                {/* 如果階段為'registration_closed'||'ongoing'並且有reg身分顯示btn */}
                {(GameStatus === 'registration_closed' ||
                    GameStatus === 'ongoing') &&
                    RegCloseOngoTask}
                {/* 如果階段為completed所有狀態一致 */}
                {GameStatus === 'completed' && (
                    <>
                        <div className={classes.Tournamentcompeleted}>
                            {intl.formatMessage({ id: 'TournamentJoin_Compeleted' })}
                        </div>
                    </>
                )}
                {/* <button onClick={() => { setProcessCk(true) }}>testApi</button> */}
            </div>
            {/* ---------------------------------------------- */}
            {/* <Button title={RenderRegStatus || RenderGameStatus} disabled={BtnClose} size="nl" customClass={} /> */}
            {/* <Button title="Join" size="nl" customClass={cx('disable')} /> */}
            {/* <Button title="Go Registration" size="nl" customClass={cx('joinBtn', 'register')} /> */}

            {/* <div style={{ position: 'relative', padding: '0 30%' }}>
                <div className={classes.Tournamentcompeleted}>Compeleted</div>
                <Button title="joined▾" size="nl" customClass={cx('joinBtn', 'joinedDropdown')} onClick={() => { setToggle(!Toggle) }} />

            </div> */}

            {/* <SubMenuDropdown customDropdownClass={classes.btn_test} items={[{
                    component: 'button',
                    componentProps: {
                        children: <span>Discard</span>,
                        onClick: {},
                    }
                }]} theme="dark">
                    {(props, onClick, isOpen) => {
                        return (
                            <Button title='Joined▾' customClass={classes.btn_joinedFuc} />
                        )
                    }}
                </SubMenuDropdown> */}
            {/* <Button title="Line Up Status" size="nl" customClass={cx('joinBtn', 'lineUp')} /> */}
            {/* <button style={{ position: 'absolute' }}>1234</button>
                {/* <div className={cx('bannerBtnStatus')}>Event Ongoing</div>
                <div className={cx('bannerBtnStatus', 'compeleted')}>Compeleted</div> */}
            {/* </div> */}
        </>
    );
};

export default withPopWindowConsumer(withDialog_V2Consumer(Banner_btn));
