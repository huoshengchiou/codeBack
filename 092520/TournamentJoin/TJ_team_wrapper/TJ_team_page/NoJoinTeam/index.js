import React, { useState, useEffect, useContext } from 'react'
//styled component
import Button from "components/DesignSystem/Input/Button";

//btn func
import { teamhandleDIL, teamhandleDd } from '../../TJ_team_handlebtn'


//state store
import { Teamgameprovider } from '../../TJ_team_state_store'


//fetch hook
import { useKillReg } from '../../useTJteamfetch'

//CSS
import classes from '../../../style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const NoJoinTeam = () => {

    const { setProcessDIL, history, location, configData, gameRegEtime, intl, dialogData, gameserial, regid, popWindowData, authData } = useContext(Teamgameprovider)
    const { apiWithTokenWrapper } = authData
    const { closeDialogFunc } = dialogData;


    // --------------------------kill reg-----------------------------


    const [ProcessRegKill, setProcessRegKill] = useState(false)
    const { IsRegDelete } = useKillReg({ ProcessRegKill, apiWithTokenWrapper, gameserial, regid })
    useEffect(() => {
        // TODO//變動後轉頁
        if (IsRegDelete) {
            history.replace({
                ...location,
                pathname: `${configData.pathPrefix}/tournament/list/${gameserial}/home`,
            });
            closeDialogFunc()
        }
    }, [IsRegDelete])

    const hadeleDiscardBtn = () => {
        teamhandleDd({ intl, dialogData, setProcessRegKill, gameserial })

    }



    return (
        <div className={classes.formWrapper}>
            <div className={cx('infoTitle')}>
                {/* Select Your Team */}
                {intl.formatMessage({ id: 'TournamentJoin_Select Your Team' })}
            </div>
            <div className={cx('infoInner')}>
                {/* You have not joined any teams yet */}
                <p className={cx('title')}>{intl.formatMessage({ id: 'TournamentJoin_You have not joined any teams yet' })}</p>
                <p>
                    {/* you can pending this tournament first, */}
                    {intl.formatMessage({ id: 'TournamentJoin_you can pending this tournament first' })},
                <br />
                    {/* explore other teams to join, */}
                    {intl.formatMessage({ id: 'TournamentJoin_explore other teams to join' })},
                <br />
                    {/* or create your own team! */}
                    {intl.formatMessage({ id: 'TournamentJoin_or create your own team' })} !
                </p>
            </div>
            <section className={cx('btnArea')}>
                <div><Button title={intl.formatMessage({ id: 'TournamentJoin_[btn]Discard' })} theme="dark_2" onClick={() => { hadeleDiscardBtn() }} /></div>
                {/* //user沒有team */}
                <div><Button title={intl.formatMessage({ id: 'TournamentJoin_[btn]Do it later' })}
                    theme="dark_2" onClick={() => { teamhandleDIL({ popWindowData, gameRegEtime, intl, history, location, configData, gameserial, setProcessDIL }) }} /></div>
            </section>

        </div>
    )
}

export default NoJoinTeam

