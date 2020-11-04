import React, { useContext } from 'react';
import isNil from 'lodash/isNil';
import { withConfigConsumer } from 'contexts/Config';
import { TournamentContext } from 'components/pages/Tournament/TournamentContext';
import classes from '../style.module.scss';

const Rank = ({ renderT8tInfo, configData, rank = 0 }) => {
  // const { renderT8tInfo: info } = useContext(TournamentContext);
  const info = renderT8tInfo
  const { getImageUrl, getGameByGameId } = configData;
  const gameId = info?.t8t_lite?.game?.game_id;

  if (isNil(rank) || !gameId) {
    return null;
  }

  const game = getGameByGameId(gameId);
  const rankTier = game?.rank_tiers[rank];

  if (!rankTier) {
    return null;
  }

  return (
    <div className={classes.cardStatus}>
      <p className={classes.rank}>
        <img alt="" src={getImageUrl(rankTier.badge_image)} />
        <span className="capitalize">{rankTier.name}</span>
      </p>
    </div>
  );
};

export default withConfigConsumer(Rank);
