import React, { useEffect, useRef, useState } from 'react';
import { withConfigConsumer } from "contexts/Config";
import { withAuthConsumer } from "contexts/Auth";

import { withDialogConsumer } from "components/layouts/Dialog/Context";
import { withPopWindowConsumer } from "components/layouts/PopWindow/Context";

import { injectIntl } from 'react-intl';
import { withRouter } from "react-router-dom";

import classes from './style.module.scss';

import { from } from "rxjs";
import Loading from 'components/utils/Loading';


//api
import { getParticipant } from 'apis/tournament';

//top bar
import EbTopBar from '../EbTopBar'

const PlayerList = ({ configData, authData, match, intl }) => {
  const { getImageUrl } = configData
  const { apiWithTokenWrapper } = authData
  const { t8t_serial } = match.params



  const [IsFetchFin, setIsFetchFin] = useState(true)

  //display List data
  const [renderList, setRenderList] = useState([])
  //1v1 or TvT
  const [GameType, setGameType] = useState('')

  const fetchListener = useRef(null)

  useEffect(() => {
    const data = {
      bodyData: {
        search_pending: false,
        search_string: null
      },
      pathParam: {
        _limit: -1,
        _pageno: 1,
      },
      t8t_serial: t8t_serial
    }
    getDisplayList(data)
    return () => {
      //取消fetch監聽
      if (fetchListener.current) fetchListener.current.unsubscribe();
    };
  }, [])


  //api info
  // 1.38 取得錦標賽參與者 ( t8t038 )
  // export const getParticipant = ({ t8t_serial, limit = -1, pageNo = 1, req }) => {
  //   return request(
  //       'POST',
  //       `${domain}/t8t/get-participant/${t8t_serial}?_limit=${limit}&_pageno=${pageNo}`,
  //       {
  //           data: req,
  //           headers: {
  //               'content-type': 'application/json',
  //           },
  //       }
  //   );
  // };

  const getDisplayList = (data) => {
    setIsFetchFin(false);
    fetchListener.current = from(
      apiWithTokenWrapper(getParticipant, data)
    ).subscribe(response => {
      if (response.status === 200) {
        if (response.data.header.status === 'OK') {
          const { body } = response.data
          const { t8t_format } = body
          setGameType(t8t_format)
          if (body.t8t_format === '1v1') {
            const { t8t_players } = body
            setRenderList(t8t_players)
          }
          else if (body.t8t_format === 'TvT') {
            const { t8t_teams } = body
            setRenderList(t8t_teams)

          } else {
            return
          }
        }

        setIsFetchFin(true)
      }
    })
  }

  // ----------------/-------------JSX---------------------\-------------

  // 1v1 TvT use same css class and inline modify

  const SingleList = (<div className={classes.block}>
    <section className={classes.title}>
      <ul>
        <li>REG#</li>
        <li>{intl.formatMessage({ id: 'Manage-Tournament-Page_User Name' })}</li>
        <li>{intl.formatMessage({ id: 'Manage-Tournament-Page_In-Game ID' })}</li>
        <li>{intl.formatMessage({ id: 'Manage-Tournament-Page_Rank' })}</li>
      </ul>
    </section>
    <section className={classes.PList}>
      {renderList.map((val, idx) => {
        return (<div className={classes.PUnit} key={idx + 'sp'}>
          <ul>
            <li>{idx + 1}</li>

            <li>
              <div className={classes.Avatar}><img src={getImageUrl(val.icon_image)} alt="" /></div>
              <p>{val.username}</p>
            </li>
            <li>{val.in_game_id}</li>
            <li>{val.rank}</li>
          </ul>
        </div>)
      })}
    </section>
  </div>)


  const TvTList = (renderList.map((val, idx) => {
    return (
      <div className={classes.block} key={idx + 'TL'}>
        <div className={classes.teamListBanner}>
          <ul>
            <li>REG# {idx + 1}</li>
            <li>
              <div>
                <div className={classes.teamAvatar}>
                  <img src={getImageUrl(val.icon_image)} alt="" />
                </div>
              </div>
            </li>
            <li>{val.team_name}</li>
          </ul>
        </div>
        <section className={classes.title}>
          <ul style={{ paddingLeft: '10px' }}>
            <li style={{ display: 'none' }}></li>
            <li>{intl.formatMessage({ id: 'Manage-Tournament-Page_User Name' })}</li>
            <li>{intl.formatMessage({ id: 'Manage-Tournament-Page_In-Game ID' })}</li>
            <li>{intl.formatMessage({ id: 'Manage-Tournament-Page_Rank' })}</li>
          </ul>
        </section>
        <section className={classes.PList}>
          {val.team_player?.map((val2, idx2) => {
            return (<div className={classes.PUnit} >
              <ul>
                <li style={{ display: 'none' }}></li>
                <li>
                  <div className={classes.Avatar}><img src={getImageUrl(val2.icon_image)} alt="" /></div>
                  <p>{val2.username}</p>
                </li>
                <li>{val2.in_game_id}</li>
                <li>{val2.rank}</li>
              </ul>
            </div>)
          })}
        </section>
      </div>)
  }))



  // ----------------\-------------JSX---------------------/-------------

  return (
    <>
      <EbTopBar />
      {!IsFetchFin && (<Loading theme='dark' />)}
      {GameType === '1v1' && SingleList}
      {GameType === 'TvT' && TvTList}

    </>
  )
}

export default withRouter(withPopWindowConsumer(
  withConfigConsumer(withAuthConsumer(withDialogConsumer(injectIntl(PlayerList))))))