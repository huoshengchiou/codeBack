import React from 'react';

import { withConfigConsumer } from "contexts/Config";
import { withAuthConsumer } from "contexts/Auth";
import { withDialogConsumer } from "components/layouts/Dialog/Context";
import { withPopWindowConsumer } from "components/layouts/PopWindow/Context";

import FreeForAllStandingList from '../../../Standings/FreeForAll'





//translate
import { injectIntl } from 'react-intl';

//router material
import { withRouter } from "react-router-dom";

const EmbedStandingFFA = ({ match, intl }) => {

    const { t8t_serial } = match.params

    // // fetch standing data
    // const { Ranklist, IsFetchFin, IsGame1v1 } = useFetchStanding({ t8t_serial });

    return (
        <>
            <FreeForAllStandingList />
        </>
    )
}

export default withRouter(withPopWindowConsumer(
    withConfigConsumer(withAuthConsumer(withDialogConsumer(injectIntl(EmbedStandingFFA))))))