import React, { useState, useEffect, useReducer, useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import moment from 'moment-timezone';
import Card, { CardHeader, CardBody } from 'components/DesignSystem/DataDisplay/Card';

import classes from '../styles.module.scss';

import classNames from 'classnames/bind';

import Loading from 'components/utils/Loading';
import Tooltip from 'components/DesignSystem/DataDisplay/Tooltip';
import Button from 'components/DesignSystem/Input/Button';
import Switch from 'components/DesignSystem/Input/Switch';
import Textfield from 'components/DesignSystem/Input/TextField';
import Dropdown from 'components/DesignSystem/Input/Dropdown_V3';
import CalendarDatePicker from 'components/DesignSystem/Input/DatePicker/CalendarDatePicker';

import { EditManageContext } from '../../../Context';

const cx = classNames.bind(classes);

const Basic = prop => {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const {
        t8tDetail,
        paramList,
        configData,
        intl,
        saveT8tDetail,
        resetSetElimination,
        contextIsLoading,
        editClickBack
    } = useContext(EditManageContext);

    const { currentLocale } = configData;
    const {
        bracket_type,
        bracket_info,
        bracket_rounds,
        is_create_finished,
        registration_end_at,
        event_start_at,
        t8t_lite
    } = t8tDetail;
    const { t8t_bo } = paramList.t8t_params;
    const { club_sales_type } = t8t_lite;

    const t8tBo = t8t_bo
        .filter(item => {
            if (club_sales_type === 'general') {
                return +item < 7;
            }
            return item;
        })
        .map((item, index) => {
            return { id: index, key: `${item}`, value: 'Best Of ' + item };
        });

    //arr共用
    //Winner roundList
    const [roundList, setRoundList] = useState([]);
    //Loser  roundList
    //TODO loading預設
    const [LroundList, setLRoundList] = useState([]);
    //Grand roundList
    //TODO loading預設
    const [GroundList, setGRoundList] = useState([]);

    const { handleSubmit, setValue, getValues, triggerValidation, control, formState } = useForm({ mode: 'onChange' });
    const { isValid } = formState;

    useEffect(() => {
        setDefaultRound();
    }, []);

    const getSizeRule = () => {
        let rule = { required: true };
        rule.min = 2;
        rule.max = 256;
        if (bracket_type === 'double') {
            rule.min = 4;
        }
        if (club_sales_type === 'partner') {
            rule.max = 512;
        }
        return rule;
    };

    const setDefaultRound = () => {
        if (bracket_rounds.length === 0) {
            return;
        }

        switch (bracket_type) {
            case 'single':
                setRoundList(bracket_rounds);
                break;
            case 'double':
                setRoundList(bracket_rounds.filter(item => item.bracket_type === 'winner'));
                setLRoundList(bracket_rounds.filter(item => item.bracket_type === 'loser'));
                setGRoundList(bracket_rounds.filter(item => item.bracket_type === 'final'));
                break;
        }
    };

    //press to fire
    const onSubmit = data => {
        let updateData = { ...t8tDetail };
        Object.keys(data).forEach(key => {
            updateData[key] = data[key];
        });

        updateData.bracket_size = updateData.bracket_size === '' ? 0 : updateData.bracket_size;
        if (bracket_type === 'double') {
            updateData.bracket_rounds = [...data.W_bracket_rounds, ...data.L_bracket_rounds, ...data.G_bracket_rounds];
        }

        updateData.indexKey = 7;

        saveT8tDetail(updateData);
    };

    const getBaseLog = (x, y) => {
        return Math.log(y) / Math.log(x);
    };

    const changeCreateRoundList = ({ size, playtype }) => {
        setRoundList([]);
        setLRoundList([]);
        setGRoundList([]);
        //block ''
        if (!+size) {
            return;
        }
        //block negative
        if (+size < 0) {
            size = 0;
        }

        // if (size % 2 !== 0) {
        //     return;
        // }

        switch (playtype) {
            case 'single':
                if (club_sales_type === 'partner') {
                    if (size < 2 || size > 512) {
                        return;
                    }
                }
                if (club_sales_type === 'general') {
                    if (size < 2 || size > 256) {
                        return;
                    }
                }
                break;
            // 'general'club_sales_type
            // 'partner'club_sales_type
            case 'double':
                if (club_sales_type === 'partner') {
                    if (size < 4 || size > 512) {
                        return;
                    }
                }
                if (club_sales_type === 'general') {
                    if (size < 4 || size > 256) {
                        return;
                    }
                }
                break;

            default:
                break;
        }

        //單數仍可運行
        let count = Math.ceil(getBaseLog(2, +size)) || 0;
        let rlists = [];

        rlists = [...Array(count).keys()].map((item, index) => {
            return {
                // t8t_bracket_round_id: "",
                bracket_elimination_round_id: '',
                bracket_type: (playtype === 'single' && 'single') || (playtype === 'double' && 'winner'),
                round_no: index,
                game_bo: getValues('bo'),
                //創建時自動帶入event time +1h
                start_at: moment(event_start_at).add(index, 'h'),
                is_pause: false
            };
        });

        setRoundList(rlists);

        if (playtype === 'double') {
            //loser round num count
            const loserRoundCount = count ? (count - 1) * 2 : 0;
            //GrandRoundCount 固定round數
            const GrandRoundCount = 2;
            rlists = [...Array(loserRoundCount).keys()].map((item, index) => {
                return {
                    bracket_elimination_round_id: '',
                    bracket_type: 'loser',
                    round_no: index,
                    game_bo: getValues('bo'),
                    start_at: moment(event_start_at).add(index + 1, 'h'),
                    is_pause: false
                };
            });
            let rlists2 = [...Array(GrandRoundCount).keys()].map((item, index) => {
                return {
                    bracket_elimination_round_id: '',
                    bracket_type: 'final',
                    round_no: index,
                    game_bo: getValues('bo'),
                    start_at: moment(event_start_at).add(loserRoundCount + index + 1, 'h'),
                    is_pause: false
                };
            });
            if (count > 0) {
                setLRoundList(rlists);
                setGRoundList(rlists2);
            }
        }
        forceUpdate();
        // elimination?.value === "double"
    };

    const changeRoungBo = ({ value, playtype }) => {
        setRoundList(
            roundList.map(item => {
                item.game_bo = value;
                return item;
            })
        );
        forceUpdate();
        setLRoundList([]);
        setGRoundList([]);

        //special adjust for double
        const handleDouble = value => {
            LroundList.forEach((item, index) => {
                setValue(`L_bracket_rounds[${index}].game_bo`, value);
            });
            GroundList.forEach((item, index) => {
                setValue(`G_bracket_rounds[${index}].game_bo`, value);
            });
        };
        playtype === 'double' && handleDouble(value);
        //強制觸發verify
        triggerValidation();
    };

    const getEliminationText = type => {
        switch (type) {
            case 'single':
                // return "Single Elimination" + " Bracket"
                return intl.formatMessage({
                    id: 'Tournament-Main-Page_Single Elimination'
                });
            default:
                // return "Double Elimination" + " Bracket"
                return intl.formatMessage({
                    id: 'Tournament-Main-Page_Double Elimination'
                });
        }
    };
    const checkRegistrationEndAt = () => {
        if (moment() > moment(registration_end_at)) {
            return false;
        }
        return true;
    };

    return (
        <>
            {contextIsLoading ? (
                <Loading />
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={classes.bracketSettings}>
                        {checkRegistrationEndAt() ? (
                            <div className={classes.btnWrapper}>
                                <Button
                                    title={intl.formatMessage({
                                        id: 'Tournament-Management-Bracket-Settings-Single-Elimination_Delete Bracket'
                                    })}
                                    theme="dark_2"
                                    onClick={() => resetSetElimination(bracket_type)}
                                />
                            </div>
                        ) : (
                            ''
                        )}
                        <Card size="col-9" customClass={classes.cardWrapper}>
                            <CardHeader>
                                {intl.formatMessage({
                                    id: 'Tournament-Management-Bracket-Settings-Single-Elimination_Bracket Settings'
                                })}
                            </CardHeader>
                            <CardBody customClass={classes.cardBody}>
                                <div className={classes.bracketInner}>
                                    <div className={classes.block}>
                                        <div className={classes.title}>
                                            {intl.formatMessage({
                                                id:
                                                    'Tournament-Management-Bracket-Settings-Single-Elimination_Bracket Style'
                                            })}
                                        </div>
                                        <div className={classes.blue}>{getEliminationText(bracket_type)}</div>
                                    </div>
                                    <div className={classes.block}>
                                        <div className={classes.title}>
                                            {intl.formatMessage({
                                                id:
                                                    'Tournament-Management-Bracket-Settings-Single-Elimination_Match Check-in'
                                            })}
                                            <div className={classes.img}>
                                                <Tooltip
                                                    info={intl.formatMessage({
                                                        id:
                                                            'Tournament-Management-Bracket-Settings-Single-Elimination_[tooltips]Match Check-in'
                                                    })}
                                                />
                                            </div>
                                        </div>
                                        <div className={classes.origal}>
                                            <Controller
                                                as={<Switch name={`bracket_info.is_match_checkin`} />}
                                                defaultValue={
                                                    bracket_info.is_match_checkin === null
                                                        ? false
                                                        : bracket_info.is_match_checkin
                                                }
                                                control={control}
                                                name={`bracket_info.is_match_checkin`}
                                            />
                                            {intl.formatMessage({
                                                id:
                                                    'Tournament-Management-Bracket-Settings-Single-Elimination_Match Check-in btn Description'
                                            })}
                                        </div>
                                    </div>
                                    {bracket_type === 'single' && (
                                        <div className={classes.block}>
                                            <div className={classes.title}>
                                                {intl.formatMessage({
                                                    id:
                                                        'Tournament-Management-Bracket-Settings-Single-Elimination_Enable third Place Match'
                                                })}
                                            </div>
                                            <div className={classes.origal}>
                                                <Controller
                                                    as={<Switch name={`bracket_info.is_enable_3rd_place`} />}
                                                    defaultValue={
                                                        bracket_info.is_enable_3rd_place === null
                                                            ? false
                                                            : bracket_info.is_enable_3rd_place
                                                    }
                                                    control={control}
                                                    name={`bracket_info.is_enable_3rd_place`}
                                                />
                                            </div>
                                        </div>
                                    )}
                                    <div className={classes.block}>
                                        <div className={classes.title}>
                                            {intl.formatMessage({
                                                id:
                                                    'Tournament-Management-Bracket-Settings-Single-Elimination_Bracket Size'
                                            })}
                                        </div>
                                        <div className={classes.origal}>
                                            <Controller
                                                as={
                                                    <Textfield
                                                        theme="dark"
                                                        customContainerClass={classes.limitinput}
                                                        name={`bracket_info.bracket_size`}
                                                        placeholder={''}
                                                        type="number"
                                                        disabled={
                                                            !is_create_finished
                                                                ? false
                                                                : registration_end_at === null
                                                                ? false
                                                                : moment(registration_end_at) > moment()
                                                                ? false
                                                                : true
                                                        }
                                                    />
                                                }
                                                defaultValue={
                                                    bracket_info.bracket_size === null
                                                        ? `0`
                                                        : `${bracket_info.bracket_size}`
                                                }
                                                control={control}
                                                rules={getSizeRule()}
                                                name={`bracket_info.bracket_size`}
                                                onChange={([event]) => {
                                                    changeCreateRoundList({
                                                        size: event.target.value,
                                                        playtype: bracket_type
                                                    });
                                                    return event.target.value;
                                                }}
                                            />
                                            {intl.formatMessage({
                                                id:
                                                    'Tournament-Management-Bracket-Settings-Single-Elimination_of players'
                                            })}
                                        </div>
                                    </div>
                                    <div className={classes.block}>
                                        <div className={classes.title}>
                                            {intl.formatMessage({
                                                id:
                                                    'Tournament-Management-Bracket-Settings-Single-Elimination_Best of for all rounds'
                                            })}
                                        </div>
                                        <div className={classes.origal2}>
                                            <Controller
                                                as={<Dropdown options={t8tBo} defaultKey={'1'} />}
                                                defaultValue={'1'}
                                                control={control}
                                                name={`bo`}
                                                onChange={e => {
                                                    changeRoungBo({ value: e[0].key, playtype: bracket_type });
                                                    return e[0].key;
                                                }}
                                            />
                                        </div>
                                    </div>
                                    {bracket_type === 'double' && (
                                        <div className={classes.block}>
                                            <div className={classes.title}>
                                                {intl.formatMessage({ id: 'Round-Schedule-Overview_Winner Bracket' })}
                                            </div>
                                        </div>
                                    )}
                                    {/* --------S------Winner roundList--------- */}
                                    {(bracket_type === 'single' || bracket_type === 'double') &&
                                        roundList.map((item, index) => {
                                            return (
                                                <div className={classes.round} key={index + 'W'}>
                                                    <table className={cx(classes.table, classes.bestAllRounds)}>
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <div className={classes.tableRound}>
                                                                        <span>
                                                                            {intl.formatMessage({
                                                                                id:
                                                                                    'Tournament-Management-Bracket-Settings-Single-Elimination_Round'
                                                                            })}
                                                                        </span>
                                                                        {index + 1}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <Controller
                                                                        as={
                                                                            <Textfield
                                                                                customContainerClass={
                                                                                    classes.displayWidth0
                                                                                }
                                                                                // name={`bracket_rounds[${index}].t8t_bracket_round_id`}
                                                                                name={`${
                                                                                    item.bracket_type !== 'single'
                                                                                        ? 'W_'
                                                                                        : ''
                                                                                }bracket_rounds[${index}].bracket_elimination_round_id`}
                                                                                type="hidden"
                                                                            />
                                                                        }
                                                                        // defaultValue={item.t8t_bracket_round_id}
                                                                        defaultValue={item.bracket_elimination_round_id}
                                                                        control={control}
                                                                        // name={`bracket_rounds[${index}].t8t_bracket_round_id`}
                                                                        name={`${
                                                                            item.bracket_type !== 'single' ? 'W_' : ''
                                                                        }bracket_rounds[${index}].bracket_elimination_round_id`}
                                                                    />
                                                                    <Controller
                                                                        as={
                                                                            <Textfield
                                                                                customContainerClass={
                                                                                    classes.displayWidth0
                                                                                }
                                                                                name={`${
                                                                                    item.bracket_type !== 'single'
                                                                                        ? 'W_'
                                                                                        : ''
                                                                                }bracket_rounds[${index}].bracket_type`}
                                                                                type="hidden"
                                                                            />
                                                                        }
                                                                        // defaultValue={item.t8t_bracket_round_id}
                                                                        defaultValue={item.bracket_type}
                                                                        control={control}
                                                                        name={`${
                                                                            item.bracket_type !== 'single' ? 'W_' : ''
                                                                        }bracket_rounds[${index}].bracket_type`}
                                                                    />
                                                                    <Controller
                                                                        as={
                                                                            <Textfield
                                                                                customContainerClass={
                                                                                    classes.displayWidth0
                                                                                }
                                                                                name={`${
                                                                                    item.bracket_type !== 'single'
                                                                                        ? 'W_'
                                                                                        : ''
                                                                                }bracket_rounds[${index}].round_no`}
                                                                                type="hidden"
                                                                            />
                                                                        }
                                                                        defaultValue={`${index + 1}`}
                                                                        control={control}
                                                                        name={`${
                                                                            item.bracket_type !== 'single' ? 'W_' : ''
                                                                        }bracket_rounds[${index}].round_no`}
                                                                    />
                                                                    <Controller
                                                                        as={
                                                                            <Textfield
                                                                                customContainerClass={
                                                                                    classes.displayWidth0
                                                                                }
                                                                                name={`${
                                                                                    item.bracket_type !== 'single'
                                                                                        ? 'W_'
                                                                                        : ''
                                                                                }bracket_rounds[${index}].is_pause`}
                                                                                type="hidden"
                                                                            />
                                                                        }
                                                                        defaultValue={`${item.is_pause}`}
                                                                        control={control}
                                                                        name={`${
                                                                            item.bracket_type !== 'single' ? 'W_' : ''
                                                                        }bracket_rounds[${index}].is_pause`}
                                                                    />
                                                                    <div className={classes.tableTitle}>
                                                                        {intl.formatMessage({
                                                                            id:
                                                                                'Tournament-Management-Bracket-Settings-Single-Elimination_Start Date'
                                                                        })}
                                                                    </div>
                                                                    <Controller
                                                                        as={
                                                                            <CalendarDatePicker
                                                                                name={`${
                                                                                    item.bracket_type !== 'single'
                                                                                        ? 'W_'
                                                                                        : ''
                                                                                }bracket_rounds[${index}].start_at`}
                                                                                theme="dark"
                                                                                disabledDateTime={moment(
                                                                                    event_start_at
                                                                                ).add(-1, 'days')}
                                                                                isShowTime={true}
                                                                                currentLocale={currentLocale}
                                                                            ></CalendarDatePicker>
                                                                        }
                                                                        control={control}
                                                                        rules={{
                                                                            required: true
                                                                        }}
                                                                        defaultValue={
                                                                            item.start_at === null
                                                                                ? ''
                                                                                : moment(item.start_at)
                                                                        }
                                                                        name={`${
                                                                            item.bracket_type !== 'single' ? 'W_' : ''
                                                                        }bracket_rounds[${index}].start_at`}
                                                                    />
                                                                    <small>
                                                                        {/* %Time Zone% */}
                                                                        {/* {TimeZoneDisplay} */}
                                                                    </small>
                                                                </td>
                                                                <td>
                                                                    <div className={classes.boSelect}>
                                                                        <Controller
                                                                            as={
                                                                                <Dropdown
                                                                                    options={t8tBo}
                                                                                    defaultKey={`${item.game_bo}`}
                                                                                />
                                                                            }
                                                                            defaultValue={`${item.game_bo}`}
                                                                            control={control}
                                                                            rules={{ required: true }}
                                                                            name={`${
                                                                                item.bracket_type !== 'single'
                                                                                    ? 'W_'
                                                                                    : ''
                                                                            }bracket_rounds[${index}].game_bo`}
                                                                            onChange={e => {
                                                                                return +e[0].key;
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            );
                                        })}
                                    {/* --------E------Winner  roundList--------- */}

                                    {bracket_type === 'double' && (
                                        <div className={classes.block}>
                                            <div className={classes.title}>
                                                {intl.formatMessage({ id: 'Round-Schedule-Overview_Loser Bracket' })}
                                            </div>
                                        </div>
                                    )}

                                    {/* --------S------Loser  roundList--------- */}
                                    {bracket_type === 'double' &&
                                        LroundList.map((item, index) => {
                                            return (
                                                <div className={classes.round} key={index + 'L'}>
                                                    <table className={cx(classes.table, classes.bestAllRounds)}>
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <div className={classes.tableRound}>
                                                                        <span>
                                                                            {intl.formatMessage({
                                                                                id:
                                                                                    'Tournament-Management-Bracket-Settings-Single-Elimination_Round'
                                                                            })}
                                                                        </span>
                                                                        {index + 1}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <Controller
                                                                        as={
                                                                            <Textfield
                                                                                customContainerClass={
                                                                                    classes.displayWidth0
                                                                                }
                                                                                // name={`bracket_rounds[${index}].t8t_bracket_round_id`}
                                                                                name={`L_bracket_rounds[${index}].bracket_elimination_round_id`}
                                                                                type="hidden"
                                                                            />
                                                                        }
                                                                        // defaultValue={item.t8t_bracket_round_id}
                                                                        defaultValue={item.bracket_elimination_round_id}
                                                                        control={control}
                                                                        // name={`bracket_rounds[${index}].t8t_bracket_round_id`}
                                                                        name={`L_bracket_rounds[${index}].bracket_elimination_round_id`}
                                                                    />
                                                                    <Controller
                                                                        as={
                                                                            <Textfield
                                                                                customContainerClass={
                                                                                    classes.displayWidth0
                                                                                }
                                                                                name={`L_bracket_rounds[${index}].bracket_type`}
                                                                                type="hidden"
                                                                            />
                                                                        }
                                                                        defaultValue={item.bracket_type}
                                                                        control={control}
                                                                        name={`L_bracket_rounds[${index}].bracket_type`}
                                                                    />
                                                                    <Controller
                                                                        as={
                                                                            <Textfield
                                                                                customContainerClass={
                                                                                    classes.displayWidth0
                                                                                }
                                                                                name={`L_bracket_rounds[${index}].round_no`}
                                                                                type="hidden"
                                                                            />
                                                                        }
                                                                        defaultValue={`${index + 1}`}
                                                                        control={control}
                                                                        name={`L_bracket_rounds[${index}].round_no`}
                                                                    />
                                                                    <Controller
                                                                        as={
                                                                            <Textfield
                                                                                customContainerClass={
                                                                                    classes.displayWidth0
                                                                                }
                                                                                name={`L_bracket_rounds[${index}].is_pause`}
                                                                                type="hidden"
                                                                            />
                                                                        }
                                                                        defaultValue={`${item.is_pause}`}
                                                                        control={control}
                                                                        name={`L_bracket_rounds[${index}].is_pause`}
                                                                    />
                                                                    <div className={classes.tableTitle}>
                                                                        {intl.formatMessage({
                                                                            id:
                                                                                'Tournament-Management-Bracket-Settings-Single-Elimination_Start Date'
                                                                        })}
                                                                    </div>
                                                                    <Controller
                                                                        as={
                                                                            <CalendarDatePicker
                                                                                name={`L_bracket_rounds[${index}].start_at`}
                                                                                theme="dark"
                                                                                disabledDateTime={moment(
                                                                                    event_start_at
                                                                                ).add(-1, 'days')}
                                                                                isShowTime={true}
                                                                                currentLocale={currentLocale}
                                                                            ></CalendarDatePicker>
                                                                        }
                                                                        control={control}
                                                                        rules={{
                                                                            required: true
                                                                        }}
                                                                        defaultValue={
                                                                            item.start_at === null
                                                                                ? ''
                                                                                : moment(item.start_at)
                                                                        }
                                                                        name={`L_bracket_rounds[${index}].start_at`}
                                                                    />
                                                                    <small>
                                                                        {/* %Time Zone% */}
                                                                        {/* {TimeZoneDisplay} */}
                                                                    </small>
                                                                </td>
                                                                <td>
                                                                    <div className={classes.boSelect}>
                                                                        <Controller
                                                                            as={
                                                                                <Dropdown
                                                                                    options={t8tBo}
                                                                                    defaultKey={item.game_bo}
                                                                                />
                                                                            }
                                                                            defaultValue={item.game_bo}
                                                                            control={control}
                                                                            rules={{
                                                                                required: true
                                                                            }}
                                                                            name={`L_bracket_rounds[${index}].game_bo`}
                                                                            onChange={e => {
                                                                                return e[0].key;
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            );
                                        })}
                                    {/* --------E------Loser  roundList--------- */}
                                    {bracket_type === 'double' && (
                                        <div className={classes.block}>
                                            <div className={classes.title}>
                                                {intl.formatMessage({ id: 'Round-Schedule-Overview_Grand Final' })}
                                            </div>
                                        </div>
                                    )}
                                    {/* --------S------Grand roundList--------- */}
                                    {bracket_type === 'double' &&
                                        GroundList.map((item, index) => {
                                            return (
                                                <div className={classes.round} key={index + 'G'}>
                                                    <table className={cx(classes.table, classes.bestAllRounds)}>
                                                        <tbody>
                                                            <tr>
                                                                <td>
                                                                    <div className={classes.tableRound}>
                                                                        <span>
                                                                            {intl.formatMessage({
                                                                                id:
                                                                                    'Tournament-Management-Bracket-Settings-Single-Elimination_Round'
                                                                            })}
                                                                        </span>
                                                                        {index + 1}
                                                                    </div>
                                                                </td>
                                                                <td>
                                                                    <Controller
                                                                        as={
                                                                            <Textfield
                                                                                customContainerClass={
                                                                                    classes.displayWidth0
                                                                                }
                                                                                name={`G_bracket_rounds[${index}].bracket_elimination_round_id`}
                                                                                type="hidden"
                                                                            />
                                                                        }
                                                                        defaultValue={item.bracket_elimination_round_id}
                                                                        control={control}
                                                                        name={`G_bracket_rounds[${index}].bracket_elimination_round_id`}
                                                                    />
                                                                    <Controller
                                                                        as={
                                                                            <Textfield
                                                                                customContainerClass={
                                                                                    classes.displayWidth0
                                                                                }
                                                                                name={`G_bracket_rounds[${index}].bracket_type`}
                                                                                type="hidden"
                                                                            />
                                                                        }
                                                                        defaultValue={item.bracket_type}
                                                                        control={control}
                                                                        name={`G_bracket_rounds[${index}].bracket_type`}
                                                                    />
                                                                    <Controller
                                                                        as={
                                                                            <Textfield
                                                                                customContainerClass={
                                                                                    classes.displayWidth0
                                                                                }
                                                                                name={`G_bracket_rounds[${index}].round_no`}
                                                                                type="hidden"
                                                                            />
                                                                        }
                                                                        defaultValue={`${index + 1}`}
                                                                        control={control}
                                                                        name={`G_bracket_rounds[${index}].round_no`}
                                                                    />
                                                                    <Controller
                                                                        as={
                                                                            <Textfield
                                                                                customContainerClass={
                                                                                    classes.displayWidth0
                                                                                }
                                                                                name={`G_bracket_rounds[${index}].is_pause`}
                                                                                type="hidden"
                                                                            />
                                                                        }
                                                                        defaultValue={`${item.is_pause}`}
                                                                        control={control}
                                                                        name={`G_bracket_rounds[${index}].is_pause`}
                                                                    />
                                                                    <div className={classes.tableTitle}>
                                                                        {intl.formatMessage({
                                                                            id:
                                                                                'Tournament-Management-Bracket-Settings-Single-Elimination_Start Date'
                                                                        })}
                                                                    </div>
                                                                    <Controller
                                                                        as={
                                                                            <CalendarDatePicker
                                                                                name={`G_bracket_rounds[${index}].start_at`}
                                                                                theme="dark"
                                                                                disabledDateTime={moment(
                                                                                    event_start_at
                                                                                ).add(-1, 'days')}
                                                                                isShowTime={true}
                                                                                currentLocale={currentLocale}
                                                                            ></CalendarDatePicker>
                                                                        }
                                                                        control={control}
                                                                        rules={{
                                                                            required: true
                                                                        }}
                                                                        defaultValue={
                                                                            item.start_at === null
                                                                                ? ''
                                                                                : moment(item.start_at)
                                                                        }
                                                                        name={`G_bracket_rounds[${index}].start_at`}
                                                                    />
                                                                    <small>
                                                                        {/* %Time Zone% */}
                                                                        {/* {TimeZoneDisplay} */}
                                                                    </small>
                                                                </td>
                                                                <td>
                                                                    <div className={classes.boSelect}>
                                                                        <Controller
                                                                            as={
                                                                                <Dropdown
                                                                                    options={t8tBo}
                                                                                    name={`G_bracket_rounds[${index}].game_bo`}
                                                                                    defaultKey={item.game_bo}
                                                                                />
                                                                            }
                                                                            defaultValue={item.game_bo}
                                                                            control={control}
                                                                            rules={{ required: true }}
                                                                            name={`G_bracket_rounds[${index}].game_bo`}
                                                                            onChange={event => {
                                                                                return event[0].key;
                                                                            }}
                                                                        />
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            );
                                        })}
                                    {/* --------E------Grand roundList--------- */}
                                </div>
                            </CardBody>
                        </Card>
                        <div className={classes.bracketTitle}></div>

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
                                        onClick={() => editClickBack(3)}
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
            )}
        </>
    );
};

export default Basic;
