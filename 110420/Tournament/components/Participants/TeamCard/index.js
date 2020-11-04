import React, { useContext } from 'react';
import isNil from 'lodash/isNil';
import classNames from 'classnames/bind';
import { withConfigConsumer } from 'contexts/Config';
import { withPopWindowConsumer } from 'components/layouts/PopWindow/Context';
import Thumbnail from 'components/DesignSystem/DataDisplay/Thumbnail';
import AvatarList from 'components/DesignSystem/DataDisplay/AvatarList';
import { TournamentContext } from '../../../TournamentContext';
import TeamDetails from '../TeamDetails';
import classes from '../style.module.scss';
import Banner_btn from '../../../Banner/Banner_btn';

const cx = classNames.bind(classes);

const TeamCard = ({
  configData,
  popWindowData,
  icon_image,
  team_name,
  team_player,
  pendingFlag,
  t8tTeamApplier,
  authData,
  intl
}) => {
  const { renderT8tInfo ,getUseGetRank} = useContext(TournamentContext);
  const { openPopWindowFunc } = popWindowData;
  const { member_id } = t8tTeamApplier;
  const { getMemberId } = authData;
  const { getImageUrl, pathPrefix, placeholders } = configData;

  const pending = pendingFlag && member_id === getMemberId();




  if (!team_player) team_player = [];

  const images =
    team_player.length !== 0
      ? team_player.map(({ member_id, username, icon_image }) => ({
        member_id,
        username,
        imageUrl: getImageUrl(icon_image),
        linkPath: `${pathPrefix}/player/${username}`,
      }))
      : [...Array(5).keys()].map((val, idx) => {
        return {
          member_id: '',
          username: '',
          imageUrl: getImageUrl(placeholders.member_profile_picture),
          linkPath: '',
        };
      });

  // show team detail
  const handleClick = () => {
    if (pending) return;

    const popWindowObj = {
      component: TeamDetails,
      componentProps: {
        title: intl.formatMessage({ id: 'Single-Tournament-Page-By-Teams_Team Details' }),
        teamIcon: icon_image,
        teamName: team_name,
        teamPlayer: team_player,
        appearanceStyle: 'dark',
        intl: intl,
        renderT8tInfo: renderT8tInfo,
        authData: authData,
        getUseGetRank: getUseGetRank
      },
      closeByButtonOnly: true,
      isFullModeForMobile: true,
    };

    openPopWindowFunc(popWindowObj);
  };

  return (
    <div className={cx('teamCard', 'cardStyle')} onClick={handleClick}>
      {pending ? (
        <div className={classes.myTeamPendingBlock}>
          <div className={classes.myTeamPendingBtnWrapper}>
            <Banner_btn adjustStyle={true} />
          </div>
          {/* Remember to Complete ! */}
          <div className={classes.myTeamPendingMsg}>
            {intl.formatMessage({ id: 'Single-Tournament-Page-By-Teams_Remember to Complete !' })}
          </div>
        </div>
      ) : pendingFlag ? (
        <div className={classes.avatarBlock}></div>
      ) : null}

      <div className={classes.clubImg}>
        <Thumbnail
          size="128px"
          border={{ double: true, gap: 4 }}
          shape="circle"
          imgUrl={getImageUrl(icon_image || placeholders.team_logo_image)}
        />
      </div>

      <div className={classes.userInfo}>
        <h5>{team_name || 'Pending Team'}</h5>
      </div>

      <div className={classes.cardStatus}>
        <AvatarList memberList={images} limit={5} />
      </div>
    </div>
  );
};

export default withConfigConsumer(withPopWindowConsumer(TeamCard));
