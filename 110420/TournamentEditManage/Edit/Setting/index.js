import React, { useState, useEffect, useRef, useContext } from 'react';
import { useFormsller, Controller, useForm } from 'react-hook-form';

import moment from 'moment-timezone';

import RadioGroup from 'components/DesignSystem/Input/RadioButton/RadioGroup';
import Radio from 'components/DesignSystem/Input/RadioButton/Radio';
import Button from 'components/DesignSystem/Input/Button';
import Dropdown from 'components/DesignSystem/Input/Dropdown_V3';
import Textfield from 'components/DesignSystem/Input/TextField';
import Switch from 'components/DesignSystem/Input/Switch';
import Tooltip from 'components/DesignSystem/DataDisplay/Tooltip';

import { formatDateTime } from 'utils/formattersV2/date';
import Card, { CardHeader, CardBody } from 'components/DesignSystem/DataDisplay/Card';

import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { getRealGameParams } from 'apis/game';
import Loading from 'components/utils/Loading';

import { EditManageContext } from '../../Context';
import classes from './styles.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const Settings = prop => {
    const { t8tDetail, paramList, configData, intl, authData, saveT8tDetail, editClickBack } = useContext(
        EditManageContext
    );

    const { apiWithTokenWrapper } = authData;
    const [isLoading, setIsLoading] = useState(true);
    const { t8t_tournament_format } = paramList.t8t_params;

    const {
        tournament_format,
        t8t_checkin_mins,
        region,
        t8t_lite,
        bench_count,
        is_t8t_checkin,
        is_t8t_applier_checkin,
        is_participant_limit,
        participant_limit,
        request_titles,
        is_need_in_game_id_verified,
        is_create_finished,
        game_api_setting,
        event_start_at,
        starter_count
    } = t8tDetail;

    const gameApiSetting = game_api_setting !== null ? JSON.parse(game_api_setting) : '';
    const { game_regions, game_servers } = t8t_lite.game;
    const defaultOption = [
        {
            key: 'null',
            value: intl.formatMessage({ id: 'common_please_select' })
        }
    ];
    const regionList = defaultOption.concat(
        configData.continents.map((item, index) => {
            return { id: index, key: item.continent_code, name: item.name, value: item.name };
        })
    );

    const tournamentFormatList = t8t_tournament_format.map((item, index) => {
        return {
            id: index,
            key: item,
            value:
                item === '1v1'
                    ? intl.formatMessage({ id: 'Tournament-Management-Settings_Solo' })
                    : intl.formatMessage({ id: 'Tournament-Management-Settings_Team' })
        };
    });
    const [realGameParams, setRealGameParams] = useState(null);
    const [requestList, setRequestList] = useState(request_titles);
    const [isParticipantLimit, setIsParticipantLimit] = useState(is_participant_limit);
    const [isRegionAllowed, setIsRegionAllowed] = useState(region === '' || region === null ? true : false);
    const minLists = [
        { id: 0, key: '30', name: 30, value: '30' },
        { id: 1, key: '60', name: 60, value: '60' }
    ];
    const [tournamentFormat, setTournamentFormat] = useState(tournament_format);
    const [t8tCheckin, setT8tCheckin] = useState(is_t8t_checkin);
    const [checkinTime, setCheckinTime] = useState({
        start_time:
            t8t_checkin_mins === 0
                ? moment(event_start_at).add(-(30 + 60), 'm')
                : moment(event_start_at).add(-(+t8t_checkin_mins + 60), 'm'),
        end_time: moment(event_start_at).add(-+(t8t_checkin_mins === 0 ? 30 : t8t_checkin_mins), 'm')
    });

    const fetchListener = useRef();

    const { handleSubmit, watch, control, formState, getValues } = useForm({ mode: 'onChange' });
    const { isValid } = formState;

    useEffect(() => {
        if (participant_limit !== null) {
        }
        getRealGameParamsbyApi();
    }, [t8tDetail]);

    const getRealGameParamsbyApi = () => {
        let data = {};
        data.game_id = t8t_lite.game.game_id;
        fetchListener.current = from(apiWithTokenWrapper(getRealGameParams, data))
            .pipe(
                map(data => {
                    Object.keys(data.data.body).map(key => {
                        if (data.data.body[key].list) {
                            data.data.body[key].list.forEach(item => {
                                item.value = intl.formatMessage({ id: item.i18n_key });
                            });
                        }
                        if (data.data.body[key].key === 'server_type') {
                            data.data.body[key].list =
                                data.data.body[key].type === 'game_server'
                                    ? game_servers
                                        .filter(i => i.is_t8t_api === true)
                                        .map((item, index) => {
                                            return {
                                                id: `r${index}`,
                                                key: item.game_server_code,
                                                value: item.display_name
                                            };
                                        })
                                    : game_regions
                                        .filter(i => i.is_enabled === true)
                                        .map((item, index) => {
                                            return { id: `r${index}`, key: item.region_code, value: item.name };
                                        });
                        }
                    });
                    return data;
                })
            )
            .subscribe(res => {
                if (res.status === 200) {
                    if (res.data.header.status.toUpperCase() === 'OK') {
                        setRealGameParams(res.data.body);
                        setIsLoading(false);
                    }
                }
            });
    };

    const addRequest = () => {
        let lists = requestList;
        let item = {
            t8t_request_title_id: '',
            title_name: '',
            is_delete: false
        };

        lists.push(item);
        setRequestList(lists);
    };

    const deleteRequest = (item, index) => {
        let items = requestList.filter((t, i) => {
            return i !== index;
        });

        setRequestList(items);
    };

    const onSubmit = data => {
        let updateData = { ...t8tDetail };

        Object.keys(data).forEach(key => {
            updateData[key] = data[key];

            if (isRegionAllowed && key === 'is_region_allowed') {
                updateData.region = '';
            }
            if (!isParticipantLimit && key === 'is_participant_limit') {
                updateData.participant_limit = '';
            }
        });

        updateData.game_api_setting = JSON.stringify(data.game_api_setting);
        updateData.indexKey = 5;

        //當setting region 為all region給null值
        if (data.is_region_allowed) {
            updateData.region = null;
        }

        saveT8tDetail(updateData);
    };

    return (
        <>
            {isLoading ? (
                <Loading></Loading>
            ) : (
                    <>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className={classes.settings}>
                                <Card size="col-9" customClass={classes.cardWrapper}>
                                    <CardHeader>
                                        {intl.formatMessage({ id: 'Tournament-Management-Settings_Game Steeings' })}
                                    </CardHeader>
                                    <CardBody customClass={classes.cardBody}>
                                        <div className={classes.setInner}>
                                            {realGameParams === null ? (
                                                ''
                                            ) : (
                                                    <>
                                                        <table className={classes.setTable}>
                                                            <tbody>
                                                                <tr>
                                                                    {Object.keys(realGameParams)
                                                                        .sort()
                                                                        .map((key, index) => {
                                                                            return (
                                                                                <td key={index}>
                                                                                    <div className={classes.seInnertTitle}>
                                                                                        {intl.formatMessage({
                                                                                            id: `${realGameParams[key].i18n_key}`
                                                                                        })}
                                                                                    </div>
                                                                                    <Controller
                                                                                        as={
                                                                                            <Dropdown
                                                                                                options={defaultOption.concat(
                                                                                                    realGameParams[key].list
                                                                                                )}
                                                                                                defaultKey={
                                                                                                    gameApiSetting
                                                                                                        ? `${gameApiSetting[
                                                                                                        realGameParams[
                                                                                                            key
                                                                                                        ].key
                                                                                                        ]
                                                                                                        }`
                                                                                                        : 'null'
                                                                                                }
                                                                                            />
                                                                                        }
                                                                                        defaultValue={
                                                                                            gameApiSetting
                                                                                                ? `${gameApiSetting[
                                                                                                realGameParams[key]
                                                                                                    .key
                                                                                                ]
                                                                                                }`
                                                                                                : 'null'
                                                                                        }
                                                                                        control={control}
                                                                                        name={`game_api_setting[${realGameParams[key].key}]`}
                                                                                        onChange={e => {
                                                                                            console.log(e[0].key);
                                                                                            return e[0].key;
                                                                                        }}
                                                                                    />
                                                                                </td>
                                                                            );
                                                                        })}
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                        <div className={classes.line}></div>
                                                    </>
                                                )}
                                            <div className={classes.group}>
                                                <div className={classes.bold}>
                                                    {intl.formatMessage({
                                                        id: 'Tournament-Management-Settings_Required Verified Gamd ID'
                                                    })}
                                                </div>
                                                <div className={classes.inner}>
                                                    <Controller
                                                        as={<Switch name={`is_need_in_game_id_verified`} />}
                                                        defaultValue={is_need_in_game_id_verified}
                                                        control={control}
                                                        name={`is_need_in_game_id_verified`}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                                <Card size="col-9" customClass={classes.cardWrapper}>
                                    <CardHeader>
                                        {intl.formatMessage({ id: 'Tournament-Management-Settings_General Format' })}
                                    </CardHeader>
                                    <CardBody customClass={classes.cardBody}>
                                        <div className={classes.setInner}>
                                            <div className={classes.bold}>
                                                {intl.formatMessage({
                                                    id: 'Tournament-Management-Settings_Tournament Format'
                                                })}
                                            </div>
                                            <div className={classes.inner}>
                                                <div className={classes.innerSelect}>
                                                    <Controller
                                                        as={
                                                            <Dropdown
                                                                options={tournamentFormatList}
                                                                name={`tournament_format`}
                                                                defaultKey={
                                                                    tournamentFormat === null ? 'solo' : tournamentFormat
                                                                }
                                                                disabled={is_create_finished ? true : false}
                                                            // theme="dark"
                                                            />
                                                        }
                                                        defaultValue={tournament_format || '1v1'}
                                                        control={control}
                                                        name={`tournament_format`}
                                                        onChange={e => {
                                                            setTournamentFormat(e[0].key);
                                                            return e[0].key;
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            {tournamentFormat === 'TvT' ? (
                                                <>
                                                    <div className={cx('group', 'needTop')}>
                                                        <div className={classes.bold}>
                                                            {intl.formatMessage({
                                                                id:
                                                                    'Tournament-Management-Settings-Team-vs-Team-Format_Team Size'
                                                            })}
                                                        </div>
                                                        <div className={classes.inner}>
                                                            {/* <span className={classes.blue}>
                                        {intl.formatMessage({ id: "Tournament-Management-Settings-Team-vs-Team-Format_5 Starters Required" })}
                                    </span> */}
                                                            <div className={classes.innerInput}>
                                                                <Controller
                                                                    as={
                                                                        <Textfield
                                                                            name={`starter_count`}
                                                                            placeholder={''}
                                                                            type="number"
                                                                            theme="dark"
                                                                        />
                                                                    }
                                                                    defaultValue={`${starter_count}`}
                                                                    control={control}
                                                                    name={`starter_count`}
                                                                    onChange={e => {
                                                                        if (+e[0].target.value < 0) {
                                                                            return `0`;
                                                                        }
                                                                        return e[0].target.value;
                                                                    }}
                                                                />
                                                            </div>
                                                            <br />
                                                            <span className={classes.spanUp}>
                                                                {/* {intl.formatMessage({ id: "Tournament-Management-Settings-Team-vs-Team-Format_Up to" }, { number: "" })} */}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className={cx('group', 'needTop')}>
                                                        <div className={classes.bold}>
                                                            {intl.formatMessage({
                                                                id:
                                                                    'Tournament-Management-Settings-Team-vs-Team-Format_Allow Bench Players Optional'
                                                            })}
                                                        </div>
                                                        <div className={classes.inner}>
                                                            <div className={classes.innerInput}>
                                                                <Controller
                                                                    as={
                                                                        <Textfield
                                                                            name={`bench_count`}
                                                                            placeholder={''}
                                                                            type="number"
                                                                            theme="dark"
                                                                        />
                                                                    }
                                                                    defaultValue={`${bench_count}`}
                                                                    control={control}
                                                                    name={`bench_count`}
                                                                    onChange={e => {
                                                                        if (+e[0].target.value < 0) {
                                                                            return `0`;
                                                                        }
                                                                        return e[0].target.value;
                                                                    }}
                                                                />
                                                            </div>
                                                            <br />
                                                            <span className={classes.spanUp}>
                                                                {/* {intl.formatMessage({ id: "Tournament-Management-Settings-Team-vs-Team-Format_Up to" }, { number: "" })} */}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                    ''
                                                )}

                                            <div className={classes.line}></div>
                                            <div className={classes.group}>
                                                <div className={classes.bold}>
                                                    {intl.formatMessage({
                                                        id: 'Tournament-Management-Settings_Tournament Check-in'
                                                    })}
                                                    <div className={classes.exclamation}>
                                                        {/* <ExclamationIcon></ExclamationIcon> */}
                                                        <Tooltip
                                                            //在元件已經定義字串過長的css處理
                                                            info={intl.formatMessage({
                                                                id:
                                                                    'Tournament-Management-Settings_[tooltips]Tournament Check-in'
                                                            })}
                                                        />
                                                    </div>
                                                </div>
                                                <div className={classes.inner}>
                                                    <Controller
                                                        as={<Switch name={`is_t8t_checkin`} />}
                                                        defaultValue={is_t8t_checkin}
                                                        control={control}
                                                        name={`is_t8t_checkin`}
                                                        onChange={e => {
                                                            let status = getValues('is_t8t_checkin');
                                                            setT8tCheckin(!status);
                                                            return !status;
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                            {t8tCheckin ? (
                                                <>
                                                    <div className={cx('needTop')}>
                                                        <div className={classes.bold}>
                                                            {intl.formatMessage({
                                                                id:
                                                                    'Tournament-Management-Settings-Check-in-Setting_Tournament Check-in Time'
                                                            })}
                                                        </div>
                                                        <div className={classes.innerBlock}>
                                                            <div className={classes.innerSelect}>
                                                                <Controller
                                                                    as={
                                                                        <Dropdown
                                                                            options={minLists}
                                                                            name={`t8t_checkin_mins`}
                                                                            // id="dropdown"

                                                                            // isItemsDefault={true}
                                                                            // theme="dark"
                                                                            defaultKey={`${t8t_checkin_mins === 0
                                                                                    ? `30`
                                                                                    : t8t_checkin_mins
                                                                                }`}
                                                                        />
                                                                    }
                                                                    defaultValue={
                                                                        t8t_checkin_mins === 0 ? `30` : t8t_checkin_mins
                                                                    }
                                                                    control={control}
                                                                    name={`t8t_checkin_mins`}
                                                                    onChange={e => {
                                                                        // setCheckinTime(moment(event_start_at).add(-(+e[0].key + 60), 'm'))
                                                                        setCheckinTime({
                                                                            start_time: moment(event_start_at).add(
                                                                                -(+e[0].key + 60),
                                                                                'm'
                                                                            ),
                                                                            end_time: moment(event_start_at).add(
                                                                                -+e[0].key,
                                                                                'm'
                                                                            )
                                                                        });
                                                                        return +e[0].key;
                                                                    }}
                                                                />
                                                            </div>
                                                            <span className={classes.spanUp}>
                                                                {intl.formatMessage({
                                                                    id:
                                                                        'Tournament-Management-Settings-Check-in-Setting_Mins Before Tournament Start'
                                                                })}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className={cx('group', 'needTop')}>
                                                        <div className={classes.bold}>
                                                            {intl.formatMessage(
                                                                {
                                                                    id:
                                                                        'Tournament-Management-Settings-Check-in-Setting_Your Tournament Check-in will open on {start_time} to {end_time}'
                                                                },
                                                                {
                                                                    start_time:
                                                                        event_start_at === null
                                                                            ? ''
                                                                            : formatDateTime(checkinTime.start_time),
                                                                    end_time:
                                                                        event_start_at === null
                                                                            ? ''
                                                                            : formatDateTime(checkinTime.end_time)
                                                                }
                                                            )}
                                                        </div>
                                                        <ul>
                                                            <li>
                                                                <Controller
                                                                    as={
                                                                        <RadioGroup
                                                                            defaultValue={watch('is_t8t_applier_checkin')}
                                                                        >
                                                                            {/* <Radio value={true}>
                                                        {intl.formatMessage({ id: "Tournament-Management-Settings-Check-in-Setting_Only Applier Check-in" })}
                                                    </Radio> */}
                                                                            <Radio value={false}>
                                                                                {intl.formatMessage({
                                                                                    id:
                                                                                        'Tournament-Management-Settings-Check-in-Setting_All Lineup Check-in'
                                                                                })}
                                                                            </Radio>
                                                                        </RadioGroup>
                                                                    }
                                                                    control={control}
                                                                    name="is_t8t_applier_checkin"
                                                                    defaultValue={is_t8t_applier_checkin}
                                                                />
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </>
                                            ) : (
                                                    ''
                                                )}

                                            <div className={classes.line}></div>
                                            <div className={classes.group}>
                                                <div className={classes.bold}>
                                                    {intl.formatMessage({
                                                        id:
                                                            'Tournament-Management-Settings-Check-in-Setting_Match Score Reporting'
                                                    })}
                                                </div>
                                                <div className={classes.inner}>
                                                    {intl.formatMessage({
                                                        id:
                                                            'Tournament-Management-Settings-Check-in-Setting_Allow Admins and Players Submit Result'
                                                    })}
                                                </div>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                                <Card size="col-9" customClass={classes.cardWrapper}>
                                    <CardHeader>
                                        {intl.formatMessage({
                                            id: 'Tournament-Management-Settings_Advanced Fields Optional'
                                        })}
                                    </CardHeader>
                                    <CardBody customClass={classes.cardBody}>
                                        <div className={classes.setInner}>
                                            <div className={cx('group')}>
                                                <div className={classes.bold}>
                                                    {intl.formatMessage({
                                                        id: 'Tournament-Management-Settings_Registration Participant Limit'
                                                    })}
                                                </div>
                                                <ul>
                                                    <li>
                                                        <Controller
                                                            as={
                                                                <RadioGroup defaultValue={watch('is_participant_limit')}>
                                                                    <Radio value={false}>
                                                                        {intl.formatMessage({
                                                                            id: 'Tournament-Management-Settings_Unlimited'
                                                                        })}
                                                                    </Radio>
                                                                    <Radio value={true}>
                                                                        {intl.formatMessage({
                                                                            id: 'Tournament-Management-Settings_Limited'
                                                                        })}
                                                                    </Radio>
                                                                </RadioGroup>
                                                            }
                                                            control={control}
                                                            name="is_participant_limit"
                                                            defaultValue={is_participant_limit}
                                                            onChange={e => {
                                                                setIsParticipantLimit(e[0]);
                                                                return e[0];
                                                            }}
                                                        />
                                                    </li>
                                                </ul>
                                            </div>
                                            {isParticipantLimit ? (
                                                <div className={cx('group', 'needTop')}>
                                                    <div className={classes.bold}>
                                                        {intl.formatMessage({
                                                            id: 'Tournament-Management-Settings_Limit Number'
                                                        })}
                                                    </div>
                                                    <div className={classes.inner}>
                                                        <div className={classes.innerInput}>
                                                            <Controller
                                                                as={
                                                                    <Textfield
                                                                        name={`participant_limit`}
                                                                        placeholder={''}
                                                                        type="text"
                                                                        theme="dark"
                                                                    />
                                                                }
                                                                defaultValue={
                                                                    participant_limit === null ? '' : `${participant_limit}`
                                                                }
                                                                control={control}
                                                                name={`participant_limit`}
                                                                // isParticipantLimit 當有limit為必填
                                                                rules={{
                                                                    required: isParticipantLimit
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                    ''
                                                )}
                                            <div className={classes.line}></div>
                                            <div className={cx('group', 'needTop')}>
                                                <div className={classes.bold}>
                                                    {intl.formatMessage({
                                                        id: 'Tournament-Management-Settings_Registration Regions'
                                                    })}
                                                </div>
                                                <ul>
                                                    <li>
                                                        <Controller
                                                            as={
                                                                <RadioGroup defaultValue={watch('is_region_allowed')}>
                                                                    <Radio value={true}>
                                                                        {intl.formatMessage({
                                                                            id: 'Tournament-Management-Settings_All'
                                                                        })}
                                                                    </Radio>
                                                                    <Radio value={false}>
                                                                        {intl.formatMessage({
                                                                            id:
                                                                                'Tournament-Management-Settings_Specific Regions'
                                                                        })}
                                                                    </Radio>
                                                                </RadioGroup>
                                                            }
                                                            control={control}
                                                            name="is_region_allowed"
                                                            defaultValue={isRegionAllowed}
                                                            onChange={e => {
                                                                setIsRegionAllowed(e[0]);
                                                                return e[0];
                                                            }}
                                                        />
                                                    </li>
                                                </ul>
                                            </div>
                                            {!isRegionAllowed ? (
                                                <div className={cx('needTop')}>
                                                    <div className={classes.bold}>
                                                        {intl.formatMessage({
                                                            id: 'Tournament-Management-Settings_Regions Allowed'
                                                        })}
                                                    </div>
                                                    <div className={classes.inner}>
                                                        <div className={classes.boSelect}>
                                                            <Controller
                                                                as={
                                                                    <Dropdown
                                                                        options={regionList}
                                                                        defaultKey={region === null ? null : region}
                                                                    />
                                                                }
                                                                defaultValue={region === null ? null : region}
                                                                control={control}
                                                                name={`region`}
                                                                onChange={e => {
                                                                    console.log(e)
                                                                    return e[0].key;
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                    ''
                                                )}
                                        </div>
                                    </CardBody>
                                </Card>
                                <Card size="col-9" customClass={classes.cardWrapper}>
                                    <CardHeader>
                                        {intl.formatMessage({
                                            id: 'Tournament-Management-Settings_Required Data Optional'
                                        })}
                                    </CardHeader>
                                    <CardBody customClass={classes.cardBody}>
                                        <div className={classes.setInner}>
                                            <div className={cx('group')}>
                                                <div className={classes.bold}>
                                                    {intl.formatMessage({ id: 'Tournament-Management-Settings_Notice' })} !
                                            </div>
                                                <div className={classes.inner}>
                                                    {intl.formatMessage({
                                                        id: 'Tournament-Management-Settings_[content]Notice'
                                                    })}
                                                </div>
                                            </div>
                                            <div className={cx('group', 'needTop')}>
                                                <div className={classes.bold}>
                                                    {intl.formatMessage({
                                                        id: 'Tournament-Management-Settings_Add Request Title'
                                                    })}
                                                </div>
                                                {requestList.map((item, index) => {
                                                    return (
                                                        <div className={classes.requestInner} key={index + 'R'}>
                                                            <Controller
                                                                as={
                                                                    <Textfield
                                                                        name={`request_titles[${index}].t8t_request_title_id`}
                                                                        type="hidden"
                                                                    />
                                                                }
                                                                defaultValue={item.t8t_request_title_id}
                                                                control={control}
                                                                name={`request_titles[${index}].t8t_request_title_id`}
                                                            />
                                                            <Controller
                                                                as={
                                                                    <Textfield
                                                                        name={`request_titles[${index}].is_delete`}
                                                                        type="hidden"
                                                                    />
                                                                }
                                                                defaultValue={item.is_delete ? 'true' : 'false'}
                                                                control={control}
                                                                name={`request_titles[${index}].is_delete`}
                                                            />
                                                            <Controller
                                                                as={
                                                                    <Textfield
                                                                        name={`request_titles[${index}].title_name`}
                                                                        placeholder={''}
                                                                        type="text"
                                                                        theme="dark"
                                                                    />
                                                                }
                                                                defaultValue={item.title_name}
                                                                control={control}
                                                                name={`request_titles[${index}].title_name`}
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                            <a href="#" className={classes.add} onClick={() => addRequest()}>
                                                + {intl.formatMessage({ id: 'Tournament-Management-Settings_Add Request' })}
                                            </a>
                                        </div>
                                    </CardBody>
                                </Card>
                                <div className={classes.buttonCon}>
                                    {is_create_finished ? (
                                        <Button
                                            title={intl.formatMessage({
                                                id: 'Tournament-Management-Bracket-Settings-After-Publish_[btn]Save'
                                            })}
                                            disabled={!isValid}
                                            type="submit"
                                        />
                                    ) : (
                                            <>
                                                <Button
                                                    title={intl.formatMessage({
                                                        id: 'Tournament-Management-Create-New-Tournament_[btn]Back'
                                                    })}
                                                    theme="dark_2"
                                                    onClick={() => editClickBack(2)}
                                                />
                                                <Button
                                                    title={intl.formatMessage({
                                                        id: 'Tournament-Management-Create-New-Tournament_[btn]Next'
                                                    })}
                                                    disabled={!isValid}
                                                    type="submit"
                                                />
                                            </>
                                        )}
                                </div>
                            </div>
                        </form>
                    </>
                )}
        </>
    );
};

export default Settings;
