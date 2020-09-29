import React, { useContext, useEffect, useRef, useState } from 'react';
import { withConfigConsumer } from "contexts/Config";
import { withAuthConsumer } from "contexts/Auth";
import { withDialogConsumer } from "components/layouts/Dialog/Context";
import { withPopWindowConsumer } from "components/layouts/PopWindow/Context";

import { injectIntl, intlShape } from 'react-intl';
import { Link, Route, Switch, withRouter } from "react-router-dom";

import Button from 'components/DesignSystem/Input/Button';
import classes from './style.module.scss';
import cx from 'classnames';

import { from, range } from "rxjs";

import FreeForAll from 'components/pages/Tournament/components/Brackets/FreeForAll'


const EmbedBracket = ({ authData, match, history, location }) => {
  const { apiWithTokenWrapper, isLoggedIn } = authData
  const { t8t_serial, type } = match.params

  const [MatchData, setMatchData] = useState([])
  const [IsFetchFin, setIsFetchFin] = useState(true)

  const fetchListener = useRef(null)

  useEffect(() => {
    return () => {
      //取消fetch監聽
      if (fetchListener.current) fetchListener.current.unsubscribe();
    };

  }, [])

  return (<>
    <div className={classes.box}>
      <FreeForAll t8t={true} noCard={true}></FreeForAll>
    </div>
  </>)
}

export default withRouter(withPopWindowConsumer(
  withConfigConsumer(withAuthConsumer(withDialogConsumer(injectIntl(EmbedBracket))))))