import React from 'react'


import TJ_single_page from './TJ_single_page'
import { TJ_single_state_store } from './TJ_single_state_store'


//outside global
import { withAuthConsumer } from 'contexts/Auth';
import { withConfigConsumer } from 'contexts/Config';
import { withDialogConsumer } from 'components/layouts/Dialog/Context';
import { withPopWindowConsumer } from 'components/layouts/PopWindow/Context';
import { injectIntl } from 'react-intl';
import { withRouter } from "react-router-dom";
import { withDialog_V2Consumer } from 'components/layouts/Dialog_V2/Context'

const TJ_single_wrapper = props => {

    return (
        <>
            <TJ_single_state_store parentinfo={props}>
                <TJ_single_page />
            </TJ_single_state_store>
        </>
    )
}


export default withRouter(withAuthConsumer(withConfigConsumer(withDialogConsumer(withPopWindowConsumer(withDialog_V2Consumer(injectIntl(TJ_single_wrapper)))))))