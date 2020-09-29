import React from 'react';
import classes from '../style.module.scss';
import classNames from 'classnames/bind';
import RewardCard from '../RewardCard';

const cx = classNames.bind(classes);

/**
 * More Rewards modal
 * @param {*} param0
 */
const MoreRewards = ({ prizes }) => {
    return (
        <div className={classes.moreRewardsBox}>
            <div className={cx('rewardList', 'moreRewardsCard')}>
                {prizes.map((o) => (
                    <RewardCard key={o.t8t_prize_id} {...o} />
                ))}
            </div>
        </div>
    );
};

export default MoreRewards;
