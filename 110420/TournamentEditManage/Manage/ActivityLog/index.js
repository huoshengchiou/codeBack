import React, { useState, useEffect, useRef, useContext } from 'react';
import { from } from 'rxjs';

// API
import { getActivityLog } from 'apis/tournament';

import { formatDateTime } from 'utils/formattersV2/date';

import Loading from 'components/DesignSystem/Base/Loading';
import Card, { CardHeader, CardBody } from 'components/DesignSystem/DataDisplay/Card';

import { EditManageContext } from '../../Context';

import classNames from 'classnames/bind';
import classes from './styles.module.scss';
const cx = classNames.bind(classes);

const ActivityLog = props => {
    const { intl, authData, match, FormattedMessage } = useContext(EditManageContext);

    const { apiWithTokenWrapper } = authData;
    const [t8tLogs, setT8tLogs] = useState([]);
    const [_pageno, set_pageno] = useState(1);
    const _limit = 10;
    const [total, setTotal] = useState(0);
    const fetchListener = useRef();
    const [loading, setLoading] = useState(false);
    const { t8t_serial } = match.params;

    useEffect(() => {
        // console.log(props);
        getLog(t8tLogs);

        return () => {
            if (fetchListener.current) {
                fetchListener.current.unsubscribe();
            }
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_pageno]);

    const getLog = t8tLogs => {
        const data = {
            t8t_serial: t8t_serial,
            _pageno: _pageno,
            _limit: _limit
        };
        fetchListener.current = from(apiWithTokenWrapper(getActivityLog, data)).subscribe(res => {
            if (res.status === 200 && res.data.header.status === 'OK') {
                // console.log("Log Data", res.data.body);
                setT8tLogs([...t8tLogs, ...res.data.body.t8t_logs]);
                setTotal(res.data.body.meta_page.total);
                setLoading(false);
            }
        });
    };

    const Content = ({ created_time, category_code, data }) => {
        // const { username, team_name, t8t_name, t8t_match_no } = data
        // let intlId = ""
        // // const valueObj = { username, team_name, t8t_name, t8t_match_no,ffa_group_no }
        // switch (category_code) {
        //     case "t8t_create_t8t":
        //         intlId = "Manage-Tournament-Activity-Log_{username} created {t8t_name}"
        //         break
        //     case "t8t_modify_t8t":
        //         intlId = "Manage-Tournament-Activity-Log_{username} edited {t8t_name}"
        //         break
        //     case "t8t_set_public":
        //         intlId = "Manage-Tournament-Activity-Log_{username} demystified {t8t_name}"
        //         break
        //     case "t8t_register_by_player":
        //         intlId = "{username} created a registration in {t8t_name}"
        //         break
        //     case "t8t_register_by_team":
        //         intlId = "{team_name} created a registration in {t8t_name}"
        //         break
        //     case "t8t_register_cancelled":
        //         intlId = "{username} cancelled participation in {t8t_name}"
        //         break
        //     case "t8t_match_report_issue":
        //         intlId = "{t8t_match_no} raised the controversy"
        //         break
        //     case "t8t_match_close_issue":
        //         intlId = "{username} fixed {t8t_match_no} controversy"
        //         break
        //     case "t8t_match_upload_result":
        //         intlId = "{username} uploaded {t8t_match_no} match results"
        //         break
        //     case "t8t_match_confirm_result":
        //         intlId = "{username} confirmed {t8t_match_no} match results"
        //         break
        //     case "t8t_match_judge_overwrite_result":
        //         intlId = "{username} overwrote {t8t_match_no} match results"
        //         break
        //     case "t8t_match_completed":
        //         intlId = "{t8t_match_no} match completed"
        //         break
        //     default:
        //         break;
        // }
        return (
            <>
                <div className={classes.tt}>{data?.username}</div>
                <div className={classes.time}>{formatDateTime(created_time)}</div>
                <div className={classes.txt}>
                    <FormattedMessage id={`Manage-Tournament-Activity-Log_${category_code}`} values={data} />
                    {/* {convertLogMessage(category_code, data)} */}
                    {/* <FormattedMessage id={intlId} values={data} /> */}
                </div>
            </>
        );
    };

    return (
        <div className={classes.basicsCon}>
            <Card size="col-9">
                <CardHeader>{intl.formatMessage({ id: 'Manage-Tournament-Activity-Log_Activity Feed' })}</CardHeader>
                <CardBody customClass={classes.basicsInner}>
                    <div className={cx('group')}>
                        <div className={classes.bold}></div>
                        {t8tLogs.map((log, index) =>
                            index !== t8tLogs.length - 1 ? (
                                <div className={cx('blackBg', 'needBottom')} key={index}>
                                    <Content {...log} />
                                </div>
                            ) : (
                                <div className={cx('blackBg')} key={index}>
                                    <Content {...log} />
                                </div>
                            )
                        )}
                    </div>
                </CardBody>
                {total > _pageno * _limit ? (
                    loading ? (
                        <Loading />
                    ) : (
                        /* eslint-disable jsx-a11y/anchor-is-valid */
                        <a
                            href="#"
                            className={classes.showMore}
                            onClick={() => {
                                setLoading(true);
                                set_pageno(_pageno + 1);
                            }}
                        >
                            Show More
                        </a>
                    )
                ) : null}
            </Card>
        </div>
    );
};

export default ActivityLog;
