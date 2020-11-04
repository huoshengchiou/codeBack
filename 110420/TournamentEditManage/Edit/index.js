import React, { useContext } from 'react';

import classes from '../styles.module.scss';
import classNames from 'classnames/bind';

import Loading from 'components/utils/Loading';
import Card from 'components/DesignSystem/DataDisplay/Card';

import Basics from './Basics';
import BracketSettings from './BracketSetting';
import EditStream from './EditStream';
import Info from './Info';
import PublishSettings from './PublishSettings';
import Settings from './Setting';
import Sponsor from './Sponsor';

import Menu from 'components/pages/Tournament/components/Menu';

import { EditManageContext } from '../Context';

const Edit = () => {
    const {
        t8tDetail,
        contextIsLoading,
        intl,
        editMenuList,
        percent,
        selectEditIndex,
        setEditSelectMenu,
        editClickBack
    } = useContext(EditManageContext);

    const GetComponent = () => {
        switch (selectEditIndex) {
            case 1:
                return <Basics />;
            case 2:
                return <Info />;
            case 3:
                return <Settings />;
            case 5:
                return <BracketSettings />;
            case 7:
                return <EditStream />;
            case 9:
                return <Sponsor />;
            case 10:
                return <PublishSettings />;
        }
    };

    return (
        <>
            {contextIsLoading ? (
                <Loading />
            ) : (
                <>
                    {t8tDetail.is_create_finished ? (
                        ''
                    ) : (
                        <div className={classes.energyBar}>
                            <div className={classes.left}>
                                {intl.formatMessage({
                                    id: 'Tournament-Management-Create-New-Tournament_Settings Completeness'
                                })}
                                <div className={classes.bar}>
                                    <div className={classes.power} style={{ width: `${percent}%` }} />
                                </div>
                            </div>
                            <div className={classes.right}>
                                {percent}
                                <span>%</span>
                            </div>
                        </div>
                    )}
                    <div className={classes.contentbox}>
                        <div className="col-3">
                            <Menu
                                menuList={
                                    t8tDetail.t8t_lite.club_sales_type === 'general'
                                        ? editMenuList.filter(item => item.key !== 9)
                                        : editMenuList
                                }
                                activeIndex={selectEditIndex}
                                is_editFinish={t8tDetail.is_create_finished}
                                setSelectIndex={prop => {
                                    setEditSelectMenu(prop);
                                }}
                            />
                        </div>
                        <div className="col-9">{GetComponent()}</div>
                    </div>
                </>
            )}
        </>
    );
};

export default Edit;
