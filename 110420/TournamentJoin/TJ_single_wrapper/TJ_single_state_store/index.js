import React, { useState, createContext, useEffect, useRef, useContext } from 'react'
//fetch hook
import { useDoItLater } from '../useTJsinglefetch'

//design time format
import { formatDateTime } from 'utils/formattersV2/date'

//pop context
import { PopWindowStorage } from 'components/DesignSystem/PopWindow_V2'



export const Singlegameprovider = createContext()


//因為資料關聯多個component用context控管
export const TJ_single_state_store = props => {
    const { history, location, match, configData, dialogData, popWindowData, intl, dialog_V2Data } = props.parentinfo

    const popWindowData_V2 = useContext(PopWindowStorage);
    const { openPopWindow, closePopWindow } = popWindowData_V2;
    const { openDialog_V2Func, closeDialog_V2Func } = dialog_V2Data

    // useEffect(() => {
    //     openPopWindow({
    //         title: 'pop without Btn',
    //         component: (<><pop-content></pop-content> <btn-group> </btn-group></>),
    //     })


    // }, [])
    //TODO visitor data from outside enviornment

    //pageState
    const [currentpage, setCurrentPage] = useState(1)
    // 1_info 2_require 3_sum(內部加入reg 跳窗)
    // pending跳窗component?



    // ---------------------------game  detail---------------------------------------------
    const { currentgamedata } = props.parentinfo
    //gamedetail //TODO fetch api只進行一次   //TODO 取得pendingData //TODO 確認是否需要required Data//TODO 由gameDetail render requireData arr //TODO reg和pendingdata
    const [gamedetail, setGameDetail] = useState([])
    //TODO visitor data from outside content
    //TODO下方好像沒用到
    //動態欄位標頭
    const [requireddatatitles, setRequiredDataTitles] = useState([])
    //final post requried data
    const [requrieddata, setRequriedData] = useState([])
    const [gameserial, setGameSerial] = useState('')
    //需要joincode訊號
    const [needjoincode, setNeedJoinCode] = useState(false)
    const [gameStartTime, setGameStartTime] = useState('')
    const [gameRegEtime, setGameRegEtime] = useState('')
    const [GameClubId, setGameClubId] = useState('')
    const playGameIcon = useRef(null)
    //render translate string
    const gameType = useRef('')
    //User RegId
    const [regid, setRegId] = useState('')
    const tournamentName = useRef('')
    const holdingClubName = useRef('')

    useEffect(() => {
        //資訊進入後進行分解，拆送state
        if (Object.keys(currentgamedata).length !== 0) {
            setGameDetail(currentgamedata)
            const arr = currentgamedata.request_titles
            const mixarr = arr.map(val => {
                const obj = { [val.title_name]: "" }
                return obj
            })
            setRequriedData(mixarr)
            setGameSerial(currentgamedata.t8t_lite.t8t_serial)
            setNeedJoinCode(currentgamedata.is_join_code)
            // console.log('currentgamedata.myself.participant', currentgamedata.myself.participant)
            currentgamedata.myself.participant && setRegId(currentgamedata.myself.participant.t8t_player_id)
            // setGameStartTime(ConvertToRenderTime(currentgamedata.event_start_at))
            // setGameRegEtime(ConvertToRenderTime(currentgamedata.registration_end_at))
            setGameStartTime(formatDateTime(currentgamedata.event_start_at))
            setGameRegEtime(formatDateTime(currentgamedata.registration_end_at))
            setGameClubId(currentgamedata.t8t_lite.club.club_id)
            setRequiredDataTitles(currentgamedata.request_titles)
            playGameIcon.current = currentgamedata.t8t_lite.game.icon_image
            tournamentName.current = currentgamedata.t8t_lite.name
            holdingClubName.current = currentgamedata.t8t_lite.club.name
            switch (currentgamedata.bracket_type) {
                case 'single':
                    gameType.current = intl.formatMessage({ id: 'TournamentJoin_Single Elimination' })
                    break
                case 'double':
                    gameType.current = intl.formatMessage({ id: 'TournamentJoin_Double Elimination' })
                    break
                case 'round_robin':
                    gameType.current = intl.formatMessage({ id: 'TournamentJoin_Round Robin' })
                    break
                case 'swiss':
                    gameType.current = intl.formatMessage({ id: 'TournamentJoin_Swiss' })
                    break
                case 'ffa':
                    gameType.current = intl.formatMessage({ id: 'TournamentJoin_Free For All' })
                    break
                default:
                    gameType.current = 'Unknown Game Mode'
                    break
            }

        }


    }, [currentgamedata])

    useEffect(() => {
        //組成問答集
        // console.log('requireddatatitles', requireddatatitles)
        const arr = requireddatatitles.map(val => {
            const obj = { [val.title_name]: "" }
            return obj
        })
        // 往下丟state
        setRequriedData(arr)

    }, [requireddatatitles])


    // const finaldata = data.map((val, idx) => {
    //     //用title做keys
    //     const obj = { [val]: "" }
    //     return obj
    // })





    // -----------------------------userinfo_collect-------------------------------------
    //從userid
    const { authData } = props.parentinfo
    const { apiWithTokenWrapper } = authData;
    // console.log(authData.getUsername())  //TODO如果是null要擋??
    //資料拆解到只留下必要的部分送到component
    const [visitorinfo, setVisitorInfo] = useState(authData)
    // const [regid, setRegId] = useState('')
    const [joincode, setJoinCode] = useState('')
    const [regitsterfinish, setRegitsterFinish] = useState(false)


    //on off控制送後台fetch
    const [readytosend, setReadyToSend] = useState(false)


    //集合組成送的所有資料
    const [finalregdata, setfinalregdata] = useState({})
    //資料格式
    // {
    //     "t8t_player_id": 10005,
    //     "join_code": "testJoinCode",
    //     'required_title':JSON...
    //     "is_regitster_finish": true
    // 't8t_serial'
    //    }
    useEffect(() => {
        // console.log('總資料偷跑')
        const formatRD = JSON.stringify(requrieddata)
        const obj = { ...finalregdata, t8t_player_id: regid, join_code: joincode, request_title: formatRD, is_regitster_finish: regitsterfinish, t8t_serial: gameserial }
        setfinalregdata(obj)
    }, [regid, joincode, requrieddata, regitsterfinish, gameserial])

    //辨認是否按下的是regbtn，關掉前面next的fetch
    const [regbtnclick, setregbtnclick] = useState(false)

    // ---------------fetch---DIL--------------------


    const { closePopWindowFunc } = popWindowData

    //fetch hook
    const [ProcessDIL, setProcessDIL] = useState(false)
    const { IsDILFin } = useDoItLater({ ProcessDIL, gameserial, apiWithTokenWrapper })
    useEffect(() => {
        if (!IsDILFin) return

        //重置process signal
        // setProcessDIL(false)
        history.replace({
            ...location,
            pathname: `${configData.pathPrefix}/tournament/list/${gameserial}/home`,
        });
        closePopWindowFunc()

    }, [IsDILFin])





    // 集中管理上方state && set 
    const accumulate = {
        currentpage,
        setCurrentPage,
        gamedetail,
        setGameDetail,
        requrieddata,
        setRequriedData,
        joincode,
        setJoinCode,
        visitorinfo,
        setVisitorInfo,
        requireddatatitles,
        setRequiredDataTitles,
        gameserial,
        setGameSerial,
        regid,
        setRegId,
        needjoincode,
        setNeedJoinCode,
        regitsterfinish,
        setRegitsterFinish,
        readytosend,
        setReadyToSend,
        finalregdata,
        setfinalregdata,
        regbtnclick,
        setregbtnclick,
        authData,
        configData,
        dialogData,
        popWindowData,
        gameRegEtime,
        setGameRegEtime,
        GameClubId,
        setGameClubId,
        intl,
        match,
        gameStartTime,
        setGameStartTime,
        history,
        location,
        ProcessDIL,
        setProcessDIL,
        gameType,
        tournamentName,
        holdingClubName,
        playGameIcon,
        popWindowData_V2,
        dialog_V2Data,
    }
    //do it later 轉頁跳窗show pending資訊
    //discard 刪除所有pending資料
    //reg按鈕，按下後收集所有資訊，同時送pending reg api


    return (
        <>
            <Singlegameprovider.Provider value={accumulate}>
                {props.children}
            </Singlegameprovider.Provider>
        </>
    )
}