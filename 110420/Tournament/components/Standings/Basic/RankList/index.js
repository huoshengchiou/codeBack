import React from 'react';
import isNil from 'lodash/isNil';
import IconImage from '../../../IconImage';
import Icon from 'components/DesignSystem/Base/Icons';
import classes from './style.module.scss';

const RankList = ({ rank, isIndividual, AdjustForEmbed, intl }) => {
  return (
    <div className={classes.rankTable}>
      <table className={AdjustForEmbed && classes.mt0} >
        <thead>
          <tr>
            <th>{intl.formatMessage({ id: 'Single-Tournament-Page-Standings_Rank' })}</th>
            <th>{intl.formatMessage({ id: 'Single-Tournament-Page-Standings_User Name' })}</th>
            <th>{intl.formatMessage({ id: 'Single-Tournament-Page-Standings_Title' })}</th>
          </tr>
        </thead>
        <tbody>
          {rank?.map(
            ({ rank, icon_image, in_game_id, username, team_name, t8t_player_id, t8t_team_id, is_in_game_id_verified }) => (
              <tr key={isIndividual ? t8t_player_id : t8t_team_id}>
                <td>
                  <p className={classes.rankNumber}>
                    #<span>{rank}</span>
                  </p>
                </td>

                <td className={classes.userName}>
                  <div>
                    <IconImage iconImage={icon_image} />

                    <div className={classes.userInfo}>
                      <h5>{isIndividual ? username : team_name}</h5>

                      {isIndividual &&
                        (isNil(in_game_id) || in_game_id === '' ? (
                          <p>N/A</p>
                        ) : (
                            <span className={classes.gameID}>
                              {in_game_id}
                              {is_in_game_id_verified && <Icon name={'Verifiation'} customClass={classes.icon} />}
                            </span>
                          ))}
                    </div>
                  </div>
                </td>

                <td></td>
              </tr>
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RankList;
