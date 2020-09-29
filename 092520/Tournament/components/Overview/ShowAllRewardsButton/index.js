import React, { useContext } from 'react';
import classes from '../style.module.scss';
import classNames from 'classnames/bind';
import { withPopWindowConsumer } from 'components/layouts/PopWindow/Context';
import Button from 'components/DesignSystem/Input/Button';
import MoreRewards from '../MoreRewards';
import { TournamentContext } from '../../../TournamentContext';

const cx = classNames.bind(classes);

/**
 * Show All Rewards button
 * @param {*} param0
 */
const ShowAllRewardsButton = ({ popWindowData, prizes }) => {
    const { intl } = useContext(TournamentContext);
    const { openPopWindowFunc } = popWindowData;

    const handleClickMoreRewards = () => {
        const popWindowObj = {
            component: MoreRewards,
            componentProps: {
                title: intl.formatMessage({ id: 'Single-Tournament-Page_MoreRewards' }),
                prizes,
            },
            closeByButtonOnly: true,
            isFullModeForMobile: true,
        };

        openPopWindowFunc(popWindowObj);
    };
    return (
        <div className={classes.btnBox}>
            <Button
                title={intl.formatMessage({ id: 'Single-Tournament-Page_[btn]Show All Rewards' })}
                theme="dark_2"
                customClass={classes.rewardsBtn}
                onClick={() => handleClickMoreRewards()}
            />
        </div>
    );
};

export default withPopWindowConsumer(ShowAllRewardsButton);
