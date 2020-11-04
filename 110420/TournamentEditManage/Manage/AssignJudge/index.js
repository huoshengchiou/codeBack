import React, { useState, useEffect, useRef, useContext } from 'react';

import { from } from 'rxjs';
import { getJudgeList, updateJudgeList } from 'apis/tournament';

import Button from 'components/DesignSystem/Input/Button';
import Icon, { iconObj } from 'components/DesignSystem/Base/Icons';
import Card, { CardHeader, CardBody } from 'components/DesignSystem/DataDisplay/Card';

import PopUp from './AssignJudgePopUp';
import FixedJudge from './FixedJudge';
import OtherJudge from './OtherJudge';

import classNames from 'classnames/bind';
import classes from './styles.module.scss';

import { EditManageContext } from '../../Context';

const cx = classNames.bind(classes);

// main
const AssignJudge = props => {
    const { t8tDetail, intl, authData, match, popWindowData, dialog_V2Data } = useContext(EditManageContext);

    const initMemberId = t8tDetail.t8t_lite.init_member_id;
    const clubId = t8tDetail.t8t_lite.club.club_id;
    const maxJudgeCount = t8tDetail.t8t_lite.club_sales_type !== 'partner' ? 2 : 10;
    const { openDialog_V2Func, closeDialog_V2Func } = dialog_V2Data;
    const { openPopWindow, closePopWindow } = popWindowData;
    const { apiWithTokenWrapper } = authData;
    const [activeJudgeCount, setActiveJudgeCount] = useState(0);
    const [t8t_staff, setT8t_staff] = useState([]);
    const [t8t_staff_no_mod, setT8t_staff_no_mod] = useState([]);

    const fetchListener = useRef();

    useEffect(() => {
        reloadJudgeData();

        return () => {
            if (fetchListener.current) {
                fetchListener.current.unsubscribe();
            }
        };
        // DO NOT REMOVE NEXT LINE !!
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const reloadJudgeData = () => {
        const data = {
            t8t_serial: match.params.t8t_serial
        };
        fetchListener.current = from(apiWithTokenWrapper(getJudgeList, data)).subscribe(response => {
            if (response.status === 200) {
                if (response.data.header.status === 'OK') {
                    let list = [...response.data.body.t8t_staff];
                    let count = 0;
                    list.forEach(entry => {
                        if (entry.member_id === initMemberId) {
                            entry.is_t8t_judge = true;
                        }
                        if (entry.is_t8t_judge) {
                            count++;
                        }
                    });

                    setActiveJudgeCount(count);
                    setT8t_staff(JSON.parse(JSON.stringify(list)));
                    setT8t_staff_no_mod(JSON.parse(JSON.stringify(list)));
                } else {
                    console.log('error retrieving data');
                }
            }
        });
    };

    // Upload judge list to server if update list !== t8t_staff in state
    const updateJudgeToServer = listInput => {
        if (listInput !== t8t_staff) {
            let updateList = [];
            listInput.map(entry => {
                if (entry.is_t8t_judge) updateList.push(entry);
                return null;
            });
            const data = {
                staff: updateList
            };
            from(apiWithTokenWrapper(updateJudgeList, data, match.params.t8t_serial)).subscribe(response => {
                if (response.data.header.status === 'OK') {
                    reloadJudgeData();
                } else {
                    console.log('update error', response);
                }
            });
        }
    };

    // Remove judge popup (trash icon)
    const removeJudge = member_id => {
        openDialog_V2Func({
            type: 'Warning',
            title: `${intl.formatMessage({
                id: 'Manage-Tournament-Assign-Judge_Delete This Judge'
            })} ? `,
            message: intl.formatMessage({
                id: 'Manage-Tournament-Assign-Judge_[content]Delete This Judge'
            }),
            buttons: [
                <Button
                    key="confirm"
                    title={intl.formatMessage({
                        id: 'common_confirm'
                    })}
                    onClick={() => {
                        closeDialog_V2Func();
                        proceedRemoveJudge(member_id);
                    }}
                />,
                <Button
                    key="cancel"
                    title={intl.formatMessage({
                        id: 'common_cancel'
                    })}
                    theme="light_2"
                    onClick={() => {
                        closeDialog_V2Func();
                    }}
                />
            ]
        });
    };

    // On confirm remove judge
    const proceedRemoveJudge = member_id => {
        let listUpdate = [...t8t_staff];
        for (let key in listUpdate) {
            if (listUpdate[key].member_id === member_id) {
                listUpdate[key].is_t8t_judge = false;
            }
        }
        updateJudgeToServer(listUpdate);
    };

    // Add judge list popup
    const popUpHandler = () => {
        openPopWindow({
            title: intl.formatMessage({ id: 'Manage-Tournament-Assign-Judge_Add Judge' }),
            closeByButtonOnly: true,
            callAfterClose: () => setT8t_staff(JSON.parse(JSON.stringify(t8t_staff_no_mod))),
            component: (
                <PopUp
                    staffList={t8t_staff}
                    initMemberId={initMemberId}
                    clubId={clubId}
                    t8t_serial={match.params.t8t_serial}
                    activeJudgeCount={activeJudgeCount}
                    maxJudgeCount={maxJudgeCount}
                    onClose={closePopWindow}
                    onUpdate={updateJudgeToServer}
                />
            )
        });
    };

    // AddJudge box component
    const AddJudge = props => {
        return (
            <div className={cx('box')} onClick={popUpHandler}>
                <div className={cx('plus')}>
                    <Icon name={'Create'} theme={'dark'} />
                </div>
            </div>
        );
    };

    return (
        <>
            <div className={classes.basicsCon}>
                <Card size="col-9">
                    <CardHeader>{intl.formatMessage({ id: 'Manage-Tournament-Page_Assign Judge' })}</CardHeader>
                    <CardBody customClass={classes.basicsInner}>
                        <div className={cx('group')}>
                            <div className={classes.inner}>
                                {intl.formatMessage({ id: 'Manage-Tournament-Assign-Judge_[content]Add Judge' })}
                            </div>
                        </div>
                        <div className={classes.line}></div>
                        <div className={cx('group')}>
                            <div className={classes.bold}>
                                {intl.formatMessage({ id: 'Manage-Tournament-Assign-Judge_Add Judge' })}
                            </div>
                            <div className={classes.inner}>
                                {activeJudgeCount}/{maxJudgeCount}
                            </div>
                        </div>
                        <div className={cx('group')}>
                            <div className={classes.boxCon}>
                                {t8t_staff
                                    .sort((a, b) => {
                                        if (a.member_id === initMemberId) {
                                            return -1;
                                        }
                                        if (b.member_id === initMemberId) {
                                            return 1;
                                        }
                                        return 0;
                                    })
                                    .map(staff => {
                                        if (staff.member_id === initMemberId) {
                                            return (
                                                <FixedJudge
                                                    key={initMemberId}
                                                    Id={initMemberId}
                                                    username={staff.username}
                                                    icon_image={staff.icon_image}
                                                />
                                            );
                                        }
                                        if (staff.member_id !== initMemberId && staff.is_t8t_judge) {
                                            return (
                                                <OtherJudge
                                                    key={staff.member_id}
                                                    username={staff.username}
                                                    onDelete={removeJudge}
                                                    member_id={staff.member_id}
                                                    icon_image={staff.icon_image}
                                                />
                                            );
                                        }
                                    })}
                                {activeJudgeCount < maxJudgeCount ? <AddJudge clicked={popUpHandler} /> : null}
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </>
    );
};

export default AssignJudge;
