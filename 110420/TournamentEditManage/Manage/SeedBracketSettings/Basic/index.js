import React, { useState, useEffect, useRef, useReducer, useContext } from 'react';
import { useFormsller, Controller, useForm, ErrorMessage } from 'react-hook-form';
import { withPopWindowConsumer } from 'components/layouts/PopWindow/Context';

import moment from 'moment-timezone';

import classNames from 'classnames/bind';
import classes from '../styles.module.scss';

import Button from 'components/DesignSystem/Input/Button';
import Autocomplete from 'components/DesignSystem/Input/AutoComplete_V2';
import Textfield from 'components/DesignSystem/Input/TextField';
import Loading from 'components/utils/Loading';
import SubMenuDropdown from 'components/DesignSystem/Input/SubMenuDropdown';
import DialogBlock from 'components/blocks/DialogBlock';
import Tooltip from 'components/DesignSystem/DataDisplay/Tooltip';
import Thumbnail from 'components/DesignSystem/DataDisplay/Thumbnail';
import BracketMap from '../BracketMap';
import Card, { CardHeader, CardBody } from 'components/DesignSystem/DataDisplay/Card';

import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { getSeed, postUpdateSeed, getGenBracket, getSingleBracket, exportSeed, importSeed } from 'apis/tournament';

import { EditManageContext } from '../../../Context';

const cx = classNames.bind(classes);

const Basic = props => {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);

    const { t8tDetail, intl, configData, authData, dialogData, match } = useContext(EditManageContext);

    const { getImageUrl } = configData;
    const { apiWithTokenWrapper } = authData;
    const { openDialogFunc, closeDialogFunc, components } = dialogData;
    const { openPopWindowFunc, closePopWindowFunc } = props.popWindowData;
    const { bracket_info, status, registration_end_at, event_start_at, participants_count } = t8tDetail;

    const [seedList, setSeedList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [seedCount, setSeedCount] = useState(0);
    const isGen = moment(registration_end_at) > moment();

    const feedItems = [
        {
            component: 'button',
            componentProps: {
                children: <span>{intl.formatMessage({ id: 'Manage-Tournament-Seed-Generate_Random' })}</span>,
                onClick: e => {
                    autoFeedIn(0);
                }
            }
        },
        {
            component: 'button',
            componentProps: {
                children: <span>{intl.formatMessage({ id: 'Manage-Tournament-Seed-Generate_Join Order' })}</span>,
                onClick: e => {
                    autoFeedIn(1);
                }
            }
        }
    ];

    const fetchListener = useRef();
    const { handleSubmit, errors, setValue, getValues, control, formState } = useForm({ mode: 'onChange' });

    const { isValid } = formState;

    useEffect(() => {
        getSeedList();

        return () => {
            if (fetchListener.current) {
                fetchListener.current.unsubscribe();
            }
        };
    }, [match.params.t8t_serial]);

    const getSeedList = () => {
        let data = {};
        data.t8t_serial = match.params.t8t_serial;
        fetchListener.current = from(apiWithTokenWrapper(getSeed, data))
            .pipe(
                map(res => {
                    if (res.status === 200) {
                        if (res.data.header.status.toUpperCase() === 'OK') {
                            let count = res.data.body.t8t_seed_list.filter(list => {
                                return list.seed !== null;
                            });
                            res.data.body.t8t_seed_list.forEach(item => {
                                item.disabled = isGen ? true : false;
                                item.disabled = false;
                                if (count.length === bracket_info.bracket_size) {
                                    if (item.seed === null) {
                                        item.disabled = true;
                                    }
                                }
                                if (res.data.body.t8t_seed_type === 'seed_checkin') {
                                    if (!item.is_checkin) {
                                        item.disabled = true;
                                    }
                                }
                            });
                            res.data.body.t8t_seed_list.seecount = count.length;
                        }
                    }
                    return res;
                })
            )
            .subscribe(res => {
                if (res.status === 200) {
                    if (res.data.header.status.toUpperCase() === 'OK') {
                        setSeedList(res.data.body);
                        setIsLoading(false);
                        setSeedCount(res.data.body.t8t_seed_list.seecount);
                    }
                }
            });
    };

    const onSubmit = data => {
        openDialogFunc({
            component: DialogBlock,
            componentProps: {
                type: 'warning',
                title: intl.formatMessage({
                    id: 'Manage-Tournament-Seed-Generate_Save Change'
                }),
                message: '',
                buttons: [
                    <Button
                        key="dialog_confirm"
                        title={intl.formatMessage({
                            id: 'common_confirm'
                        })}
                        onClick={() => {
                            onSave(data);
                            closeDialogFunc();
                        }}
                    />,
                    <Button
                        key="dialog_cancal"
                        title={intl.formatMessage({
                            id: 'common_cancel'
                        })}
                        onClick={() => {
                            closeDialogFunc();
                        }}
                    />
                ]
            },
            closeByButtonOnly: true
        });
    };

    const onSave = data => {
        let postData = {};
        postData.t8t_seed_list = data.t8t_seed_list.map(item => {
            if (item.seed === '') {
                item.seed = null;
            }
            return item;
        });

        fetchListener.current = from(apiWithTokenWrapper(postUpdateSeed, postData, match.params.t8t_serial)).subscribe(
            res => {
                if (res.status === 200) {
                    if (res.data.header.status.toUpperCase() === 'OK') {
                        openDialogFunc({
                            component: DialogBlock,
                            componentProps: {
                                type: 'success',
                                title: 'Success',
                                message: '',
                                buttons: [
                                    <Button
                                        key="dialog_confirm"
                                        title={intl.formatMessage({
                                            id: 'common_confirm'
                                        })}
                                        onClick={() => {
                                            closeDialogFunc();
                                            genBracket();
                                        }}
                                    />
                                ]
                            },
                            closeByButtonOnly: true
                        });
                    } else {
                        if (res.data.header.status === 'T8T5033') {
                            openDialogFunc({
                                component: DialogBlock,
                                componentProps: {
                                    type: 'error',
                                    title: intl.formatMessage({
                                        id: 'Manage-Tournament-Bracket-Seeding_Seed could not changed'
                                    }),
                                    message: '',
                                    buttons: [
                                        <Button
                                            key="dialog_confirm"
                                            title={intl.formatMessage({
                                                id: 'common_confirm'
                                            })}
                                            onClick={() => {
                                                closeDialogFunc();
                                                genBracket();
                                            }}
                                        />
                                    ]
                                },
                                closeByButtonOnly: true
                            });
                        }
                    }
                }
            }
        );
    };

    const genBracket = () => {
        let data = { t8t_serial: match.params.t8t_serial };
        fetchListener.current = from(apiWithTokenWrapper(getGenBracket, data)).subscribe(res => {
            if (res.status === 200) {
                if (res.data.header.status.toUpperCase() === 'OK') {
                }
            }
        });
    };

    const reset = () => {
        seedList.t8t_seed_list.forEach((item, index) => {
            setValue(`t8t_seed_list[${index}].seed`, '');
            item.disabled = false;
        });

        setCount();
    };

    // 驗證seed不為零
    const notzero = (value, index) => {
        if (value === '0') {
            return false;
        }
        return true;
    };

    // 驗證輸入seed不可大於bracket_size
    const maxcount = (value, index) => {
        if (+value > bracket_info.bracket_size) {
            return false;
        }
        return true;
    };

    const pattern = (value, index) => {
        if (value === '') {
            return true;
        }
        const reqEx = /^\+?[0-9][0-9]*$/;
        if (!reqEx.test(value)) {
            setCount(value, index, true);
            return false;
        }

        return true;
    };

    const validate = (value, index) => {
        let valueArr = getValues();
        let seedNumArr = 0;
        if (!isLoading) {
            Object.keys(valueArr).map(key => {
                if (key.includes('.seed')) {
                    if (valueArr[key] !== '' && valueArr[key] === value) {
                        seedNumArr = ++seedNumArr;
                    }
                }
            });

            if (seedNumArr > 1) {
                return 'test';
            }

            setCount(value, index);
        }

        return true;
    };

    const setCount = (value, index, minus) => {
        let valueArr = getValues();
        let count = 0;
        Object.keys(valueArr).map(key => {
            if (key.includes('.seed')) {
                if (valueArr[key] !== '' && +valueArr[key] > 0) {
                    count = ++count;
                }
            }
        });

        if (minus === true) {
            count = count - 1;
        }

        if (count === bracket_info.bracket_size) {
            let list = [...seedList.t8t_seed_list];
            seedList.t8t_seed_list = list.map(item => {
                item.disabled = false;
                if (item.seed === null) {
                    item.disabled = true;
                }

                if (seedList.t8t_seed_type === 'seed_checkin') {
                    if (!item.is_checkin) {
                        item.disabled = true;
                    }
                }

                return item;
            });
            setSeedList(seedList);
        } else {
            seedList.t8t_seed_list.forEach(item => {
                item.disabled = false;
                if (seedList.t8t_seed_type === 'seed_checkin') {
                    if (!item.is_checkin) {
                        item.disabled = true;
                    }
                }
            });

            setSeedList(seedList);
        }
        setSeedCount(count < 0 ? 0 : count);
        forceUpdate();
    };

    const autoFeedIn = type => {
        let size = bracket_info.bracket_size;
        let count = 1;
        let usedArray = [];
        switch (type) {
            case 0:
                let dataCount = seedList.t8t_seed_list.length;
                function getRandomNum() {
                    let seedNum = Math.floor(Math.random() * dataCount);
                    if (usedArray.includes(seedNum)) {
                        return getRandomNum();
                    } else {
                        usedArray.push(seedNum);
                    }
                    return seedNum;
                }

                seedList.t8t_seed_list.map((item, index) => {
                    let setIndex = getRandomNum();
                    seedList.t8t_seed_list[setIndex].seed = ``;
                    setValue(`t8t_seed_list[${setIndex}].seed`, ``);

                    let flag = true;
                    if (seedList.t8t_seed_type === 'seed_checkin') {
                        if (!seedList.t8t_seed_list[setIndex].is_checkin) {
                            flag = false;
                        }
                    }

                    if (flag) {
                        if (index + 1 <= size) {
                            seedList.t8t_seed_list[setIndex].seed = `${count}`;
                            setValue(`t8t_seed_list[${setIndex}].seed`, `${count}`);
                        } else {
                            seedList.t8t_seed_list[setIndex].seed = null;
                            setValue(`t8t_seed_list[${setIndex}].seed`, '');
                        }
                        count = count + 1;
                    }
                });
                setSeedList(seedList);
                setCount();
                break;
            case 1:
                if (seedList.t8t_seed_list.length < size) {
                    size = seedList.t8t_seed_list.length;
                }
                seedList.t8t_seed_list.forEach((item, index) => {
                    item.seed = ``;
                    setValue(`t8t_seed_list[${index}].seed`, ``);

                    let flag = true;
                    if (seedList.t8t_seed_type === 'seed_checkin') {
                        if (!item.is_checkin) {
                            flag = false;
                        }
                    }
                    if (flag) {
                        item.seed = `${count}`;
                        setValue(`t8t_seed_list[${index}].seed`, `${count}`);
                        if (index + 1 > size) {
                            item.seed = null;
                            setValue(`t8t_seed_list[${index}].seed`, '');
                        }
                        count = count + 1;
                    }
                });
                setSeedList(seedList);
                setCount();

                break;
        }
    };

    const viewBracket = () => {
        let data = {};
        data.t8t_serial = match.params.t8t_serial;
        fetchListener.current = from(apiWithTokenWrapper(getSingleBracket, data)).subscribe(res => {
            if (res.status === 200) {
                if (res.data.header.status.toUpperCase() === 'OK') {
                    if (res.data.body.bracket_matches.length > 0) {
                        openPopWindowFunc({
                            component: BracketMap,
                            componentProps: {
                                title: intl.formatMessage({ id: 'Bracket Map' }),
                                bracketList: res.data.body.bracket_matches,
                                closePopWindowFunc: () => closePopWindowFunc()
                            },
                            closeByButtonOnly: true
                        });
                    }
                }
            }
        });
    };

    const downloadDataHandler = () => {
        const downloadCSV = dataStream => {
            const element = document.createElement('a');
            const file = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), dataStream], {
                type: 'text/csv; charset=UTF-8',
                encoding: 'UTF-8'
            });
            element.href = window.URL.createObjectURL(file);
            element.download = `${match.params.t8t_serial}_seed.csv`;
            document.body.appendChild(element);
            element.click();
        };

        const data = {
            t8t_serial: match.params.t8t_serial
        };
        fetchListener.current = from(apiWithTokenWrapper(exportSeed, data)).subscribe(response => {
            if (response.status === 200 && response.data.header.status === 'OK') {
                downloadCSV(response.data.body);
            }
        });
    };

    const uploadFileHandler = () => {
        const submitData = csvFile => {
            const formData = new FormData();
            const json = JSON.stringify({ type: seedList.t8t_seed_type });
            const req = new Blob([json], {
                type: 'application/json'
            });
            formData.append('req', req);
            formData.append('csv_file', csvFile);
            fetchListener.current = from(apiWithTokenWrapper(importSeed, formData, match.params.t8t_serial)).subscribe(
                response => {
                    if (response.status === 200 && response.data.header.status === 'OK') {
                        setSeedList({ ...seedList, t8t_seed_list: [] });
                        getSeedList();
                    }
                }
            );
        };

        const fileData = document.createElement('input');
        fileData.setAttribute('type', 'file');
        fileData.setAttribute('accept', '.csv');
        fileData.onchange = e => submitData(e.target.files[0]);
        fileData.click();
    };

    const getSaveDisableStatus = () => {
        if (moment() > moment(registration_end_at) && moment() < moment(event_start_at)) {
            return true;
        }
        return false;
    };

    return (
        <>
            <div className={classes.basicsCon}>
                {isLoading ? (
                    <Loading />
                ) : (
                    <>
                        <Card size="col-9">
                            <CardHeader>
                                {intl.formatMessage({ id: 'Manage-Tournament-Bracket-Seeding_Seeding' })}
                            </CardHeader>
                            <CardBody customClass={classes.basicsInner}>
                                <div className={cx('group')}>
                                    <div className={classes.bold}>
                                        {intl.formatMessage({
                                            id: 'Manage-Tournament-Bracket-Seeding_Participants Number'
                                        })}
                                    </div>
                                    <div className={classes.inner}>
                                        <span className={classes.blue}>
                                            {intl.formatMessage(
                                                { id: 'Manage-Tournament-Bracket-Seeding_{number} Registered' },
                                                { number: participants_count }
                                            )}{' '}
                                        </span>
                                        <span className={cx(classes.blue, classes.marginLeft36)}>
                                            {' '}
                                            {intl.formatMessage(
                                                { id: 'Manage-Tournament-Bracket-Seeding_{number} Seeded' },
                                                {
                                                    number: `${seedCount} / ${
                                                        bracket_info ? bracket_info.bracket_size : 0
                                                    }`
                                                }
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className={classes.line}></div>
                                <div className={cx('group')}>
                                    <div className={cx('inputSearch')}>
                                        <Autocomplete placeholder="" type="search" onSearch={() => {}} />
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
                                            <Tooltip
                                                info={intl.formatMessage({
                                                    id: 'Manage-Tournament-Bracket-Seeding_[tooltips]Export'
                                                })}
                                            />
                                        </div>
                                        {/* <img alt="" src={exclamation} /> */}
                                    </div>
                                    <div className={cx('clear')}></div>
                                </div>
                                <div className={classes.line}></div>
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className={cx('group')}>
                                        <div className={classes.blackBg}>
                                            {isGen ? (
                                                <div className={classes.text_center}>
                                                    {intl.formatMessage({
                                                        id:
                                                            'Manage-Tournament-Bracket-Seeding_You can generate seed when registraion close'
                                                    })}
                                                </div>
                                            ) : (
                                                <>
                                                    <Button
                                                        title={intl.formatMessage({
                                                            id:
                                                                'Manage-Tournament-Bracket-Seeding_[btn]View Bracket Map'
                                                        })}
                                                        theme="dark_2"
                                                        onClick={() => viewBracket()}
                                                    />
                                                    <div className={classes.moreBtn}>
                                                        <Button
                                                            title={intl.formatMessage({
                                                                id: 'Manage-Tournament-Bracket-Seeding_[btn]Reset'
                                                            })}
                                                            customClass={cx(classes.smallBtn, classes.button)}
                                                            theme="dark_2"
                                                            onClick={() => reset()}
                                                        />
                                                        {/* <div> */}
                                                        <SubMenuDropdown
                                                            theme="dark"
                                                            items={feedItems}
                                                            customClass={cx(classes.submenu)}
                                                        >
                                                            {(props, onClick, isOpen) => {
                                                                return (
                                                                    <Button
                                                                        title={`${intl.formatMessage({
                                                                            id:
                                                                                'Manage-Tournament-Bracket-Seeding_[btn]Auto Feed-in'
                                                                        })}▾`}
                                                                        theme="dark_2"
                                                                        customClass={cx(classes.subbtn)}
                                                                    />
                                                                );
                                                            }}
                                                        </SubMenuDropdown>
                                                        <Button
                                                            title={intl.formatMessage({
                                                                id:
                                                                    'Tournament-Management-Bracket-Settings-After-Publish_[btn]Save'
                                                            })}
                                                            size="sm_1"
                                                            disabled={!isValid || !getSaveDisableStatus()}
                                                            type="submit"
                                                            customClass={cx(classes.button)}
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                    <div className={cx('group', 'needTop')}>
                                        <table className={cx('manTableNoBlckBg', 'manTableNoBlckBg2')}>
                                            <tbody>
                                                <tr>
                                                    <td>
                                                        {intl.formatMessage({
                                                            id: 'Manage-Tournament-Bracket-Seeding_REG#'
                                                        })}
                                                    </td>
                                                    <td>
                                                        {intl.formatMessage({
                                                            id: 'Manage-Tournament-Bracket-Seeding_User Name'
                                                        })}
                                                    </td>
                                                    <td>
                                                        {intl.formatMessage({
                                                            id: 'Manage-Tournament-Bracket-Seeding_Seed#'
                                                        })}
                                                    </td>
                                                </tr>
                                                {seedList.t8t_seed_list.map((item, index) => {
                                                    return (
                                                        <tr key={index}>
                                                            <td>{index + 1}</td>
                                                            <td>
                                                                <div className={classes.flex}>
                                                                    <div className={classes.manBox}>
                                                                        <Thumbnail
                                                                            imgUrl={getImageUrl(item.icon_image)}
                                                                            border={{ gap: 2 }}
                                                                            size="48px"
                                                                        />
                                                                        {/* {item.icon_image === null ? "" : <img alt="" src={getImageUrl(item.icon_image)} />} */}
                                                                        {/* <img alt="" src={man} /> */}
                                                                    </div>
                                                                    {item.participant_name}
                                                                </div>
                                                            </td>
                                                            <td>
                                                                <div className={classes.inputBlock}>
                                                                    <div className={classes.input}>
                                                                        <Controller
                                                                            as={
                                                                                <Textfield
                                                                                    customContainerClass={
                                                                                        classes.displayWidth0
                                                                                    }
                                                                                    name={`t8t_seed_list[${index}].participant_id`}
                                                                                    type="hidden"
                                                                                />
                                                                            }
                                                                            defaultValue={item.participant_id}
                                                                            control={control}
                                                                            name={`t8t_seed_list[${index}].participant_id`}
                                                                        />
                                                                        <Controller
                                                                            as={
                                                                                <Textfield
                                                                                    customContainerClass={
                                                                                        classes.displayWidth0
                                                                                    }
                                                                                    name={`t8t_seed_list[${index}].participant_name`}
                                                                                    type="hidden"
                                                                                />
                                                                            }
                                                                            defaultValue={item.participant_name}
                                                                            control={control}
                                                                            name={`t8t_seed_list[${index}].participant_name`}
                                                                        />
                                                                        <Controller
                                                                            as={
                                                                                <Textfield
                                                                                    theme="dark"
                                                                                    type="text"
                                                                                    name={`t8t_seed_list[${index}].seed`}
                                                                                    disabled={
                                                                                        status === 'ongoing'
                                                                                            ? true
                                                                                            : item.disabled
                                                                                    }
                                                                                />
                                                                            }
                                                                            defaultValue={`${
                                                                                item.seed === null ? '' : item.seed
                                                                            }`}
                                                                            control={control}
                                                                            name={`t8t_seed_list[${index}].seed`}
                                                                            rules={{
                                                                                validate: {
                                                                                    pattern: value =>
                                                                                        pattern(value, index),
                                                                                    notzero: value =>
                                                                                        notzero(value, index),
                                                                                    maxcount: value =>
                                                                                        maxcount(value, index),
                                                                                    validate: value =>
                                                                                        validate(value, index)
                                                                                }
                                                                            }}
                                                                            //     onChange={(e) => {
                                                                            //         let value = e[0].target.value;
                                                                            //         return value

                                                                            //     }}
                                                                        />
                                                                    </div>
                                                                    <div className={classes.message}>
                                                                        <ErrorMessage
                                                                            errors={errors}
                                                                            name={`t8t_seed_list[${index}].seed`}
                                                                        >
                                                                            {({ message }) => {
                                                                                switch (
                                                                                    errors.t8t_seed_list[`${index}`]
                                                                                        .seed.type
                                                                                ) {
                                                                                    case 'validate':
                                                                                        return intl.formatMessage({
                                                                                            id:
                                                                                                'Manage-Tournament-Reset-Seed_Can not be repeatable'
                                                                                        });
                                                                                    // case "notzero":
                                                                                    //     return "notzero"
                                                                                    // case "maxcount":
                                                                                    //     return "maxcount"
                                                                                }
                                                                            }}
                                                                        </ErrorMessage>
                                                                        {/* <span className={classes.message}> {setValidate(errors, index)}</span> */}
                                                                    </div>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                </form>
                            </CardBody>
                        </Card>
                    </>
                )}
            </div>
        </>
    );
};

export default withPopWindowConsumer(Basic);
