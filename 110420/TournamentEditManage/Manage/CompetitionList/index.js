import React, { useState, useEffect, useRef, useContext } from 'react';
import { withConfigConsumer } from 'contexts/Config';
import { withAuthConsumer } from 'contexts/Auth';
import { withRouter } from 'react-router-dom';
import { withDialogConsumer } from 'components/layouts/Dialog/Context';
import DialogBlock from 'components/blocks/DialogBlock';
import { injectIntl } from 'react-intl';

// API
import { getT8t, postGetRegistrationListAPI, removeParticipant, postExportCompetitionListAPI } from 'apis/tournament';

import classNames from 'classnames/bind';

import SinglePlayerList from './SinglePlayerList/';
// import TeamList from './TeamList/';

import Button from 'components/DesignSystem/Input/Button';
import Autocomplete from 'components/DesignSystem/Input/AutoComplete_V2';
// import Tooltip from 'components/DesignSystem/DataDisplay/Tooltip';
import Loading from 'components/DesignSystem/Base/Loading';
import Card, { CardHeader, CardBody } from 'components/DesignSystem/DataDisplay/Card';

import classes from './styles.module.scss';
import { from } from 'rxjs';

import { EditManageContext } from '../../Context';

const cx = classNames.bind(classes);

const CompetitionList = props => {
    const { match } = props;
    const { t8tDetail, intl, authData, dialogData, getT8tDetail } = useContext(EditManageContext);
    const { apiWithTokenWrapper } = authData;
    const { openDialogFunc, closeDialogFunc } = dialogData;
    const { tournament_format, participants_count, t8t_lite } = t8tDetail;
    const { t8t_serial } = t8t_lite;

    const [t8t_teams, setT8t_teams] = useState([]); // TVT 資料
    const [t8t_Players, setT8t_Players] = useState([]); // 1V1 資料

    const [isReady, setIsReady] = useState(false);
    const [reloadToggle, setReloadToggle] = useState(false);
    const [isT8tCheckin, setIsT8tCheckin] = useState(null);
    const fetchGetT8tListener = useRef(); // API getT8t
    const fetchListener = useRef(); // API t8t048

    useEffect(() => {
        fetchT8TDetailCallBack();
    }, []);

    // API getT8t t8t012
    const fetchT8TDetailCallBack = () => {
        let t8tSerial = { t8t_serial: match.params.t8t_serial }; // 抓去網址參數 :t8t_serial
        fetchGetT8tListener.current = from(apiWithTokenWrapper(getT8t, t8tSerial)).subscribe(response => {
            if (response.status === 200) {
                const { header, body } = response.data;
                // normal status
                if (header.status.toUpperCase() === 'OK') {
                    setIsT8tCheckin(body.t8t.is_t8t_checkin);
                } else {
                    console.log('t8t012 error');
                }
            }
        });
    };

    useEffect(() => {
        const data = {
            bodyData: {
                search_pending: false,
                search_string: ''
            },
            pathParam: {
                _limit: -1,
                _pageno: 1
            },
            t8t_serial: t8t_serial
        };
        sendData(data);
        return () => {
            if (fetchListener.current) {
                fetchListener.current.unsubscribe();
            }
        };
        // DO NOT REMOVE NEXT LINE !!
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.t8t, reloadToggle]);

    // API t8t048
    const sendData = data => {
        setIsReady(false);
        fetchListener.current = from(apiWithTokenWrapper(postGetRegistrationListAPI, data)).subscribe(response => {
            if (response.status === 200) {
                if (response.data.header.status === 'OK') {
                    //Admin未進行正取名單seed產生時，兩者皆empty []
                    filterPlayersData(response.data.body.t8t_players); // 1V1 filter
                    filterTeamsData(response.data.body.t8t_teams); // Team VS Team filter
                    setIsReady(true);
                } else {
                    setIsReady(true);
                }
            }
        });
    };

    // 1V1 filter
    const filterPlayersData = playerData => {
        let playerArray = [];
        playerData.map((data, index) => {
            if (data.is_seed_admission) {
                playerArray.push(data);
            }
        });
        setT8t_Players(playerArray);
    };

    // Team VS Team filter
    const filterTeamsData = TeamData => {
        let TeamArray = [];
        TeamData.map((data, index) => {
            if (data.is_seed_admission) {
                TeamArray.push(data);
            }
        });
        setT8t_teams(TeamArray);
    };

    const deleteObjectHandler = inputId => {
        deleteDialog(inputId);
    };

    const deleteDialog = inputId => {
        openDialogFunc({
            component: DialogBlock,
            componentProps: {
                type: 'warning',
                title: `${intl.formatMessage({
                    id: 'Manage-Tournament-Page_Delete This Participant'
                })} ?`,
                message: intl.formatMessage({
                    id: 'Manage-Tournament-Page_[content]Delete This Participant'
                }),
                buttons: [
                    <Button
                        key="confirm"
                        title={intl.formatMessage({
                            id: 'common_confirm'
                        })}
                        onClick={() => {
                            closeDialogFunc();
                            proceedDelete(inputId);
                        }}
                    />,
                    <Button
                        key="cancel"
                        title={intl.formatMessage({
                            id: 'common_cancel'
                        })}
                        theme="light_2"
                        onClick={() => {
                            closeDialogFunc();
                        }}
                    />
                ]
            },
            closeByButtonOnly: true
        });
    };

    const proceedDelete = inputId => {
        const data = {
            req: {
                target_id: inputId
            },
            t8t_serial: t8t_serial
        };
        from(apiWithTokenWrapper(removeParticipant, data)).subscribe(response => {
            if (response.status === 200) {
                if (response.data.header.status === 'OK') {
                    setReloadToggle(!reloadToggle);
                    getT8tDetail();
                } else {
                    console.log('delete error');
                }
            } else console.log('delete error');
        });
    };

    const searchPlayerHandler = searchPlayer => {
        const data = {
            bodyData: {
                search_pending: false,
                search_string: searchPlayer.trim()
            },
            pathParam: {
                _limit: -1,
                _pageno: 1
            },
            t8t_serial: t8t_serial
        };
        sendData(data);
    };

    // Export
    const downloadDataHandler = () => {
        const downloadCSV = dataStream => {
            const element = document.createElement('a');
            const file = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), dataStream], {
                type: 'text/csv; charset=UTF-8',
                encoding: 'UTF-8'
            });
            element.href = window.URL.createObjectURL(file);
            element.download = `${t8t_serial}_participant.csv`;
            document.body.appendChild(element);
            element.click();
        };

        const data = {
            t8t_serial: t8t_serial
        };
        from(apiWithTokenWrapper(postExportCompetitionListAPI, data)).subscribe(response => {
            if (response.status === 200 && response.data.header.status === 'OK') {
                downloadCSV(response.data.body);
            }
        });
    };

    //Admin未進行正取名單seed產生時，兩者皆empty []
    const noDataPlaceHolder = intl.formatMessage({ id: "Manage-Tournament-Page_Admin hasn't generated seed yet." });

    let DisplayList = null;

    // 1V1 or TVT data ?
    switch (tournament_format) {
        case 'TvT':
            DisplayList =
                t8t_teams.length > 0 ? (
                    <SinglePlayerList
                        teams={t8t_teams} // 篩選過checkin資料
                        onDelete={deleteObjectHandler}
                        isT8tCheckin={isT8tCheckin}
                    />
                ) : (
                    noDataPlaceHolder
                );
            break;
        case '1v1':
            DisplayList =
                t8t_Players.length > 0 ? (
                    <SinglePlayerList
                        players={t8t_Players} // 篩選過checkin資料
                        onDelete={deleteObjectHandler}
                        isT8tCheckin={isT8tCheckin}
                    />
                ) : (
                    noDataPlaceHolder
                );
            break;
        default:
            break;
    }

    return (
        <>
            <div className={classes.basicsCon}>
                <Card size="col-9">
                    <CardHeader>{intl.formatMessage({ id: 'Manage-Tournament-Page_Competition' })}</CardHeader>
                    <CardBody customClass={classes.basicsInner}>
                        <div className={cx('groupAll')}>
                            {/* Tournament Competition  */}
                            <div className={cx('group', 'groupTitle')}>
                                <div className={classes.bold}>
                                    {tournament_format === 'TvT'
                                        ? intl.formatMessage({ id: 'Manage-Tournament-Page_Tournament Competition' })
                                        : intl.formatMessage({ id: 'Manage-Tournament-Page_Tournament Competition' })}
                                </div>
                                <div className={classes.inner}>
                                    <span className={classes.blue}>
                                        {tournament_format === 'TvT' ? t8t_teams.length : t8t_Players.length}
                                    </span>
                                </div>
                            </div>
                            {/* Check-in Status */}
                            <div className={cx('group', 'groupTitle')}>
                                <div className={classes.bold}>
                                    {intl.formatMessage({ id: 'Manage-Tournament-Page_Check-in Status' })}
                                </div>
                                <div className={classes.inner}>
                                    <span className={classes.blue}>
                                        {tournament_format === 'TvT'
                                            ? `${t8t_teams.length} / ${t8t_teams.length}`
                                            : `${t8t_Players.length} / ${t8t_Players.length}`}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className={classes.line}></div>
                        <div className={cx('group')}>
                            <div className={cx('inputSearch')}>
                                <Autocomplete
                                    placeholder=""
                                    type="search"
                                    search={true}
                                    onChange={val => {
                                        if (val === undefined || val === '') {
                                            searchPlayerHandler('');
                                        }
                                    }}
                                    onSearch={val => {
                                        searchPlayerHandler(val);
                                    }}
                                />
                            </div>
                            <div className={cx('fileBtn')}>
                                <Button
                                    title={intl.formatMessage({ id: 'Manage-Tournament-Page_[btn]Export' })}
                                    theme="dark_2"
                                    onClick={downloadDataHandler}
                                />
                                {/* <Button
                                title={intl.formatMessage({ id: 'Manage-Tournament-Page_[btn]Import' })}
                                theme="dark_2"
                                onClick={uploadFileHandler}
                            /> */}
                                {/* <div className={cx('img')}>
                                <Tooltip info={intl.formatMessage({ id: 'Manage-Tournament-Page_[tooltips]Import' })} />
                            </div> */}
                            </div>
                            <div className={cx('clear')}></div>
                        </div>
                        <div className={classes.line}></div>

                        {isReady ? DisplayList : <Loading />}
                    </CardBody>
                </Card>
            </div>
        </>
    );
};

export default withRouter(withAuthConsumer(withConfigConsumer(withDialogConsumer(injectIntl(CompetitionList)))));
