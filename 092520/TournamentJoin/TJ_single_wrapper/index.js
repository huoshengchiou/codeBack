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






const TJ_single_wrapper = props => {

    return (
        <>
            {/* <div style={{ background: 'lightblue' }}> */}
            <TJ_single_state_store parentinfo={props}>
                <TJ_single_page />
            </TJ_single_state_store>

            {/* </div> */}
        </>
    )
}


export default withRouter(withAuthConsumer(withConfigConsumer(withDialogConsumer(withPopWindowConsumer(injectIntl(TJ_single_wrapper))))))