import React, { useContext, useEffect, useState } from 'react';
import { TournamentContext } from '../../../TournamentContext';
import { useFetchParticipants } from '../../../hooks/useFetchParticipants';
import TeamCard from '../TeamCard';
import PlayerCard from '../PlayerCard';
import classes from '../style.module.scss';

const Registration = ({ search, setIsRegistered }) => {
  const { t8t_serial, isIndividual, intl, authData, getUseGetRank } = useContext(TournamentContext);

  const [pageNo, setPageNo] = useState(1);
  const [participantType, setParticipantType] = useState();
  const [metaPage, setMetaPage] = useState();
  const [list, setList] = useState([]);
  const [participants, setParticipants] = useState([]);

  useFetchParticipants({
    t8t_serial,
    isIndividual,
    pageNo,
    search,
    setMetaPage,
    setParticipantType,
    setList,
  });

  useEffect(() => {
    setParticipants([]);
  }, [search]);

  useEffect(() => {
    setParticipants(o => [...o, ...list]);
  }, [list]);

  const handleClick = () => {
    setPageNo(o => o + 1);
  };

  if (!participants) {
    return null;
  }

  const players = participants?.map(o => <PlayerCard key={o.t8t_player_id} {...o} authData={authData} intl={intl} getUseGetRank={getUseGetRank} />);

  const teams = participants?.map(o => <TeamCard key={o.t8t_team_id} {...o} authData={authData} intl={intl} getUseGetRank={getUseGetRank} />);

  const isRegistered = participantType === 'registered';
  const caption = isRegistered
    ? intl.formatMessage({ id: 'Single-Tournament-Page_Registration List' })
    : intl.formatMessage({ id: 'Single-Tournament-Page-Registration-Closed_Competition List' });
  setIsRegistered(isRegistered);

  return (
    <div className={classes.playerListContainer}>
      <h3 className={classes.title}>
        {caption} ({metaPage?.total})
      </h3>

      <div>
        {!isRegistered && metaPage && metaPage?.total === '0' && "Admin hasn't generated seed yet"}
        {isIndividual ? players : teams}
      </div>

      {metaPage?.total > participants.length && (
        <div className={classes.more} onClick={handleClick}>
          {intl.formatMessage({ id: 'Single-Tournament-Page-Registration-Closed_Show More' })}
        </div>
      )}
    </div>
  );
};

export default Registration;
