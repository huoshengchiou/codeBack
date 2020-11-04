import React, { useState, useEffect, useRef, useReducer, useContext } from 'react';
import { useForm } from 'react-hook-form';

import { PopWindowStorage } from 'components/DesignSystem/PopWindow_V2';

import Thumbnail from 'components/DesignSystem/DataDisplay/Thumbnail';

import classNames from 'classnames/bind';
import classes from '../styles.module.scss';

import Button from 'components/DesignSystem/Input/Button';
import Search from 'components/DesignSystem/Input/Search';
import Icon from 'components/DesignSystem/Base/Icons';
import Tooltip from 'components/DesignSystem/DataDisplay/Tooltip';
import Card, { CardHeader, CardBody } from 'components/DesignSystem/DataDisplay/Card';

import { from } from 'rxjs';
import { map } from 'rxjs/operators';
import { postExportParticipant, exportSeed, importSeed, getFFASeed, postFFASeed } from 'apis/tournament';

import Loading from 'components/utils/Loading';
import SubMenuDropdown from 'components/DesignSystem/Input/SubMenuDropdown';
import DialogBlock from 'components/blocks/DialogBlock';
import FFAList from '../FFAList';

import { EditManageContext } from '../../../Context';

const cx = classNames.bind(classes);

const FreeForAll = props => {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const { t8tDetail, intl, configData, authData, dialogData, match } = useContext(EditManageContext);
    const popWindowData = useContext(PopWindowStorage);

    const { getImageUrl } = configData;
    const { apiWithTokenWrapper } = authData;
    const { openPopWindow } = popWindowData;

    const { bracket_info, participants_count, status } = t8tDetail;
    const bracketSize = bracket_info.bracket_size;
    const participantPerGroup =
        bracket_info.participant_per_group > 0 ? bracket_info.participant_per_group : bracket_info.bracket_size;
    const groupCount = bracket_info.bracket_size > 0 ? Math.ceil(bracketSize / participantPerGroup) : 0;

    const [isSelect, setIsSelect] = useState(false);
    const [oriSeedList, setOriSeedList] = useState([]);
    const [seedList, setSeedList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [seedCount, setSeedCount] = useState(0);
    const { openDialogFunc, closeDialogFunc } = dialogData;

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

    const { handleSubmit, getValues, triggerValidation, formState } = useForm({ mode: 'onChange' });
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
        fetchListener.current = from(apiWithTokenWrapper(getFFASeed, data))
            .pipe(
                map(res => {
                    if (res.status === 200) {
                        if (res.data.header.status.toUpperCase() === 'OK') {
                            let count = res.data.body.t8t_seed_list.filter(list => list.seed !== null);
                            let orilist = [];
                            res.data.body.t8t_seed_list.forEach(item => {
                                if (res.data.body.t8t_seed_type === 'seed_checkin') {
                                    if (!item.is_checkin) {
                                        item.disabled = true;
                                    }
                                }
                                let oriItem = JSON.parse(JSON.stringify(item));
                                oriItem.seed = null;
                                orilist.push(oriItem);
                            });
                            res.data.body.oriT8t_seed_list = orilist;
                            res.data.body.t8t_seed_list.seecount = count.length;
                        }
                    }
                    return res;
                })
            )
            .subscribe(res => {
                if (res.status === 200) {
                    if (res.data.header.status.toUpperCase() === 'OK') {
                        setOriSeedList(JSON.parse(JSON.stringify(res.data.body)));
                        setSeedList(JSON.parse(JSON.stringify(res.data.body)));

                        setSeedCount(res.data.body.t8t_seed_list.seecount);
                        setIsLoading(false);
                        triggerValidation();
                        // forceUpdate();
                    }
                }
            });
    };

    const onSubmit = data => {
        let postData = {};
        postData.t8t_seed_list = seedList.t8t_seed_list.filter(item => {
            return item.seed !== null;
        });

        postData.t8t_serial = match.params.t8t_serial;

        fetchListener.current = from(apiWithTokenWrapper(postFFASeed, postData)).subscribe(res => {
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
                                        // genBracket();
                                    }}
                                />
                            ]
                        },
                        closeByButtonOnly: true
                    });
                }
            }
        });
    };

    const reset = () => {
        seedList.t8t_seed_list = seedList.t8t_seed_list.map((item, index) => {
            item.seed = null;
            return item;
        });

        setSeedList(seedList);

        setCount();
    };

    // const pattern = (value, index) => {
    //     if (value === "") {
    //         return true
    //     }
    //     const reqEx = /^\+?[0-9][0-9]*$/;
    //     if (!reqEx.test(value)) {
    //         setCount(value, index, true)
    //         return false
    //     }

    //     return true
    // }

    // const validate = (value, index) => {
    //     let valueArr = getValues();
    //     let seedNumArr = 0;

    //     Object.keys(valueArr).map(key => {
    //         if (key.includes(".seed")) {
    //             if (valueArr[key] !== "" && valueArr[key] === value) {
    //                 seedNumArr = ++seedNumArr;
    //             }
    //         }
    //     })

    //     if (seedNumArr > 1) {
    //         return false
    //     }
    //     setCount(value, index);

    //     return true
    // }

    const setCount = (value, index, minus) => {
        let array = seedList.t8t_seed_list.filter(item => item.seed !== null);

        setSeedCount(array.length);
    };

    const autoFeedIn = type => {
        let size = bracket_info.bracket_size;
        if (size > participants_count) {
            size = participants_count;
        }

        if (seedCount === size) {
            reset();
        }
        let usedArray = [];
        let num = [];
        let count = 1;
        let groupno = 0;

        let diff = size - Math.floor(size / groupCount) * groupCount;
        let countBygroup = [...Array(groupCount).keys()].map(() => {
            return Math.floor(size / groupCount);
        });

        const getDiffNum = () => {
            if (diff <= 0) {
                return;
            }
            countBygroup.every((item, index) => {
                if (diff <= 0) {
                    return false;
                }
                diff = diff - 1;
                countBygroup[index] = countBygroup[index] + 1;
                return true;
            });
        };

        getDiffNum();

        let t8t_seed_list = seedList.t8t_seed_list;
        if (!isSelect) {
            t8t_seed_list = JSON.parse(JSON.stringify(oriSeedList.oriT8t_seed_list));
        }
        let dataList = [];
        let list = t8t_seed_list.filter(a => {
            if (a.seed !== null) {
                dataList.push(a);
                num.push(a.seed);
                usedArray.push(a.participant_id);
            }
            if (seedList.t8t_seed_type === 'seed_admission') {
                return a.seed === null;
            } else {
                return a.seed === null && a.is_checkin;
            }
        });
        let selectListCount = usedArray.length;
        switch (type) {
            case 0: //random
                let dataCount = list.length;
                function getRandomNum() {
                    if (usedArray.length !== 0 && usedArray.length === dataCount + selectListCount) {
                        return '';
                    }
                    let seedNum = Math.floor(Math.random() * dataCount);
                    let data = list[seedNum];
                    if (usedArray.includes(data.participant_id)) {
                        return getRandomNum();
                    } else {
                        usedArray.push(data.participant_id);
                    }

                    return seedNum;
                }

                countBygroup.forEach((n, index) => {
                    [...Array(n).keys()].map(item => {
                        let lists = dataList.filter(item => {
                            return (
                                item.seed > bracket_info.participant_per_group * index &&
                                item.seed <= bracket_info.participant_per_group * (index + 1)
                            );
                        });

                        if (lists.length === n) {
                            return;
                        }
                        let seedNo = bracket_info.participant_per_group * index + 1 + item;

                        if (usedArray.length === size) {
                            return;
                        }

                        if (!num.includes(seedNo)) {
                            let index = getRandomNum();
                            if (index !== '') {
                                seedList.t8t_seed_list[index].seed = seedNo;
                            }
                        }
                    });
                });

                // seedList.t8t_seed_list = dataList

                setSeedList(seedList);
                setCount();
                forceUpdate();

                break;
            case 1: //auto feed in
                let limit = bracket_info.participant_per_group * groupno + countBygroup[groupno];
                const getNum = () => {
                    let lists = dataList.filter(item => {
                        return (
                            item.seed > bracket_info.participant_per_group * groupno &&
                            item.seed <= bracket_info.participant_per_group * (groupno + 1)
                        );
                    });

                    if (count > limit || lists.length === countBygroup[groupno]) {
                        groupno = groupno + 1;
                        count = bracket_info.participant_per_group * groupno + 1;
                        limit = bracket_info.participant_per_group * groupno + countBygroup[groupno];
                    }
                    if (num.includes(count)) {
                        count = count + 1;
                        return getNum();
                    }
                    num.push(count);
                    return count;
                };
                // console.log(list)

                list.slice(0, size - num.length).every(item => {
                    if (num.length === size) {
                        return false;
                    }

                    if (item.seed === null) {
                        item.seed = getNum();
                    }
                    return true;
                });
                seedList.t8t_seed_list = list;
                setSeedList(seedList);
                setCount();
                forceUpdate();

                break;
        }
        setIsSelect(false);
    };

    const downloadDataHandler = () => {
        const downloadCSV = dataStream => {
            const element = document.createElement('a');
            const file = new Blob([new Uint8Array([0xef, 0xbb, 0xbf]), 'Text', dataStream], {
                type: 'text/csv; charset=UTF-8',
                encoding: 'UTF-8'
            });
            // const file = new Blob([dataStream], { type: "text/csv" });
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
                // console.log(response.data.body);
                downloadCSV(response.data.body);
            }
        });
    };

    const uploadFileHandler = () => {
        const submitData = csvFile => {
            // console.log(csvFile);
            const formData = new FormData();
            const json = JSON.stringify({ type: seedList.t8t_seed_type });
            const req = new Blob([json], {
                type: 'application/json'
            });
            formData.append('req', req);
            formData.append('csv_file', csvFile);
            fetchListener.current = from(apiWithTokenWrapper(importSeed, formData, match.params.t8t_serial)).subscribe(
                response => {
                    // console.log(response);
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

    const getGroupName = index => {
        const engLetter = [
            'A',
            'B',
            'C',
            'D',
            'E',
            'F',
            'G',
            'H',
            'I',
            'J',
            'K',
            'L',
            'M',
            'N',
            'O',
            'P',
            'Q',
            'R',
            'S',
            'T',
            'U',
            'V',
            'W',
            'X',
            'Y',
            'Z'
        ];
        let letter = '';
        const getletter = num => {
            if (num <= 25) {
                letter = letter + engLetter[num];
                return;
            }
            const num1 = Math.floor(num / 26) - 1;
            const num2 = num % 26;
            letter = letter + engLetter[num1];
            getletter(num2);
        };
        getletter(index);

        return letter;
    };

    const setSeedbyList = num => {
        if (seedCount === bracket_info.bracket_size) {
            return;
        }
        openPopWindow({
            title: intl.formatMessage({ id: 'Seed-List_Add Competition' }),
            component: (
                <FFAList
                    lists={
                        oriSeedList.t8t_seed_type === 'seed_admission'
                            ? oriSeedList.t8t_seed_list
                            : oriSeedList.t8t_seed_list.filter(item => item.is_checkin)
                    }
                    leftCount={bracket_info.bracket_size - seedCount}
                    onAdd={item => {
                        setIsSelect(true);
                        setSeed(item);
                    }}
                    seedNo={num}
                ></FFAList>
            )
        });
    };

    const setSeed = obj => {
        seedList.t8t_seed_list = seedList.t8t_seed_list.map(item => {
            if (item.participant_id === obj.participant_id) {
                return obj;
            }
            return item;
        });
        setSeedList(seedList);
        setCount();
        forceUpdate();
    };

    const deletSeed = num => {
        let list = seedList.t8t_seed_list.map(item => {
            if (+item.seed === +num) {
                item.seed = null;
            }
            return item;
        });

        seedList.t8t_seed_list = list;
        setSeedList(seedList);
        setCount();
        forceUpdate();
    };

    const getCompetitionCount = (index, perGroup) => {
        let start = perGroup * index + 1;
        let end = perGroup * (index + 1);
        let data = seedList.t8t_seed_list.filter(item => item.seed >= start && item.seed <= end);

        return data.length;
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
                                                { number: `${seedCount} / ${bracket_info.bracket_size}` }
                                            )}
                                        </span>
                                    </div>
                                </div>
                                <div className={classes.line}></div>
                                <div className={cx('group')}>
                                    <div className={cx('inputSearch')}>
                                        <Search name="search" placeholder="" theme="dark" />
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
                                    </div>
                                    <div className={cx('clear')}></div>
                                    <div className={classes.line}></div>
                                    <form onSubmit={handleSubmit(onSubmit)}>
                                        <div className={cx('group')}>
                                            {/* <div>
                                                <TextInformation textAlign="center" theme={"warning"}>Please Generate Tournament's Seed</TextInformation>
                                            </div> */}
                                            <div className={classes.blackBg}>
                                                <div className={classes.moreBtn}>
                                                    <Button
                                                        title={intl.formatMessage({
                                                            id: 'Manage-Tournament-Bracket-Seeding_[btn]Reset'
                                                        })}
                                                        customClass={cx(classes.smallBtn, classes.button)}
                                                        theme="dark_2"
                                                        onClick={() => reset()}
                                                    />
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
                                                        title={intl.formatMessage({ id: 'Bracket-FFA_[btn]Generate' })}
                                                        size="sm_1"
                                                        disabled={status === 'ongoing' || status === 'completed'}
                                                        type="submit"
                                                        customClass={cx(classes.button)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className={cx('group', 'compeCon')}>
                                            {[...Array(groupCount).keys()].map((groupItem, groupCountIndex) => {
                                                return (
                                                    <div
                                                        className={cx(
                                                            'block',
                                                            'needTop',
                                                            groupCountIndex % 2 === 0 ? 'mr10' : ''
                                                        )}
                                                        key={groupCountIndex}
                                                    >
                                                        <div className={cx('title')}>
                                                            {intl.formatMessage({ id: 'Bracket-FFA_Group' })}{' '}
                                                            {getGroupName(groupCountIndex)}
                                                        </div>
                                                        <div className={cx('titleBar')}>
                                                            <div>
                                                                {intl.formatMessage({ id: 'Bracket-FFA_Competitions' })}{' '}
                                                                (
                                                                {getCompetitionCount(
                                                                    groupCountIndex,
                                                                    bracket_info.participant_per_group
                                                                )}
                                                                )
                                                            </div>
                                                            <div>{intl.formatMessage({ id: 'Bracket-FFA_Seed#' })}</div>
                                                        </div>
                                                        <div className={cx('itemCon')}>
                                                            {[...Array(+participantPerGroup).keys()].map(
                                                                (group, index) => {
                                                                    let seedNo =
                                                                        index +
                                                                        1 +
                                                                        +bracket_info.participant_per_group *
                                                                            groupCountIndex;
                                                                    let item = seedList.t8t_seed_list.find(
                                                                        item => item.seed === seedNo
                                                                    );
                                                                    return (
                                                                        <div
                                                                            className={cx('item')}
                                                                            key={`${groupCountIndex}${index}`}
                                                                        >
                                                                            {item ? (
                                                                                <div className={cx('info')}>
                                                                                    <div
                                                                                        className={cx(
                                                                                            'info',
                                                                                            'infoHasData'
                                                                                        )}
                                                                                    >
                                                                                        <div className={cx('hand')}>
                                                                                            <Thumbnail
                                                                                                imgUrl={getImageUrl(
                                                                                                    item.avatar
                                                                                                        .logo_image
                                                                                                )}
                                                                                                border={{ gap: 2 }}
                                                                                                size="48px"
                                                                                            />
                                                                                        </div>
                                                                                        <div className={cx('inner')}>
                                                                                            <div className={cx('name')}>
                                                                                                {item.avatar.name}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className={cx('delete')}>
                                                                                            <Icon
                                                                                                name={'Delete'}
                                                                                                theme={'dark'}
                                                                                                width={'15px'}
                                                                                                isButton={true}
                                                                                                onClick={() => {
                                                                                                    deletSeed(seedNo);
                                                                                                }}
                                                                                            />
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ) : (
                                                                                <div
                                                                                    className={cx(
                                                                                        'info',
                                                                                        seedCount ===
                                                                                            participants_count &&
                                                                                            'disabled'
                                                                                    )}
                                                                                    onClick={() => {
                                                                                        if (
                                                                                            seedCount ===
                                                                                            participants_count
                                                                                        ) {
                                                                                            return;
                                                                                        }
                                                                                        setSeedbyList(seedNo);
                                                                                    }}
                                                                                >
                                                                                    <Icon
                                                                                        name={'Create'}
                                                                                        theme={'dark'}
                                                                                        width={'16px'}
                                                                                        isButton={false}
                                                                                        color={
                                                                                            seedCount ===
                                                                                            participants_count
                                                                                                ? 'rgba(255, 255, 255, 0.3)'
                                                                                                : ''
                                                                                        }
                                                                                    />
                                                                                </div>
                                                                            )}
                                                                            <div className={cx('num')}>{seedNo}</div>
                                                                        </div>
                                                                    );
                                                                }
                                                            )}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </form>
                                </div>
                            </CardBody>
                        </Card>
                    </>
                )}
            </div>
        </>
    );
};

export default FreeForAll;
