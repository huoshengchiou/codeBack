import React from 'react';

import { withConfigConsumer } from "contexts/Config";
import { withAuthConsumer } from "contexts/Auth";
import { withDialogConsumer } from "components/layouts/Dialog/Context";
import { withPopWindowConsumer } from "components/layouts/PopWindow/Context";


//translate
import { injectIntl } from 'react-intl';
//router material
import { withRouter } from "react-router-dom";
//CSS
import classes from '../style.module.scss';
//import component
import RankList from '../../../Standings/Basic/RankList';
//api
import { useFetchStanding } from '../../../../hooks/useFetchStanding';
//load 
import Loading from 'components/utils/Loading';






const EmbedStandingBase = ({ match, intl }) => {

    const { t8t_serial } = match.params

    // // fetch standing data
    const { Ranklist, IsFetchFin, IsGame1v1 } = useFetchStanding({ t8t_serial });

    return (
        <>
            {IsFetchFin ? (<RankList rank={Ranklist} isIndividual={IsGame1v1} AdjustForEmbed={true} intl={intl} />) : (<Loading theme='dark' />)}

        </>
    )
}

export default withRouter(withPopWindowConsumer(
    withConfigConsumer(withAuthConsumer(withDialogConsumer(injectIntl(EmbedStandingBase))))))