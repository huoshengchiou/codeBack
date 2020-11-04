import React, { useState, useEffect, useRef, useContext } from 'react';
import { withConfigConsumer } from 'contexts/Config';
import { withAuthConsumer } from 'contexts/Auth';
import { withRouter } from 'react-router-dom';
// API
import {
    getParticipant,
    postGetRegistrationListAPI,
    removeParticipant,
    exportParticipant,
    importParticipant
} from 'apis/tournament';

import { withDialogConsumer } from 'components/layouts/Dialog/Context';
import DialogBlock from 'components/blocks/DialogBlock';
import { injectIntl } from 'react-intl';

import classNames from 'classnames/bind';

import SinglePlayerList from './SinglePlayerList/';
import TeamList from './TeamList/';

import Button from 'components/DesignSystem/Input/Button';
import Autocomplete from 'components/DesignSystem/Input/AutoComplete_V2';
import Tooltip from 'components/DesignSystem/DataDisplay/Tooltip';
import Loading from 'components/DesignSystem/Base/Loading';
import Card, { CardHeader, CardBody } from 'components/DesignSystem/DataDisplay/Card';

import classes from './styles.module.scss';
import { from } from 'rxjs';

import { EditManageContext } from '../../Context';

const cx = classNames.bind(classes);

const ParticipantsList = props => {
    const { t8tDetail, intl, authData, dialogData, getT8tDetail } = useContext(EditManageContext);

    const { apiWithTokenWrapper } = authData;
    const { openDialogFunc, closeDialogFunc } = dialogData;
    const { tournament_format, participants_count, t8t_lite } = t8tDetail;
    const { t8t_serial } = t8t_lite;

    const [t8t_teams, setT8t_teams] = useState([]);
    const [t8t_players, setT8t_players] = useState([]);
    const [isReady, setIsReady] = useState(false);
    const [reloadToggle, setReloadToggle] = useState(false);
    const fetchListener = useRef();

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

    const sendData = data => {
        setIsReady(false);
        fetchListener.current = from(apiWithTokenWrapper(postGetRegistrationListAPI, data)).subscribe(response => {
            // console.log('postGetRegistrationListAPI:', response);
            if (response.status === 200) {
                if (response.data.header.status === 'OK') {
                    //Admin未進行正取名單seed產生時，兩者皆empty []
                    setT8t_teams(response.data.body.t8t_teams);
                    setT8t_players(response.data.body.t8t_players);
                    setIsReady(true);
                } else {
                    setIsReady(true);
                }
            }
        });
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
            // pathParam: {
            //     _limit: -1,
            //     _pageno: 1
            // },
            t8t_serial: t8t_serial
        };
        sendData(data);
    };

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
        from(apiWithTokenWrapper(exportParticipant, data)).subscribe(response => {
            if (response.status === 200 && response.data.header.status === 'OK') {
                downloadCSV(response.data.body);
            }
        });
    };

    const uploadFileHandler = () => {
        const submitData = csvFile => {
            const formData = new FormData();
            formData.append('csv_file', csvFile);
            from(apiWithTokenWrapper(importParticipant, formData, t8t_serial)).subscribe(response => {
                if (response.status === 200 && response.data.header.status === 'OK') {
                    setReloadToggle(!reloadToggle);
                    getT8tDetail();
                }
            });
        };

        const fileData = document.createElement('input');
        fileData.setAttribute('type', 'file');
        fileData.setAttribute('accept', '.csv');
        fileData.onchange = e => submitData(e.target.files[0]);
        fileData.click();
    };

    //Admin未進行正取名單seed產生時，兩者皆empty []
    const noDataPlaceHolder = intl.formatMessage({ id: "Manage-Tournament-Page_Admin hasn't generated seed yet." });

    let DisplayList = null;

    switch (tournament_format) {
        case 'TvT':
            DisplayList =
                t8t_teams.length > 0 ? (
                    <>
                        {t8t_teams.map((team, index) => (
                            <TeamList
                                key={team.team_id}
                                teamId={team.team_id}
                                t8t_team_id={team.t8t_team_id}
                                teamName={team.team_name}
                                reg={index + 1}
                                teamPlayers={team.team_player}
                                onDelete={deleteObjectHandler}
                                icon_image={team.icon_image}
                                is_seed_admission={team.is_seed_admission}
                            />
                        ))}
                    </>
                ) : (
                    noDataPlaceHolder
                );
            break;
        case '1v1':
            DisplayList =
                t8t_players.length > 0 ? (
                    <>
                        <SinglePlayerList players={t8t_players} onDelete={deleteObjectHandler} />
                    </>
                ) : (
                    noDataPlaceHolder
                );
            break;
        default:
            break;
    }

    return (
        <div className={classes.basicsCon}>
            <Card size="col-9">
                <CardHeader>{intl.formatMessage({ id: 'Manage-Tournament-Page_Participants' })}</CardHeader>
                <CardBody customClass={classes.basicsInner}>
                    <div className={cx('group')}>
                        <div className={classes.bold}>
                            {tournament_format === 'TvT'
                                ? intl.formatMessage({ id: 'Manage-Tournament-Page_Joined Teams' })
                                : intl.formatMessage({ id: 'Manage-Tournament-Page_Joined Players' })}
                        </div>
                        <div className={classes.inner}>
                            <span className={classes.blue}>{participants_count}</span>
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
                            <Button
                                title={intl.formatMessage({ id: 'Manage-Tournament-Page_[btn]Import' })}
                                theme="dark_2"
                                onClick={uploadFileHandler}
                            />
                            <div className={cx('img')}>
                                {/* <ExclamationIcon></ExclamationIcon> */}
                                <Tooltip info={intl.formatMessage({ id: 'Manage-Tournament-Page_[tooltips]Import' })} />
                            </div>
                        </div>
                        <div className={cx('clear')}></div>
                    </div>
                    <div className={classes.line}></div>
                    {isReady ? DisplayList : <Loading />}
                </CardBody>
            </Card>
        </div>
    );
};

export default withRouter(withAuthConsumer(withConfigConsumer(withDialogConsumer(injectIntl(ParticipantsList)))));
