import React, { useContext } from 'react';
import classes from '../style.module.scss';
import classNames from 'classnames/bind';
import { withPopWindowConsumer } from 'components/layouts/PopWindow/Context';
import { PopWindowStorage } from 'components/DesignSystem/PopWindow_V2';
import Button from 'components/DesignSystem/Input/Button';
import MoreRewards from '../MoreRewards';
import { TournamentContext } from '../../../TournamentContext';
const cx = classNames.bind(classes);

/**
 * Show All Rewards button
 * @param {*} param0
 */
const ShowAllRewardsButton = ({ prizes }) => {
    const { intl } = useContext(TournamentContext);
    const popWindowData_V2 = useContext(PopWindowStorage);
    const { openPopWindow } = popWindowData_V2;
    const handleClickMoreRewards = () => {
        openPopWindow({
            title: intl.formatMessage({ id: 'Single-Tournament-Page_MoreRewards' }),
            component: (
                <>
                    <pop-content>
                        <MoreRewards prizes={prizes} />
                    </pop-content>
                </>
            )
        });
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
