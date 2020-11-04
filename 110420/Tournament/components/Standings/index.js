import React, { useContext } from 'react';
import { TournamentContext } from '../../TournamentContext';
import Basic from './Basic'
import AwardPodium from './Basic/AwardPodium';
import RankList from './Basic/RankList';

import FreeForAll from './FreeForAll'
import classes from './style.module.scss';

const Standings = ({ }) => {
  const { isIndividual, intl, renderT8tInfo, t8t_serial } = useContext(TournamentContext);
  const { bracket_type } = renderT8tInfo;


  const getComponent = (type) => {
    switch (type) {
      case "single":
      case "double":
        return <Basic t8t_serial={t8t_serial} intl={intl} isIndividual={isIndividual} />
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
