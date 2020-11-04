import React from 'react';
import { withConfigConsumer } from "contexts/Config";
import { withDialogConsumer } from "components/layouts/Dialog/Context";
import { withPopWindowConsumer } from "components/layouts/PopWindow/Context";

//translate
import { injectIntl } from 'react-intl';
//fetch material
import { withRouter, Link } from "react-router-dom";

import Button from 'components/DesignSystem/Input/Button';
//CSS
import classes from './style.module.scss';


const JoinButton = ({ location, configData, match, history, intl }) => {

  const { t8t_serial } = match.params


  const handleJoin = () => {

    history.push({
      ...location,
      pathname: `${configData.pathPrefix}/tournament/list/${t8t_serial}/home`,
    });

  }
  return (
    <>
      <Button title={intl.formatMessage({ id: 'Single-Tournament-Banner-Status_Join' })} disabled={false} onClick={() => { handleJoin() }} />
      <div>Powered by <Link className={classes.link} to={configData.pathPrefix}>planet9.GG</Link></div>
    </>
  )
}

export default withRouter(withPopWindowConsumer(
  withConfigConsumer(withDialogConsumer(injectIntl(JoinButton)))))