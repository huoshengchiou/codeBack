//react
import React, { useState, createContext, useEffect, useRef } from 'react';
//translate
import { FormattedMessage } from 'react-intl'

//fetch api
import { useGetT8TDetail } from '../hooks/useGetT8TDetail';
import { useFetchStanding } from '../hooks/useFetchStanding';
import { useFetchParticipants } from '../hooks/useFetchParticipants';

export const TournamentContext = createContext();

export const TournamentContainer = (props) => {
    const {
        match,
        history,
        configData,
        location,
        authData,
        dialogData,
        ShowFloatBar,
        intl,
        popWindowData,
    } = props.parentgift;

    const { apiWithTokenWrapper, getMemberId } = authData;
    //t8t fetch material
    const t8t_serial = match.params.t8t_serial;
    // --------------------------- Banner------- S-----------------------
    const [ProcessFch, setProcessFch] = useState(false);
    //all t8t game data
    const [renderT8tInfo, setRenderT8tInfo] = useState({});
    //holding club data
    const [renderCbInfo, setRenderCbInfo] = useState({});
    const [CbFlCount, setCbFlCount] = useState(null);
    const clubUrlKey = useRef('')
    //Long str type
    const [CbId, setCbId] = useState('');
    //bracket_type
    const bracketType = useRef('')
    const [GameSerial, setGameSerial] = useState('');
    //next stage info of t8t game
    const [GameStatus, setGameStatus] = useState('');
    //game with private by import //報名階段關閉join功能
    const IsPrivateImport = useRef(null)

    // ------------------v---------User reg associate--------v-------------------
    // !==null  have Reg status
    const label1 = useRef('註冊相關資料')
    const [VisitorStatus, setVisitorStatus] = useState(null);
    //club follow?
    const [IsUserFlCb, setIsUserFlCb] = useState(null);
    //t8t game Reg id
    const [RegId, setRegId] = useState(null);
    //TvT game applier?
    const [IsApplier, setIsApplier] = useState(false);
    //team participate List
    const teamParticipateList = useRef(null)
    // ------------------^---------User reg associate--------^-------------------
    //TODO已經跑過一次就不再更新timer
    const fetchOnce = useRef(false)
    const label2 = useState('CK相關時間點')
    const finalCkInStart = useRef(null)
    const finalCkEndToOngo = useRef(null)
    const finalCkNotOpen = useRef(null)

    const [passTimeToBtn, setPassTimeToBtn] = useState(0)
    //auto scroll
    const goTop = () => {
        const node = document.querySelector('#scrollCapture');
        node.scrollTo({
            top: 0,
            left: 0,
            behavior: 'auto'
        })
    }


    //fetch t8t game data
    const {
        GamerRegId,
        AboutNextStatus,
        GamerRegStatus,
        FchBkT8tInfo,
        FchBkHoldingCbInfo,
        IsT8TFchOK,
        CheckInTime,
        CheckETime,
        OriRegEtime,
        CheckInLeftTime,
        leftDays,
        gameNeedsCK,
        fetchUserRegStatus,
        currentGameStatus,
        timeToNext,
        ckInStart,
        ckEndToOngo,
        ckNotOpen,
    } = useGetT8TDetail({ t8t_serial, apiWithTokenWrapper, ProcessFch });

    //data tranfer to state store
    useEffect(() => {
        //initail invoke fetch
        setProcessFch(true)
    }, [])
    //sense login process fectch for re render
    useEffect(() => {
        setProcessFch(true);
        console.log('帳號重登刷新')
    }, [authData.isLoggedIn]);

    // fetch standing data
    const { standing } = useFetchStanding({ t8t_serial });

    /**
     * Indicate it is either 1v1 or TvT
     */
    const isIndividual = renderT8tInfo.tournament_format === '1v1';

    //#region --- Banner ---

    // ----------------v--pass--t8t game associate info-to--state--v-----------
    //useEffect不能偵測ref改變，但是值還是拿到更新
    // Tournament qualification of user
    const isClubAdmin = useRef(false)
    const isThisGameJudge = useRef(false)

    // const userRegStatus = useRef(null)


    useEffect(() => {
        if (!IsT8TFchOK) return;
        //只使用在狀態確認
        // if (fetchOnce.current && currentGameStatus.current === 'registration_closed' && gameNeedsCK.current) {
        //     console.log('registration_closed 專用fetch確認狀態')
        //     setVisitorStatus(GamerRegStatus)
        //     //設定新的時間定義
        //     setFirstTimer(timeToNext.current)
        //     setProcessFch(false);
        //     return
        // }
        setRenderCbInfo(FchBkHoldingCbInfo);
        setCbId(FchBkHoldingCbInfo.club_id);
        clubUrlKey.current = FchBkHoldingCbInfo.url_key
        setIsUserFlCb(FchBkHoldingCbInfo.is_follower);
        setCbFlCount(FchBkHoldingCbInfo.follower_count);
        setRenderT8tInfo(FchBkT8tInfo);
        setGameSerial(FchBkT8tInfo.t8t_lite.t8t_serial);
        setRegId(GamerRegId);
        //是否關閉reg階段的join//game 設定
        IsPrivateImport.current = FchBkT8tInfo.open_rule === 'private_import'
        //ffa//solo//double
        bracketType.current = FchBkT8tInfo.bracket_type
        //-------v---Tournament qualification of user----v----- 
        isClubAdmin.current = FchBkHoldingCbInfo.is_admin
        isThisGameJudge.current = false
        if (FchBkT8tInfo?.t8t_staff) {
            const { t8t_staff } = FchBkT8tInfo
            if (t8t_staff.length !== 0) {
                let staffArr = t8t_staff.find(item => item.member_id === getMemberId())
                if (staffArr) { isThisGameJudge.current = (staffArr.role === "judge") ? true : false }
            }

        }
        //-------^---Tournament qualification of user----^-----
        setGameStatus(currentGameStatus.current);
        setVisitorStatus(fetchUserRegStatus.current)
        teamParticipateList.current = fetchUserRegStatus.current?.team_player || null

        //turn on timer
        finalCkInStart.current = ckInStart.current
        finalCkEndToOngo.current = ckEndToOngo.current
        setPassTimeToBtn(timeToNext.current)
        // setFirstTimer(timeToNext.current)
        fetchOnce.current = true
        console.log('fetch 刷新')
        //reset t8t fetch
        setProcessFch(false);
        //autolocate scroll
        goTop()
    }, [IsT8TFchOK]);

    // ----------------^--pass--t8t game associate info-to--state--^-----------


    //透過導向重登跳窗後再一次進行fetch
    // if (!isLoggedIn) {
    //     history.push({
    //         ...location,
    //         hash: "#sign-in"
    //     });
    //     return;
    // }

    //  ---------------------v------Banner btn and Msg render-----v-------
    //tournament basic state
    const [RenderGameStatus, setRenderGameStatus] = useState('');
    //user state after Reg
    const [RenderRegStatus, setRenderRegStatus] = useState('');
    //Banner waring msg
    const [DefaultBannerMsg, setDefaultBannerMsg] = useState(null)
    //Reg Banner waring msg
    const [RegBannerMsg, setRegBannerMsg] = useState(null)
    //具有和賽事相關註冊身分專用skin code
    const [UserBtnSkin, setUserBtnSkin] = useState('');
    // const [BtnClose, setBtnClose] = useState(false);

    //底層事件進行DB和render字樣轉換
    // intl.formatMessage({ id: 'Single-Tournament-Banner-Status_Join' })
    useEffect(() => {
        if (!GameStatus) return
        console.log('GameStatus轉換')
        switch (GameStatus) {
            case 'registration_not_open':
                setRenderGameStatus(intl.formatMessage({ id: 'Single-Tournament-Banner-Status_Join' }));
                setDefaultBannerMsg(intl.formatMessage({ id: 'Single-Tournament-Banner-Status_Registration will open soon' }));
                break;
            case 'registration_opened':
                setRenderGameStatus(intl.formatMessage({ id: 'Single-Tournament-Banner-Status_Join' }));
                if (FchBkT8tInfo.participant_limit !== null && (FchBkT8tInfo.participant_limit -
                    FchBkT8tInfo.participants_count <=
                    0)) {
                    setDefaultBannerMsg(intl.formatMessage({ id: 'Single-Tournament-Banner-Status_Tournament full' }))
                } else {
                    setDefaultBannerMsg(intl.formatMessage({ id: 'Single-Tournament-Banner-Status_Almost Full !! Hurry Up!' }))
                }
                break;
            case 'registration_closed':
                setRenderGameStatus(intl.formatMessage({ id: 'Single-Tournament-Banner-Status_Registration Closed' }));
                setDefaultBannerMsg(<FormattedMessage id={'Single-Tournament-Banner-Status_Beginning in {day} days'} values={{ day: leftDays.current }} />)
                break;
            case 'ongoing':
                setRenderGameStatus(intl.formatMessage({ id: 'Single-Tournament-Banner-Status_Event Ongoing' }));
                setDefaultBannerMsg('')
                break;
            case 'completed':
                setRenderGameStatus(intl.formatMessage({ id: 'Single-Tournament-Banner-Status_Completed' }));
                setDefaultBannerMsg('')
                break;
            default:
                return;
        }
    }, [GameStatus]);

    //當用戶註冊身分改變時的變動-----------------------------------------------------------------------------
    useEffect(() => {
        //null  在開始以及結束狀態內
        // --------------------------------------有註冊身分往下執行--------------------------------
        if (
            !VisitorStatus ||
            GameStatus === 'Completed' ||
            GameStatus === 'registration_not_open'
        ) {
            // setRenderRegStatus(null);
            return
        }
        console.log('VisitorStatus改變進行註冊身分判定');

        //TODO 由gameformat區分進入為1V1 還是TvT
        // 回傳不同資料格式給render
        if (VisitorStatus && !isIndividual) {
            setIsApplier(
                getMemberId() === VisitorStatus.t8tTeamApplier.member_id
            );
        }
        // 只處理registration_opened 期間狀態改變
        // if (GameStatus === 'registration_opened') {

        if (GameStatus === 'registration_opened') {
            if (isIndividual) {
                const finalStr = VisitorStatus.is_register_finish
                    ? `${intl.formatMessage({ id: 'Single-Tournament-Banner-Status_[btn]Joined' })}▾`
                    : intl.formatMessage({ id: 'Single-Tournament-Banner-Status_[btn]Go Registration' });
                const dressCode = VisitorStatus.is_register_finish
                    ? 'SingleJFinish'
                    : 'SingleJKpReg';
                setUserBtnSkin(dressCode);
                setRenderRegStatus(finalStr);
                // setBtnClose(VisitorStatus.is_register_finish)
            } else {
                //只有team applier才會有繼續reg的選項
                if (getMemberId() === VisitorStatus.t8tTeamApplier.member_id) {
                    const finalStr = VisitorStatus.is_register_finish
                        ? `${intl.formatMessage({ id: 'Single-Tournament-Banner-Status_[btn]Joined' })}▾`
                        : intl.formatMessage({ id: 'Single-Tournament-Banner-Status_[btn]Go Registration' });
                    const dressCode = VisitorStatus.is_register_finish
                        ? 'ApplierTeamJFinish'
                        : 'TeamJKpReg';
                    setUserBtnSkin(dressCode);
                    setRenderRegStatus(finalStr);
                    // setBtnClose(VisitorStatus.is_register_finish)
                    // setBtnClose(false)
                } else {
                    const finalStr = VisitorStatus.is_register_finish
                        ? intl.formatMessage({ id: 'Single-Tournament-Banner-Status_[btn]Joined' })
                        : intl.formatMessage({ id: 'Single-Tournament-Banner-Status_[btn]Go Registration' });
                    const dressCode = VisitorStatus.is_register_finish
                        ? 'TeamJFinish'
                        : 'TeamJWaitReg';
                    setUserBtnSkin(dressCode);
                    setRenderRegStatus(finalStr);
                    //不是報名的人永遠都是true
                    // setBtnClose(true)
                }
            }
        }
        if (GameStatus === 'registration_closed') {
            console.log('參賽身分找registration_closed中skin')






            //如果game本身不需要進行checkin
            if (!gameNeedsCK.current) {
                setRenderRegStatus(intl.formatMessage({ id: 'Single-Tournament-Banner-Status_[btn]See Bracket' }));
                setUserBtnSkin('SeeBracket');
                // setRegBannerMsg('Event ongoing')
                return
            }
            //如果game需要CK檢查使用者CK狀態
            if (gameNeedsCK.current) {

                if (ckNotOpen.current) {
                    setRenderRegStatus(intl.formatMessage({ id: 'Single-Tournament-Banner-Status_[btn]Check-in' }))
                    setUserBtnSkin('ckNotOpen')
                    return
                }




                if (isIndividual) {
                    //TODO 根據user Checkin狀態開放開關
                    // setBtnClose(VisitorStatus.is_user_checkin);
                    const finalstr = VisitorStatus.is_user_checkin
                        ? intl.formatMessage({ id: 'Single-Tournament-Banner-Status_[btn]See Bracket' })
                        : intl.formatMessage({ id: 'Single-Tournament-Banner-Status_[btn]Check-in' });
                    const dressCode = VisitorStatus.is_user_checkin
                        ? 'SingleCkFinish'
                        : 'SingleNotCk';
                    setRenderRegStatus(finalstr);
                    setUserBtnSkin(dressCode);
                } else if (!isIndividual) {
                    //當所有人都checkin完成轉see Bracket
                    if (VisitorStatus.is_all_checkin) {
                        // setBtnClose(false);
                        setRenderRegStatus(intl.formatMessage({ id: 'Single-Tournament-Banner-Status_[btn]See Bracket' }));
                        setUserBtnSkin('TeamAllCk');
                    } else if (!VisitorStatus.is_all_checkin) {
                        // setBtnClose(
                        //     VisitorStatus.is_user_checkin ||
                        //     VisitorStatus.is_all_checkin
                        // ); 
                        const finalstr =
                            VisitorStatus.is_user_checkin &&
                                !VisitorStatus.is_all_checkin
                                ? intl.formatMessage({ id: 'Single-Tournament-Banner-Status_[btn]Line Up Status' })
                                : intl.formatMessage({ id: 'Single-Tournament-Banner-Status_[btn]Check-in' });
                        setRenderRegStatus(finalstr);
                        const dressCode =
                            VisitorStatus.is_user_checkin &&
                                !VisitorStatus.is_all_checkin
                                ? 'TeamWaitCkFinish'
                                : 'TeamNotCk';
                        setUserBtnSkin(dressCode);
                    } else {
                        return '身分判斷Error'
                    }
                } else {
                    return '身分判斷Error'
                }
            }
        }

        if (GameStatus === 'ongoing') {

            setRenderRegStatus(intl.formatMessage({ id: 'Single-Tournament-Banner-Status_[btn]See Bracket' }));
            setUserBtnSkin('regOnGo');

        }






    }, [VisitorStatus]);

    // ----------------------------------Timers------------------------------------------------------
    // const IsSecondTimerRun = useRef(false);

    //具有註冊身分或is_t8t_checkin為true才會執行的第二timer--------------------------
    const CallSecondTimer = (delay, callback) => {
        //  default block
        if (CheckInTime.current === 0 || CheckETime.current === 0 || fetchUserRegStatus.current) return;
        //run once close
        // if (IsSecondTimerRun.current) return;
        // console.log('第二timer執行')

        //invoke第二個timer後
        //TODO 根據註冊身分條件執行render狀態置換
        // if (GameStatus === 'registration_closed' && VisitorStatus) {
        //TODO 要特別處理user state
        // if (isIndividual) {
        //     console.log('進入第二timer skin判別')
        //     //TODO 根據user Checkin狀態開放開關
        //     // setBtnClose(VisitorStatus.is_user_checkin);
        //     const finalstr = VisitorStatus.is_user_checkin
        //         ? intl.formatMessage({ id: 'Single-Tournament-Banner-Status_[btn]See Bracket' })
        //         : intl.formatMessage({ id: 'Single-Tournament-Banner-Status_[btn]Check-in' });
        //     setRenderRegStatus(finalstr);
        //     const dressCode = VisitorStatus.is_user_checkin
        //         ? 'SingleCkFinish'
        //         : 'SingleNotCk';
        //     setUserBtnSkin(dressCode);
        // } else if (!isIndividual) {
        //     //當所有人都checkin完成轉see Bracket
        //     if (VisitorStatus.is_all_checkin) {
        //         // setBtnClose(false);
        //         setRenderRegStatus(intl.formatMessage({ id: 'Single-Tournament-Banner-Status_[btn]See Bracket' }));
        //         setUserBtnSkin('TeamAllCk');
        //     } else if (!VisitorStatus.is_all_checkin) {
        //         // setBtnClose(
        //         //     VisitorStatus.is_user_checkin ||
        //         //     VisitorStatus.is_all_checkin
        //         // ); 
        //         const finalstr =
        //             VisitorStatus.is_user_checkin &&
        //                 !VisitorStatus.is_all_checkin
        //                 ? intl.formatMessage({ id: 'Single-Tournament-Banner-Status_[btn]Line Up Status' })
        //                 : intl.formatMessage({ id: 'Single-Tournament-Banner-Status_[btn]Check-in' });
        //         setRenderRegStatus(finalstr);
        //         const dressCode =
        //             VisitorStatus.is_user_checkin &&
        //                 !VisitorStatus.is_all_checkin
        //                 ? 'TeamWaitCkFinish'
        //                 : 'TeamNotCk';
        //         setUserBtnSkin(dressCode);
        //     } else {
        //         return;
        //     }
        // } else {
        //     return;
        // }
        // //  }

        setTimeout(() => {
            console.log('第二timer啟動');
            //TODO在chekin期間屬於registration_closed

            //do something
            if (callback) callback();
            //TODO加入當checkE結束後要處理的事
            return CallSecondTimer(CheckETime.current, () => {
                //如果有註冊資料才可以看bracket
                if (VisitorStatus) {
                    setRenderRegStatus(intl.formatMessage({ id: 'Single-Tournament-Banner-Status_[btn]See Bracket' }));
                    setUserBtnSkin('SeeBracket');
                    setRegBannerMsg(intl.formatMessage({ id: 'Single-Tournament-Banner-Status_Event Ongoing' }))
                }
                setGameStatus('ongoing');
                // IsSecondTimerRun.current = true;
            });
        }, delay);
    };
    // OriRegEtime.current
    const CDTimeRef = useRef(0);
    //正常流程為close轉timer
    const ManagerTimer = () => {
        //當階段為'registration_closed'
        //當有註冊身分且game設定FchBkT8tInfo.is_t8t_checkin 為true時才跑第二timer
        //TODO 0716_add
        console.log('狀態判斷', (fetchUserRegStatus.current !== null) && (gameNeedsCK.current))
        if ((fetchUserRegStatus.current !== null) && (gameNeedsCK.current)) {
            // 當還有CK前有剩餘時間
            CheckInLeftTime.current ? CallSecondTimer(CheckInLeftTime.current) : CallSecondTimer(CheckInTime.current)
            console.log('有註冊身分且要ck轉timer')
            return
        }

        if ((fetchUserRegStatus.current !== null) && (!gameNeedsCK.current)) {
            //    有註冊身分 導引回正常的timer機制
            // 調整註冊狀態顯示
            console.log('有註冊狀態並且game不需要CK', OriRegEtime.current)


            // setTimeout(() => {
            //     setProcessFch(true);
            // }, OriRegEtime.current);
            return
        }

        // console.log('hello')

        //沒有註冊身分 導引回正常的timer機制
        setTimeout(() => {
            setProcessFch(true);
        }, OriRegEtime.current);
    };

    //第一timer(所有狀態都會使用)
    useEffect(() => {
        if (AboutNextStatus) return
        //TODO 如果
        // still in default return
        if (!AboutNextStatus) return;
        console.log('AboutNextStatus觸發')
        //on going /complete
        // if (AboutNextStatus.seconds_to_status === 0) {
        //     if (AboutNextStatus.status === 'registration_closed') {
        //         console.log('這裡')
        //         // ManagerTimer()
        //     }
        //     if (AboutNextStatus.status === 'ongoing' && fetchUserRegStatus.current) {
        //         setRenderRegStatus('SeeBracket')
        //         setUserBtnSkin('SeeBracket');
        //     }

        //     setGameStatus(AboutNextStatus.status);
        //     return
        // }
        // TODO 當在倒數秒數為0時處理??  'ongoing' 'complete' 或特定'registration_closed'秒數一定為0
        // if (AboutNextStatus.seconds_to_status === 0) {
        //     console.log(
        //         '進入ongoing complete 或特定registration_closed倒數機制'
        //     );
        //     // setVisitorStatus(fetchUserRegStatus.current);
        //     if (AboutNextStatus.status === 'registration_closed') {

        //         if (fetchUserRegStatus.current) {
        //         setVisitorStatus(fetchUserRegStatus.current);

        //             if (AboutNextStatus.CkFin) {
        //                 //有註冊身分執行//並且已經結束Ck
        //                 setRenderRegStatus(intl.formatMessage({ id: 'Single-Tournament-Banner-Status_[btn]See Bracket' }));
        //                 setUserBtnSkin('SeeBracket');
        //                 return;
        //             }
        //             //拿剩餘時間跑第二timer
        //             CallSecondTimer(CheckInLeftTime.current);
        //             console.log('拿剩餘時間跑第二timer')
        //             return;
        //         }
        //         //TODO沒有註冊身分執行
        //     }
        //     // 'ongoing' 'complete'階段只裝入狀態不執行倒數
        //     setGameStatus(AboutNextStatus.status);
        //     return;
        // }

        // 一般狀態運行//'registration_closed'下還有倒數秒數往下------------------------
        //reg not open/   reg/   regclose/ 皆還有秒數
        if (AboutNextStatus.seconds_to_status !== 0) {
            CDTimeRef.current = AboutNextStatus.seconds_to_status;
            console.log('第一timer一般運行模式,狀態為', AboutNextStatus.status)
            //TODO註冊時間過後，調值的時間點

            setVisitorStatus(fetchUserRegStatus.current)
            //只要處於'registration_closed'就執行另一種倒數機制
            if (AboutNextStatus.status === 'registration_closed') {
                console.log('進入regclose階段時間設定')
                ManagerTimer()
                return
            }
            // console.log('第一timer啟動')
            setTimeout(() => {
                console.log('reg not open/reg倒數跑完');
                setProcessFch(pre => !pre);
            }, AboutNextStatus.seconds_to_status);
            setGameStatus(AboutNextStatus.status);
            // if (AboutNextStatus.status !== 'registration_closed') { setVisitorStatus(fetchUserRegStatus.current) }



            // const firstTimer = setTimeout(() => {
            //     console.log('倒數跑完')

            //     GameStatus === 'registration_closed' ? CallSecondTimer() : setProcessFch(true)
            // }, CDTimeRef.current)
            // return () => clearInterval(firstTimer);
        }
    }, [AboutNextStatus]);
    //Timer region  0827移往banner btn
    // const [firstTimer, setFirstTimer] = useState(0);
    // const timerUsedBefore = useRef(false)

    // //動作提前1秒執行 //unit sec
    // const adjustTimeLength = 1
    // useEffect(() => {
    //     //強制刷新
    //     if (GameStatus === 'registration_closed' && firstTimer === 0) {
    //         setProcessFch(true)
    //         return
    //     }
    //     if (firstTimer === 0) return;
    //     const timerId = setInterval(() => {
    //         // currentGameStatus.current
    //         // console.log('前', timerId)
    //         switch (GameStatus) {
    //             case 'registration_not_open':
    //                 // console.log('timer=>registration_not_open', firstTimer)
    //                 break;
    //             case 'registration_opened':
    //                 // console.log('timer=>registration_opened', firstTimer)
    //                 break;
    //             case 'registration_closed':
    //                 // console.log('timer=>registration_closed', firstTimer)
    //                 if (firstTimer === (finalCkInStart.current + adjustTimeLength)) {
    //                     setProcessFch(true)
    //                 }
    //                 if (firstTimer === (finalCkEndToOngo.current + adjustTimeLength)) {
    //                     setProcessFch(true)
    //                 }

    //                 break;
    //             case 'ongoing':
    //                 //不會進
    //                 break;
    //             case 'completed':
    //                 //不會進
    //                 break;
    //             default:
    //                 break;
    //         }

    //         if (firstTimer === (0 + adjustTimeLength)) {
    //             setProcessFch(true)
    //         }
    //         timerUsedBefore.current = true
    //         setFirstTimer((t) => t - 1);
    //     }, 1000);
    //     return () => {
    //         // console.log('解timer', timerId)
    //         clearInterval(timerId)
    //     };
    // }, [firstTimer]);



    // --------------------------Banner------- E-----------------------













    //collect all state  take and give
    const accumulate = {
        setProcessFch,
        IsT8TFchOK,
        t8t_serial,
        renderT8tInfo,
        setRenderT8tInfo,
        renderCbInfo,
        setRenderCbInfo,
        CDTimeRef,
        GameStatus,
        setGameStatus,
        configData,
        match,
        history,
        location,
        VisitorStatus,
        setVisitorStatus,
        RenderGameStatus,
        setRenderGameStatus,
        RenderRegStatus,
        setRenderRegStatus,
        UserBtnSkin,
        setUserBtnSkin,
        dialogData,
        authData,
        GameSerial,
        setGameSerial,
        RegId,
        setRegId,
        IsApplier,
        setIsApplier,
        CbId,
        setCbId,
        CbFlCount,
        setCbFlCount,
        IsUserFlCb,
        setIsUserFlCb,
        standing,
        DefaultBannerMsg,
        setDefaultBannerMsg,
        RegBannerMsg,
        setRegBannerMsg,
        isIndividual,
        ShowFloatBar,
        intl,
        isClubAdmin,
        isThisGameJudge,
        bracketType,
        passTimeToBtn,
        setPassTimeToBtn,
        finalCkInStart,
        finalCkEndToOngo,
        popWindowData,
        clubUrlKey,
        IsPrivateImport,
        teamParticipateList,
    }

    return (
        <TournamentContext.Provider value={accumulate}>
            {props.children}
        </TournamentContext.Provider>
    );
};
