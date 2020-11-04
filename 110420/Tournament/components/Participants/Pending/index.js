import React, { useContext, useEffect, useState } from 'react';
import { TournamentContext } from '../../../TournamentContext';
import { useFetchParticipants } from '../../../hooks/useFetchParticipants';
import TeamCard from '../TeamCard';
import PlayerCard from '../PlayerCard';
import classes from '../style.module.scss';

const Pending = ({ search }) => {
  const { t8t_serial, isIndividual, intl, authData, getUseGetRank } = useContext(TournamentContext);
  const [pageNo, setPageNo] = useState(1);
  const [metaPage, setMetaPage] = useState();
  const [list, setList] = useState([]);
  const [participants, setParticipants] = useState([]);

  useFetchParticipants({
    t8t_serial,
    isIndividual,
    limit: -1,
    pageNo,
    pending: true,
    search,
    setMetaPage,
    setList,
  });

  useEffect(() => {
    setParticipants([]);
  }, [search]);

  useEffect(() => {
    setParticipants(list);
  }, [list]);

  if (!participants) {
    return null;
  }

  // console.log('participants', participants)
  const players = participants?.map(o => <PlayerCard key={o.t8t_player_id} {...o} pendingFlag={true} authData={authData} intl={intl} getUseGetRank={getUseGetRank} />);

  const teams = participants?.map(o => <TeamCard key={o.t8t_team_id} {...o} pendingFlag={true} authData={authData} intl={intl} getUseGetRank={getUseGetRank} />);

  return (
    <div className={classes.playerListContainer}>
      <h3 className={classes.title}>{intl.formatMessage({ id: 'Single-Tournament-Page_Pending List' })} ({metaPage?.total})</h3>
      <div>{isIndividual ? players : teams}</div>
    </div>
  );
};

export default Pending;
