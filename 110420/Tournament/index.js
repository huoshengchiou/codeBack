import React, { useEffect, useRef, useState } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { tournamentRoutes } from 'config/routes/tournament.js';
import { withAuthConsumer } from 'contexts/Auth';
import { withConfigConsumer } from 'contexts/Config';
import TemplateV2 from 'components/layouts/TemplateV2';
import TabLv1 from "components/DesignSystem/DataDisplay/Tab/TabLv1";
import { withPopWindowConsumer } from 'components/layouts/PopWindow/Context';
import { withDialogConsumer } from 'components/layouts/Dialog/Context';

//local state store
import { TournamentContainer } from './TournamentContext';
import {
    Observable,
    Subject,
    asapScheduler,
    pipe,
    of,
    from,
    interval,
    merge,
    fromEvent,
} from "rxjs";
import Banner from './Banner';
import TopBar from './components/Bar/TopBar';
import FloatBar from './components/Bar/FloatBar';
import BarContainer from './components/BarContainer';
import TabLv1_v2 from 'components/DesignSystem/DataDisplay/Tab/TabLv1/TabLv1_v2'


//translate
import { injectIntl } from 'react-intl'

const Tournament = ({ match, history, configData, location, authData, dialogData, intl, popWindowData }) => {

    // const scroll = useRef(null)
    // const scroll$ = useRef(null)
    useEffect(() => {
        // const scrollCapture = document.querySelector('#scrollCapture')
        // scroll.current = fromEvent(scrollCapture, 'scroll')
        // scroll$.current = scroll.current.subscribe(e => handleScrollRx(e))
        if (!match.params?.tab_name) {
            history.replace(
                `${configData.pathPrefix}/tournament/list/${match.params.t8t_serial}/home`
            );
        }
        return () => {
            // scroll$.current.unsubscribe() 
        };
    }, []);

    const tabMaterial = tournamentRoutes.map((val, idx) => {
        let titleString = ''
        switch (val.title) {
            case 'Overview':
                titleString = intl.formatMessage({ id: 'Single-Tournament-Page_Overview' })
                break
            case 'Participants':
                titleString = intl.formatMessage({ id: 'Single-Tournament-Page_Participants' })
                break
            case 'Brackets':
                titleString = intl.formatMessage({ id: 'Single-Tournament-Page_Brackets' })
                break
            case 'Standings':
                titleString = intl.formatMessage({ id: 'Single-Tournament-Page_Standings' })
                break
            case 'Media':
                titleString = intl.formatMessage({ id: 'Single-Tournament-Page_Media' })
                break
            default:
                titleString = ''
        }
        return { TabName: titleString, id: idx, path: val.path, key: val.key }
    })

    const handleClickTab = (obj) => {
        // return console.log(obj)
        // const target = tournamentRoutes[index];
        // console.log(target);
        history.push(
            `${configData.pathPrefix}/tournament/list/${match.params.t8t_serial}/${obj.key}`
        );
    };

    let targetIndex = 0;
    if (match.params?.tab_name) {
        const { tab_name } = match.params;
        targetIndex = tournamentRoutes.findIndex((tab) => tab.key === tab_name);
    }

    if (!match.params?.t8t_serial) return null;

    return (<>
        <TournamentContainer
            parentgift={{ match, history, configData, location, authData, dialogData, intl, popWindowData }}
        >
            <BarContainer height={480} topBar={TopBar} floatBar={FloatBar}></BarContainer>
            <TemplateV2>
                <Banner />
                <div style={{ width: '1129px', padding: '10px 0 0 0', margin: '0 auto' }}> <TabLv1_v2 Tablist={tabMaterial} onClick={handleClickTab} defaultIdx={targetIndex} /></div>

                {/* <TabLv1
                    theme="dark"
                    tabList={tournamentRoutes.map((val) => {
                        switch (val.title) {
                            case 'Overview':
                                return { ...val, title: intl.formatMessage({ id: 'Single-Tournament-Page_Overview' }) }
                            case 'Participants':
                                return { ...val, title: intl.formatMessage({ id: 'Single-Tournament-Page_Participants' }) }
                            case 'Brackets':
                                return { ...val, title: intl.formatMessage({ id: 'Single-Tournament-Page_Brackets' }) }
                            case 'Standings':
                                return { ...val, title: intl.formatMessage({ id: 'Single-Tournament-Page_Standings' }) }
                            case 'Media':
                                return { ...val, title: intl.formatMessage({ id: 'Single-Tournament-Page_Media' }) }
                            default:
                                return {}
                        }
                    })}
                    defaultIndex={targetIndex}
                    onClick={(index) => handleClickTab(index)}
                /> */}

                <div>
                    <Switch>
                        {tournamentRoutes.map((route, key) => {
                            return (
                                <Route
                                    key={`route_${key}`}
                                    path={`${configData.pathPrefix}/tournament/list/:t8t_serial${route.path}`}
                                    exact={route.exact}
                                    render={() => (
                                        <route.component tabKey={route.key} />
                                        // <div>{route.key}</div>
                                    )}
                                />
                            );
                        })}
                    </Switch>
                </div>
            </TemplateV2>
        </TournamentContainer>
    </>
    );
};

export default withRouter(
    withConfigConsumer(withAuthConsumer(withPopWindowConsumer(withDialogConsumer(injectIntl(Tournament)))))
);

