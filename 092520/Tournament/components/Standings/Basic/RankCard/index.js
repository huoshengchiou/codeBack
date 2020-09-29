import React from 'react';
import isNil from 'lodash/isNil';
import classNames from 'classnames/bind';
import { withConfigConsumer } from 'contexts/Config';
import IconImage from '../../../IconImage';
import classes from './style.module.scss';

const cx = classNames.bind(classes);

const RankCard = ({ configData, rank, no, isIndividual }) => {
  const { pathPrefix } = configData;
  const { icon_image, in_game_id, username, team_name, team_url_key } = rank;
  const to = isIndividual
    ? `${pathPrefix}/player/${username}`
    : `${pathPrefix}/team/list/${team_url_key}`;

  return (
    <>
      {rank && (
        <a href={to} className={cx('rankCard', `rankNo${no}`)}>
          <img src={require(`../../imgs/bg${no}.png`)} alt="" />

          <div className={classes.rankUserImg}>
            <IconImage iconImage={icon_image} />
          </div>

          <div className={classes.userInfo}>
            <h5>{isIndividual ? username : team_name}</h5>

            {isIndividual &&
              (isNil(in_game_id) || in_game_id === '' ? (
                // <p>N/A</p>
                ""
              ) : (
                  <p className={classes.gameID}>{in_game_id}</p>
                ))}
          </div>
        </a>
      )}
    </>
  );
};

export default withConfigConsumer(RankCard);
