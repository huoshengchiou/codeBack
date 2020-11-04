import React, { useState, useContext, useEffect } from 'react'



//styled
import Textfield from "components/DesignSystem/Input/TextField";
import Button from "components/DesignSystem/Input/Button";

//global state
import { Teamgameprovider } from '../../TJ_team_state_store'


//reg hook
import { useSendTeamReg } from '../../useTJteamfetch'

//api
import { useKillReg } from '../../useTJteamfetch'


//jump window
import { teamhandleDIL, teamhandleDd } from '../../TJ_team_handlebtn'


//CSS
import classes from '../../../style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const TeamJoinCodeAndRequireData = () => {

    const { setProcessDIL, history, location, intl, dialogData, popWindowData, configData, authData, gameserial, regid, gameRegEtime, setCurrentPage, joincode, setjoincode, starterarr, bencharr, setRequriedData, readytosend, finalregdata, setReadyToSend, regitsterfinish, requireddatatitles, needjoincode } = useContext(Teamgameprovider)
    //get avatar URL func
    const { getImageUrl } = configData;
    // auth for api
    const { apiWithTokenWrapper } = authData
    const { closeDialogFunc } = dialogData;


    //local render list
    const [requireMbAnslist, setRequireMbAnsList] = useState([])

    useEffect(() => {
        //catch matrials from global //structure requried list 
        if (requireddatatitles.length === 0) return
        const totalQ = requireddatatitles
        const combinearr = [...starterarr, ...bencharr]
        const mixarr = combinearr.map(val => {
            const totalQ2 = totalQ.map(val => {
                return { requiredQ: val, answer: '' }
            })
            return { memberinfo: val, requiredQlist: totalQ2 }
        })
        setRequireMbAnsList(mixarr)
    }, [starterarr, bencharr, requireddatatitles])


    //update to global state
    useEffect(() => {
        setRequriedData([...requireMbAnslist])
    }, [requireMbAnslist])



    //TODO e.target.value //等使用者按下next鍵才存入global state? 


    const handleresponse = ({ member_id, title, value }) => {
        //event obj 無法整包直接傳
        setRequireMbAnsList(requireMbAnslist => requireMbAnslist.map(val => val.memberinfo.member_id === member_id ? { ...val, requiredQlist: val.requiredQlist.map(element => element.requiredQ === title ? { ...element, answer: value } : element) } : val))
        // const deepcopy = JSON.parse(JSON.stringify(responseobj))
        // const { deepobj, idx2, value } = deepcopy
        // deepobj.response[idx2].answer = value
        // setReqirueRenderList([...deepobj])
        // setReqirueRenderList(prestate => [...prestate,])
    }


    //  -------------------------新資料結構測試------------------------

    const titles2 = ['habbit', 'love', 'girl']

    const user2 = [{ name: 'jack' }, { name: 'mary' }, { name: 'jill' }]

    // ['habbit', 'love', 'girl'] to {habbit: "", love: "", girl: ""}
    function convertArrToObj(arr) {
        let useobj = {}
        arr.map(val => {
            useobj = { ...useobj, [val]: "" }
        })
        return useobj
    }
    const newarr2 = convertArrToObj(titles2)

    // console.log(newarr2)
    function combineAskArr(majorarr, askobj) {
        let arr = majorarr.map(val => {
            val = { ...val, ...askobj }
            return val
        })
        return arr
    }

    // for(let i=0;i<newarr3.length;i++)    {
    //     Object.keys(newarr3[i]).map((key)=>{
    //         console.log(newarr3[i][key])
    //     })
    // }


    // const handleInputChange = (obj) => {
    //     //extract event obj
    //     const { key, value } = obj
    //     let arr2 = requrieddata.map(val => Object.keys(val)[0] === key ? { ...val, [key]: value } : val)
    //     setRequriedData(arr2)
    // }

    // Object.keys(rendertest2[i])


    // ------------------------------------------------------------------footer btn func------------------------------------------



    const { fetchfinish } = useSendTeamReg({ readytosend, apiWithTokenWrapper, finalregdata, setReadyToSend })

    // p1_TeamApplyPolicy p2_NoJoinTeam p3_SelectTeam p4_TeamJoinCodeAndRequireData p5_TeamConfirmation

    useEffect(() => {
        // if (fetchfinish) {
        //     setReadyToSend(false)

        // }

    }, [fetchfinish])


    const handlenextbtn = () => {
        if (regitsterfinish) return
        setReadyToSend(true)
        setCurrentPage(5)

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
            <div className={classes.formWrapper}>
                {/* ----------------------------------join code------------需要才顯示------------------ */}
                {needjoincode ? (<>
                    <div className={cx('infoTitle')}>
                        {/* Required Data */}
                        {intl.formatMessage({ id: 'TournamentJoin_Required Data' })}
                    </div>
                    <div className={cx('infoInner', 'joinInput')}>
                        <Textfield title={intl.formatMessage({ id: 'TournamentJoin_Join Code' })} customId='testF' value={joincode} onChange={(e) => { setjoincode(e.target.value) }} />
                    </div></>)
                    : null}


                {/* ----------------------------------------------------require Data------------需要才顯示-------------------------- */}
                {requireddatatitles.length === 0 ? null :
                    <>
                        <div className={cx('infoTitle')}>
                            {/* Required Data */}
                            {intl.formatMessage({ id: 'TournamentJoin_Required Data' })}
                        </div>

                        <div className={cx('infoInner', 'joinInput')}>

                            {/* --------------隊伍reqiure最外層--------- */}
                            <ul className={cx('requireUserList')}>
                                {/* ---------------------------------------sample-------boilerplate ------------原版型-by people--------------------------- */}
                                {/* ---------隊員個人回答單元---------- */}
                                {/* <li className={cx('requireUserListUnit')}> */}
                                {/* -----------------隊員資訊-------------- */}
                                {/* <div className={cx('requireUserInfo')}>
                                <div className={cx('requireUserAvatar')}>
                                    <img alt="" src="" alt="" />
                                </div>
                                <div className={cx('requireUserDes')}>
                                    <div className={cx('Username')}>%UserName%</div>
                                    <div className={cx('UserID')}>%UserName%</div>
                                </div>
                            </div> */}
                                {/* ------------隊員個人問題集------------------ */}
                                {/* <ul className={cx('requireUserAnsList')}> */}
                                {/* ---------------個別問題單元------------------ */}
                                {/* <li className={cx('requireUserAnsUnit')}>
                                    <div className={cx('UserAnsTitle')}>
                                        %Required DataA%
                                    </div>
                                    <div className={cx('UserAnsInput')}>
                                        <Textfield customClass={cx('UserAnsText')} />
                                    </div>
                                </li>

                            </ul>
                        </li> */}

                                {/* ------------------------------current use-----------------兩層render結構--------  */}

                                {requireMbAnslist.map((val, idx) => (
                                    <li className={cx('requireUserListUnit')} key={idx + 'mb'} >
                                        {/* -----------------隊員資訊-------------- */}
                                        <div className={cx('requireUserInfo')}>
                                            <div className={cx('requireUserAvatar')}>
                                                <img alt="" src={getImageUrl(val.memberinfo.profile_picture)} alt="" />
                                            </div>

                                            <div className={cx('requireUserDes')}>
                                                <div className={cx('Username')}>{val.memberinfo.username}</div>
                                                <div className={cx('UserID')}>{val.memberinfo.member_id}</div>
                                            </div>
                                        </div>
                                        {/* ------------隊員個人問題集------------------ */}
                                        <ul className={cx('requireUserAnsList')}>
                                            {/* ---------------個別問題單元------------------ */}
                                            {val.requiredQlist.map((element, index) => (
                                                <li className={cx('requireUserAnsUnit')} key={index + 'Qlist'}>
                                                    <Textfield customClass={cx('UserAnsText')} title={element.requiredQ} id={val.memberinfo.member_id + element.requiredQ} value={element.answer} onChange={(e) => handleresponse({ title: element.requiredQ, member_id: val.memberinfo.member_id, value: e.target.value })} />
                                                </li>
                                            ))}


                                        </ul>
                                    </li>)
                                )}
                                {/* ------------------------------current use-------------------------  */}



                            </ul>
                            {/* ------------------------------old----format------start------by question---- */}
                            {/* 
                    {reqiruerenderlist.map((val, idx1) => (
                        <table className={cx('requireUserTable')} key={idx1}>
                            <thead>
                                <tr>
                                    <th>User Name</th>
                                    <th>{val.title}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {val.response.map((element, idx2) => (
                                    <tr key={idx2}>
                                        <td className={classes.userName}>
                                            <img alt="" src={require('../../../imgs/img_user.png')} alt="" />
                                            <div className={classes.userInfo}>
                                                <h5>{element.name}</h5>
                                                <p className={classes.gameID}>{element.gameId}</p>
                                            </div>
                                        </td>
                                        <td className={cx('requiredInput')}  >
                                            <Textfield theme="dark" value={element.answer} onChange={e => handleresponse({ value: e.target.value, deepobj: val, title: val.title, idx1, answer: element.answer, idx2 })} />
                                        </td>
                                    </tr>
                                ))}


                            </tbody>
                        </table>
                    ))} */}
                            {/* ------------------------------old----format--------end------by question-- */}

                        </div>
                    </>}



                {/* ----------------------------------------------Btns---------------------------------------------------- */}


                <div className={cx('fourbtnArea')}>
                    <ul>
                        <li>
                            <Button title={intl.formatMessage({ id: 'TournamentJoin_[btn]Back' })}
                                theme="dark_2" onClick={() => { setCurrentPage(3) }} />
                            <Button title={intl.formatMessage({ id: 'TournamentJoin_[btn]Discard' })}
                                theme="dark_2" customClass={classes.Btn} onClick={() => { hadeleDiscardBtn() }} />
                        </li>
                        <li>
                            <Button title={intl.formatMessage({ id: 'TournamentJoin_[btn]Do it later' })}
                                theme="dark_2" onClick={() => { teamhandleDIL({ popWindowData, gameRegEtime, intl, history, location, configData, gameserial, setProcessDIL }) }} />
                            <Button title={intl.formatMessage({ id: 'TournamentJoin_[btn]Next' })}
                                theme="dark_2" customClass={classes.Btn} disabled={(needjoincode && joincode === '')} onClick={() => { handlenextbtn() }} />
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default TeamJoinCodeAndRequireData