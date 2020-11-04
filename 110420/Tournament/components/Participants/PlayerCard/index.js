import React, { useContext } from 'react';
import classNames from 'classnames/bind';
import { withConfigConsumer } from 'contexts/Config';

import Thumbnail from 'components/DesignSystem/DataDisplay/Thumbnail';
import Icon from 'components/DesignSystem/Base/Icons';

import Rank from '../Rank';
import Banner_btn from '../../../Banner/Banner_btn';
import classes from '../style.module.scss';
import { TournamentContext } from '../../../TournamentContext';

const cx = classNames.bind(classes);

const PlayerCard = ({
  configData,
  icon_image,
  username,
  rank,
  in_game_id,
  is_in_game_id_verified,
  pendingFlag,
  member_id,
  intl,
  authData,
  getUseGetRank,
  game_data
}) => {

  // console.log(useContext(TournamentContext))
  // const { intl, authData } = useContext(TournamentContext);

  const { getImageUrl, pathPrefix, placeholders } = configData;
  const { getMemberId } = authData;
  const to = `${pathPrefix}/player/${username}`;
  const pending = pendingFlag && member_id === getMemberId();

  return (
    <div href={to} className={cx('playerCard', 'cardStyle')}>
      {pending && (
        <div className={classes.singlePendingBlock}>
          <div className={classes.singlePendingBtnWrapper}>
            <Banner_btn adjustStyle={true} />
          </div>
          <div className={classes.singlePendingMsg}>
            {intl.formatMessage({ id: 'Single-Tournament-Page-By-Teams_Remember to Complete !' })}
          </div>
        </div>
      )}

      <a href={to} style={{ textDecoration: 'none' }}>
        <div className={classes.userContent}>
          <div className={classes.clubImg}>
            <Thumbnail
              size="128px"
              border={{ double: true, gap: 4 }}
              shape="circle"
              imgUrl={getImageUrl(icon_image || placeholders.member_profile_picture)}
            />
          </div>

          <div className={classes.userInfo}>
            <h5>{username}</h5>
            <span className={classes.gameID}>
              {in_game_id}
              {is_in_game_id_verified && <Icon name={'Verifiation'} customClass={classes.icon} />}
            </span>

          </div>
        </div>
        <div className={classes.playerRank}>
          {getUseGetRank(game_data)}
        </div>
      </a>
    </div>
  );
};

export default withConfigConsumer(PlayerCard);
