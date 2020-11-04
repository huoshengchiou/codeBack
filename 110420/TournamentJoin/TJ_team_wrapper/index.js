import React from 'react'
import TJ_team_page from './TJ_team_page'
import { TJ_team_state_store } from './TJ_team_state_store'

//HOC
import { withAuthConsumer } from 'contexts/Auth';
import { withConfigConsumer } from 'contexts/Config';
import { withDialogConsumer } from 'components/layouts/Dialog/Context';
import { withPopWindowConsumer } from 'components/layouts/PopWindow/Context';
import { withDialog_V2Consumer } from 'components/layouts/Dialog_V2/Context'
//intl
import { injectIntl } from 'react-intl';
import { withRouter } from "react-router-dom";

const TJ_team_wrapper = (props) => {
    return (
        <>
            <TJ_team_state_store parentinfo={props}>
                <TJ_team_page />
            </TJ_team_state_store>
        </>
    )
}


export default withRouter(withAuthConsumer(withConfigConsumer(withDialogConsumer(withPopWindowConsumer(withDialog_V2Consumer(injectIntl(TJ_team_wrapper)))))))