import React, { useContext, useEffect, useRef, useState } from 'react';
import { withConfigConsumer } from "contexts/Config";
import { withAuthConsumer } from "contexts/Auth";
import { withDialogConsumer } from "components/layouts/Dialog/Context";
import { withPopWindowConsumer } from "components/layouts/PopWindow/Context";

import { injectIntl, intlShape } from 'react-intl';
import { Link, Route, Switch, withRouter } from "react-router-dom";

import EbTopBar from '../EbTopBar'
import Base from './Base'
import FreeForAll from './FreeForAll'



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

  const getComponent = (type) => {
    switch (type) {
      case "ffa":
        return <FreeForAll t8t={1}></FreeForAll>
      default:
        return <Base></Base>
    }

  }

  return (<>
    <EbTopBar></EbTopBar>
    <>
      {getComponent(type)}
    </>
  </>)
}

export default withRouter(withPopWindowConsumer(
  withConfigConsumer(withAuthConsumer(withDialogConsumer(injectIntl(EmbedBracket))))))