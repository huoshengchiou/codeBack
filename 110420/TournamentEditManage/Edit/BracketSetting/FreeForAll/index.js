import React, { useState, useEffect, useReducer, useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import moment from 'moment-timezone';
import Card, { CardHeader, CardBody } from 'components/DesignSystem/DataDisplay/Card';

import classes from '../styles.module.scss';

import classNames from 'classnames/bind';
import Button from 'components/DesignSystem/Input/Button';
import Switch from 'components/DesignSystem/Input/Switch';
import Dropdown from 'components/DesignSystem/Input/Dropdown_V3';
import SortTable from 'components/DesignSystem/DataDisplay/SortTable_V2';
import Tooltip from 'components/DesignSystem/DataDisplay/Tooltip';

import Textfield from 'components/DesignSystem/Input/TextField';
import CalendarDatePicker from 'components/DesignSystem/Input/DatePicker/CalendarDatePicker';

import { EditManageContext } from '../../../Context';

const cx = classNames.bind(classes);

const FreeForAll = prop => {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const { t8tDetail, paramList, configData, intl, saveT8tDetail, resetSetElimination, editClickBack } = useContext(
        EditManageContext
    );

    const { currentLocale } = configData;
    const { t8t_score_type } = paramList.t8t_params;
    const {
        bracket_info,
        bracket_rounds,
        is_create_finished,
        registration_end_at,
        event_start_at,
        bracket_ranks,
        t8t_lite
    } = t8tDetail;
    const { club_sales_type } = t8t_lite;
    const [isInGameRank, setIsInGameRank] = useState(bracket_info.is_in_game_rank);
    const [isCreateStage, setIsCreateStage] = useState(bracket_info.is_stage);

    //arr共用
    //FFA stageList
    const [roundList, setRoundList] = useState(bracket_rounds);

    const scoreTypeList = [
        {
            key: null,
            value: intl.formatMessage({ id: 'common_please_select' })
        }
    ].concat(
        t8t_score_type.map((item, index) => {
            return {
                id: index,
                key: `${item}`,
                value: intl.formatMessage({ id: `Tournament-Management-Bracket-Score-Rule_${item}` })
            };
        })
    );

    const sortKeyList = [
        { sortKey: 'number', intlKey: 'Tournament-Management-Bracket-FFA_Rank', sortable: false, width_pct: '25%' },
        { sortKey: 'name', intlKey: 'Tournament-Management-Bracket-FFA_Score', sortable: false, width_pct: '75%' }
    ];

    const [rankData, setRankData] = useState([]);
    const [sortKey, setSortKey] = useState('name');
    const [desc, setDesc] = useState(true);

    const { handleSubmit, setValue, getValues, triggerValidation, control, formState } = useForm({ mode: 'onChange' });
    const { isValid } = formState;
    useEffect(() => {
        if (bracket_ranks.length > 0) {
            setRank();
        }
    }, []);

    //press to fire
    const onSubmit = data => {
        let updateData = { ...t8tDetail };
        Object.keys(data).forEach(key => {
            updateData[key] = data[key];
        });

        updateData.indexKey = 7;
        saveT8tDetail(updateData);
    };

    const validateWinnerSize = (participantPerGroup, winnerPerGroup) => {
        const limitWinnerPerGroup = Math.floor(participantPerGroup / 2);
        if (winnerPerGroup <= 0 || winnerPerGroup > limitWinnerPerGroup) {
            return false;
        }
        return true;
    };

    const getSizeRule = () => {
        let rule = { required: true };
        rule.min = 3;
        rule.max = 64;
        if (club_sales_type === 'partner') {
            rule.max = 128;
        }
        return rule;
    };

    const changeCreateRoundList = (bracketSize, participantPerGroup, winnerPerGroup, isflag) => {
        setRoundList([]);
        triggerValidation();

        if (+bracketSize <= 0 || bracketSize === '') {
            return;
        }

        if (+bracketSize < 3) {
            return;
        }

        switch (club_sales_type) {
            case 'partner':
                if (+bracketSize > 128) {
                    return;
                }
                break;

            default:
                if (+bracketSize > 64) {
                    return;
                }
                break;
        }

        let rlists = [];
        let count = 1;

        const setCount = num => {
            if (num <= 0) {
                return;
            }

            let stageCount = Math.floor(num / participantPerGroup);
            let winnerCount = stageCount * winnerPerGroup;
            count = count + 1;
            if (participantPerGroup >= winnerCount) {
                return;
            }

            return setCount(winnerCount);
        };

        if (isflag) {
            if (+participantPerGroup <= 0 || participantPerGroup === '') {
                return;
            }
            if (+participantPerGroup > +bracketSize) {
                return;
            }
            if (+winnerPerGroup <= 0 || winnerPerGroup === '') {
                return;
            }
            if (+winnerPerGroup >= +participantPerGroup) {
                return;
            }
            if (!validateWinnerSize(participantPerGroup, winnerPerGroup)) {
                return;
            }
            setCount(bracketSize);
        }

        rlists = [...Array(count).keys()].map((item, index) => {
            return {
                bracket_ffa_stage_id: '',
                stage_no: index + 1,
                games: 1,
                start_at: null,
                is_pause: false
            };
        });

        setRoundList(rlists);
    };

    const setRank = type => {
        let dataList = [];
        setRankData(dataList);
        if (bracket_ranks.length > 0) {
            dataList = bracket_ranks;
        }

        if (type === 0) {
            let rankCount = getValues('inGameCount');
            dataList = [...Array(+rankCount).keys()];
        }

        const advScort = [10, 6, 5, 4, 3, 2, 1, 1, 0];

        let list = dataList.map((item, index) => {
            return {
                number: index + 1,
                name: (
                    <>
                        <Controller
                            as={
                                <Textfield
                                    name={`bracket_ranks[${index}].bracket_ffa_battle_royale_rank_id`}
                                    type="hidden"
                                />
                            }
                            defaultValue={`${
                                item.bracket_ffa_battle_royale_rank_id ? item.bracket_ffa_battle_royale_rank_id : ''
                            }`}
                            control={control}
                            name={`bracket_ranks[${index}].bracket_ffa_battle_royale_rank_id`}
                        />
                        <Controller
                            as={<Textfield name={`bracket_ranks[${index}].rank`} type="hidden" />}
                            defaultValue={`${index + 1}`}
                            control={control}
                            name={`bracket_ranks[${index}].rank`}
                        />
                        {setValue(
                            `bracket_ranks[${index}].score`,
                            `${item.score ? item.score : index + 1 > 8 ? advScort[8] : advScort[index]}`
                        )}
                        <Controller
                            as={
                                <Textfield
                                    theme="dark"
                                    name={`bracket_ranks[${index}].score`}
                                    placeholder={''}
                                    type="text"
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
                            defaultValue={`${item.score ? item.score : index + 1 > 8 ? advScort[8] : advScort[index]}`}
                            control={control}
                            rules={{
                                required: true
                            }}
                            name={`bracket_ranks[${index}].score`}
                        />
                    </>
                )
            };
        });
        setRankData(list);
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={classes.bracketSettings}>
                    <div className={classes.btnWrapper}>
                        <Button
                            title={intl.formatMessage({
                                id: 'Tournament-Management-Bracket-Settings-Single-Elimination_Delete Bracket'
                            })}
                            theme="dark_2"
                            onClick={() => resetSetElimination(null)}
                        />
                    </div>
                    <Card size="col-9">
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
                                    <div className={classes.blue}>
                                        {intl.formatMessage({ id: 'Tournament-Main-Page_Free For All' })}
                                    </div>
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
                                <div className={classes.block}>
                                    <div className={classes.title}>
                                        {intl.formatMessage({
                                            id: 'Tournament-Management-Bracket-Settings-Single-Elimination_Bracket Size'
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
                                                    ? '0'
                                                    : `${bracket_info.bracket_size}`
                                            }
                                            control={control}
                                            rules={getSizeRule()}
                                            name={`bracket_info.bracket_size`}
                                            onChange={e => {
                                                if (e[0].target.value !== '' && +e[0].target.value <= 0) {
                                                    return '0';
                                                }

                                                changeCreateRoundList(
                                                    e[0].target.value,
                                                    getValues(`bracket_info.participant_per_group`),
                                                    getValues(`bracket_info.winner_per_group`),
                                                    isCreateStage
                                                );
                                                return e[0].target.value;
                                            }}
                                        />
                                        {intl.formatMessage({
                                            id: 'Tournament-Management-Bracket-Settings-Single-Elimination_of players'
                                        })}
                                    </div>
                                </div>

                                <div className={classes.block}>
                                    <div className={classes.title}>
                                        {intl.formatMessage({ id: 'Tournament-Management-Bracket-FFA_Create Stage' })}
                                        <Tooltip
                                            info={intl.formatMessage({
                                                id: 'Tournament-Management-Bracket-FFA_[tooltips]Create Stage'
                                            })}
                                        />
                                    </div>
                                    <div className={classes.origal}>
                                        <Controller
                                            as={<Switch name={`bracket_info.is_stage`} />}
                                            defaultValue={
                                                bracket_info.is_stage === null ? false : bracket_info.is_stage
                                            }
                                            control={control}
                                            name={`bracket_info.is_stage`}
                                            onChange={e => {
                                                let flag = getValues('bracket_info.is_stage');
                                                setIsCreateStage(!flag);
                                                bracket_info.winner_per_group = `0`;
                                                bracket_info.participant_per_group = `0`;
                                                if (!flag === false) {
                                                    bracket_info.participant_per_group = bracket_info.bracket_size;
                                                }
                                                let bracketSize = getValues(`bracket_info.bracket_size`);
                                                changeCreateRoundList(bracketSize, 0, 0, !flag);

                                                return !flag;
                                            }}
                                        />
                                    </div>
                                </div>
                                {isCreateStage ? (
                                    <>
                                        <div className={classes.block}>
                                            <div className={classes.title}>
                                                {intl.formatMessage({
                                                    id: 'Tournament-Management-Bracket-FFA_Participants Per Group'
                                                })}
                                            </div>
                                            <div className={classes.origal}>
                                                <div className={classes.autocomplete}>
                                                    <Controller
                                                        as={
                                                            <Textfield
                                                                theme="dark"
                                                                customContainerClass={classes.limitinput}
                                                                name={`bracket_info.participant_per_group`}
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
                                                            bracket_info.participant_per_group === null
                                                                ? '1'
                                                                : `${bracket_info.participant_per_group}`
                                                        }
                                                        control={control}
                                                        rules={{
                                                            required: true,
                                                            validate: {
                                                                validate: value => {
                                                                    let size = getValues(`bracket_info.bracket_size`);
                                                                    if (+value < 0) {
                                                                        return false;
                                                                    }
                                                                    if (size > 0) {
                                                                        if (+value >= +size) {
                                                                            return false;
                                                                        }
                                                                    }
                                                                    return true;
                                                                }
                                                            }
                                                        }}
                                                        name={`bracket_info.participant_per_group`}
                                                        onChange={e => {
                                                            if (e[0].target.value !== '' && +e[0].target.value < 1) {
                                                                return `1`;
                                                            }
                                                            changeCreateRoundList(
                                                                getValues(`bracket_info.bracket_size`),
                                                                e[0].target.value,
                                                                getValues(`bracket_info.winner_per_group`),
                                                                isCreateStage
                                                            );
                                                            return e[0].target.value;
                                                        }}
                                                    />
                                                </div>
                                                <span>
                                                    {intl.formatMessage({
                                                        id: 'Tournament-Management-Bracket-FFA_# of Competition'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                        <div className={classes.block}>
                                            <div className={classes.title}>
                                                {intl.formatMessage({
                                                    id: 'Tournament-Management-Bracket-FFA_Winners Per Group'
                                                })}
                                                <Tooltip
                                                    info={intl.formatMessage({
                                                        id:
                                                            'Tournament-Management-Bracket-FFA_[tooltips]Winners Per Group'
                                                    })}
                                                />
                                            </div>
                                            <div className={classes.origal}>
                                                <div className={classes.autocomplete}>
                                                    <Controller
                                                        as={
                                                            <Textfield
                                                                theme="dark"
                                                                name={`bracket_info.winner_per_group`}
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
                                                            bracket_info.winner_per_group === null
                                                                ? '1'
                                                                : `${bracket_info.winner_per_group}`
                                                        }
                                                        control={control}
                                                        rules={{
                                                            required: true,
                                                            validate: {
                                                                validate: value => {
                                                                    let size = getValues(`bracket_info.bracket_size`);
                                                                    let perGroup = getValues(
                                                                        `bracket_info.participant_per_group`
                                                                    );
                                                                    if (+value < 0) {
                                                                        return false;
                                                                    }
                                                                    if (size > 0) {
                                                                        if (+value >= +size) {
                                                                            return false;
                                                                        }
                                                                    }
                                                                    if (+perGroup > 0) {
                                                                        if (+value >= +perGroup) {
                                                                            return false;
                                                                        }
                                                                        if (+value > +Math.floor(perGroup / 2)) {
                                                                            return false;
                                                                        }
                                                                    }
                                                                    return true;
                                                                }
                                                            }
                                                        }}
                                                        name={`bracket_info.winner_per_group`}
                                                        onChange={e => {
                                                            if (e[0].target.value !== '' && +e[0].target.value < 1) {
                                                                return `1`;
                                                            }

                                                            changeCreateRoundList(
                                                                getValues(`bracket_info.bracket_size`),
                                                                getValues(`bracket_info.participant_per_group`),
                                                                e[0].target.value,
                                                                isCreateStage
                                                            );
                                                            return e[0].target.value;
                                                        }}
                                                    />

                                                    {/* {errors['bracket_info']?.winner_per_group && <p>{errors['bracket_info'].winner_per_group.message}</p>} */}
                                                </div>
                                                <span>
                                                    {intl.formatMessage({
                                                        id: 'Tournament-Management-Bracket-FFA_# of Competition'
                                                    })}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                ) : (
                                    ''
                                )}

                                <div className={classes.block}>
                                    <div className={classes.title}>
                                        {intl.formatMessage({ id: 'Tournament-Management-Bracket-FFA_Score Type' })}
                                    </div>
                                    <div className={classes.origal}>
                                        <div className={classes.dropdown}>
                                            <Controller
                                                as={
                                                    <Dropdown
                                                        placeholder="select"
                                                        options={scoreTypeList}
                                                        defaultKey={`${bracket_info.score_type}`}
                                                    />
                                                }
                                                defaultValue={`${bracket_info.score_type}`}
                                                control={control}
                                                rules={{ required: true }}
                                                name={`bracket_info.score_type`}
                                                onChange={e => {
                                                    return e[0].key;
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={classes.block}>
                                    <div className={classes.lightBlue}>
                                        {intl.formatMessage({ id: 'Tournament-Management-Bracket-FFA_Score Rule' })}
                                    </div>
                                    <div className={classes.title}>
                                        {intl.formatMessage({ id: 'Tournament-Management-Bracket-FFA_In-Game Rank' })}
                                        <Tooltip
                                            info={intl.formatMessage({
                                                id: 'Tournament-Management-Bracket-FFA_[tooltips]In-Game Rank'
                                            })}
                                        />
                                    </div>
                                    <div className={classes.origal}>
                                        <Controller
                                            as={<Switch name={`bracket_info.is_in_game_rank`} />}
                                            defaultValue={
                                                bracket_info.is_in_game_rank === null
                                                    ? false
                                                    : bracket_info.is_in_game_rank
                                            }
                                            control={control}
                                            name={`bracket_info.is_in_game_rank`}
                                            onChange={e => {
                                                let flag = getValues('bracket_info.is_in_game_rank');
                                                setIsInGameRank(!flag);
                                                setRankData([]);
                                                return !flag;
                                            }}
                                        />
                                    </div>
                                    {isInGameRank ? (
                                        <>
                                            <div className={classes.inputAndBtn}>
                                                <div className={classes.autocomplete}>
                                                    <Controller
                                                        as={
                                                            <Textfield
                                                                theme="dark"
                                                                name={`inGameCount`}
                                                                placeholder={''}
                                                                type="text"
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
                                                        defaultValue={`0`}
                                                        control={control}
                                                        name={`inGameCount`}
                                                    />
                                                </div>
                                                <Button
                                                    size="sm_1"
                                                    title={intl.formatMessage({
                                                        id: 'Tournament-Management-Bracket-FFA_Generate'
                                                    })}
                                                    theme="dark_1"
                                                    onClick={() => setRank(0)}
                                                />
                                            </div>
                                            <div className={classes.sortTable}>
                                                <SortTable
                                                    sortKeyList={sortKeyList}
                                                    data={rankData}
                                                    sortKey={sortKey}
                                                    setSortKey={setSortKey}
                                                    desc={desc}
                                                    setDesc={setDesc}
                                                />
                                            </div>
                                        </>
                                    ) : (
                                        ''
                                    )}
                                </div>
                                <div className={classes.block}>
                                    <div className={classes.title}>
                                        {intl.formatMessage({ id: 'Tournament-Management-Bracket-FFA_Kill PTS' })}
                                    </div>
                                    <div className={classes.origal}>
                                        <div className={classes.autocomplete}>
                                            <Controller
                                                as={
                                                    <Textfield
                                                        theme="dark"
                                                        name={`bracket_info.kill_pts`}
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
                                                    bracket_info.kill_pts === 0 ? '1' : `${bracket_info.kill_pts}`
                                                }
                                                control={control}
                                                rules={{
                                                    required: true,
                                                    min: 1
                                                }}
                                                name={`bracket_info.kill_pts`}
                                                onChange={e => {
                                                    if (e[0].target.value !== '' && +e[0].target.value < 1) {
                                                        return `1`;
                                                    }
                                                    return e[0].target.value;
                                                }}
                                            />
                                        </div>
                                        <span>
                                            {intl.formatMessage({
                                                id: 'Tournament-Management-Bracket-FFA_# of Competition'
                                            })}
                                        </span>
                                    </div>
                                    {roundList.map((item, index) => {
                                        return (
                                            <div key={index}>
                                                <div className={classes.blueBlock}>
                                                    <div className={classes.stage}>
                                                        <span>
                                                            {' '}
                                                            {intl.formatMessage({
                                                                id: 'Tournament-Management-Bracket-FFA_Stage'
                                                            })}
                                                        </span>
                                                        {item.stage_no}
                                                    </div>
                                                    <div className={classes.date}>
                                                        <div className={classes.start}>
                                                            {intl.formatMessage({
                                                                id:
                                                                    'Tournament-Management-Bracket-Settings-Single-Elimination_Start Date'
                                                            })}
                                                        </div>
                                                        <div className={classes.dropdown}>
                                                            <Controller
                                                                as={
                                                                    <Textfield
                                                                        customContainerClass={classes.displayWidth0}
                                                                        name={`bracket_rounds[${index}].bracket_ffa_stage_id`}
                                                                        type="hidden"
                                                                    />
                                                                }
                                                                defaultValue={`${item.bracket_ffa_stage_id}`}
                                                                control={control}
                                                                name={`bracket_roun[${index}].bracket_ffa_stage_id`}
                                                            />
                                                            <Controller
                                                                as={
                                                                    <Textfield
                                                                        name={`bracket_rounds[${index}].stage_no`}
                                                                        type="hidden"
                                                                    />
                                                                }
                                                                defaultValue={`${index + 1}`}
                                                                control={control}
                                                                name={`bracket_rounds[${index}].stage_no`}
                                                            />
                                                            <Controller
                                                                as={
                                                                    <CalendarDatePicker
                                                                        name={`bracket_rounds[${index}].start_at`}
                                                                        theme="dark"
                                                                        disabledDateTime={moment(event_start_at).add(
                                                                            -1,
                                                                            'days'
                                                                        )}
                                                                        isShowTime={true}
                                                                        currentLocale={currentLocale}
                                                                    ></CalendarDatePicker>
                                                                }
                                                                control={control}
                                                                rules={{
                                                                    required: true
                                                                }}
                                                                defaultValue={
                                                                    item.start_at === null ? '' : moment(item.start_at)
                                                                }
                                                                name={`bracket_rounds[${index}].start_at`}
                                                            />
                                                        </div>
                                                        <div className={classes.time}></div>
                                                    </div>
                                                    <div className={classes.num}>
                                                        <div className={classes.nn}>
                                                            {intl.formatMessage({
                                                                id: 'Tournament-Management-Bracket-FFA_Number of Games'
                                                            })}
                                                            <Tooltip
                                                                info={intl.formatMessage({
                                                                    id:
                                                                        'Tournament-Management-Bracket-FFA_[tooltips]Number of Games'
                                                                })}
                                                            />
                                                        </div>
                                                        <div className={classes.rangeNum}>
                                                            <Controller
                                                                as={
                                                                    <Textfield
                                                                        theme="dark"
                                                                        name={`bracket_rounds[${index}].games `}
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
                                                                defaultValue={`${item.games}`}
                                                                control={control}
                                                                rules={{
                                                                    required: true,
                                                                    min: 1,
                                                                    max: 35
                                                                }}
                                                                name={`bracket_rounds[${index}].games`}
                                                                onChange={e => {
                                                                    if (
                                                                        e[0].target.value !== '' &&
                                                                        +e[0].target.value < 1
                                                                    ) {
                                                                        return `1`;
                                                                    }
                                                                    return e[0].target.value;
                                                                }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
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
        </>
    );
};

export default FreeForAll;
