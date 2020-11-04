import { useState, useEffect, useRef } from 'react';
import { from } from 'rxjs';

import { getMemberTeamListAPI } from 'apis/player';
import { getTeamInfo } from 'apis/team';

import { getTeamClubinfo, postRegisteragreeTvT, postRegistertvt, postDiscardreg, getDoItLater } from 'apis/tournament';

//member036 teams include user

export function useMyteams(loginUsername) {
    const fetchListener = useRef();
    const [myteams, setMyTeams] = useState([]);

    function fetchmyteams(loginUsername) {
        const data = { username: loginUsername };

        fetchListener.current = from(getMemberTeamListAPI(data)).subscribe(response => {
            if (response.status === 200) {
                const { header, body } = response.data;
                if (header.status.toUpperCase() === 'OK') {
                    setMyTeams(body.teams);
                }
            }
        });
    }

    useEffect(() => {
        fetchmyteams(loginUsername);

        return () => {
            //取消fetch監聽
            if (fetchListener.current) fetchListener.current.unsubscribe();
        };
    }, [loginUsername]);

    return { myteams };
}

// ----------------------------------------------mix fetch------------------------

//Team013 team members
// 1.40判斷隊員是否為Club會員(t8t040)
//取得隊伍成員名單

export function useMyteamMembers({ currentselectteam, GameClubId }) {
    const fetchListener = useRef();
    const secondfetchListener = useRef();
    const [myteammembers, setMyTeamMembers] = useState([]);
    const [IsFetchMemberFinish, setIsFetchMemberFinish] = useState(false);
    const [payload, setpayload] = useState([]);

    function fetchteammember(currentselectteam, GameClubId) {
        const data = { url_key: currentselectteam };
        const data2 = {
            url_key: currentselectteam,
            club_id: GameClubId
        };
        let payload1 = [];

        fetchListener.current = from(getTeamInfo(data)).subscribe(response => {
            setIsFetchMemberFinish(false);
            if (response.status === 200) {
                const { header, body } = response.data;
                if (header.status.toUpperCase() === 'OK') {
                    const arr = body.team.members.map(val => {
                        return {
                            username: val.username,
                            member_id: val.member_id,
                            profile_picture: val.profile_picture,
                            IsIdVerfied: val.is_in_game_id_verified,
                            inGameId: val.in_game_id
                        };
                    });
                    payload1 = [...payload1, ...arr];
                    secondfetchListener.current = from(getTeamClubinfo(data2)).subscribe(response => {
                        if (response.status === 200) {
                            const { header, body } = response.data;
                            if (header.status.toUpperCase() === 'OK') {
                                const arr = payload1.map((val, idx) => {
                                    let arr = body.team_members.filter(val2 => val.username === val2.username);
                                    return { ...val, IsInClub: arr[0].is_club_member };
                                });
                                setMyTeamMembers(arr);
                                setIsFetchMemberFinish(true);
                            }
                        } else {
                            console.log('擴充隊員Cb訊息失敗');
                            return;
                        }
                    });
                }
            }
        });
    }

    useEffect(() => {
        // console.log('選擇改變')
        if (currentselectteam !== '') {
            fetchteammember(currentselectteam, GameClubId);
        }

        return () => {
            //取消fetch監聽
            if (fetchListener.current) fetchListener.current.unsubscribe();
            if (secondfetchListener.current) secondfetchListener.current.unsubscribe();
        };
    }, [currentselectteam]);

    return { myteammembers, IsFetchMemberFinish };
}

// // 1.14. 報名錦標賽-同意政策ByTeam(t8t014)  //取得regid

export function useCreateTeamReg({ createreg, gameserial, apiWithTokenWrapper }) {
    const fetchListener = useRef();
    const [team_reg_id, setTeam_Reg_Id] = useState('');
    const [dataLoading, setDataLoading] = useState(false);
    const [finishcreatejoin, setFinishCreateJoin] = useState(false);

    function fetchmyregid(gameserial) {
        // gameserial
        // const data = { t8t_serial: gameserial }
        const data = { t8t_serial: gameserial };

        fetchListener.current = from(apiWithTokenWrapper(postRegisteragreeTvT, data)).subscribe(response => {
            if (response.status === 200) {
                const { header, body } = response.data;
                if (header.status.toUpperCase() === 'OK') {
                    // console.log(body.t8t_player.t8t_player_id)
                    //拉回reg id
                    console.log('隊伍報名啟動完成');
                    // console.log(body)
                    setTeam_Reg_Id(body.t8t_team.t8t_team_id);
                    // t8t_player_id
                }
            } else {
                console.log('隊伍啟動報名失敗');
            }
        });
    }

    useEffect(() => {
        //確認不是空字串才觸發fetch
        if (gameserial === '') return;
        if (createreg) {
            fetchmyregid(gameserial);
        }
        return () => {
            //取消fetch監聽
            if (fetchListener.current) fetchListener.current.unsubscribe();
        };
    }, [createreg]);

    return { team_reg_id };
}

// 1.6.	報名錦標賽ByTeam(t8t006)                   //送出reg資料

export function useSendTeamReg({ readytosend, apiWithTokenWrapper, finalregdata, setReadyToSend }) {
    const [fetchfinish, setFetchFinish] = useState(false);

    const RegBkOK = useRef(false);

    const fetchListener = useRef();

    function fetchsendteamreg(finalregdata) {
        fetchListener.current = from(apiWithTokenWrapper(postRegistertvt, finalregdata)).subscribe(response => {
            if (response.status === 200) {
                const { header, body } = response.data;
                if (header.status.toUpperCase() === 'OK') {
                    if (body.is_register_finish) {
                        console.log('最終註冊成功');
                        // setRegitsterFinish(true)
                        RegBkOK.current = true;
                    }
                    // console.log(body)
                    // console.log('資料更新成功')
                    setReadyToSend(false);
                    setFetchFinish(true);
                }
            } else {
                console.log('資料更新失敗');
            }
        });
    }

    useEffect(() => {
        // console.log('偷跑')

        if (readytosend) {
            // console.log('跑進來了')
            // console.log(finalregdata)
            setFetchFinish(false);
            fetchsendteamreg(finalregdata);
        }

        return () => {
            //取消fetch監聽
            if (fetchListener.current) fetchListener.current.unsubscribe();
        };
    }, [readytosend]);

    return { fetchfinish, RegBkOK };
}

//1.23	取消報名(t8t023)  //solo //team 共用

export function useKillReg({ ProcessRegKill, apiWithTokenWrapper, gameserial, regid }) {
    const fetchListener = useRef();
    const [IsRegDelete, setIsRegDelete] = useState(false);

    function fetchkillreg(data) {
        //func block
        // return console.log(data)
        fetchListener.current = from(apiWithTokenWrapper(postDiscardreg, data)).subscribe(response => {
            if (response.status === 200) {
                const { header, body } = response.data;
                if (header.status.toUpperCase() === 'OK') {
                    // console.log(body)
                    setIsRegDelete(true);
                }
            }
        });
    }
    useEffect(() => {
        if (ProcessRegKill) {
            const data = {
                t8t_serial: gameserial,
                target_id: regid
            };
            console.log('殺掉資料了', data);

            fetchkillreg(data);
        }
        return () => {
            //取消fetch監聽
            if (fetchListener.current) fetchListener.current.unsubscribe();
        };
    }, [ProcessRegKill]);

    return { IsRegDelete };
}

// 1.34.	稍後報名 (t8t034) 由後端發訊號用

export function useDoItLater({ ProcessDIL, gameserial, apiWithTokenWrapper }) {
    const fetchListener = useRef();
    const [IsDILFin, setIsDILFin] = useState(false);

    function fetchDoItLater(gameserial) {
        // gameserial
        const data = { t8t_serial: gameserial };

        fetchListener.current = from(apiWithTokenWrapper(getDoItLater, data)).subscribe(response => {
            if (response.status === 200) {
                const { header, body } = response.data;
                if (header.status.toUpperCase() === 'OK') {
                    setIsDILFin(true);
                }
            }
        });
    }

    useEffect(() => {
        //確認不是空字串才觸發fetch
        // console.log('DIL')
        if (!ProcessDIL || gameserial === '') return;
        console.log('觸發DIL');
        setIsDILFin(false);
        fetchDoItLater(gameserial);

        return () => {
            //取消fetch監聽
            if (fetchListener.current) fetchListener.current.unsubscribe();
        };
    }, [ProcessDIL]);

    return { IsDILFin };
}
