import React, { useState, useEffect } from 'react';
import { withConfigConsumer } from "contexts/Config";
import { withAuthConsumer } from "contexts/Auth";
import { withDialogConsumer } from "components/layouts/Dialog/Context";
import { withPopWindowConsumer } from "components/layouts/PopWindow/Context";

import { injectIntl } from 'react-intl';
import { withRouter } from "react-router-dom"

import Button from 'components/DesignSystem/Input/Button';
import classes from '../style.module.scss';
import cx from 'classnames';
import Thumbnail from 'components/DesignSystem/DataDisplay/Thumbnail';


import {
  formatDateTime,
} from 'utils/formattersV2/date'
import Share from "components/DesignSystem/Feedback/Share";


const MatchCard = (props) => {
  const { offShare = false, data, configData, location, history, closePopWindowFunc, dialogData, intl, authData } = props;
  const { profile } = authData;
  const { openDialogFunc } = dialogData
  const { getImageUrl, pathPrefix } = configData;
  const { t8t_serial, banner_image, game } = data.t8t_lite;
  const [teamUrl, setTeamUrl] = useState('')

  useEffect(() => {
    if (data.tournament_format === 'TvT') {
      let teamMember = data.home_player.concat(data.visitor_player).filter((item) => item.member_id === profile.member_id);
      if (teamMember.length > 0) {
        setTeamUrl(teamMember[0].participant_type === 'visitor' ? data.visitor_name : data.home_name)
      }
    }
  }, [])

  // upcomping 
  // cancelled red
  // waiting_for_checkin
  // ongoing
  // waiting_for_result
  // waiting_for_result_comfirm
  // admin_checking
  // completed green
  // invalid red
  const getStatus = (status) => {
    // status = "waiting_for_checkin"
    switch (status) {
      case "ongoing":
        return <h4>{intl.formatMessage({ id: 'Match-Card-Team-vs-Team_Ongoing' })}</h4>
      case "upcoming":
        return <h4>{intl.formatMessage({ id: 'Match-Card-Team-vs-Team_Upcoming' })}</h4>
      case "cancelled":
        return <h4 className={classes.red}>{intl.formatMessage({ id: 'Match-Card-Team-vs-Team_Cancelled' })}</h4>
      case "waiting_for_checkin":
        return <h4>{intl.formatMessage({ id: 'Match-Card-Team-vs-Team_Waiting for Checkin' })}</h4>
      case "waiting_for_result":
        return <h4>{intl.formatMessage({ id: 'Match-Card-Team-vs-Team_Waiting For Result' })}</h4>
      case "waiting_for_result_comfirm":
      case "waiting_home_verified":
      case "waiting_visitor_verified":
        return <h4>{intl.formatMessage({ id: 'Match-Card-Team-vs-Team_Waiting for Result Confirm' })}</h4>
      case "admin_checking":
      case "waiting_admin_verified":
        return <h4>{intl.formatMessage({ id: 'Match-Card-Team-vs-Team_Admin Checking' })}</h4>
      case "completed":
        return <h4 className={classes.green}>{intl.formatMessage({ id: 'Match-Card-Team-vs-Team_Completed' })}</h4>
      case "invalid":
        return <h4 className={classes.red}>{intl.formatMessage({ id: 'Match-Card-Team-vs-Team_Invalid' })}</h4>
      case "pause":
        return <h4 className={classes.red}>{intl.formatMessage({ id: 'Match-Card-Team-vs-Team_Pause' })}</h4>
    }
  }

  const getDisplayScore = (status) => {
    switch (status) {
      case "waiting_for_checkin":
        return 1
      case "admin_checking":
      case "waiting_admin_verified":
        return 2
      case "upcoming":
        return 3
      default:
        return 0
    }
  }

  const getButtonbyStatus = (status) => {
    switch (status) {
      case "upcoming":
        if (data.is_t8t_checkin) {
          if (data.is_member) {
            return <div>
              <Button title="Go to Check-in" onClick={() => {
                history.replace({
                  ...location,
                  pathname: `${pathPrefix}/tournament/list/${t8t_serial}/home`,
                });
                closePopWindowFunc();
              }} />
            </div>
          }
          else {
            return ""
          }
        }
        return <div>
          <Button title={intl.formatMessage({ id: 'Match-Card-Team-vs-Team_[btn]Enter Battle Room' })} disabled={true} />
        </div>
      case "waiting_for_checkin":
        if (data.is_t8t_checkin) {
          return <div>
            <Button title="Go to Check-in" onClick={() => {
              history.replace({
                ...location,
                pathname: `${pathPrefix}/tournament/list/${t8t_serial}/home`,
              });
              closePopWindowFunc();
            }} />
          </div>
        }
        return ""
      case "ongoing":
      case "waiting_for_result":
      case "waiting_for_result_comfirm":
      case "waiting_home_verified":
      case "waiting_visitor_verified":
      case "waiting_admin_verified":
      case "admin_checking":
        if (data.is_member) {
          return <div>
            <Button title={intl.formatMessage({ id: 'Match-Card-Team-vs-Team_[btn]Enter Battle Room' })} onClick={() => goBattleRoom()} />
            {
              game.game_code === "lol" && data.tournament_format === "TvT" && data.bracket_type !== "ffa" &&
              <Button title={intl.formatMessage({ id: 'Match-Card-Team-vs-Team_[btn]Pre-match Analysis' })} theme="dark_2" onClick={() => {
                window.open(`${pathPrefix}/lol-pre-match/elimination/${t8t_serial}/${data.bracket_elimination_match_id}/${teamUrl}`)
              }} />
            }

          </div>

        }
        return ""
      case "completed":
        return ""
      // <div>
      //   <Button title={intl.formatMessage({ id: 'Match-Card-Team-vs-Team_[btn]Match Details' })} theme="dark_2" />
      // </div>
      default:
        return ""
    }
  }

  const getScoreButtonbyStatus = (status) => {
    let vistorHomeStatus = checkVistorOrHome();
    switch (status) {
      case "ongoing":
        return <div>
          <Button title={intl.formatMessage({ id: 'Match-Card-Team-vs-Team_[btn]Submit Result' })} disabled={true} />
        </div>
      case "waiting_for_result":
      case "waiting_for_result_comfirm":
      case "waiting_home_verified":
        if (data.is_member) {
          return <div>
            <Button title={intl.formatMessage({ id: 'Match-Card-Team-vs-Team_[btn]Submit Result' })} onClick={() => goBattleRoom()} />
          </div>
        }
        return ""
      // 0:not login 1:not home or vistor 2:home 3:vistor
      case "waiting_visitor_verified":
        switch (vistorHomeStatus) {
          case 0:
            if (data.is_member) {
              return <div>
                <Button title={intl.formatMessage({ id: 'Match-Card-Team-vs-Team_[btn]Submit Result' })} onClick={() => goBattleRoom()} />
              </div>
            }
            return ""
          case 1:
            if (data.is_member) {
              return <div>
                <Button title={intl.formatMessage({ id: 'Match-Card-Team-vs-Team_[btn]Submit Result' })} onClick={() => goBattleRoom()} />
              </div>
            }
            return ""
          case 2:
            return <div>
              <Button title={intl.formatMessage({ id: 'Submit-Result_[btn]Edit Result 10min' })} onClick={() => goBattleRoom()} />
            </div>
          case 3:
            return <div>
              <Button title={intl.formatMessage({ id: 'Confirm-Result_[btn]Confirm Result' })} onClick={() => goBattleRoom()} />
            </div>
          default:
            return ""
        }
      case "waiting_admin_verified":
        switch (vistorHomeStatus) {
          case 0:
            return <div>
              <Button title={intl.formatMessage({ id: 'Match-Card-Team-vs-Team_[btn]Submit Result' })} onClick={() => goBattleRoom()} />
            </div>
          case 1:
            return <div>
              <Button title={intl.formatMessage({ id: 'Match-Card-Team-vs-Team_[btn]Submit Result' })} onClick={() => goBattleRoom()} />
            </div>
          case 2:
            return <div>
              <Button title={intl.formatMessage({ id: 'Confirm-Result_[btn]Confirm Result' })} onClick={() => goBattleRoom()} />
            </div>
          case 3:
            return <div>
              <Button title={intl.formatMessage({ id: 'Submit-Result_[btn]Edit Result 10min' })} onClick={() => goBattleRoom()} />
            </div>
          default:
            return ""
        }
      default:
        return ""
    }
  }

  const checkVistorOrHome = () => {
    if (profile === null) {
      return 0
    }

    switch (data.tournament_format) {
      case "1v1":
        if (data.home === profile.member_id) {
          return 2
        }
        if (data.visitor === profile.member_id) {
          return 3
        }
        return 1

      case "TvT":
        if (data.home_player.length > 0) {
          let homePlayer = data.home_player.find((item) => item.member_id === profile.member_id)
          if (homePlayer) {
            return 2
          }
        }
        if (data.visitor_player.length > 0) {
          let vistorPlayer = data.visitor_player.find((item) => item.member_id === profile.member_id)
          if (vistorPlayer) {
            return 3
          }
        }
        return 1

    }
  }

  const goBattleRoom = () => {
    window.open(`${pathPrefix}/tournamentBattleRoom/${data.bracket_elimination_match_id}`)
  }
  // /tournamentEmbed/matchcard/
  // getImageUrl(banner_image)BannerSrc={} ShareLink={FinalShareLink}
  const Sharebox = () => { return <> <Share ShareLink={`${pathPrefix}/tournamentEmbed/matchcard/${data.bracket_elimination_match_id}`} TitlePos='center' Needlayers={['L1', 'L2', 'L3']} ShareOrder={['Facebook', 'Twitter']} BannerSrc={getImageUrl(banner_image)} titleText={intl.formatMessage({ id: 'Manage-Tournament-Page_Share' })} /></> }
  const goShare = () => {
    openDialogFunc({
      component: Sharebox,
      componentProps: {
        closeButton: true,
        type: "",
        title: 'Share',
        buttons: [],
      },
      closeByButtonOnly: false,
    })
  }

  return (
    <div className={cx(classes.preMatch)}>
      <div className={classes.prePageContainer}>
        <div className={classes.session}>
          <div className={classes.gameIcon}>
            {data.t8t_lite?.game.icon_image === null ? "" : <img src={getImageUrl(data.t8t_lite.game.icon_image)} alt="" />}
            <h3 className={classes.tournamentName}>{`${data.t8t_lite?.name} - Round ${data.bracket_round?.round_no},Match ${data.match_no}`}
              {/* Tournament Name - Round1, Match 1 */}
            </h3>
          </div>
          <p>{formatDateTime(data.bracket_round?.start_at)}</p>
        </div>
        <div className={classes.ungoBlock}>
          {/* left vistor team */}
          <div className={classes.leftCol}>
            <div className={classes.teamName}>
              <div className={classes.clubImg}>
                <div className={classes.inner}>
                  <Thumbnail
                    border={{ double: true, gap: 4 }}
                    imgUrl={data.visitor_icon_image === null ? null : getImageUrl(data.visitor_icon_image)}
                  />
                </div>
              </div>
              <p>
                {data.status === "completed" && data.visitor_score > data.home_score ?
                  <h2 className={classes.victory}>
                    {intl.formatMessage({ id: 'Match-Card-Team-vs-Team_Victory' })}
                  </h2> : ""}
                {data.visitor_name === null ? "--" : data.visitor_name}
              </p>
            </div>

            <div className={classes.teamUserImg}>
              {data.tournament_format === "TvT" ? <>
                <>
                  {data.visitor_player?.slice(0, 5).map((item, index) => {
                    return <Thumbnail
                      border={{ gap: 2 }}
                      size="45px"
                      imgUrl={getImageUrl(item.icon_image)}
                      key={index}
                    />
                  })}
                </>

                <>
                  {data.visitor_player?.length > 5 ?
                    <p>+ {data.visitor_player?.length - 5}</p> : ""
                  }
                </>
              </> : ""}
            </div>
          </div>
          {/* center */}
          <div className={classes.vsCol}>
            {/* vs status start*/}
            {getStatus(data.status)}
            <p>Best of {data.bracket_round?.game_bo}</p>

            {/* vs status end*/}
            {/* score status start*/}
            {getDisplayScore(data.status) === 0 ?
              <>
                <div className={classes.score}>
                  <p className={data.status === "completed" && data.visitor_score > data.home_score ? classes.green : classes.red} >{data.visitor_score}</p>
                  <p>:</p>
                  <p className={data.status === "completed" && data.home_score > data.visitor_score ? classes.green : classes.red}>{data.home_score}</p>
                  {getScoreButtonbyStatus(data.status)}

                  {/* submit button start*/}
                  {/* edit button start*/}
                  {/* confirm button start*/}
                </div>
                {/* score status end*/}
              </> : getDisplayScore(data.status) === 1 ?
                <div>
                  <img src={require('../imgs/img_vs.png')} className={classes.vsImg} alt="" />
                </div>
                : <div className={classes.score}>
                  <p>-</p>
                  <p>:</p>
                  <p>-</p>
                </div>
            }

          </div>
          {/* right */}
          <div className={classes.rightCol}>
            <div className={cx(classes.teamName, classes.matchTeam)}>
              <p>
                {data.status === "completed" && data.home_score > data.visitor_score ?
                  <h2 className={classes.victory}>
                    {intl.formatMessage({ id: 'Match-Card-Team-vs-Team_Victory' })}
                  </h2> : ""}
                {data.home_name === null ? "--" : data.home_name}
              </p>
              <div className={classes.clubImg}>
                <div className={classes.inner}>
                  <Thumbnail
                    border={{ double: true, gap: 4 }}
                    imgUrl={data.home_icon_image === null ? null : getImageUrl(data.home_icon_image)}
                  />
                </div>
              </div>
            </div>
            {/* match status end*/}
            <div className={cx(classes.teamUserImg)}>
              {data.tournament_format === "TvT" ? <>
                <>
                  {data.home_player?.slice(0, 5).map((item, index) => {
                    return <Thumbnail
                      border={{ gap: 2 }}
                      size="45px"
                      imgUrl={item.icon_image === null ? null : getImageUrl(item.icon_image)}
                      key={index}
                    />
                  })}
                </>
                <>
                  {data.home_player?.length > 5 ?
                    <p>+ {data.home_player?.length - 5}</p> : ""
                  }</>
              </> : ""}
            </div>
          </div>
        </div>
        <div className={classes.matchBtn}>
          {/* match button start*/}
          {getButtonbyStatus(data.status)}
        </div>
        <div className={classes.toolsBtn}>
          {getDisplayScore(data.status) ?
            <div className={classes.share} style={{ display: `${offShare ? "none" : ""}` }} onClick={() => goShare()}>
              <img src={require('../imgs/ico_share.png')} alt="" />
            </div> : ""}
        </div>
      </div>
    </div>
  )
}


export default withRouter(withPopWindowConsumer(withConfigConsumer(withAuthConsumer(withDialogConsumer(injectIntl(MatchCard))))))
