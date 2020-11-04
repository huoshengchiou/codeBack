import React, { useState, useEffect, useRef, useContext } from 'react';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { from } from 'rxjs';

import { withConfigConsumer } from 'contexts/Config';
import { withAuthConsumer } from 'contexts/Auth';

import { getT8t } from 'apis/tournament';

import Menu from 'components/pages/Tournament/components/Menu';
import Loading from 'components/utils/Loading';

import ParticipantsList from './ParticipantsList';
import CompetitionList from './CompetitionList';

import Notifications from './Notifications';
import SeedBracketSettings from './SeedBracketSettings';
import AssignJudge from './AssignJudge';
import ActivityLog from './ActivityLog';
import ShareLinkandCodes from './ShareLinkandCodes';
import RequiredData from './RequiredData';

import classes from '../styles.module.scss';

import { EditManageContext } from '../Context';

const Manage = () => {
    const { t8tDetail, location, contextIsLoading, manageMenuList } = useContext(EditManageContext);
    const [selectIndex, setSelectIndex] = useState(location.hash === '#seedbracketsetting' ? 5 : 1);

    const GetComponent = () => {
        switch (selectIndex) {
            case 1:
                return <ParticipantsList></ParticipantsList>;
            case 2:
                return <CompetitionList></CompetitionList>;
            case 3:
                return <Notifications></Notifications>;
            case 4:
                return <RequiredData></RequiredData>;
            case 6:
                return <SeedBracketSettings></SeedBracketSettings>;
            case 8:
                return <AssignJudge></AssignJudge>;
            case 9:
                return <ActivityLog></ActivityLog>;
            case 11:
                return <ShareLinkandCodes></ShareLinkandCodes>;
            default:
                break;
        }
    };

    return (
        <>
            {contextIsLoading ? (
                <Loading />
            ) : (
                <>
                    <div className={classes.contentbox}>
                        <div className="col-3">
                            <Menu
                                menuList={
                                    t8tDetail.request_titles.length > 0
                                        ? manageMenuList.filter(item => item !== '')
                                        : manageMenuList.filter(item => item.key !== 4 && item !== '')
                                }
                                activeIndex={selectIndex}
                                setSelectIndex={prop => {
                                    setSelectIndex(prop.item.key);
                                }}
                                is_editFinish={true}
                            ></Menu>
                        </div>
                        <div className="col-9">{GetComponent()}</div>
                    </div>
                </>
            )}
        </>
    );
};

export default Manage;
