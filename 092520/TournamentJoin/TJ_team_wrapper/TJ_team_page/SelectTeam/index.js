import React, { useState, useContext, useRef, useEffect } from 'react'

//global state
import { Teamgameprovider } from '../../TJ_team_state_store'

//styled component
import Dropdown from "components/DesignSystem/Input/Dropdown";
import Button from "components/DesignSystem/Input/Button";
import Checkbox from "components/DesignSystem/Input/Checkbox";

//manipulate all btns
import { teamhandleDIL, teamhandleDd } from '../../TJ_team_handlebtn'


//reuse components
import Dropdown_V3 from "components/DesignSystem/Input/Dropdown_V3";
import Thumbnail from "components/DesignSystem/DataDisplay/Thumbnail";

//custom fetch hook
import { useSendTeamReg, useKillReg } from '../../useTJteamfetch'

//取得loading圖示component
import Loading from 'components/utils/Loading';

//CSS
import classes from '../../../style.module.scss';
import classNames from 'classnames/bind';
//CSS class 縮寫
const cx = classNames.bind(classes);


// -------------------------------------------component edge------------------------------------------------------
const SelectTeam = () => {


    // -----------------------------global state------------------
    const { needStarterNum, setProcessDIL, setCurrentTeamLogo, currentTeamLogo, history, location, intl, dialogData, popWindowData, configData, authData, needBenchNum, gameserial, regid, FetchMemberFinish, starterarr, setStarterArr, bencharr, setBencharr, visitorhasteams, setCurrentPage, visitorteammemberlist, currentselectteam, setCurrentSelectTeam, setCurrentSelectTeamName, requireddatatitles, needjoincode, setCurrentSelectTeamId, readytosend, finalregdata, setReadyToSend, regitsterfinish, gameRegEtime } = useContext(Teamgameprovider)
    const { closePopWindowFunc } = popWindowData
    const { getImageUrl } = configData;
    const { closeDialogFunc } = dialogData;
    const { apiWithTokenWrapper } = authData

    // starter bench plus btn 詳細隊員列表分寫
    // ---------------------------------Stater------------selectlist-------------------
    const [renderlist, setRenderList] = useState([])

    useEffect(() => {
        // const arr = visitorteammemberlist.map(val => val.gameId)
        setRenderList(visitorteammemberlist)
        // setTempSelect(arr)
    }, [visitorteammemberlist])


    //TODO user身分檢驗 後續重構處理
    // const UserVerify = (val = {}) => {
    //     if (!val) return
    //     //狀態可能並存
    //     const ErrorMsg = []
    //     const GameIdVerify = true
    //     const CbVerify = true
    //     if ((GameOpenRule !== 'public') && (!val.IsInClub)) {
    //         GameIdVerify = false
    //         const Msg=intl.formatMessage({ id: 'TournamentJoin_Not Club Member' })
    //         ErrorMsg.push(Msg)
    //     }
    //     if (NeedGameIdVerified && !val.IsIdVerfied) {
    //         CbVerify = false
    //         const Msg=intl.formatMessage({ id: 'TournamentJoin_Not Verified ID' })
    //         ErrorMsg.push(Msg)
    //     }
    //     console.log('ErrorMsg', ErrorMsg)
    //     return { VerifyPass: GameIdVerify && CbVerify, ErrorMsg }
    // }


    // -------------------------------------------------------AddStarter-------------------------------------------------- 

    const AddStarter = () => {
        //裡面的func可以直接拿外層的vari展示
        // visitorteammemberlist 
        // starterarr
        // const [isChecked, setIsChecked] = useState(false);
        const [tempselect, setTempSelect] = useState([])
        // const [renderlist, setRenderList] = useState([])

        // useEffect(() => {
        //     setRenderList(visitorteammemberlist)
        // }, [])

        //  TODO   假設bench先新增
        // useEffect(() => {
        //     if(bencharr.length!==0){
        //     //只取id做filter
        //     const filterarr = bencharr.map(val => val.member_id)
        //     const arr = visitorteammemberlist.filter(val => filterarr.indexOf(val.member_id) === -1)
        //     setDigestRenderList(arr)
        //     }
        // }, [])
        const [digestrenderlist, setDigestRenderList] = useState([])



        // useEffect(() => {
        //     // filter showlist with bench
        //     const filterarr = bencharr.map(val => val.member_id) + starterarr.map(val => val.member_id)

        //     const arr = visitorteammemberlist.filter(val => filterarr.indexOf(val.member_id) === -1)
        //     setDigestRenderList(arr)

        // }, [starterarr, bencharr])


        //catch to local state
        // --------------------current use-----------------
        useEffect(() => {
            setDigestRenderList(visitorteammemberlist)
        }, [visitorteammemberlist])



        const [FilterLabelarr, setFilterLabelarr] = useState([])

        //pick member id //prepare filter label arr
        useEffect(() => {
            const arr1 = starterarr.map(val => { return val.member_id })
            const arr2 = bencharr.map(val => { return val.member_id })
            const arr3 = [...arr1, ...arr2]

            setFilterLabelarr(arr3)

        }, [starterarr, bencharr])

        const handleselectmember = (val) => {
            if (tempselect.indexOf(val.member_id) !== -1) {
                return setTempSelect(tempselect => tempselect.filter(element => element !== val.member_id))
            }
            //大於5去除之前第一個選擇
            // TODO 大於每隊設定上限去除之前第一個選擇 072920
            if (starterarr.length + tempselect.length === needStarterNum) {
                tempselect.shift();
            }
            setTempSelect(tempselect => [...tempselect, val.member_id])

        }

        const sendtostarter = () => {
            //拿取現有材料修改starter arr
            const arr = visitorteammemberlist.filter(val => tempselect.indexOf(val.member_id) !== -1)
            // console.log('arr', arr)
            setStarterArr([...starterarr, ...arr])
            // 清空tempselect
            setTempSelect([])
            //關閉視窗
            closePopWindowFunc()

        }

        return (
            <>
                {FetchMemberFinish ?
                    (<div className={classes.addStarterBox}>
                        {/* Required */}
                        <p>{intl.formatMessage({ id: 'TournamentJoin_Required' })}</p>
                        <p className={cx('requiredNumber')}>{starterarr.length + tempselect.length} / {needStarterNum}</p>
                        <div>
                            <table className={cx('addUserTable')}>
                                <thead>
                                    <tr>
                                        <th></th>
                                        {/* User Name */}
                                        <th>{intl.formatMessage({ id: 'TournamentJoin_User Name' })}</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* CheckGId: NeedGameIdVerified, CheckCb: GameOpenRule !== 'public' */}
                                    {digestrenderlist.map((val, idx) => (
                                        < tr key={idx} >
                                            {/* TODO 重補user的遊戲驗證*/}
                                            {/* NeedGameIdVerified   GameOpenRule !== 'public' */}
                                            <td style={{ opacity: `${((val.CheckGId && !val.IsIdVerfied) || (val.CheckCb && !val.IsInClub) || FilterLabelarr.indexOf(val.member_id) !== -1) ? '0.5' : '1'}` }}>
                                                {/* <td style={{ opacity: `${(!val.IsInClub || FilterLabelarr.indexOf(val.member_id) !== -1) ? '0.5' : '1'}` }}> */}
                                                {/* <input type="checkbox" /> */}
                                                <Checkbox
                                                    title=''
                                                    checked={tempselect.indexOf(val.member_id) !== -1 || FilterLabelarr.indexOf(val.member_id) !== -1}
                                                    //綁event//不去理會原生 event obj
                                                    onChange={() => handleselectmember(val)}
                                                    name={val.member_id}
                                                    // disabled={(starterarr.length + tempselect.length) >= 5 || FilterLabelarr.indexOf(val.member_id) !== -1 || (!val.IsInClub)}
                                                    // disabled={(starterarr.length + tempselect.length) >= 5 || FilterLabelarr.indexOf(val.member_id) !== -1 || (!val.IsIdVerfied) || (!val.IsInClub)}
                                                    //TODO修改原上限
                                                    disabled={FilterLabelarr.indexOf(val.member_id) !== -1 || (val.CheckGId && !val.IsIdVerfied) || (val.CheckCb && !val.IsInClub)}
                                                />
                                            </td>
                                            {/* TODO 重補user的遊戲驗證*/}
                                            <td className={classes.userName} style={{ opacity: `${((val.CheckGId && !val.IsIdVerfied) || (val.CheckCb && !val.IsInClub) || FilterLabelarr.indexOf(val.member_id) !== -1) ? '0.5' : '1'}` }}>
                                                {/* <td className={classes.userName} style={{ opacity: `${(!val.IsInClub || FilterLabelarr.indexOf(val.member_id) !== -1) ? '0.5' : '1'}` }}> */}
                                                {/* <img src={getImageUrl(val.profile_picture)} alt="" /> */}
                                                <Thumbnail border={{ gap: 2 }} size="49px" imgUrl={getImageUrl(val.profile_picture)} />
                                                <div className={classes.userInfo}>
                                                    <h5>{val.username}</h5>

                                                    <p className={classes.gameID}>{val.member_id}</p>
                                                </div>
                                            </td>
                                            {/* {intl.formatMessage({ id: 'TournamentJoin_Not Club Member' })} */}
                                            <td className={classes.userStatus}>
                                                {(val.CheckCb && !val.IsInClub) && intl.formatMessage({ id: 'TournamentJoin_Not Club Member' })}<br />
                                                {/* TODO 重補user的遊戲驗證*/}
                                                {(val.CheckGId && !val.IsIdVerfied) && intl.formatMessage({ id: 'TournamentJoin_Not Verified ID' })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className={classes.addBtnWrapper}><Button title={intl.formatMessage({ id: 'TournamentJoin_[btn]Add' })}
                            customClass={classes.addBtn} onClick={() => sendtostarter()} /></div>


                    </div >)
                    : <Loading />}
            </>
        )
    }

    // --------------------------------------------------------AddBenchPlayer----------------------------------------
    const AddBenchPlayer = () => {

        // TODO預設值來自global
        const [tempselect, setTempSelect] = useState([])

        const [digestrenderlist, setDigestRenderList] = useState([])
        //TODO如果先選了bench要剔除正式可以選到
        //TODO 過濾start或bench已經存在select
        // useEffect(() => {
        //     //只取id做filter
        //     const filterarr = starterarr.map(val => val.member_id) + bencharr.map(val => val.member_id)
        //     const arr = visitorteammemberlist.filter(val => filterarr.indexOf(val.member_id) === -1)
        //     setDigestRenderList(arr)

        // }, [starterarr, bencharr])


        //catch to local state
        useEffect(() => {
            setDigestRenderList(visitorteammemberlist)
        }, [visitorteammemberlist])



        const [FilterLabelarr, setFilterLabelarr] = useState([])

        //prepare filter label arr
        useEffect(() => {
            const arr1 = starterarr.map(val => { return val.member_id })
            const arr2 = bencharr.map(val => { return val.member_id })
            const arr3 = [...arr1, ...arr2]

            setFilterLabelarr(arr3)
        }, [starterarr, bencharr])








        //fetch結果改變render
        //TODO從global取出資料產生可以變動的render 資料，之後再回送global



        // setVisitorteammemberlist
        // const handleselectmember = (val) => {
        //     //從map裡直接拉個別的state出來做資料處理

        //     if (tempselect.indexOf(val.gameId) !== -1) {
        //         setTempSelect(tempselect => tempselect.filter(element => element !== val.gameId))
        //         // setIsChecked(false)
        //         // console.log('repeat')
        //     } else {
        //         setTempSelect(tempselect => [...tempselect, val.gameId])
        //         // setIsChecked(true)
        //     }
        //     // setIsChecked(!isChecked)
        // }
        const handleselectmember = (val) => {
            if (tempselect.indexOf(val.member_id) !== -1) {
                return setTempSelect(tempselect => tempselect.filter(element => element !== val.member_id))
            }
            //大於5去除之前第一個選擇
            // TODO 大於上限去除第一
            if (bencharr.length + tempselect.length === needBenchNum) {
                tempselect.shift();
            }
            setTempSelect(tempselect => [...tempselect, val.member_id])

        }


        const sendtobench = () => {
            //拿取現有材料修改starter arr
            const arr = visitorteammemberlist.filter(val => tempselect.indexOf(val.member_id) !== -1)
            setBencharr([...bencharr, ...arr])
            // 清空tempselect
            setTempSelect([])
            //關閉視窗
            closePopWindowFunc()

        }

        //TODO 最終確認的btn 會把renderlist digest 後set 給final arr

        return (
            <>
                {FetchMemberFinish ?
                    (<div className={classes.addStarterBox}>
                        {/* Required */}
                        <p>{intl.formatMessage({ id: 'TournamentJoin_Required' })}</p>
                        <p className={cx('requiredNumber')}>{bencharr.length + tempselect.length} / {needBenchNum}</p>
                        <div>
                            <table className={cx('addUserTable')}>
                                <thead>
                                    <tr>
                                        <th></th>
                                        {/* User Name */}
                                        <th>{intl.formatMessage({ id: 'TournamentJoin_User Name' })}</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {digestrenderlist.map((val, idx) => (
                                        <tr key={idx} >
                                            {/* TODO 重補user的遊戲驗證*/}
                                            <td style={{ opacity: `${((val.CheckGId && !val.IsIdVerfied) || (val.CheckCb && !val.IsInClub) || FilterLabelarr.indexOf(val.member_id) !== -1) ? '0.5' : '1'}` }}>
                                                {/* <td style={{ opacity: `${(!val.IsInClub || FilterLabelarr.indexOf(val.member_id) !== -1) ? '0.5' : '1'}` }}> */}
                                                <Checkbox
                                                    title=''
                                                    checked={tempselect.indexOf(val.member_id) !== -1 || FilterLabelarr.indexOf(val.member_id) !== -1}
                                                    onChange={() => handleselectmember(val)}
                                                    // disabled={(bencharr.length + tempselect.length) >= 5 || FilterLabelarr.indexOf(val.member_id) !== -1 || (!val.IsInClub)}
                                                    disabled={FilterLabelarr.indexOf(val.member_id) !== -1 || (val.CheckGId && !val.IsIdVerfied) || (val.CheckCb && !val.IsInClub)}
                                                />
                                            </td>
                                            {/* TODO 重補user的遊戲驗證*/}
                                            <td className={classes.userName} style={{ opacity: `${((val.CheckGId && !val.IsIdVerfied) || (val.CheckCb && !val.IsInClub) || FilterLabelarr.indexOf(val.member_id) !== -1) ? '0.5' : '1'}` }}>
                                                {/* <td className={classes.userName} style={{ opacity: `${(!val.IsInClub || FilterLabelarr.indexOf(val.member_id) !== -1) ? '0.5' : '1'}` }}> */}
                                                {/* <img src={getImageUrl(val.profile_picture)} alt="" /> */}
                                                <Thumbnail border={{ gap: 2 }} size="49px" imgUrl={getImageUrl(val.profile_picture)} />
                                                <div className={classes.userInfo}>
                                                    <h5>{val.username}</h5>
                                                    <p className={classes.gameID}>{val.member_id}</p>
                                                </div>
                                            </td>
                                            <td className={classes.userStatus}>
                                                {(val.CheckCb && !val.IsInClub) && intl.formatMessage({ id: 'TournamentJoin_Not Club Member' })}<br />
                                                {/* TODO 重補user的遊戲驗證*/}
                                                {(val.CheckGId && !val.IsIdVerfied) && intl.formatMessage({ id: 'TournamentJoin_Not Verified ID' })}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className={classes.addBtnWrapper}><Button title={intl.formatMessage({ id: 'TournamentJoin_[btn]Add' })} customClass={classes.addBtn} onClick={() => sendtobench()} /></div>
                    </div>)
                    : <Loading />}
            </>
        )
    }


    // -----------------------------add bench list 跳窗----------------------------







    const [selectteamname, setSelectTeamName] = useState('')
    //record previous selected team // keep select arr
    const preselectteam = useRef(null)





    //    ----------------------remove starter------------------
    const removeStarter = val => {
        const arr = starterarr.filter(element => element.member_id !== val.member_id)
        setStarterArr(arr)
        // console.log(val.member_id)

    }
    //    ---------------------remove bench----------------
    const removeBench = val => {
        const arr = bencharr.filter(element => element.member_id !== val.member_id)
        setBencharr(arr)
        // console.log(val.member_id)

    }

    //change select team clear all selection
    const clearselect = () => {
        if (preselectteam !== currentselectteam) {
            //starter永遠保留初始
            // setStarterArr([{ username: authData.profile.username, member_id: authData.profile.member_id, profile_picture: authData.profile.profile_picture, IsIdVerfied: true, IsInClub: true }])
            setStarterArr([])
            setBencharr([])
        }
    }




    // -------------------------------追加starter--Btn JSX----------------------

    //TODO需要區分兩種arr
    const starterMoreBtn = (<>
        <div className={cx('addStarterCard', 'addNewUser')}>
            <div className={cx('gap')}>
                <div className={classes.column} onClick={() => {
                    //TODO確認fetch完成後才跳窗，補loading?
                    if (!FetchMemberFinish) return
                    const { openPopWindowFunc } = popWindowData;
                    const popWindowAttributes = {
                        component: AddStarter,
                        componentProps: {
                            title: 'Add Starter',
                        },
                        closeByButtonOnly: true,
                        isFullModeForMobile: false,
                    };
                    openPopWindowFunc(popWindowAttributes);
                }}>
                    <div className={classes.userInfo}>
                        {FetchMemberFinish ? <img src={require('../../../imgs/ico_add.svg')} alt="" /> : <Loading theme='dark' />}
                    </div>

                </div>
            </div>
        </div>
    </>)

    // -------------------------------追加bench  Btn   JSX---------------------------------------
    const benchMoreBtn = (<>
        <div className={cx('addStarterCard', 'addNewUser')}>
            <div className={cx('gap')}>
                <div className={classes.column} onClick={() => {
                    if (!FetchMemberFinish) return
                    const { openPopWindowFunc } = popWindowData;
                    const popWindowAttributes = {
                        component: AddBenchPlayer,
                        componentProps: {
                            title: 'Add Bench Player',
                        },
                        closeByButtonOnly: true,
                        isFullModeForMobile: false,
                    };
                    openPopWindowFunc(popWindowAttributes);
                }}>
                    <div className={classes.userInfo}>
                        {FetchMemberFinish ? <img src={require('../../../imgs/ico_add.svg')} alt="" /> : <Loading theme='dark' />}
                    </div>
                </div>
            </div>
        </div>

    </>)



    // ----------------------------------------------footer btns func-----------------------


    const { fetchfinish } = useSendTeamReg({ readytosend, apiWithTokenWrapper, finalregdata, setReadyToSend })


    useEffect(() => {
        // if (fetchfinish) {
        //     setReadyToSend(false)
        // }


    }, [fetchfinish])




    const handlenextbtn = () => {
        if (regitsterfinish) return
        setReadyToSend(true)
        // requireddatatitles, needjoincode
        // p1_TeamApplyPolicy p2_NoJoinTeam p3_SelectTeam p4_TeamJoinCodeAndRequireData p5_TeamConfirmation

        // console.log('data', needjoincode, requireddatatitles)
        if (needjoincode || requireddatatitles.length !== 0) {
            setCurrentPage(4)
        } else {
            setCurrentPage(5)
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
        <div className={classes.formWrapper}>
            <div className={cx('infoTitle')}>
                {/* Select Your Team */}
                {intl.formatMessage({ id: 'TournamentJoin_Select Your Team' })}
            </div>
            <div className={cx('infoInner')}>
                <div className={cx('selectWrapper')}>
                    <Dropdown_V3
                        options={visitorhasteams}
                        defaultOption={visitorhasteams[0]}
                        iconStyle={{ marginRight: '20px' }}
                        //return select obj
                        onChange={e => {
                            setCurrentSelectTeam(e.url_key)
                            setCurrentSelectTeamId(e.team_id)
                            setCurrentTeamLogo(e.logo_image)
                            setCurrentSelectTeamName(e.name)
                            preselectteam.current = e.name
                            return clearselect()
                        }}
                    />
                </div>
                {/* TODO 改變 */}
                {/* <Dropdown
                    items={visitorhasteams}
                    name="dropdown"
                    id="dropdown"
                    value={selectteamname}
                    defaultOption={visitorhasteams[0]}
                    //有default 設定時會在自定義arr前加入一個obj
                    // isItemsDefault={true}
                    onChange={(e) => {
                        // if (e.target.selectedIndex - 1 < 0) {
                        //     return setCurrentSelectTeam(visitorhasteams[0].name)
                        // }
                        // console.log(visitorhasteams[e.target.selectedIndex - 1].name);
                        // --------------------------------working area------------------
                        //////////////////////////////
                        //get fetch memeber list key
                        setCurrentSelectTeam(visitorhasteams[e.target.selectedIndex].url_key)
                        //get select teamid
                        setCurrentSelectTeamId(visitorhasteams[e.target.selectedIndex].team_id)
                        //change show value
                        setSelectTeamName(visitorhasteams[e.target.selectedIndex].name)
                        //change show logo
                        setCurrentTeamLogo(visitorhasteams[e.target.selectedIndex].logo_image)
                        //改變global value
                        setCurrentSelectTeamName(visitorhasteams[e.target.selectedIndex].name)
                        //存入做為上一次選擇紀錄
                        preselectteam.current = visitorhasteams[e.target.selectedIndex].name
                        // setValue(e.target.selectedIndex - 1)
                        return clearselect()
                        //////////////
                    }}
                    customClass={cx('currentteamselect')}
                /> */}
                {/* <img src={getImageUrl(currentTeamLogo)} alt="" className={cx('userImg')} /> */}
            </div>
            <div className={cx('infoTitle')}>
                {/* Select Participants */}
                {intl.formatMessage({ id: 'TournamentJoin_Select Participants' })}
            </div>
            <div className={cx('infoInner', 'cardBottom')}>
                <div className={cx('col')}>
                    <p className={cx('content')}>{intl.formatMessage({ id: 'TournamentJoin_SelectDes' })}</p>
                </div>
                <div className={cx('col')}>
                    {/* Add Starter */}
                    <h4>{intl.formatMessage({ id: 'TournamentJoin_Add Starter' })}</h4>
                    {/* //starter人數 */}
                    <p className={cx('status')}>{starterarr.length} / {needStarterNum}</p>
                    <div className={cx('addStarterGroup')}>

                        {/* ------------add Starter--------------- */}
                        {starterarr.map((val, idx) => (
                            // Class Status: .addNewUser and .disableCard
                            <div className={cx('addStarterCard')} key={idx}>
                                <div className={cx('gap')}>
                                    <div className={classes.column}>
                                        {/* //avatar */}
                                        <div className={cx('avatarWrapper')} >
                                            <Thumbnail border={{ gap: 2 }} size="46px" imgUrl={getImageUrl(val.profile_picture)} />
                                        </div>
                                        {/* <img src={getImageUrl(val.profile_picture)} alt="" /> */}
                                        <div className={classes.userInfo}>
                                            <h5>{val.username}</h5>
                                            <p>{val.member_id}</p>
                                            <img src={require('../../../imgs/ico_add.svg')} alt="" />
                                        </div>
                                        {/* 090720解除報名者即為正式 */}
                                        {/* {
                                            (val.member_id !== authData.profile.member_id) && (<> <div className={classes.tools}  >
                                                <img dataui={val.member_id} src={require('../../../imgs/ico_trash.svg')} alt="" onClick={() => removeStarter(val)} />
                                            </div></>)
                                        } */}
                                        <div className={classes.tools}  >
                                            <img dataui={val.member_id} src={require('../../../imgs/ico_trash.svg')} alt="" onClick={() => removeStarter(val)} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                        {/* ---------------追加 btn------------------ */}
                        {/* 原上限5 */}
                        {starterarr.length === needStarterNum || starterMoreBtn}

                        {/* -------------------------------------         */}

                    </div>
                </div>

                <div className={cx('col')}>
                    {needBenchNum !== 0 &&
                        (<><h4>{intl.formatMessage({ id: 'TournamentJoin_Add Bench Player' })}</h4>
                            <p className={cx('status')}>{bencharr.length} / {needBenchNum}</p>
                            <div className={cx('addStarterGroup', 'addNewGroup')}>
                                {bencharr.map((val, idx) => (
                                    <div className={cx('addStarterCard')} key={idx}>
                                        <div className={cx('gap')}>
                                            <div className={classes.column}>
                                                {/* avatar */}
                                                {/* <img src={getImageUrl(val.profile_picture)} alt="" /> */}
                                                <div className={cx('avatarWrapper')} >
                                                    <Thumbnail border={{ gap: 2 }} size="46px" imgUrl={getImageUrl(val.profile_picture)} />
                                                </div>
                                                <div className={classes.userInfo}>
                                                    <h5>{val.username}</h5>
                                                    <p>{val.member_id}</p>
                                                    <img src={require('../../../imgs/ico_add.svg')} alt="" />
                                                </div>
                                                {/* <div className={classes.tools} style={{ display: 'none' }}> */}
                                                <div className={classes.tools} >
                                                    <img src={require('../../../imgs/ico_trash.svg')} alt="" onClick={() => removeBench(val)} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                {/* ---------------追加  btn------------------ */}
                                {bencharr.length === needBenchNum || benchMoreBtn}
                                {/* -------------------------------------         */}
                            </div></>)}
                    <div className={cx('threebtnArea')}>
                        <ul>
                            <li>
                                <Button title={intl.formatMessage({ id: 'TournamentJoin_[btn]Discard' })} theme="dark_2" onClick={() => { hadeleDiscardBtn() }} />
                            </li>
                            <li>
                                <Button title={intl.formatMessage({ id: 'TournamentJoin_[btn]Do it later' })}
                                    theme="dark_2" customClass={classes.secondBtn} onClick={() => { teamhandleDIL({ popWindowData, gameRegEtime, intl, history, location, configData, gameserial, setProcessDIL }) }} />
                                {/* TODO根據條件判斷4 5 */}
                                <Button title={intl.formatMessage({ id: 'TournamentJoin_[btn]Next' })}
                                    //原上限5  //原始bench限制|| (bencharr.length < needBenchNum)
                                    theme="dark_2" disabled={starterarr.length !== needStarterNum} customClass={classes.secondBtn} onClick={() => { handlenextbtn() }} />
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}




export default SelectTeam
