import React from 'react';
import IconImage from '../../IconImage';
import classes from './style.module.scss';

/**
 * RewardCard
 * @param {*} param0
 */
const RewardCard = ({ title, name, description, prize_image, link }) => {


  return (
    <div className={classes.rewardCard} onClick={() => {
      if (!link) {
        return
      }
      window.open(link)
    }}>
      <div className={classes.rewardStatus}>
        <span>{title}</span>
      </div>
      <div className={classes.ImgWrapper}>{prize_image && <IconImage iconImage={prize_image} />}</div>
      <div className={classes.rewardContent}>
        <h4>{name}</h4>
        <p>{description}</p>
      </div>
    </div>
  );
};

export default RewardCard;
