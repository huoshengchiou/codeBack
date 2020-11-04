import React, { useState, useRef, useEffect, useContext } from 'react';
import { from } from "rxjs";
//for map
import Loading from 'components/utils/Loading';

//api
import { postFindRequiredData, postExportRequiredData } from 'apis/tournament';


// Design System
import Button from "components/DesignSystem/Input/Button";
import Card, { CardHeader, CardBody } from 'components/DesignSystem/DataDisplay/Card'
import Thumbnail from "components/DesignSystem/DataDisplay/Thumbnail"
// Style
import classNames from "classnames/bind";
import classes from './styles.module.scss';

import { EditManageContext } from '../../Context';


const cx = classNames.bind(classes);

const RequiredData = () => {

    const {
        t8tDetail,
        intl,
        configData,
        authData,
        match
    } = useContext(EditManageContext);

    //fetch material
    const { apiWithTokenWrapper } = authData
    const { t8t_serial } = match.params

    //current game format
    const { tournament_format } = t8tDetail

    //拿照片URL
    const { getImageUrl } = configData;

    const [IsFetchFin, setIsFetchFin] = useState(false)
    //display List data
    const [renderList, setRenderList] = useState([])
    const fetchListener = useRef(null)
    const secondFetchListener = useRef(null)
    const noReqDataFlag = useRef(!t8tDetail.request_titles.length)
    //api description

    //fetch Qlist
    const fetchRequireList = (data) => {
        setIsFetchFin(false);
        fetchListener.current = from(
            apiWithTokenWrapper(postFindRequiredData, data)
        ).subscribe(response => {
            if (response.status === 200) {
                if (response.data.header.status === 'OK') {
                    const { t8t_required_datas } = response.data.body
                    t8t_required_datas.forEach(val => {
                        val.requirdData = JSON.parse(val.requirdData)
                    })
                    //filter requirdData null
                    const arr = t8t_required_datas.filter(val => val.requirdData !== null)
                    setRenderList(arr)
                    setIsFetchFin(true);
                }
            }
        })
    }


    useEffect(() => {
        const data = {
            t8t_serial: t8t_serial
        }
        noReqDataFlag.current || fetchRequireList(data)
        return () => {
            //取消fetch監聽
            if (fetchListener.current) fetchListener.current.unsubscribe();
            if (secondFetchListener.current) secondFetchListener.current.unsubscribe();
        };
    }, [])



    const handleExport = () => {
        const downloadCSV = (dataStream) => {
            const element = document.createElement("a");
            const file = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), dataStream], { type: "text/csv; charset=UTF-8", encoding: "UTF-8" });
            // const file = new Blob([dataStream], { type: "text/csv" });
            element.href = window.URL.createObjectURL(file);
            element.download = `Required Data.csv`;
            document.body.appendChild(element);
            element.click();
        }

        const data = {
            t8t_serial: t8t_serial
        }
        secondFetchListener.current = from(
            apiWithTokenWrapper(postExportRequiredData, data)
        ).subscribe(response => {
            if (response.status === 200 && response.data.header.status === "OK") {
                // console.log(response.data.body);
                downloadCSV(response.data.body);
            }
        })
    }

    return <div className={cx('requireContainer')}>
        <Card size="col-9">
            <CardHeader>
                {intl.formatMessage({ id: "TournamentJoin_Required Data" })}
            </CardHeader>
            <CardBody padding="16px" customClass={cx('requireCardBody')}>
                {noReqDataFlag.current || (IsFetchFin ? (<>
                    {/* -----------v---Export-----v---------- */}
                    <div className={cx('toolTop')}>
                        <Button title={intl.formatMessage({ id: "Tournament-Management-Bracket-Settings-Publish-Settings_[btn]Export" })} theme="dark_2" size="sm_1" onClick={handleExport} />
                    </div>
                    {/* -----------^---Export-----^---------- */}
                    <div className={cx('regContent')} style={{ display: renderList.length === 0 && 'none' }}>
                        <div>
                            {renderList.map((val, idx) => {
                                const { avatar, requirdData } = val
                                return (
                                    <>
                                        {tournament_format !== '1v1' && (
                                            <>
                                                {/* ------------v--Team Banner---v-------- */}
                                                <div className={cx('reg')} >
                                                    <p>{intl.formatMessage({ id: "Required Data_REG#" })} <span>{idx + 1}</span></p>
                                                    <div className={cx('userBlock')}>
                                                        <Thumbnail
                                                            imgUrl={getImageUrl(avatar.logo_image)}
                                                            border={{ double: true, gap: 4 }}
                                                            size="78px"
                                                        />
                                                        <span>{avatar.name}</span>
                                                    </div>
                                                </div>
                                                {/* ------------^--Team Banner---^-------- */}
                                            </>
                                        )}
                                    </>
                                )
                            })}
                            <table className={cx('regTable')}>
                                <thead>
                                    <tr>
                                        {tournament_format === '1v1' && (<th className={cx('col1')}>{intl.formatMessage({ id: "Required Data_REG#" })} </th>)}
                                        <th className={cx('col2')}>{intl.formatMessage({ id: "Required Data_User Name" })}</th>
                                        <th className={cx('col3')}>{intl.formatMessage({ id: "Required Data_Category" })}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {renderList.map((val, idx) => {
                                        const { avatar, requirdData } = val
                                        return (
                                            <>
                                                {/* ----------v-----solo-------v-------- */}
                                                {tournament_format === '1v1' && (<>
                                                    <tr>
                                                        {/* //---v---User avatar Unit--v--- */}
                                                        {tournament_format === '1v1' && (<td className={cx('col1')} >
                                                            {idx + 1}
                                                        </td>)}
                                                        <td className={cx('col2')} >
                                                            <div className={cx('tdUserBlock')}>
                                                                <Thumbnail
                                                                    imgUrl={getImageUrl(avatar.logo_image)}
                                                                    border={{ gap: 3 }}
                                                                    size="48px"
                                                                />
                                                                <span>{avatar.name}</span>
                                                            </div>
                                                        </td>
                                                        {/* //---^---User avatar Unit--^--- */}
                                                        <td className={cx('col3')}>
                                                            {requirdData.map((val2, idx2) => {
                                                                const key = Object.keys(val2)[0]
                                                                return (<>
                                                                    <div className={cx('tdData')} key={`${idx}${idx2}`}>
                                                                        <div className={cx('qTitle')}>{key}</div>
                                                                        <div className={cx('qAns')}>{val2[key]}</div>
                                                                    </div>

                                                                </>)
                                                            })}
                                                        </td>
                                                    </tr>

                                                </>)}
                                                {/* ----------^-----solo-------^-------- */}

                                                {/* ----------v-----Team-------v-------- */}

                                                {tournament_format !== '1v1' && requirdData.map((val2, idx2) => {
                                                    const { memberinfo, requiredQlist } = val2
                                                    return (<>
                                                        <tr key={`${idx}${idx2}`}>
                                                            {/* //---v---User avatar Unit--v--- */}
                                                            {tournament_format === '1v1' && (<td className={cx('col1')} >
                                                                {idx2 + 1}
                                                            </td>)}
                                                            <td className={cx('col2')} >
                                                                <div className={cx('tdUserBlock')}>
                                                                    <Thumbnail
                                                                        imgUrl={getImageUrl((tournament_format === '1v1') ? avatar.logo_image : memberinfo.profile_picture)}
                                                                        border={{ gap: 3 }}
                                                                        size="48px"
                                                                    />
                                                                    <span>{(tournament_format === '1v1') ? avatar.name : memberinfo.username}</span>
                                                                </div>
                                                            </td>
                                                            {/* //---^---User avatar Unit--^--- */}


                                                            <td className={cx('col3')}>
                                                                {requiredQlist.map((val3, idx3) => {
                                                                    const { answer, requiredQ } = val3
                                                                    return (<>
                                                                        <div className={cx('tdData')} key={`${idx}${idx2}${idx3}`}>
                                                                            <div className={cx('qTitle')}>{requiredQ}</div>
                                                                            <div className={cx('qAns')}>{answer}</div>
                                                                        </div>

                                                                    </>)
                                                                })}


                                                            </td>

                                                        </tr>
                                                    </>)
                                                })}
                                                {/* ----------^-----Team-------^-------- */}
                                            </>
                                        )
                                        
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>) : <Loading theme='dark' />)}
            </CardBody>
        </Card>
    </div>

};

export default RequiredData;