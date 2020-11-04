import React, { useState, useEffect } from "react";
//child component
import TJ_single_wrapper from './TJ_single_wrapper'
import TJ_team_wrapper from './TJ_team_wrapper'
//layout
import TemplateV2 from 'components/layouts/TemplateV2';
//global info
import { withAuthConsumer } from 'contexts/Auth';
import { withConfigConsumer } from 'contexts/Config';
//translate
import { injectIntl } from 'react-intl';
//router
import { withRouter } from "react-router-dom";
//fetch hook
import { useGetgamedetail } from './useTJ_gamedetail_fetch'

//取得loading圖示component
import Loading from 'components/utils/Loading';


// -----------------CSS associated------------------------
import classes from './style.module.scss';
//topBar component
import BarContainer from 'components/pages/Tournament/components/BarContainer'
import Bar from './Bar';
import HeaderBar from "components/pages/Tournament/components/HeaderBar"

// solo tournament 分別獨立在不同的 Wrapper 下處理，各自擁有獨立context

// TODO
//TODO從最外層component拿userData送到page頁
const TournamentJoin = ({ match, intl, location, history, authData, configData }) => {
  const { apiWithTokenWrapper } = authData


  //capture serial from URL
  const [t8t_serial, setT8T_Serial] = useState(match.params.t8t_serial)

  //TODO update gamedetail hook
  const { gamedetail, IsIniFetchOK, IsUserInCb } = useGetgamedetail({ t8t_serial, apiWithTokenWrapper })

  //hold game detail transfer props
  const [currentgamedata, setCurrentGameData] = useState({})


  //TODOno login redirect 
  if (authData.getMemberId() === null) {
    // 沒有登入時導回tournament detail頁面
    history.replace({
      ...location,
      pathname: `${configData.pathPrefix}/tournament/list/${t8t_serial}/home`,
    });
  }

  //當fetch結果改變時換state，把資料用props往下傳
  useEffect(() => {
    //TODO當沒有verifiedId 還有in club導回前頁
    if (!gamedetail) return
    //當tournament需要驗遊戲Id且Id未驗證
    if ((gamedetail.is_need_in_game_id_verified) && (!gamedetail.myself.is_in_game_id_verified)) {
      return history.replace({
        ...location,
        pathname: `${configData.pathPrefix}/tournament/list/${t8t_serial}/home`,
      });
    }

    //當rule不為public時不具有Cb身分時
    if ((gamedetail.open_rule !== 'public') && (!IsUserInCb)) {
      return history.replace({
        ...location,
        pathname: `${configData.pathPrefix}/tournament/list/${t8t_serial}/home`,
      });
    }

    setCurrentGameData(gamedetail)

  }, [gamedetail])

  return (
    <>
      <BarContainer topBar={Bar} data={gamedetail}></BarContainer>
      <TemplateV2>
        <div className={classes.box}>
          {/* 1v1 and TvT have individual fetch and context in their wrapper */}
          {IsIniFetchOK ? (<>
            <div className={classes.banner}>
              <HeaderBar detail={gamedetail}></HeaderBar>
            </div>
            <div className={classes.formContainer}>
              {intl.formatMessage({ id: 'TournamentJoin_Join' })}
              {currentgamedata.tournament_format === '1v1' && <TJ_single_wrapper currentgamedata={currentgamedata} />}
              {currentgamedata.tournament_format === 'TvT' && <TJ_team_wrapper currentgamedata={currentgamedata} />}
            </div>
          </>) : (<Loading theme="dark" />)
          }
        </div>
      </TemplateV2>
    </>
  )
}

export default withRouter(injectIntl(withAuthConsumer(withConfigConsumer(TournamentJoin))))