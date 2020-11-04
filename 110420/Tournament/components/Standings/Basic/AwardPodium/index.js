import React from 'react';
import RankCard from '../RankCard';
import classes from '../../style.module.scss';

const AwardPodium = ({ rank, isIndividual }) => {
  return (
    <>
      {rank[1] && <RankCard no="1" rank={rank[1]} isIndividual={isIndividual} />}
      {rank[0] && <div className={classes.rankMargin}><RankCard no="0" rank={rank[0]} isIndividual={isIndividual} /></div>}
      {rank[2] && <RankCard no="2" rank={rank[2]} isIndividual={isIndividual} />}
    </>
  );
};

export default AwardPodium;
