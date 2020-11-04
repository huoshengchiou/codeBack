import React, { useState, useEffect, useRef, useReducer, useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import moment from 'moment-timezone';
import classes from './styles.module.scss';
import classNames from 'classnames/bind';

import Card, { CardHeader, CardBody } from 'components/DesignSystem/DataDisplay/Card';

//design time format
import { formatDateTime } from 'utils/formattersV2/date';

import { from } from 'rxjs';
import { postGenJoinCode } from 'apis/tournament';

import RadioGroup from 'components/DesignSystem/Input/RadioButton/RadioGroup';
import Radio from 'components/DesignSystem/Input/RadioButton/Radio';

import Switch from 'components/DesignSystem/Input/Switch';
import Button from 'components/DesignSystem/Input/Button';
import CalendarDatePicker from 'components/DesignSystem/Input/DatePicker/CalendarDatePicker';
import Textfield from 'components/DesignSystem/Input/TextField';
import { EditManageContext } from '../../Context';
const cx = classNames.bind(classes);

const PublishSettings = prop => {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const {
        t8tDetail,
        paramList,
        match,
        configData,
        intl,
        authData,
        saveT8tDetail,
        editClickBack,
        getDatepickerDisable
    } = useContext(EditManageContext);

    const { apiWithTokenWrapper } = authData;
    const { currentLocale } = configData;
    const {
        event_start_at,
        registration_start_at,
        registration_end_at,
        open_rule,
        is_join_code,
        is_published,
        is_create_finished,
        status
    } = t8tDetail;
    const { t8t_ticket_type, t8t_open_rule } = paramList.t8t_params;

    const [list, setList] = useState([]);
    const [openRule, setOpenRule] = useState([]);
    const [ticketTypeList, setTicketTypeList] = useState([]);
    const [isJoinCode, setIsJoinCode] = useState(is_join_code);
    const [isfree, setIsFree] = useState(true);
    const [openDate, setOpenDate] = useState(registration_start_at);
    const [closeDate, setCloseDate] = useState(registration_end_at);

    const { handleSubmit, watch, getValues, control, formState } = useForm({ mode: 'onChange' });
    const { isValid } = formState;

    const fetchListener = useRef();

    useEffect(() => {
        setOpenRule(
            t8t_open_rule.map(item => {
                let subValue = '';
                let value = '';
                switch (item) {
                    case 'public':
                        value = intl.formatMessage({
                            id: 'Tournament-Management-Bracket-Settings-Publish-Settings_Public'
                        });
                        subValue = intl.formatMessage({
                            id: 'Tournament-Management-Bracket-Settings-Publish-Settings_[content]Public'
                        });
                        break;
                    case 'private':
                        value = intl.formatMessage({
                            id: 'Tournament-Management-Bracket-Settings-Publish-Settings_Private'
                        });
                        subValue = intl.formatMessage({
                            id: 'Tournament-Management-Bracket-Settings-Publish-Settings_[content]Private'
                        });
                        break;
                    case 'private_import':
                        value = intl.formatMessage({
                            id: 'Tournament-Management-Bracket-Settings-Publish-Settings_Private by Import'
                        });
                        subValue = intl.formatMessage({
                            id: 'Tournament-Management-Bracket-Settings-Publish-Settings_[content]Private by Import'
                        });
                        break;
                }
                return { key: item, value: value, subValue: subValue };
            })
        );
        setTicketTypeList(
            t8t_ticket_type.map(item => {
                let value = '';
                switch (item) {
                    case 'free':
                        value = intl.formatMessage({
                            id: 'Tournament-Management-Bracket-Settings-Publish-Settings_For Free'
                        });
                        break;
                    case 'using_stargems':
                        value = intl.formatMessage({
                            id: 'Tournament-Management-Bracket-Settings-Publish-Settings_Using StarGems'
                        });
                        break;
                    case 'using_startcoins':
                        value = intl.formatMessage({
                            id: 'Tournament-Management-Bracket-Settings-Publish-Settings_Using StarCoins'
                        });
                        break;
                }
                return { key: item, value: value };
            })
        );
    }, [t8tDetail]);

    const onSubmit = data => {
        let updateData = { ...t8tDetail };
        Object.keys(data).forEach(key => {
            updateData[key] = data[key];
        });
        updateData.indexKey = -1;
        updateData.is_create_finished = true;

        saveT8tDetail(updateData);
    };

    const addJoinCodeList = () => {
        let count = getValues('join_code_count');
        fetchListener.current = from(
            apiWithTokenWrapper(postGenJoinCode, { count: count }, match.params?.t8t_serial)
        ).subscribe(res => {
            if (res.status === 200) {
                if (res.data.header.status.toUpperCase() === 'OK') {
                    list.push(...res.data.body.t8t_joincodes);
                    setList(list);
                    forceUpdate();
                }
            }
        });
    };

    const deleteJoinCodeList = (item, index) => {
        let items = list.filter((t, i) => {
            return i !== index;
        });

        setList(items);
    };

    // 現在只有單一選項，先不測試。
    const checkIsFree = type => {
        setIsFree(false);
        if (type === 'free') {
            setIsFree(true);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={classes.basicsCon}>
                    <Card size="col-9" customClass={classes.cardWrapper}>
                        <CardHeader>
                            {intl.formatMessage({
                                id: 'Tournament-Management-Bracket-Settings-Publish-Settings_Registration Time'
                            })}
                        </CardHeader>
                        <CardBody customClass={classes.cardBody}>
                            <div className={classes.basicsInner}>
                                <div className={cx('group')}>
                                    <div className={classes.bold}>
                                        {intl.formatMessage({
                                            id:
                                                'Tournament-Management-Bracket-Settings-Publish-Settings_Tournament Start Time'
                                        })}
                                    </div>
                                    <div className={classes.inner}>
                                        <span className={classes.blue}>
                                            {formatDateTime(event_start_at)}
                                            {/* %Date%, %Time% */}
                                        </span>
                                    </div>
                                </div>
                                <div className={classes.line}></div>
                                <table className={classes.basicsTable}>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className={classes.basicsTableWord}>
                                                    {intl.formatMessage({
                                                        id:
                                                            'Tournament-Management-Bracket-Settings-Publish-Settings_Open Date'
                                                    })}
                                                </div>
                                                <Controller
                                                    as={
                                                        <CalendarDatePicker
                                                            name={`registration_start_at`}
                                                            theme="dark"
                                                            disabledDateTime={moment().add(-1, 'day')}
                                                            endDisabledDateTime={
                                                                closeDate !== null
                                                                    ? moment(event_start_at).diff(
                                                                          moment(closeDate),
                                                                          'hours'
                                                                      ) > 0
                                                                        ? moment(closeDate)
                                                                        : moment(event_start_at)
                                                                    : moment(event_start_at)
                                                            }
                                                            isShowTime={true}
                                                            currentLocale={currentLocale}
                                                            disabled={getDatepickerDisable(status)}
                                                        ></CalendarDatePicker>
                                                    }
                                                    control={control}
                                                    defaultValue={
                                                        registration_start_at === null
                                                            ? ''
                                                            : moment(registration_start_at)
                                                    }
                                                    rules={{
                                                        required: true
                                                    }}
                                                    name={`registration_start_at`}
                                                    onChange={e => {
                                                        setOpenDate(e[0]);
                                                        return e[0];
                                                    }}
                                                />
                                                <div className={classes.basicsGrayWord}>
                                                    {/* Display %Time Zone% */}
                                                    {/* {TimeZoneDisplay} */}
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                                <div className={classes.line}></div>
                                <table className={classes.basicsTable}>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <div className={classes.basicsTableWord}>
                                                    {intl.formatMessage({
                                                        id:
                                                            'Tournament-Management-Bracket-Settings-Publish-Settings_Close Date'
                                                    })}
                                                </div>
                                                <Controller
                                                    as={
                                                        <CalendarDatePicker
                                                            name={`registration_end_at`}
                                                            theme="dark"
                                                            disabledDateTime={
                                                                openDate !== null
                                                                    ? moment(event_start_at).diff(
                                                                          moment(openDate),
                                                                          'hours'
                                                                      ) < 24
                                                                        ? moment(openDate).add(-1, 'days')
                                                                        : moment(openDate)
                                                                    : ''
                                                            }
                                                            endDisabledDateTime={moment(event_start_at)}
                                                            isShowTime={true}
                                                            currentLocale={currentLocale}
                                                            disabled={getDatepickerDisable(status)}
                                                        ></CalendarDatePicker>
                                                    }
                                                    control={control}
                                                    defaultValue={
                                                        registration_end_at === null ? '' : moment(registration_end_at)
                                                    }
                                                    rules={{
                                                        required: true
                                                    }}
                                                    name={`registration_end_at`}
                                                    onChange={e => {
                                                        setCloseDate(e[0]);
                                                        return e[0];
                                                    }}
                                                />
                                                <div className={classes.basicsGrayWord}>
                                                    {/* Display %Time Zone% */}
                                                    {/* {TimeZoneDisplay} */}
                                                </div>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </CardBody>
                    </Card>
                    <Card size="col-9" customClass={classes.cardWrapper}>
                        <CardHeader>
                            {intl.formatMessage({
                                id: 'Tournament-Management-Bracket-Settings-Publish-Settings_Ticket'
                            })}
                        </CardHeader>
                        <CardBody customClass={classes.cardBody}>
                            <div className={classes.basicsInner}>
                                <div className={cx('group')}>
                                    <div className={classes.bold}>
                                        {intl.formatMessage({
                                            id: 'Tournament-Management-Bracket-Settings-Publish-Settings_Charge Rule'
                                        })}
                                    </div>
                                    <ul>
                                        <li>
                                            <Controller
                                                as={
                                                    <RadioGroup defaultValue={watch('ticket_type')}>
                                                        {ticketTypeList.map((item, index) => {
                                                            return (
                                                                <Radio key={index} value={item.key}>
                                                                    {item.value}
                                                                </Radio>
                                                            );
                                                        })}
                                                    </RadioGroup>
                                                }
                                                control={control}
                                                name="ticket_type"
                                                defaultValue={'free'}
                                                onChange={e => {
                                                    checkIsFree(e[0]);
                                                    return e[0];
                                                }}
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div className={classes.line}></div>
                                {!isfree ? (
                                    <div className={cx('group')}>
                                        <div className={classes.bold}>
                                            {intl.formatMessage({
                                                id: 'Tournament-Management-Bracket-Settings-Publish-Settings_Cost'
                                            })}
                                        </div>
                                        <div className={classes.inner}>
                                            <Controller
                                                as={
                                                    <Textfield
                                                        name={`ticket_price`}
                                                        customContainerClass={classes.pubInput}
                                                        placeholder={''}
                                                        theme="dark"
                                                        type="text"
                                                    />
                                                }
                                                defaultValue={'free'}
                                                control={control}
                                                name={`ticket_price`}
                                            />
                                            <span className={classes.spanUp}>
                                                {intl.formatMessage({
                                                    id:
                                                        'Tournament-Management-Bracket-Settings-Publish-Settings_StarGems Per Participant'
                                                })}
                                            </span>
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
                                id: 'Tournament-Management-Bracket-Settings-Publish-Settings_Open Rule'
                            })}{' '}
                        </CardHeader>
                        <CardBody customClass={classes.cardBody}>
                            <div className={classes.basicsInner}>
                                <div className={cx('group')}>
                                    <div className={classes.bold}>
                                        {intl.formatMessage({
                                            id:
                                                'Tournament-Management-Bracket-Settings-Publish-Settings_setup the tournament as'
                                        })}
                                    </div>
                                    <ul className={classes.horizontalUl}>
                                        <li>
                                            <Controller
                                                as={
                                                    <RadioGroup
                                                        defaultValue={watch('open_rule')}
                                                        customClass={classes.typeRadionGroup}
                                                        isVertical={true}
                                                    >
                                                        {openRule.map((item, index) => {
                                                            return (
                                                                <Radio
                                                                    key={index + 'op'}
                                                                    value={item.key}
                                                                    subvalue={item.subValue}
                                                                >
                                                                    {item.value}
                                                                </Radio>
                                                            );
                                                        })}
                                                    </RadioGroup>
                                                }
                                                control={control}
                                                defaultValue={open_rule ? open_rule : 'public'}
                                                name="open_rule"
                                            />
                                        </li>
                                    </ul>
                                </div>
                                <div className={classes.line}></div>
                                <div className={classes.group}>
                                    <div className={classes.bold}>
                                        {intl.formatMessage({
                                            id: 'Tournament-Management-Bracket-Settings-Publish-Settings_Join Code'
                                        })}
                                    </div>
                                    <div className={classes.inner}>
                                        <Controller
                                            as={<Switch name={`is_join_code`} />}
                                            defaultValue={is_join_code}
                                            control={control}
                                            name={`is_join_code`}
                                            onChange={e => {
                                                let flag = getValues('is_join_code');
                                                setIsJoinCode(!flag);
                                                return !flag;
                                            }}
                                        />
                                    </div>
                                    {isJoinCode ? (
                                        <>
                                            <div
                                                className={cx(classes.inner, classes.displayflex, classes.marginTop15)}
                                            >
                                                <Controller
                                                    as={
                                                        <Textfield
                                                            name={`join_code_count`}
                                                            customContainerClass={classes.pubInput2}
                                                            placeholder={''}
                                                            theme="dark"
                                                            type="text"
                                                        />
                                                    }
                                                    defaultValue={''}
                                                    control={control}
                                                    name={`join_code_count`}
                                                />
                                                <Button
                                                    title={intl.formatMessage({ id: 'TournamentJoin_[btn]Add' })}
                                                    size="sm_1"
                                                    onClick={() => addJoinCodeList()}
                                                />
                                            </div>
                                            <table className={classes.opaTable}>
                                                <tbody>
                                                    <tr>
                                                        <td>
                                                            {intl.formatMessage({
                                                                id:
                                                                    'Tournament-Management-Bracket-Settings-Publish-Settings_Code'
                                                            })}
                                                        </td>
                                                        <td>
                                                            {intl.formatMessage({
                                                                id:
                                                                    'Tournament-Management-Bracket-Settings-Publish-Settings_Usage'
                                                            })}
                                                        </td>
                                                        <td>
                                                            <Button
                                                                title={intl.formatMessage({
                                                                    id:
                                                                        'Tournament-Management-Bracket-Settings-Publish-Settings_[btn]Export'
                                                                })}
                                                                size="sm_1"
                                                            />
                                                        </td>
                                                    </tr>
                                                    {list.map((item, index) => {
                                                        return (
                                                            <tr key={index}>
                                                                <td>{item.join_code}</td>
                                                                <td>{item.usage}</td>
                                                                <td></td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                    <Card size="col-9" customClass={classes.cardWrapper}>
                        <CardHeader>
                            {intl.formatMessage({ id: 'Tournament-Management-Page-Clone-Tournament_Publish' })}
                        </CardHeader>
                        <CardBody customClass={classes.cardBody}>
                            <div className={classes.basicsInner}>
                                <div className={classes.group}>
                                    <div className={classes.bold}>
                                        {intl.formatMessage({
                                            id:
                                                'Tournament-Management-Bracket-Settings-Publish-Settings_Publish This Tournament'
                                        })}
                                    </div>
                                    <div className={classes.inner}>
                                        <Controller
                                            as={<Switch name={`is_published`} />}
                                            defaultValue={is_published}
                                            control={control}
                                            name={`is_published`}
                                        />
                                    </div>
                                    <div className={classes.inner}>
                                        {intl.formatMessage({
                                            id:
                                                'Tournament-Management-Bracket-Settings-Publish-Settings_[content]Publish This Tournament'
                                        })}
                                    </div>
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
                                // 需要joincode但沒有list
                                disabled={(isJoinCode && list.length === 0) || !isValid}
                                type="submit"
                            />
                        ) : (
                            <>
                                <Button
                                    title={intl.formatMessage({
                                        id: 'Tournament-Management-Create-New-Tournament_[btn]Back'
                                    })}
                                    theme="dark_2"
                                    onClick={() =>
                                        editClickBack(t8tDetail.t8t_lite.club_sales_type === 'general' ? 7 : 9)
                                    }
                                />
                                <Button
                                    title={intl.formatMessage({
                                        id: 'Tournament-Management-Bracket-Settings-Publish-Settings_[btn]Finish'
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

export default PublishSettings;
