import React, { useContext, useEffect, useRef, useState } from 'react';
import { withConfigConsumer } from "contexts/Config";
import { withAuthConsumer } from "contexts/Auth";
import { withDialogConsumer } from "components/layouts/Dialog/Context";
import { withPopWindowConsumer } from "components/layouts/PopWindow/Context";

import { injectIntl, intlShape } from 'react-intl';
import { Link, Route, Switch, withRouter } from "react-router-dom";

import Button from 'components/DesignSystem/Input/Button';
import classes from './style.module.scss';
import Search from "components/DesignSystem/Input/Search";
import cx from 'classnames';
// import classNames from 'classnames/bind';

// const myCx = classNames.bind(classes);
import { from, range } from "rxjs";
import { getMatchCard, getSingleBracket } from "apis/tournament";
import Loading from 'components/utils/Loading';

import MatchCard from 'components/pages/Tournament/components/MatchCard/Basic'

const EmbedMatchCard = ({ authData, match, history, location }) => {
  const { apiWithTokenWrapper, isLoggedIn } = authData
  const { match_id } = match.params


  const [MatchData, setMatchData] = useState({})
  const fetchListener = useRef()



  //api pattern
  // // 1.31 取得單一Match (t8t031)
  // export const getMatchCard = (data, access_token,bracket_single_match_id) => {
  //   return request(
  //       'GET',
  //       `${domain}/t8t/match-card/${bracket_single_match_id}`,
  //       {
  //           data,
  //           headers: {
  //               'content-type': 'application/octet-stream',
  //               // Authorization: `Bearer ${access_token}`,
  //           },
  //       }
  //   );
  // };


  const [IsFetchIng, setIsFetchIng] = useState(false)


  const getMatch = () => {
    fetchListener.current = from(
      apiWithTokenWrapper(getMatchCard, "", match_id)
    ).subscribe(res => {

      if (res.status === 200) {
        if (res.data.header.status.toUpperCase() === "OK") {
          const { t8t_match } = res.data.body
          setMatchData(t8t_match)
          setIsFetchIng(true)
          console.log('res', res.data)

          // openPopWindowFunc({
          //   component: MatchCard,
          //   componentProps: {
          //     title: intl.formatMessage({ id: 'Match Card' }),
          //     customWindowContentClass: classes.customWindowContentClass,
          //     status: "matchCard_1",
          //     t8t: renderT8tInfo,
          //     data: res.data.body.t8t_match,
          //     closePopWindowFunc: () => closePopWindowFunc()
          //   },
          //   closeByButtonOnly: true

          // });

        }
      }
    });
  }

  useEffect(() => {
    getMatch()

    return () => {
      //取消fetch監聽
      if (fetchListener.current) fetchListener.current.unsubscribe();
    };

  }, [])
  return (
    <>
      {/* <div>MatchCard</div> */}
      {IsFetchIng ? (<MatchCard data={MatchData} offShare={true} />) : (<Loading />)}
    </>
  )
}

export default withRouter(withPopWindowConsumer(
  withConfigConsumer(withAuthConsumer(withDialogConsumer(injectIntl(EmbedMatchCard))))))