import React from 'react'
import TJ_team_page from './TJ_team_page'

import { TJ_team_state_store } from './TJ_team_state_store'


import { withAuthConsumer } from 'contexts/Auth';
import { withConfigConsumer } from 'contexts/Config';
import { withDialogConsumer } from 'components/layouts/Dialog/Context';
import { withPopWindowConsumer } from 'components/layouts/PopWindow/Context';
import { injectIntl } from 'react-intl';
import { withRouter } from "react-router-dom";




//import  tj team  handlebtn

const TJ_team_wrapper = (props) => {
    // console.log('TJ_team_wrapper', props)

    // const { authData } = props
    // console.log(authData.getUsername())
    // .getUsername()
    //TODO 從page拿user info
    return (
        <>
            {/* <div style={{ background: 'lightyellow' }}> */}
            <TJ_team_state_store parentinfo={props}>
                <TJ_team_page />
            </TJ_team_state_store>

            {/* </div> */}
        </>
    )
}


export default withRouter(withAuthConsumer(withConfigConsumer(withDialogConsumer(withPopWindowConsumer(injectIntl(TJ_team_wrapper))))))