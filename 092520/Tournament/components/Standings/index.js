import React, { useContext } from 'react';
import { TournamentContext } from '../../TournamentContext';
import AwardPodium from './Basic/AwardPodium';
import RankList from './Basic/RankList';

import FreeForAll from './FreeForAll'
import classes from './style.module.scss';

const Standings = ({ }) => {
  const { standing, isIndividual, intl, renderT8tInfo } = useContext(TournamentContext);

  if (!standing) {
    return null;
  }

  const { t8t_players, t8t_teams } = standing;
  const { bracket_type } = renderT8tInfo;
  const rank = isIndividual ? t8t_players : t8t_teams;


  console.log('比賽資料', rank)
  const getComponent = (type) => {
    switch (type) {
      case "single":
      case "double":
        return t8t_players?.length === 0 && t8t_teams?.length === 0 ? (
          <div className={classes.empty}>{intl.formatMessage({ id: 'Single-Tournament-Page-Standings_Standings Coming soon' })}</div>
        ) : (
            <>
              <div className={`${classes.cardContainer} ${(rank.length < 3) && classes.additionStyle}`} >
                <AwardPodium rank={rank.slice(0, 3)} isIndividual={isIndividual} />
              </div>
              <RankList rank={rank} isIndividual={isIndividual} intl={intl} />
            </>
          )
      case "ffa":
        return <FreeForAll />
    }
  }

  return (
    <div className={classes.box}>
      {getComponent(bracket_type)}
      {/* {t8t_players?.length === 0 && t8t_teams?.length === 0 ? (
        <div className={classes.empty}>{intl.formatMessage({ id: 'Single-Tournament-Page-Standings_Standings Coming soon' })}</div>
      ) : (
          <>
            <div className={classes.cardContainer}>
              <AwardPodium rank={rank.slice(0, 3)} isIndividual={isIndividual} />
            </div>
            <RankList rank={rank} isIndividual={isIndividual} intl={intl} />
          </>
        )} */}
    </div>
  );
};

export default Standings;
