import { useState, useEffect, useRef } from 'react';
import { from } from 'rxjs';

//moment
import moment from 'moment';

import { getT8t } from 'apis/tournament';

export function useGetT8TDetail({ t8t_serial, apiWithTokenWrapper, ProcessFch, history, configData, location }) {
    //holding club info
    const [FchBkHoldingCbInfo, setFchBkHoldingCbInfo] = useState({});
    //game info
    const [FchBkT8tInfo, setFchBkT8tInfo] = useState({});
    const fetchUserRegStatus = useRef(null);
    //fetch Reg Id
    const [GamerRegId, setGamerRegId] = useState(null);
    //fch signal
    const [IsT8TFchOK, setIsT8TFchOK] = useState(false);
    const currentGameStatus = useRef(null);

    //比對狀態改變才調動state
    const pregamestatusref = useRef('');

    // --------------B model-----S-----ref------

    // const BfCheckTime = useRef(0)
    const CheckInTime = useRef(null);
    const CheckETime = useRef(null);
    //ori counttime
    const OriRegEtime = useRef(null);
    //Ckin left time
    const CheckInLeftTime = useRef(null);
    //left days before game start
    const leftDays = useRef(null);
    const gameNeedsCK = useRef(null);
    const isUserCkGame = useRef(null);

    // --------------B model-----E-----------
    const timeToNext = useRef(0);
    const ckInStart = useRef(null);
    const ckEndToOngo = useRef(null);

    //Rxjs observer
    const fetchListener = useRef();
    //CkNotOpen Flag
    const ckNotOpen = useRef(null);

    //TODO 未登入狀態下，不送TOKEN//利用api調控
    function fetchT8TDetail(data) {
        setIsT8TFchOK(false);
        fetchListener.current = from(apiWithTokenWrapper(getT8t, data)).subscribe(response => {
            if (response.status === 200) {
                const { header, body, status } = response.data;
                //exception
                if (header.status === 'T8T5004') {
                    history.replace({
                        ...location,
                        pathname: `${configData.pathPrefix}/tournament`
                    });
                    return;
                }
                //general
                if (header.status.toUpperCase() === 'OK') {
                    //TODO狀態一樣停止更新 //但如果遇到同樣的狀態更新時間就會拿不到
                    if (pregamestatusref.current === body.t8t.status) return;

                    if (body.t8t.myself.participant) {
                        if (body.t8t.tournament_format === '1v1') {
                            setGamerRegId(body.t8t.myself.participant.t8t_player_id);
                        } else {
                            setGamerRegId(body.t8t.myself.participant.t8t_team_id);
                        }
                    }
                    //main game status
                    currentGameStatus.current = body.t8t.status;
                    //user Reg status
                    fetchUserRegStatus.current = body.t8t.myself.participant;
                    //reg data
                    if (body.t8t.myself.participant) {
                        isUserCkGame.current = body.t8t.myself.participant.is_user_checkin;
                    }

                    gameNeedsCK.current = body.t8t.is_t8t_checkin;

                    //   TODO到頁面程式時間成本計算
                    //type change for time string  //time unit sec
                    timeToNext.current = body.t8t.seconds_to_status * 1;
                    // console.log('timeToNext', timeToNext.current)
                    //距離活動開始尚餘時間
                    let duration = moment.duration(body.t8t.seconds_to_status * 1, 'seconds').asDays();
                    leftDays.current = Math.ceil(duration);

                    //確認game需要CK並且具有reg身分再給CK in time
                    if (gameNeedsCK.current && body.t8t.myself.participant) {
                        //固定60分鐘 //轉為sec
                        ckNotOpen.current = true;
                        const CheckInTime = 60 * 60;
                        ckInStart.current = CheckInTime + body.t8t.t8t_checkin_mins * 60;
                        ckEndToOngo.current = body.t8t.t8t_checkin_mins * 60;
                        //位在ck階段
                        if (timeToNext.current < CheckInTime + body.t8t.t8t_checkin_mins * 60) {
                            ckNotOpen.current = false;
                            ckInStart.current = null;
                        }
                        //位在ck結束階段
                        if (timeToNext.current < body.t8t.t8t_checkin_mins * 60) {
                            ckInStart.current = null;
                            ckEndToOngo.current = null;
                            ckNotOpen.current = true;
                        }
                    }
                    //舉辦game 社團資訊
                    setFchBkHoldingCbInfo(body.t8t.t8t_lite.club);
                    //t8t主要資訊
                    setFchBkT8tInfo(body.t8t);
                    setIsT8TFchOK(true);
                }
            }
        });
    }
    //啟動第一次fetch後走on off 機制
    useEffect(() => {
        if (!ProcessFch) return;
        fetchT8TDetail({ t8t_serial });
        return () => {
            //取消fetch監聽
            if (fetchListener.current) fetchListener.current.unsubscribe();
        };
    }, [ProcessFch]);

    return {
        FchBkHoldingCbInfo,
        IsT8TFchOK,
        FchBkT8tInfo,
        CheckInTime,
        CheckETime,
        GamerRegId,
        OriRegEtime,
        CheckInLeftTime,
        leftDays,
        fetchUserRegStatus,
        gameNeedsCK,
        currentGameStatus,
        timeToNext,
        ckInStart,
        ckEndToOngo,
        ckNotOpen
    };
}
