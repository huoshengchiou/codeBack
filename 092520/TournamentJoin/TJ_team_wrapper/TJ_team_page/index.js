import React, { useContext } from 'react'


import TeamApplyPolicy from './TeamApplyPolicy'
import NoJoinTeam from './NoJoinTeam'
import SelectTeam from './SelectTeam'
import TeamJoinCodeAndRequireData from './TeamJoinCodeAndRequireData'
import TeamConfirmation from './TeamConfirmation'

import { Teamgameprovider } from '../TJ_team_state_store'



const TJ_team_page = () => {
    const { currentpage } = useContext(Teamgameprovider)

    //TODO 拿username做為fetch team list 材料


    return (
        <>
            {currentpage === 1 && <TeamApplyPolicy />}
            {currentpage === 2 && <NoJoinTeam />}
            {currentpage === 3 && <SelectTeam />}
            {currentpage === 4 && <TeamJoinCodeAndRequireData />}
            {currentpage === 5 && <TeamConfirmation />}




            {/* <TeamApplyPolicy />
            <NoJoinTeam />
            <SelectTeam />
            <TeamJoinCodeAndRequireData />
            <TeamConfirmation /> */}

        </>
    )
}


export default TJ_team_page