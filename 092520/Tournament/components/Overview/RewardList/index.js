import React from 'react';
import RewardCard from '../RewardCard';
import classes from './style.module.scss';

/**
 * RewardList
 * @param {*} param0
 */
const RewardList = ({ prizes }) => {
  if (!prizes) {
    return null;
  }

  return (
    <div className={classes.rewardList}>
      {prizes.slice(0, 3).map(o => (
        <RewardCard key={o.t8t_prize_id} {...o} />
      ))}
    </div>
  );
};

export default RewardList;
