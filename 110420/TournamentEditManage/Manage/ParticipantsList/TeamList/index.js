import React, { useContext } from 'react';
import { injectIntl } from 'react-intl';
import { withConfigConsumer } from 'contexts/Config';
import { EditManageContext } from '../../../Context';

// components
import { TrashIcon } from 'components/utils/Icons';
import Thumbnail from 'components/DesignSystem/DataDisplay/Thumbnail';
import Icon, { iconObj } from 'components/DesignSystem/Base/Icons';

// class & scss
import classNames from 'classnames/bind';
import classes from '../styles.module.scss';
const cx = classNames.bind(classes);

const Player = props => {
    const { getUseGetRank, configData } = useContext(EditManageContext);

    const { getImageUrl } = configData;
    const { username, icon_image, game_data, in_game_id } = props.player;

    return (
        <>
            <tr>
                <td>
                    <div className={classes.flex}>
                        <div className={classes.manBox}>
                            <Thumbnail imgUrl={getImageUrl(icon_image)} size="48px" border={{ gap: 2 }} />
                        </div>
                        {username}
                    </div>
                </td>
                <td>{in_game_id}</td>
                <td>{getUseGetRank(game_data)}</td>
            </tr>
        </>
    );
};

const TeamList = props => {
    const { intl } = props;
    const { getImageUrl } = props.configData;
    return (
        <>
            <div className={cx('group', 'needTop')}>
                <div className={cx('blackBg')}>
                    <div className={cx('top')}>
                        <div className={cx('num')}>
                            {intl.formatMessage({ id: 'Manage-Tournament-Bracket-Seeding_REG#' })}{' '}
                            <span>{props.reg}</span>
                        </div>
                        <div className={classes.earth}>
                            <div className={classes.inner}>
                                {props.icon_image ? (
                                    <img src={getImageUrl(props.icon_image)} alt="" />
                                ) : (
                                    <img src={require('images/core/earth.png')} alt="" />
                                )}
                            </div>
                        </div>
                        <div className={cx('name')}>{props.teamName}</div>

                        {/* select icon */}
                        {props.is_seed_admission && (
                            <div className={cx('selected')}>
                                <Icon name={'PassA'} theme={'dark'} width={'23px'} />
                                {intl.formatMessage({ id: 'Manage-Tournament-Page_Selected' })}
                            </div>
                        )}

                        <div className={cx('trash')} onClick={props.onDelete.bind(this, props.t8t_team_id)}>
                            <TrashIcon></TrashIcon>
                        </div>
                        {/* <img className={cx("trash")} src={trash}  /> */}
                    </div>
                    <table className={classes.manTable}>
                        <tbody>
                            <tr>
                                <td>{intl.formatMessage({ id: 'Manage-Tournament-Page_User Name' })}</td>
                                <td>{intl.formatMessage({ id: 'Manage-Tournament-Page_In-Game ID' })}</td>
                                <td>{intl.formatMessage({ id: 'Manage-Tournament-Page_Rank' })}</td>
                            </tr>
                            {props.teamPlayers.map((player, index) => (
                                <Player key={index} reg={index + 1} player={player} />
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
};

export default withConfigConsumer(injectIntl(TeamList));
