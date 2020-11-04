import React, { useContext } from 'react';

import DialogBlock from 'components/blocks/DialogBlock';
import Share from 'components/DesignSystem/Feedback/Share';
import Card, { CardHeader, CardBody } from 'components/DesignSystem/DataDisplay/Card';
import { CopyIcon, RedoIcon } from 'components/utils/Icons';

import classNames from 'classnames/bind';
import classes from './styles.module.scss';

import { EditManageContext } from '../../Context';
const cx = classNames.bind(classes);

const ShareLinkandCodes = props => {
    const { t8tDetail, intl, match, configData, dialogData } = useContext(EditManageContext);

    const { openDialogFunc, closeDialogFunc } = dialogData;
    const { t8t_serial } = match.params;
    const { pathPrefix, getImageUrl } = configData;
    const { bracket_type, t8t_lite } = t8tDetail;
    const { banner_image } = t8t_lite;

    //switch embedded compnents with URL
    let typePathFix = '';

    // single :"" double:"" ffa:"/ffa"
    switch (bracket_type) {
        case 'ffa':
            typePathFix = '/ffa';
            break;
        default:
            break;
    }

    //TODO
    // Change parameters here !!
    const baseProps = {
        share_url: '/tournament/list/',
        join_url: '/tournamentEmbed/joinButton/',
        player_url: '/tournamentEmbed/playerList/',
        bracket_url: '/tournamentEmbed/bracket/',
        standing_url: '/tournamentEmbed/standing/',
        join_props: 'width="186" height="60" scrolling="no" frameborder="0"',
        player_props: 'title="Planet9 Tournament Players" width="100%" height="800" scrolling="yes" frameborder="0"',
        bracket_props: 'title="Planet9 Tournament" width="100%" height="800" scrolling="yes" frameborder="0"',
        standing_props: 'title="Planet9 Tournament" width="100%" height="800" scrolling="yes" frameborder="0"'
    };

    // TODO:
    const fullPath = configData.domains.website + pathPrefix;
    //跳窗分享URL
    const FinalShareLink = fullPath + baseProps.share_url + t8t_serial + '/home';

    const copyHandler = textUrl => {
        navigator.clipboard.writeText(textUrl);
        openDialogFunc({
            component: DialogBlock,
            componentProps: {
                type: 'success',
                title: intl.formatMessage({
                    id: 'Link copied to clipboard!'
                })
            },
            closeByButtonOnly: false
        });
        setTimeout(closeDialogFunc, 1000);
    };

    const Sharebox = () => {
        return (
            <>
                {' '}
                <Share
                    ShareLink={FinalShareLink}
                    TitlePos="center"
                    Needlayers={['L1', 'L2', 'L3']}
                    ShareOrder={['Facebook', 'Twitter']}
                    BannerSrc={getImageUrl(banner_image)}
                    titleText={intl.formatMessage({ id: 'Manage-Tournament-Page_Share' })}
                />
            </>
        );
    };

    const socialShareHandler = () => {
        openDialogFunc({
            component: Sharebox,
            componentProps: {
                closeButton: true,
                title: intl.formatMessage({ id: 'Manage-Tournament-Share_Share Link' }),
                buttons: []
            },
            closeByButtonOnly: false
        });
    };

    const ShareLink = () => {
        return (
            <>
                <Card size="col-9" customClass={classes.ShareLinkCard}>
                    <CardHeader>{intl.formatMessage({ id: 'Manage-Tournament-Share_Share Link' })}</CardHeader>
                    <CardBody customClass={classes.basicsInner}>
                        <div className={cx('group')}>
                            <div className={cx('inputCon')}>
                                <input className={cx('copyInput')} value={FinalShareLink} />
                                <div className={cx('copy')} onClick={() => copyHandler(FinalShareLink)}>
                                    <CopyIcon></CopyIcon>
                                </div>
                                <div className={cx('redo')} onClick={() => socialShareHandler(FinalShareLink)}>
                                    <RedoIcon></RedoIcon>
                                </div>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </>
        );
    };

    const EmbedCodesSub = props => {
        return (
            <div className={cx('group')}>
                <div className={cx('bold')}>{props.name}</div>
                <div className={cx('inputCon')}>
                    <textarea className={cx('copyInput', 'embed')} value={props.url} />
                    <div className={cx('copy', 'embed')} onClick={() => copyHandler(props.url)}>
                        <CopyIcon></CopyIcon>
                    </div>
                </div>
            </div>
        );
    };

    const EmbedCodes = () => {
        return (
            <>
                <Card size="col-9">
                    <CardHeader>{intl.formatMessage({ id: 'Manage-Tournament-Share_Embed Codes' })}</CardHeader>
                    <CardBody customClass={classes.basicsInner}>
                        <EmbedCodesSub
                            name={intl.formatMessage({ id: 'Manage-Tournament-Share_Join Button' })}
                            url={
                                '<iframe src="' +
                                fullPath +
                                baseProps.join_url +
                                t8t_serial +
                                '" ' +
                                baseProps.join_props +
                                '/>'
                            }
                        />
                        <div className={cx('line')}></div>
                        <EmbedCodesSub
                            name={intl.formatMessage({ id: 'Manage-Tournament-Share_Player List' })}
                            url={
                                '<iframe src="' +
                                fullPath +
                                baseProps.player_url +
                                t8t_serial +
                                '" ' +
                                baseProps.player_props +
                                '/>'
                            }
                        />
                        <div className={cx('line')}></div>
                        <EmbedCodesSub
                            name={intl.formatMessage({ id: 'Manage-Tournament-Share_Bracket' })}
                            url={
                                '<iframe src="' +
                                fullPath +
                                baseProps.bracket_url +
                                t8t_serial +
                                typePathFix +
                                '" ' +
                                baseProps.bracket_props +
                                '/>'
                            }
                        />
                        <div className={cx('line')}></div>
                        <EmbedCodesSub
                            name={intl.formatMessage({ id: 'Manage-Tournament-Share_Standing' })}
                            url={
                                '<iframe src="' +
                                fullPath +
                                baseProps.standing_url +
                                t8t_serial +
                                typePathFix +
                                '" ' +
                                baseProps.standing_props +
                                '/>'
                            }
                        />
                    </CardBody>
                </Card>
            </>
        );
    };

    return (
        <div className={classes.basicsCon}>
            <ShareLink />
            <EmbedCodes />
        </div>
    );
};

export default ShareLinkandCodes;
