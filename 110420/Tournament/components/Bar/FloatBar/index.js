import React, { useContext, useEffect } from 'react';

//state store
import { TournamentContext } from '../../../TournamentContext'

//style C
import Banner_btn from '../../../Banner/Banner_btn'

// import cx from 'classnames';
import classes from '../style.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(classes);


const HeaderFloatBar = (props) => {

    const { authData, RegBannerMsg, DefaultBannerMsg, ShowFloatBar } = useContext(TournamentContext)

    // const styleprop = useSpring({ to: { position: 'fixed', top: 0 }, from: { position: 'fixed', top: '-60px' } })
    // ScrollPosition > 480
    return (
        <div className={cx('full-width', 'box')}>
            {/* `${(ScrollPosition > 500) ? "scrollToFix" : "scrollToFix"}`) */}
            <div className={cx('context', 'floatBar')}>
                {/* Almost Full !! Hurry Up! */}
                <p className={cx('hurryBtn')}>{RegBannerMsg || DefaultBannerMsg}</p>
                {/* <Button title="Join" size='sm_1' customClass={cx('joinBtn')} /> */}
                {/* style={{ width: '100px', height: '30px', background: 'red' }} */}
                {/* adjust btn with attribute */}
                <div className={cx('joinBtn')}><Banner_btn size='sm_1' adjustStyle={true} /></div>
                {/* <Banner_btn /> */}
            </div>
        </div>
    )
}

export default HeaderFloatBar