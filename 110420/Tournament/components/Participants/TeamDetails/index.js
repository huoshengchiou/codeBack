import React, { useState, useContext } from 'react';
import classNames from 'classnames/bind';
import PlayerCard from '../PlayerCard';
import classes from '../style.module.scss';
import IconImage from '../../IconImage';

const cx = classNames.bind(classes);

const TeamDetails = ({
    renderT8tInfo,
    intl,
    TournamentContext,
    teamIcon,
    teamName,
    teamPlayer = [],
    authData,
    getUseGetRank
}) => {
    if (!teamPlayer) {
        return null;
    }

    const starters = [];
    const bench = [];
    teamPlayer.forEach(o => (o.is_starter ? starters.push(o) : bench.push(o)));

    return (
        <div className={classes.teamDetails}>
            <div>
                {teamName && (
                    <>
                        <div className={classes.header}>
                            <div className={classes.clubImg}>
                                <div className={classes.inner}>
                                    <IconImage iconImage={teamIcon} />
                                </div>
                            </div>
                            {teamName}
                        </div>
                    </>
                )}
                <div className={classes.playerListContainer}>
                    <h3 className={classes.title}>{`${intl.formatMessage({
                        id: 'Single-Tournament-Page-By-Teams_Starters'
                    })} (${starters.length})`}</h3>
                    <div>
                        {starters.map(o => (
                            <PlayerCard
                                renderT8tInfo={renderT8tInfo}
                                key={o.t8t_team_player_id}
                                {...o}
                                authData={authData}
                                intl={intl}
                                getUseGetRank={getUseGetRank}
                            />
                        ))}
                    </div>
                </div>

                <div className={classes.playerListContainer}>
                    <h3 className={classes.title}>{`${intl.formatMessage({
                        id: 'Single-Tournament-Page-By-Teams_Bench Players'
                    })} (${bench.length})`}</h3>
                    <div>
                        {bench.map(o => (
                            <PlayerCard
                                renderT8tInfo={renderT8tInfo}
                                key={o.t8t_team_player_id}
                                {...o}
                                authData={authData}
                                intl={intl}
                                getUseGetRank={getUseGetRank}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamDetails;
