import React, { useContext, useState, useEffect } from 'react';
import Thumbnail from 'components/DesignSystem/DataDisplay/Thumbnail';
import ButtonSubMenuDropdown from 'components/DesignSystem/Input/ButtonSubMenuDropdown';
import { withConfigConsumer } from 'contexts/Config/index.js';
import { withRouter } from 'react-router-dom';
//fetch hook
import { useFollowClub } from '../hooks/useFollowClub';
//取得loading component
import Loading from 'components/utils/Loading';
//state store
import { TournamentContext } from '../TournamentContext';
//Child
import Banner_btn from './Banner_btn';
//CSS
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const Banner = () => {
    //pick state from  store
    const {
        clubUrlKey,
        intl,
        IsUserFlCb,
        CbId,
        setCbFlCount,
        setIsUserFlCb,
        authData,
        RegBannerMsg,
        DefaultBannerMsg,
        renderT8tInfo,
        renderCbInfo,
        configData,
        CbFlCount,
        IsT8TFchOK
    } = useContext(TournamentContext);
    const { getImageUrl, placeholders, pathPrefix } = configData;
    const { apiWithTokenWrapper } = authData;
    //links for club
    const fullPath = 'http://' + window.location.host + pathPrefix;

    //game open_rule
    let displayRule = '';
    switch (renderT8tInfo.open_rule) {
        case 'public':
            displayRule = intl.formatMessage({ id: 'Single-Tournament-Banner-Status_Public' });
            break;
        case 'private':
            displayRule = intl.formatMessage({ id: 'Single-Tournament-Banner-Status_Private' });
            break;
        case 'private_import':
            displayRule = intl.formatMessage({ id: 'Single-Tournament-Banner-Status_Private by Import' });
            break;
        default:
            break;
    }

    //-----/-------follow Cb btn-------design system---\---
    //fetch signal
    const [ProcessFollow, setProcessFollow] = useState(false);

    //初步以tournament fetch值展示，若有變動後以local state值為主

    const { FchFollowFin, FchBkData } = useFollowClub({
        apiWithTokenWrapper,
        ProcessFollow,
        CbId,
        setProcessFollow
    });

    useEffect(() => {
        if (!FchFollowFin || !FchBkData) return;
        setIsUserFlCb(FchBkData.is_follower);
        //refresh Cb follow num
        setCbFlCount(FchBkData.follower_count);
        setProcessFollow(false);
    }, [FchFollowFin]);
    //---\---------follow Cb btn-------design system---/---

    //顯示剩餘報名數量
    const DisplaySpot = () => {
        if (renderT8tInfo.participant_limit === null)
            return intl.formatMessage({ id: 'Single-Tournament-Banner-Status_Unlimited' });

        // 剩餘可報名數量0或小於0皆歸0
        return renderT8tInfo.participant_limit - renderT8tInfo.participants_count <= 0
            ? `0 ${intl.formatMessage({ id: 'Single-Tournament-Banner-Status_Spots left' })}`
            : `${renderT8tInfo.participant_limit - renderT8tInfo.participants_count} ${intl.formatMessage({
                  id: 'Single-Tournament-Banner-Status_Spots left'
              })}`;
    };

    return (
        <>
            {IsT8TFchOK ? (
                <>
                    <div className={cx('box')}>
                        <div
                            className={cx('bannerContainer')}
                            style={{
                                backgroundImage: `url(${
                                    Object.keys(renderT8tInfo).length !== 0
                                        ? getImageUrl(renderT8tInfo.t8t_lite.banner_image)
                                        : ''
                                })`
                            }}
                        >
                            <div className={cx('bannerFeature')}>
                                <div
                                    className={cx('bannerImg')}
                                    style={{
                                        backgroundImage: `url(${
                                            Object.keys(renderT8tInfo).length !== 0
                                                ? getImageUrl(renderT8tInfo.t8t_lite.game.icon_image)
                                                : ''
                                        })`
                                    }}
                                ></div>
                                {renderCbInfo.is_feature && (
                                    <>
                                        <div className={cx('bannerStatus')}>
                                            <h5 className={cx('featureText')}>
                                                {intl.formatMessage({ id: 'Tournament-Main-Page_Featured-icon' })}
                                            </h5>
                                        </div>
                                    </>
                                )}
                            </div>
                            <div className={cx('bannerContent')}>
                                <div className={cx('clubBlock', 'clubFlex')}>
                                    <a href={`${fullPath}/club/my-club/${clubUrlKey.current}/home`}>
                                        <div className={cx('clubImg')}>
                                            <Thumbnail
                                                size="64px"
                                                border={{ double: true, gap: 4 }}
                                                shape="square"
                                                imgUrl={
                                                    Object.keys(renderCbInfo).length !== 0
                                                        ? getImageUrl(renderCbInfo.logo_image)
                                                        : getImageUrl(placeholders.club_logo_image)
                                                }
                                            />
                                        </div>
                                    </a>
                                    <div className={cx('clubContent')}>
                                        <h4 style={{ color: '#ffffff' }}>{renderCbInfo.name}</h4>
                                        <div className={cx('follows')}>
                                            {/* {CbFlCount} follows */}
                                            <p style={{ fontSize: '16px' }}>
                                                {intl.formatMessage(
                                                    { id: 'Tournament-Main-Page_{number} follows' },
                                                    { number: CbFlCount }
                                                )}
                                            </p>
                                            <ButtonSubMenuDropdown
                                                isButtonTrue={IsUserFlCb}
                                                isLoading={!FchFollowFin}
                                                size={'sm'}
                                                buttonTitle={{
                                                    isTrue: intl.formatMessage({ id: 'Connect-Main_Followed' }),
                                                    isFalse: intl.formatMessage({ id: 'Connect-Main_Follow' })
                                                }}
                                                dropdownTitle={intl.formatMessage({ id: 'Connect-Main_Unfollow' })}
                                                onClickCallback={() => {
                                                    setProcessFollow(true);
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className={cx('clubBlock')}>
                                    {/* %Single Tournament Name VeryLong with 2Lines% */}
                                    <h3 className={cx('TournamentName')}>{renderT8tInfo.t8t_lite?.name}</h3>

                                    <p>
                                        {DisplaySpot()} | {displayRule}
                                    </p>
                                </div>
                                <div className={cx('icoMoney')}>
                                    <p>
                                        ${renderT8tInfo.total_prize_pool}
                                        <span>
                                            {intl.formatMessage({ id: 'Single-Tournament-Banner-Status_Prize Pool' })}
                                        </span>
                                    </p>
                                </div>
                                {/* TODO prepare gift for child  */}
                                <div className={cx('BannerBtnWrapper')}>
                                    <Banner_btn />
                                </div>
                                <p className={cx('message')}>{RegBannerMsg || DefaultBannerMsg}</p>
                            </div>
                        </div>
                    </div>
                </>
            ) : (
                <Loading theme="dark" />
            )}
        </>
    );
};

export default withRouter(withConfigConsumer(Banner));
