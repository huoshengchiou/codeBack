import React, { useContext, useState, useEffect } from 'react';
import Thumbnail from "components/DesignSystem/DataDisplay/Thumbnail";
import ButtonSubMenuDropdown from 'components/DesignSystem/Input/ButtonSubMenuDropdown';
import { withConfigConsumer } from 'contexts/Config/index.js';
import { withRouter } from "react-router-dom";


//fetch hook
import { useFollowClub } from '../hooks/useFollowClub';

//取得loading component
import Loading from 'components/utils/Loading';

//state store
import { TournamentContext } from '../TournamentContext'

//Child
import Banner_btn from './Banner_btn'
//ori Cb follow btn
// import Banner_FL_btn from './Banner_FL_btn'

//CSS
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

// export const ButtonByStatus = (props) => {

//   let { status, is_checkin, fns } = props.data; //status registration_not_open | registration_opened | registration_closed, ongoing | completed  
//   let isGameTimeStart = false;
//   let isNeedCheckIn = is_checkin > 0 ? true : false;
//   let isSelfCheckIn = true;
//   let isTeamMateCheckIn = false;
//   let fnName;
//   let title = '';
//   let msg = '';
//   let btnClass;

//   switch (status) {
//     case "registration_opened": {
//       title = "Join";
//       msg = "Almost Full !! Hurry Up!"
//       fnName = "handleLinkToJoin";
//       break;
//     }
//     case "registration_not_open": {
//       title = "Join";
//       msg = "Registration will open soon"
//       btnClass = classes.canNotJoin;
//       fnName = "";
//       break;
//     }
//     case "registration_closed": {
//       title = "Join";
//       msg = "Registration will open soon"
//       btnClass = classes.canNotJoin;
//       fnName = "";
//       break;
//     }
//     case "registration_ongoing": {
//       title = "Go Registration";
//       msg = "Almost Full !! Hurry Up!"
//       fnName = "handleLinkToJoin";
//       break;
//     }
//     case "registration_completed": {//報名截止

//       if (!isGameTimeStart && isNeedCheckIn) { //尚未開打 有賽前檢錄

//         if (isSelfCheckIn && isTeamMateCheckIn) { //自己和隊友都有檢錄 
//           title = "Check-in";
//           msg = "time1 - time2"
//           btnClass = classes.goToBattleDisable;
//           fnName = "";
//         }
//         if (isSelfCheckIn && !isTeamMateCheckIn) {//自己有檢錄 隊友尚未檢錄 
//           title = "Line Up Status";
//           msg = `Begining in ### min`;
//           btnClass = classes.timeLineUp;
//           fnName = "";
//         }

//       }

//       if (isGameTimeStart && !isNeedCheckIn) { //無賽前檢錄 已經開打
//         title = "Go to Battle Room";
//         msg = "time1 - time2"
//         btnClass = classes.goToBattle;
//         fnName = "";
//       }
//       break;
//     }
//     default: {
//       title = "Join";
//       msg = "Registration will open soon"
//       btnClass = classes.canNotJoin;
//       fnName = "";
//     }
//   }

//   return (
//     <>
//       <Button title={title} size="nl" customClass={btnClass} onClick={fns[fnName]} />
//       <p className={cx('message')}>{msg}</p>
//     </>
//   )
// }

const Banner = () => {
  //pick state from  store
  const { clubUrlKey, intl, IsUserFlCb, CbId, setCbFlCount, setIsUserFlCb, authData, RegBannerMsg, DefaultBannerMsg, renderT8tInfo, renderCbInfo, configData, CbFlCount, IsT8TFchOK } = useContext(TournamentContext)
  const { getImageUrl, placeholders, pathPrefix } = configData;
  const { apiWithTokenWrapper } = authData;
  //links for club
  const fullPath = "http://" + window.location.host + pathPrefix;

  // const { configData, match, history } = props;
  // const { t8t_url_key } = match.params;
  // const { getImageUrl } = configData;
  // const { singleT8tInfo } = props.data;
  // const clubInfo = get(singleT8tInfo, "club") || {};
  // const { name: t8tName, total_prize_pool, status, is_checkin } = validateValue(singleT8tInfo) ? singleT8tInfo : {};

  // const ft8tName = validateValue(t8tName) ? t8tName : '- -';
  // const ftotal_prize_pool = validateValue(total_prize_pool) ? "$ " + formatThoundSandWithRegex(total_prize_pool) : '- -';
  // const { name, follower_count, is_feature, logo_image } = validateValue(clubInfo) ? clubInfo : {};
  // const fname = validateValue(name) ? name : '- -';
  // const ffollower_count = validateValue(follower_count) ? follower_count : '- -';
  // const logoImg = validateValue(logo_image) ? getImageUrl(logo_image) : require('./imgs/clubImg.jpg');

  // const handleLinkToJoin = (t8t_serial) => {
  //   let linkStr = `${configData.pathPrefix}/tournament/join/${t8t_serial}`
  //   history.push(linkStr);
  // }



  // const BannerCover = {
  //   backgroundImage: `url(${getImageUrl(renderCbInfo?.cover_image)})`
  // }

  //game open_rule
  let displayRule = ''
  switch (renderT8tInfo.open_rule) {
    case 'public':
      displayRule = intl.formatMessage({ id: 'Single-Tournament-Banner-Status_Public' })
      break
    case 'private':
      displayRule = intl.formatMessage({ id: 'Single-Tournament-Banner-Status_Private' })
      break
    case 'private_import':
      displayRule = intl.formatMessage({ id: 'Single-Tournament-Banner-Status_Private by Import' })
      break
    default:
      break
  }






  //-----/-------follow Cb btn-------design system---\---
  //fetch switch
  const [ProcessFollow, setProcessFollow] = useState(false);

  //初步以tournament fetch值展示，若有變動後以local state值為主

  const { FchFollowFin, FchBkData } = useFollowClub({
    apiWithTokenWrapper,
    ProcessFollow,
    CbId,
    setProcessFollow,
  });

  useEffect(() => {
    if (!FchFollowFin || !FchBkData) return;
    // console.log('FchBkData', FchBkData)
    setIsUserFlCb(FchBkData.is_follower);
    //refresh Cb follow num
    setCbFlCount(FchBkData.follower_count);
    setProcessFollow(false);
  }, [FchFollowFin]);
  //---\---------follow Cb btn-------design system---/---

  //顯示剩餘報名數量
  const DisplaySpot = () => {

    if (renderT8tInfo.participant_limit === null) return intl.formatMessage({ id: 'Single-Tournament-Banner-Status_Unlimited' })

    // 剩餘可報名數量0或小於0皆歸0
    return ((renderT8tInfo.participant_limit - renderT8tInfo.participants_count) <= 0) ? `0 ${intl.formatMessage({ id: 'Single-Tournament-Banner-Status_Spots left' })}` : `${renderT8tInfo.participant_limit - renderT8tInfo.participants_count} ${intl.formatMessage({ id: 'Single-Tournament-Banner-Status_Spots left' })}`

  }



  return (
    <>
      {IsT8TFchOK ? (<><div className={cx('box')}>
        <div className={cx('bannerContainer')} style={{ backgroundImage: `url(${Object.keys(renderT8tInfo).length !== 0 ? getImageUrl(renderT8tInfo.t8t_lite.banner_image) : ''})` }}>
          <div className={cx('bannerFeature')}>
            <div className={cx('bannerImg')} style={{ backgroundImage: `url(${Object.keys(renderT8tInfo).length !== 0 ? getImageUrl(renderT8tInfo.t8t_lite.game.icon_image) : ''})` }}></div>
            {renderCbInfo.is_feature &&
              <><div className={cx('bannerStatus')}>
                <h5 className={cx('featureText')}>Feature</h5>
              </div></>}
          </div>
          <div className={cx('bannerContent')}>
            <div className={cx('clubBlock', 'clubFlex')}>
              <a href={`${fullPath}/club/my-club/${clubUrlKey.current}/home`}>
                <div className={cx('clubImg')}>
                  <Thumbnail size="64px" border={{ double: true, gap: 4 }} shape="square" imgUrl={Object.keys(renderCbInfo).length !== 0 ? getImageUrl(renderCbInfo.logo_image) : getImageUrl(placeholders.club_logo_image)} />
                  {/* <div className={cx('inner')}>
                <img src={Object.keys(renderCbInfo).length !== 0 ? getImageUrl(renderCbInfo.logo_image) : getImageUrl(placeholders.club_logo_image)} alt="" />
                </div> */}
                </div>
              </a>
              <div className={cx('clubContent')}>
                <h4 style={{ color: '#ffffff' }}>{renderCbInfo.name}</h4>
                <div className={cx('follows')}>
                  <p style={{ fontSize: '16px' }}>{CbFlCount} follows</p>
                  {/* TODO補上follower狀態 */}
                  {/* <Banner_FL_btn /> */}
                  <ButtonSubMenuDropdown
                    isButtonTrue={IsUserFlCb}
                    isLoading={!FchFollowFin}
                    size={"sm"}
                    buttonTitle={
                      {
                        isTrue: "Unfollow",
                        isFalse: "Followed"
                      }
                    }
                    dropdownTitle={'UnFollow'}
                    onClickCallback={() => {
                      setProcessFollow(true);
                    }}
                  />
                </div>
              </div>
            </div>
            <div className={cx('clubBlock')}>
              {/* %Single Tournament Name VeryLong with 2Lines% */}
              <h3 className={cx('TournamentName')}>{renderT8tInfo.t8t_lite?.name}</h3>

              <p>{DisplaySpot()} | {displayRule}</p>
            </div>
            <div className={cx("icoMoney")}>
              {/* <img src={require('./imgs/ico_money.png')} alt="" /> */}
              <p>
                ${renderT8tInfo.total_prize_pool}
                <span>{intl.formatMessage({ id: 'Single-Tournament-Banner-Status_Prize Pool' })}</span>
              </p>
            </div>
            {/* TODO prepare gift for child  */}
            <div className={cx("BannerBtnWrapper")}>
              <Banner_btn />
            </div>
            <p className={cx('message')}>{RegBannerMsg || DefaultBannerMsg}</p>
          </div>
        </div>
      </div></>) : <Loading theme="dark" />}

    </>)
}

export default withRouter(withConfigConsumer(Banner));