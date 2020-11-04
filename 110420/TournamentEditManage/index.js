import React, { useState, useEffect, useRef, useContext } from 'react';

import { withConfigConsumer } from 'contexts/Config';
import { withAuthConsumer } from 'contexts/Auth';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';

import classes from './styles.module.scss';
import TemplateV2 from 'components/layouts/TemplateV2';
// import TabLv1_v2 from 'components/DesignSystem/DataDisplay/Tab/TabLv1/TabLv1_v2'

import TabLv1 from 'components/DesignSystem/DataDisplay/Tab/TabLv1';
import HeaderBar from 'components/pages/Tournament/components/HeaderBar';
import Edit from './Edit';
import Manage from './Manage';
import EditManageContainer from './Context';
import { EditManageContext } from './Context';

import Loading from 'components/utils/Loading';

import BarContainer from 'components/pages/Tournament/components/BarContainer';
import Bar from './Bar';

const Index = () => {
    return (
        <>
            <EditManageContainer>
                <EditManage></EditManage>
            </EditManageContainer>
        </>
    );
};

const EditManage = () => {
    const {
        t8tDetail,
        authData,
        tabList,
        history,
        location,
        configData,
        match,
        contextIsLoading,
        editClickBack,
        urlHash,
        setUrlHash
    } = useContext(EditManageContext);

    const { is_create_finished, participants_count } = t8tDetail;
    const { isLoggedIn } = authData;
    const [targetIndex, setTargetIndex] = useState(0);

    useEffect(() => {
        if (!isLoggedIn) {
            history.push({
                ...location,
                pathname: `${configData.pathPrefix}/tournament`,
                hash: '#sign-in'
            });
            return;
        }
    }, [match.params?.t8t_serial]);

    useEffect(() => {
        if (t8tDetail.is_create_finished) {
            if (urlHash === '#manage' || urlHash === '#seedbracketsetting') {
                setTargetIndex(1);
            }
        }
    }, [contextIsLoading]);

    // const handleClickTab = obj => {
    //     if (!is_create_finished) {
    //         return
    //     }
    //     if (obj.index === 0) {
    //         editClickBack(1)
    //     }

    //     setTargetIndex(obj.index);
    // };

    const handleClickTab = index => {
        if (!is_create_finished) {
            return;
        }
        if (index === 0) {
            setUrlHash(null);
            editClickBack(1);
        }

        setTargetIndex(index);
    };
    return (
        <>
            {contextIsLoading ? (
                <Loading />
            ) : (
                <>
                    <BarContainer
                        topBar={Bar}
                        data={{
                            t8tdetail: t8tDetail,
                            t8t_serial: match.params?.t8t_serial,
                            username: authData.getUsername()
                        }}
                    />
                    <TemplateV2>
                        <>
                            <HeaderBar detail={t8tDetail} participants_count={participants_count} />
                            {/* <TabLv1_v2
                                    theme="dark"
                                    Tablist={is_create_finished ? tabList : tabList.map(val => val.index === 1 ? { ...val, disabled: true } : val)}
                                    defaultIdx={targetIndex}
                                    onClick={(obj) => handleClickTab(obj)}
                                /> */}
                            <TabLv1
                                theme="dark"
                                tabList={
                                    is_create_finished
                                        ? tabList
                                        : tabList.map(val => (val.index === 1 ? { ...val, disabled: true } : val))
                                }
                                defaultIndex={targetIndex}
                                onClick={index => handleClickTab(index)}
                            />
                            <div className={classes.box}>
                                {targetIndex === 0 ? <Edit /> : <Manage participants_count={participants_count} />}
                            </div>
                        </>
                    </TemplateV2>
                </>
            )}
        </>
    );
};

export default withRouter(withAuthConsumer(withConfigConsumer(injectIntl(Index))));
