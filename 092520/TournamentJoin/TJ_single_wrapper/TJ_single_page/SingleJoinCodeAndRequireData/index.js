import React, { useContext, useState, useEffect } from 'react'

//styled component
import Textfield from "components/DesignSystem/Input/TextField";
import Button from "components/DesignSystem/Input/Button";
//state store
import { Singlegameprovider } from '../../TJ_single_state_store'


//handle all btns
import { singlehandleDIL, singlehandleRg, teamhandleDd } from '../../TJ_single_handlebtn2'

//fetch hook
import { useSendSingleReg, useKillReg } from '../../useTJsinglefetch'

//CSS
import classes from '../../../style.module.scss';
import classNames from 'classnames/bind';
import { keys } from 'xstate/lib/utils';
const cx = classNames.bind(classes);

const SingleJoinCodeAndRequireData = () => {
    //btn funtion分寫
    const { setProcessDIL, IsDILFin, history, location, configData, intl, gameRegEtime, dialogData, popWindowData, authData, gameserial, regid, setCurrentPage, joincode, setJoinCode, requrieddata, setRequriedData, needjoincode, readytosend, setReadyToSend, finalregdata, regitsterfinish } = useContext(Singlegameprovider)
    const { closeDialogFunc } = dialogData;

    // console.log('requrieddata', requrieddata)
    // console.log('required_data_titles', required_data_titles)
    // TODO利用目前的state記錄使用者輸入，最後更動global
    // request_titles

    //    目前狀態連動global

    // const data = ['habbit', 'love', 'girl']


    // const finaldata = data.map((val, idx) => {
    //     //用title做keys
    //     const obj = { [val]: "" }
    //     return obj
    // })

    // console.log('finaldata', finaldata)


    // const [inputFields, setinputFields] = useState(finaldata)


    //個人輸入管理
    const handleInputChange = (obj) => {
        //extract event obj
        const { key, value } = obj
        let arr2 = requrieddata.map(val => Object.keys(val)[0] === key ? { ...val, [key]: value } : val)
        setRequriedData(arr2)
    }

    const { apiWithTokenWrapper } = authData
    //temp reg fetch
    //TODO狀態碼判斷從reg還是temp
    const { fetchfinish } = useSendSingleReg({ readytosend, apiWithTokenWrapper, finalregdata, setReadyToSend })
    // 本頁可以送joincode requrieddata


    useEffect(() => {
        if (fetchfinish) {
            setCurrentPage(3)
        }

    }, [fetchfinish])

    const handlenextbtn = async () => {
        //當註冊按完擋住next功能
        if (regitsterfinish) return
        // TODO 未來會有回頁問題要處理
        setReadyToSend(true)


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

        // setProcessRegKill(true)

    }

    return (
        <>
            <div className={classes.formWrapper}>
                {/* 沒有需要joincode時關閉 */}
                {/* ----------------joincode-----inputs---------- */}
                {needjoincode && <><div className={cx('infoTitle')}>
                    {/* Join Code */}
                    {intl.formatMessage({ id: 'TournamentJoin_Ticket' })}
                </div>
                    <div className={cx('infoInner', 'joinInput')}>
                        <Textfield value={joincode} onChange={(e) => { setJoinCode(e.target.value) }} />
                    </div></>}
                {/* ----------------joincode-----inputs---------- */}
                {requrieddata.length === 0 || <>
                    <div className={cx('infoTitle')}>
                        {/* Required Data */}
                        {intl.formatMessage({ id: 'TournamentJoin_Required Data' })}
                    </div>
                    <div className={cx('infoInner', 'joinInput')}>
                        {/* ----------------使用者輸入單元------------------ */}
                        {requrieddata.map((val, idx) => (
                            <Textfield key={idx} customClass={cx('singleRequireInput')} name={Object.keys(val)} title={Object.keys(val)} value={val[Object.keys(val)]} onChange={(e) => { handleInputChange({ key: Object.keys(val)[0], value: e.target.value }) }} />)
                        )}
                    </div>
                </>}
                {/* -------------btn---------- */}
                <div className={cx('threebtnArea')}>
                    <ul>
                        <li>
                            <Button title={intl.formatMessage({ id: 'TournamentJoin_[btn]Discard' })} theme="dark_2" onClick={() => { hadeleDiscardBtn() }} />
                        </li>
                        <li>
                            <Button title={intl.formatMessage({ id: 'TournamentJoin_[btn]Do it later' })}
                                theme="dark_2" customClass={classes.secondBtn} onClick={() => { singlehandleDIL({ popWindowData, gameRegEtime, intl, history, location, configData, gameserial, setProcessDIL }) }} />
                            <Button title={intl.formatMessage({ id: 'TournamentJoin_[btn]Next' })}
                                theme="dark_2" disabled={(needjoincode && joincode === '')} customClass={classes.secondBtn} onClick={() => { handlenextbtn() }} />
                        </li>
                    </ul>
                </div>

            </div>
        </>
    )
}


export default SingleJoinCodeAndRequireData