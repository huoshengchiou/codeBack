import React, { useContext } from 'react'
//child C
import SingleApplyPolicy from './SingleApplyPolicy'
import SingleJoinCodeAndRequireData from './SingleJoinCodeAndRequireData'
import SingleConfirmation from './SingleConfirmation'

import { Singlegameprovider } from '../TJ_single_state_store'




const TJ_single_page = () => {

    const { currentpage } = useContext(Singlegameprovider)

    return (
        <>
            {currentpage === 1 && <SingleApplyPolicy />}
            {currentpage === 2 && <SingleJoinCodeAndRequireData />}
            {currentpage === 3 && <SingleConfirmation />}


            {/* <SingleApplyPolicy />
            <SingleJoinCodeAndRequireData />
            <SingleConfirmation /> */}
        </>
    )
}


export default TJ_single_page