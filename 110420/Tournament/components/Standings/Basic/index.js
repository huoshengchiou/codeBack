import React from 'react'
//child component
import AwardPodium from './AwardPodium';
import RankList from './RankList';
//api
import { useFetchStanding } from '../../../hooks/useFetchStanding';
//style
import classes from '../style.module.scss';


const Basic = ({ t8t_serial, intl, isIndividual }) => {


    const { standing } = useFetchStanding({ t8t_serial });

    if (!standing) {
        return null;
    }

    const { t8t_players, t8t_teams } = standing;
    const rank = isIndividual ? t8t_players : t8t_teams;



    return (
        t8t_players?.length === 0 && t8t_teams?.length === 0 ? (
            <div className={classes.empty}>{intl.formatMessage({ id: 'Single-Tournament-Page-Standings_Standings Coming soon' })}</div>
        ) : (
                <>
                    <div className={`${classes.cardContainer} ${(rank.length < 3) && classes.additionStyle}`} >
                        <AwardPodium rank={rank.slice(0, 3)} isIndividual={isIndividual} />
                    </div>
                    <RankList rank={rank} isIndividual={isIndividual} intl={intl} />
                </>
            )
    )
}

export default Basic