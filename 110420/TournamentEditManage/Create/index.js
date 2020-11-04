import React, { useState, useEffect, useRef } from "react";

import { withConfigConsumer } from "contexts/Config";
import { withAuthConsumer } from "contexts/Auth";
import { withRouter } from "react-router-dom";

import { postCreate } from "apis/tournament";
import { from } from "rxjs";

import GameInfo from './GameInfo'

import GameList from './GameList'
import BarContainer from 'components/pages/Tournament/components/BarContainer'
import Bar from '../Bar';

const Create = props => {
    const { history, location, match, configData, authData } = props;
    const { apiWithTokenWrapper } = authData;

    const [game, setGame] = useState(null);

    const fetchListener = useRef();

    const node = document.querySelector('#scrollCapture');
    node.scrollTo({
        top: 0,
        left: 0,
        behavior: 'auto'
    })

    useEffect(() => {
        return () => {
            if (fetchListener.current) {
                fetchListener.current.unsubscribe();
            }
        };
    }, [match.params.clubid]);

    const createAPI = (prop) => {
        let data = { club_id: match.params.clubid, game_id: game.game_id, name: prop.name, t8t_serial: prop.tournament || '' };

        fetchListener.current = from(apiWithTokenWrapper(postCreate, data)).subscribe(res => {
            if (res.status === 200) {
                if (res.data.header.status.toUpperCase() === "OK") {

                    history.push({
                        ...location,
                        pathname: `${configData.pathPrefix}/tournament/editmanage/${match.params.clubid}/${res.data.body.t8t.t8t_lite.t8t_serial}`
                    });

                }
            }
        });
    };


    return (
        <>
            <BarContainer topBar={Bar}></BarContainer>
            {
                game === null ?
                    <GameList onSelect={(data) => setGame(data)}></GameList> :
                    <GameInfo onSubmit={(data) => createAPI(data)} game={game} goBack={() => setGame(null)}></GameInfo>
            }
        </>

    );
};
export default withRouter(withAuthConsumer(withConfigConsumer(Create)));
