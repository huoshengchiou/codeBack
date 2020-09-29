import React, { useContext, useEffect, useRef, useState } from 'react';
import { withConfigConsumer } from "contexts/Config";
import { withAuthConsumer } from "contexts/Auth";
import { withDialogConsumer } from "components/layouts/Dialog/Context";

import { injectIntl, intlShape } from 'react-intl';
import { Link, Route, Switch, withRouter } from "react-router-dom";

import Button from 'components/DesignSystem/Input/Button';
import classes from './style.module.scss';
import Search from "components/DesignSystem/Input/Search";
import cx from 'classnames';
import { from, range } from "rxjs";
import { getMatchCard, getSingleBracket } from "apis/tournament";

import { PopWindow_V2, withPopWindowProvider_V2, PopWindowStorage, withPopWindowConsumer } from 'components/DesignSystem/PopWindow_V2'

import {
  formatTimeHumanize,
  formatDateTime,
  formatDate,
  formatTime,
  formatToday
} from 'utils/formattersV2/date'
import Share from "components/DesignSystem/Feedback/Share";

import Thumbnail from 'components/DesignSystem/DataDisplay/Thumbnail';


const MatchCard = (props) => {
  const { offShare = false, status, data, configData, location, history, openPopWindowFunc, dialogData, intl, participantid } = props;
  const { openDialogFunc } = dialogData
  const { getImageUrl } = configData;
  const [paticipant, setpaticipant] = useState({})
  const popWindowData = useContext(PopWindowStorage);
  const { closePopWindow, openPopWindow } = popWindowData;

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
      case "upcoming":
      case "waiting_for_checkin":
        return false
      default:
        return true
    }
  }

  const getButtonbyStatus = (status) => {
    console.log(data)
    switch (status) {
      case "upcoming":
      case "waiting_for_checkin":
        if (data.is_t8t_checkin) {
          return <div>
            <Button title="Go to Check-in" onClick={() => {
              goBattleRoom()
              // history.replace({
              //   ...location,
              //   pathname: `${configData.pathPrefix}/tournament/list/${t8t_serial}/home`,
              // });
              closePopWindow();
            }} />
          </div>
        }
        return ""
      case "ongoing":
      case "waiting_for_result":
      case "waiting_for_result_comfirm":
      case "admin_checking":
      case "waiting_home_verified":
      case "waiting_visitor_verified":
      case "waiting_admin_verified":
        if (data.isme) {
          return <div>
            <Button title={intl.formatMessage({ id: 'Match-Card-Team-vs-Team_[btn]Enter Battle Room' })} onClick={() => goBattleRoom()} />
            {/* <Button title={intl.formatMessage({ id: 'Match-Card-Team-vs-Team_[btn]Pre-match Analysis' })} theme="dark_2" /> */}
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
    return ""
    // switch (status) {
    //   case "ongoing":
    //   case "waiting_for_result":
    //   case "waiting_for_result_comfirm":
    //   case "waiting_home_verified":
    //   case "waiting_visitor_verified":
    //   case "waiting_admin_verified":
    //     // if (data.is_member) {
    //     //   return <div>
    //     //     <Button title={intl.formatMessage({ id: 'Match-Card-Team-vs-Team_[btn]Submit Result' })} onClick={() => goBattleRoom()} />
    //     //   </div>
    //     // }
    //     return ""
    //   default:

    // }
  }
  const goBattleRoom = () => {
    window.open(`${configData.pathPrefix}/ffaBattleroom/${data.t8t_lite.t8t_serial}/stage-no/${data.stage_no}/group-no/${data.group_no}`)
  }
  // /tournamentEmbed/matchcard/
  // getImageUrl(banner_image)BannerSrc={} ShareLink={FinalShareLink}
  const Sharebox = () => { return <> <Share ShareLink={`${configData.pathPrefix}/tournamentEmbed/matchcard/${data.bracket_elimination_match_id}`} TitlePos='center' Needlayers={['L1', 'L2', 'L3']} ShareOrder={['Facebook', 'Twitter']} BannerSrc={getImageUrl(data.t8t_lite.banner_image)} /></> }
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

  const getGroupName = (index) => {
    const engLetter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    let letter = "";
    const getletter = (num) => {
      if (num <= 25) {
        letter = letter + engLetter[num];
        return
      }
      const num1 = Math.floor(num / 26) - 1;
      const num2 = num % 26;
      letter = letter + engLetter[num1];
      getletter(num2)
    }
    getletter(index - 1)
    return letter

  }


  return (
    <div className={cx(classes.preMatch)}>
      <div className={classes.prePageContainer}>
        <div className={classes.session}>
          <div className={classes.gameIcon}>
            {data.t8t_lite?.game.icon_image == null ? "" : <img src={getImageUrl(data.t8t_lite?.game.icon_image)} alt="" />}

            <h3 className={classes.tournamentName}>{`${data.t8t_lite?.name} - Stage ${data.stage_no},Group ${getGroupName(data.group_no)}`}
            </h3>
          </div>
          <p>{formatDateTime(data.group_start_at)}</p>
        </div>
        <div className={cx(classes.ungoBlock)}>
          <div className={cx(classes.vsCol)}>
            {getStatus(data.status)}
          </div>
          <div className={classes.matchInfo}>
            <div className={classes.leftCol}>
              <div className={classes.teamName}>
                <div className={classes.clubImg}>
                  <div className={classes.inner}>
                    <Thumbnail
                      border={{ double: true, gap: 4 }}
                      imgUrl={getImageUrl(data.participant?.avatar.logo_image)}
                    />

                    {/* {paticipant?.avatar ? <img src={getImageUrl(paticipant?.avatar.logo_image)} alt="" /> : ""} */}
                  </div>
                </div>
                <p>
                  {data.participant?.avatar ? data.participant?.avatar.name : ""}</p>
              </div>
              <div className={classes.teamUserImg}>
                {data.participant.team_players?.slice(0, 5).map((item, index) => {
                  return <Thumbnail
                    border={{ gap: 2 }}
                    size="45px"
                    imgUrl={getImageUrl(item.logo_image)}
                    ket={index}
                  />
                  // return <img key={index} src={getImageUrl(item.icon_image)} alt="" />
                })}
                {data.participant.team_players?.length > 5 ?
                  <p>+ {data.participant.team_players?.length - 5}</p> : ""
                }
              </div>
            </div>
            <div className={classes.rightCol}>
              <div className={classes.leftData}>
                <p>Number of Games : {data.number_of_game}</p>
                <p>Group Participants : {data.participant_per_group}</p>
              </div>
              <div className={classes.rightData}>
                {/* <div className={classes.matching}>
                  In Matching…
                </div> */}
                <div className={classes.dataCol}>
                  <div className={classes.col}>
                    <p className={classes.title}>Score</p>
                    <p className={classes.data}>
                      {data.participant.group_score}
                    </p>
                  </div>
                  <div className={classes.col}>
                    <p className={classes.title}>Rank</p>
                    <p className={classes.data}>
                      <span>#</span>
                      {data.participant.group_rank}
                      <span>{`/ ${data.participants.length}`}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className={classes.matchBtn}>
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
