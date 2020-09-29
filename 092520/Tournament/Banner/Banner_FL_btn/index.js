import React, { useState, useContext, useEffect } from 'react';

import Button from 'components/DesignSystem/Input/Button';

//state store
import { TournamentContext } from '../../TournamentContext';

//fetch hook
import { useFollowClub } from '../../hooks/useFollowClub';

//CSS
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const Banner_FL_btn = () => {
    const {
        renderCbInfo,
        CbId,
        authData,
        setCbFlCount,
        IsUserFlCb,
        setIsUserFlCb,
        history,
        location,
    } = useContext(TournamentContext);
    const { apiWithTokenWrapper, isLoggedIn } = authData;

    //dialog on/off
    const [Toggle, setToggle] = useState(false);

    //fetch switch
    const [ProcessFollow, setProcessFollow] = useState(false);

    //初步以tournament fetch值展示，若有變動後以local state值為主

    const { FchFollowFin, FchBkData } = useFollowClub({
        apiWithTokenWrapper,
        ProcessFollow,
        CbId,
        setProcessFollow,
    });

    //default先拿context內容，等local state change後以local為主
    const [FollowCb, setFollowCb] = useState(null);
    //follow acount往context傳

    useEffect(() => {
        if (!FchFollowFin || !FchBkData) return;
        setIsUserFlCb(FchBkData.is_follower);
        setCbFlCount(FchBkData.follower_count);
        console.log('FchFollowFin', FchFollowFin);
    }, [FchFollowFin]);

    //TODO處理當使用者未登入時導向
    const handleFbtn = () => {
        if (!isLoggedIn) {
            history.push({
                ...location,
                hash: '#sign-in',
            });
            return;
        }
        if (IsUserFlCb) {
            return setToggle(true);
        } else {
            setProcessFollow(true);
        }
    };

    const handleUnFl = () => {
        setProcessFollow(true);
        setToggle(false);
    };

    return (
        <>
            <div style={{ position: 'relative' }}>
                {/* TODO fetch club*/}
                {console.log()}
                {/* {renderCbInfo.is_follower?()} */}
                <Button
                    theme={IsUserFlCb && 'dark_2'}
                    title={IsUserFlCb ? 'Unfollow▾' : 'Follow'}
                    size="sm_2"
                    isLoading={!FchFollowFin && true}
                    customClass={classes.unfollowBtn}
                    onClick={() => {
                        handleFbtn();
                    }}
                />
                {/* <Button title="follow" size="sm_2" customClass={classes.followBtn} onClick={() => { setToggle(true) }} /> */}
                {Toggle && (
                    <>
                        <div
                            className={classes.ProcessUF}
                            onClick={() => {
                                handleUnFl();
                            }}
                        >
                            Unfollow
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default Banner_FL_btn;
