import React, { useContext } from 'react';
import { TournamentContext } from '../../TournamentContext';
import OverviewMenus from './OverviewMenus';
import RewardList from './RewardList';
import ShowAllRewardsButton from './ShowAllRewardsButton';
import DescCard from './DescCard';
import Schedule from './Schedule';
import DoubleSchedule from './DoubleSchedule';
import FFASchedule from './FFASchedule';
import Sponsor from './Sponsor';
import classes from './style.module.scss';

const Overview = () => {
    const { renderT8tInfo: info, intl } = useContext(TournamentContext);

    if (!info) {
        return null;
    }

    const getScheduleComponent = () => {
        switch (info.bracket_type) {
            case 'double':
                return <DoubleSchedule rounds={info.bracket_rounds} />;
            case 'ffa':
                return <FFASchedule rounds={info.bracket_rounds} />;
            default:
                return <Schedule rounds={info.bracket_rounds} />;
        }
    };

    return (
        <div className={classes.box}>
            <OverviewMenus />

            <div className={`${classes.innerRight} col-9`}>
                <RewardList prizes={info.prizes} />

                {info.prizes?.length > 0 && <ShowAllRewardsButton prizes={info.prizes} />}

                <div className={classes.desc}>
                    <DescCard
                        title={intl.formatMessage({ id: 'Single-Tournament-Page_Description' })}
                        desc={info.description}
                        emptyText={intl.formatMessage({
                            id: 'Single-Tournament-Page_No Description in this Tournament'
                        })}
                    />
                    <DescCard
                        title={intl.formatMessage({ id: 'Single-Tournament-Page_Rule' })}
                        desc={info.rule}
                        emptyText={intl.formatMessage({ id: 'Single-Tournament-Page_No Rule in this tournament' })}
                    />
                </div>
                {/* Schedule */}
                {getScheduleComponent()}

                <Sponsor sponsors={info.sponsors} />
            </div>
        </div>
    );
};

export default Overview;
