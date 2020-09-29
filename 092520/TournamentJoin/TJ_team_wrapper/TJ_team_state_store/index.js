import React, { useState, createContext, useEffect, useRef } from 'react'



//format time
import moment from 'moment-timezone';



//design time format
import { formatDateTime } from 'utils/formattersV2/date'


//fetch hook
import { useMyteams, useMyteamMembers, useDoItLater } from '../useTJteamfetch'


export const Teamgameprovider = createContext()


export const TJ_team_state_store = props => {
    // console.log('TJ_team_state_store', props)

    const { intl, match, configData, history, location, dialogData, popWindowData } = props.parentinfo

    const { getImageUrl } = configData;



    //TODO 從page拿到關於使用者的info//作為fetch 材料



    //預設頁碼
    const [currentpage, setCurrentPage] = useState(1)
    // p1_TeamApplyPolicy p2_NoJoinTeam p3_SelectTeam p4_TeamJoinCodeAndRequireData p5_TeamConfirmation



    // -------------------------tournament  detail-------------------------------------
    //TODO visitor data from outside content
    const { currentgamedata } = props.parentinfo
    const [gamedetail, setGameDetail] = useState([])
    //動態填寫欄位標頭
    const [requireddatatitles, setRequiredDataTitles] = useState([])
    //最終填寫問答集
    const [requrieddata, setRequriedData] = useState([])
    //取得tournament序號
    const [gameserial, setGameSerial] = useState('')
    //是否需要joincode
    const [needjoincode, setNeedJoinCode] = useState(false)
    const [gameStartTime, setGameStartTime] = useState('')
    const [gameRegEtime, setGameRegEtime] = useState('')
    const [needStarterNum, setneedStarterNum] = useState('')
    const [needBenchNum, setneedBenchNum] = useState('')
    const [GameClubId, setGameClubId] = useState('')
    const playGameIcon = useRef(null)
    //是否要驗gameId
    const [NeedGameIdVerified, setNeedGameIdVerified] = useState(null)
    const [GameOpenRule, setGameOpenRule] = useState('')
    //render translate string
    const gameType = useRef('')
    //User Reg t8tId
    const [regid, setRegId] = useState('')
    const tournamentName = useRef('')
    const holdingClubName = useRef('')
    const noNeedReq = useRef(false)



    // function ConvertToRenderTime(GMT) {
    //     //locale設定顯示語系
    //     moment.locale('en')
    //     const AdjustTimestamp = moment(GMT).tz(moment.tz.guess()).valueOf()
    //     const TimeStr1 = moment(AdjustTimestamp).format(`YYYY/MM/DD`)
    //     const TimeStr2 = moment(AdjustTimestamp).format(`hh:mm A`)
    //     const TimeStr3 = moment.tz.guess() //Asia/Taipei
    //     //adjustTZ +8..~+10... 
    //     const TimeStr4 = moment(AdjustTimestamp).format(`Z`).split(':')[0].split('')[1] ? moment(AdjustTimestamp).format(`Z`).split(':')[0].replace('0', '') : moment(AdjustTimestamp).format(`Z`).split(':')[0]
    //     const processStr = `${TimeStr1}  ${TimeStr2} | ${TimeStr3}  (${TimeStr4})`
    //     return processStr
    // }


    // 當fetch tournament資訊後，拆解設定給其他state
    useEffect(() => {
        // console.log('team跑遊戲資訊')
        //確認資料拿完後
        if (Object.keys(currentgamedata).length !== 0) {
            setGameDetail(currentgamedata)
            // console.log('currentgamedata', currentgamedata)
            const arr = currentgamedata.request_titles
            // const mixarr = arr.map(val => {
            //     const obj = { [val.title_name]: "" }
            //     return obj
            // })
            //TODO有require data存在時才修正require data
            // setRequriedData(mixarr)
            setGameSerial(currentgamedata.t8t_lite.t8t_serial)
            setNeedJoinCode(currentgamedata.is_join_code)
            //如果存在註冊資料，寫入RegId
            currentgamedata.myself.participant && setRegId(currentgamedata.myself.participant.t8t_team_id)
            // console.log('遊戲結束', currentgamedata.registration_end_at)
            // setGameStartTime(ConvertToRenderTime(currentgamedata.event_start_at))
            // setGameRegEtime(ConvertToRenderTime(currentgamedata.registration_end_at))
            setGameStartTime(formatDateTime(currentgamedata.event_start_at))
            setGameRegEtime(formatDateTime(currentgamedata.registration_end_at))
            setneedStarterNum(currentgamedata.starter_count)
            setneedBenchNum(currentgamedata.bench_count)
            setGameClubId(currentgamedata.t8t_lite.club.club_id)
            setNeedGameIdVerified(currentgamedata.is_need_in_game_id_verified)
            setGameOpenRule(currentgamedata.open_rule)
            //digest to title only arr
            setRequiredDataTitles(currentgamedata.request_titles.map(val => { return val.title_name }))
            noNeedReq.current = !currentgamedata.request_titles.length
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



    // ----------------------------visitor associate----------------------------

    //userinfo_collect  //TODO隨著選擇team更改調整fetch team list
    const [currentselectteam, setCurrentSelectTeam] = useState('')
    const [currentselectteamid, setCurrentSelectTeamId] = useState('')
    const [currentselectteamname, setCurrentSelectTeamName] = useState('')
    const [currentTeamLogo, setCurrentTeamLogo] = useState({})
    // useEffect(() => {
    // }, [currentselectteam])
    //TODO調整fetch回來的teamlist



    // -----------------------------userinfo_collect-------------------------------------

    //從userid
    const { authData } = props.parentinfo
    const { apiWithTokenWrapper } = authData;
    // console.log('helloauthData', authData)
    // const { authData } = userinfo
    // console.log(authData.getUsername())  //TODO如果是null要擋??
    //利用map組成dropdown陣列
    const loginUsername = authData.getUsername()
    const [visitorinfo, setVisitorInfo] = useState(authData)
    // useEffect(() => {
    //     console.log(authData)
    // }, [])

    const { myteams } = useMyteams(loginUsername)


    //val//obj
    // const newarr = myteams.map((val, idx) => {
    //     return { id: idx, key: val.name, name: val.name }
    // })
    // console.log(newarr)

    //visitor擁有的隊伍
    const [visitorhasteams, setVisitorHasTeams] = useState([])



    // useEffect(() => {
    //     console.log('擁有隊伍', visitorhasteams)


    // }, [visitorhasteams])




    const selectTeamStyle = {
        width: '30px',
        height: '30px',
        border: 'solid 2px #126174',
        borderRadius: '50%',
    }



    // TODO
    useEffect(() => {
        //整理dropdown資料格式
        // console.log('myteams', myteams)
        let myfirstteam = ''
        let myfirstteamname = ''
        let myfirstteamid = ''
        let myfirstteamlogo = {}
        const newarr = myteams.map((val, idx) => {
            if (idx === 0) {
                myfirstteam = val.url_key
                myfirstteamid = val.team_id
                myfirstteamname = val.name
                myfirstteamlogo = val.logo_image
            }
            return { id: idx, key: val.name, value: val.name, name: val.name, url_key: val.url_key, team_id: val.team_id, logo_image: val.logo_image, icon: <img src={getImageUrl(val.logo_image)} alt="selectTeamImg" style={selectTeamStyle} /> }
        })
        // setCurrentSelectTeam(newarr[0].url_key)
        // console.log(newarr[0].url_key)
        // TODO
        setCurrentSelectTeam(myfirstteam)
        setCurrentSelectTeamId(myfirstteamid)
        setCurrentSelectTeamName(myfirstteamname)
        setCurrentTeamLogo(myfirstteamlogo)
        setVisitorHasTeams(newarr)
    }, [myteams])


    //當擁有隊伍發生改變的時候，把第一筆資料匯入memberlist搜索
    // useEffect(() => {
    //     setCurrentSelectTeam(visitorhasteams[0].url_key)
    // }, [visitorhasteams])



    //    TODO siganl應該給最後的加工陣列
    const { myteammembers, IsFetchMemberFinish } = useMyteamMembers({ currentselectteam, GameClubId })

    const [visitorteammemberlist, setVisitorteammemberlist] = useState([])

    const [FetchMemberFinish, setFetchMemberFinish] = useState(false)

    useEffect(() => {
        if (myteammembers.length === 0) return
        // console.log('myteammembers', myteammembers)
        // setVisitorteammemberlist(myteammembers)
        //加入本場遊戲的驗證開關
        setVisitorteammemberlist(myteammembers.map(val => { return { ...val, CheckGId: NeedGameIdVerified, CheckCb: GameOpenRule !== 'public' } }))

    }, [myteammembers])

    //同步更新fetch狀態給global state
    useEffect(() => {
        setFetchMemberFinish(IsFetchMemberFinish)
    }, [IsFetchMemberFinish])






    // -------------------POST info collect---------------------------

    const [joincode, setjoincode] = useState('')
    //TODO functional component //拿回teamlist的value 隨著 currentselec不同要再回去拉team_memberlist
    //正式球員列表addStarter
    // TODO starterarr default就會加入visitor


    // const [starterarr, setStarterArr] = useState([])
    //default狀態直接加入報名者//因為有verified Id 還有in club才能進入頁面，不做額外判定
    // const [starterarr, setStarterArr] = useState([{ username: authData.profile.username, member_id: authData.profile.member_id, profile_picture: authData.profile.profile_picture, IsIdVerfied: true, IsInClub: true }])
    // 090720取消報名者直接為正式
    const [starterarr, setStarterArr] = useState([])
    // { username: authData.profile.username, member_id: authData.profile.member_id, profile_picture: authData.profile.profile_picture,IsIdVerfied:true,IsInClub:true }
    const [bencharr, setBencharr] = useState([])





    //根據選擇人員不同調整問答集

    // ['habbit', 'love', 'girl'] to {habbit: "", love: "", girl: ""}
    function convertArrToObj(arr) {
        let useobj = {}
        arr.map(val => {
            useobj = { ...useobj, [val]: "" }
        })
        return useobj
    }
    function combineAskArr(majorarr, askobj, labelkey) {
        let arr = majorarr.map(val => {
            val = { [labelkey]: { ...val }, ...askobj }
            return val
        })
        return arr
    }

    useEffect(() => {
        //轉換題目arr
        // const sourcearr = ['血型', '身高', '體重']

        // requireddatatitles
        const askobj = convertArrToObj(requireddatatitles)


        //合成所有人員列表
        const mixarr = [...starterarr, ...bencharr]

        const finalarr = combineAskArr(mixarr, askobj, 'mbinfo')

        //設給最後的問題集
        setRequriedData(finalarr)
        // console.log(finalarr)

    }, [starterarr, bencharr])







    // TODO------------requiredata------------
    // const [joinrequiredata, setJoinRequireData] = useState([])

    // const [teamrequiredata, setTeamRequireData] = useState([])


    //註冊完成
    const [regitsterfinish, setRegitsterFinish] = useState(false)
    //on off控制送後台fetch
    const [readytosend, setReadyToSend] = useState(false)


    //集合組成送的所有資料
    const [finalregdata, setfinalregdata] = useState({})



    //noNeedReq.current 控管最終送問答集資料，true送空[]
    useEffect(() => {
        // console.log('總資料偷跑')
        const formatRD = JSON.stringify(noNeedReq.current ? [] : requrieddata)
        const formatstarterarr = starterarr.map(val => {
            return val.username
        })
        const formatbencharr = bencharr.map(val => {
            return val.username
        })

        const obj =
        {
            ...finalregdata,
            t8t_team_id: regid,
            team_id: currentselectteamid,
            starter: formatstarterarr,
            bench: formatbencharr,
            join_code: joincode,
            request_title: formatRD,
            is_regitster_finish: regitsterfinish,
            t8t_serial: gameserial
        }
        setfinalregdata(obj)
        // currentselectteam
    }, [regid, joincode, requrieddata, regitsterfinish, gameserial, starterarr, bencharr, currentselectteamid])


    // ---------------fetch---DIL--------------------

    const { closePopWindowFunc } = popWindowData

    //fetch hook
    const [ProcessDIL, setProcessDIL] = useState(false)
    const { IsDILFin } = useDoItLater({ ProcessDIL, gameserial, apiWithTokenWrapper })
    useEffect(() => {
        if (!IsDILFin) return

        //  no team pending
        if (currentpage === 2) {
            history.replace({
                ...location,
                pathname: `${configData.pathPrefix}/tournament/list/${gameserial}/participants`,
            });
            closePopWindowFunc()
            return
        }



        //重置process signal
        // setProcessDIL(false)
        history.replace({
            ...location,
            pathname: `${configData.pathPrefix}/tournament/list/${gameserial}/home`,
        });
        closePopWindowFunc()

    }, [IsDILFin])


    const accumulate = {
        currentpage,
        setCurrentPage,
        gamedetail,
        setGameDetail,
        requrieddata,
        setRequriedData,
        currentselectteam,
        setCurrentSelectTeam,
        visitorteammemberlist,
        setVisitorteammemberlist,
        starterarr,
        setStarterArr,
        bencharr,
        setBencharr,
        joincode,
        setjoincode,
        visitorhasteams,
        setVisitorHasTeams,
        currentselectteamname,
        setCurrentSelectTeamName,
        requireddatatitles,
        setRequiredDataTitles,
        visitorinfo,
        setVisitorInfo,
        gameserial,
        setGameSerial,
        needjoincode,
        setNeedJoinCode,
        regitsterfinish,
        setRegitsterFinish,
        readytosend,
        setReadyToSend,
        finalregdata,
        setfinalregdata,
        regid,
        setRegId,
        currentselectteamid,
        setCurrentSelectTeamId,
        gameRegEtime,
        setGameRegEtime,
        FetchMemberFinish,
        setFetchMemberFinish,
        needBenchNum,
        setneedBenchNum,
        GameClubId,
        setGameClubId,
        authData,
        configData,
        dialogData,
        popWindowData,
        intl,
        match,
        gameStartTime,
        setGameStartTime,
        history,
        location,
        currentTeamLogo,
        setCurrentTeamLogo,
        NeedGameIdVerified,
        setNeedGameIdVerified,
        GameOpenRule,
        setGameOpenRule,
        ProcessDIL,
        setProcessDIL,
        needStarterNum,
        setneedStarterNum,
        gameType,
        tournamentName,
        holdingClubName,
        playGameIcon,
    }

    return (
        <>
            <Teamgameprovider.Provider value={accumulate}>
                {props.children}
            </Teamgameprovider.Provider>
        </>
    )
}