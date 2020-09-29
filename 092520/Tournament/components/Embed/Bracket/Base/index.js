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

import { from, range } from "rxjs";

import { getSingleBracket } from "apis/tournament";
import Loading from 'components/utils/Loading';
import { Bracket } from "components/DesignSystem/Tournament";

import * as JSOG from "jsog";
import * as _ from "underscore";


const Base = ({ authData, match, history, location }) => {
  const { apiWithTokenWrapper, isLoggedIn } = authData
  const { t8t_serial, type } = match.params

  const [MatchData, setMatchData] = useState([])
  const [IsFetchFin, setIsFetchFin] = useState(true)

  const fetchListener = useRef(null)

  useEffect(() => {

    viewBracket()

    return () => {
      //取消fetch監聽
      if (fetchListener.current) fetchListener.current.unsubscribe();
    };

  }, [])

  const viewBracket = () => {
    setIsFetchFin(false)
    let data = {};
    data.t8t_serial = t8t_serial;
    // console.log(t8t_serial)
    fetchListener.current = from(
      apiWithTokenWrapper(getSingleBracket, data)
    )
      .subscribe(res => {
        if (res.status === 200) {
          if (res.data.header.status.toUpperCase() === "OK") {
            const { bracket_matches } = res.data.body
            // console.log('body', bracket_matches)
            if (bracket_matches.length > 0) {
              console.log('有資料')
              setMatchData(bracket_matches)
            }
            setIsFetchFin(true)
          }
        }

      });

  }


  return (<>
    <div className={classes.box}>
      {IsFetchFin ?
        MatchData.map((list, index) => {
          const DEMO_DATA = list.bracket_tree;


          const rootName = DEMO_DATA[(DEMO_DATA.length) - 1].name;
          const MATCH_DATA = JSOG.decode(DEMO_DATA);
          const ROOT = _.findWhere(MATCH_DATA, { name: rootName });

          return (<div className={classes.bracketsContainer} key={index}>
            {/* <h3>Single Elimination</h3> */}
            <Bracket
              match={ROOT}
              data={list}
              homeOnTop={false}
            // clickEvent={(matchProps) => goSinglePage(matchProps)}
            />
          </div>)

        }) : (<Loading />)}
    </div>
  </>)
}

export default withRouter(withPopWindowConsumer(
  withConfigConsumer(withAuthConsumer(withDialogConsumer(injectIntl(Base))))))