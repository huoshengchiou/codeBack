import React from 'react';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import { withAuthConsumer } from 'contexts/Auth';
import { withConfigConsumer } from 'contexts/Config';
// import { TrashIcon } from 'components/utils/Icons';
// import { EditManageContext } from '../../../Context';

//components
import Thumbnail from 'components/DesignSystem/DataDisplay/Thumbnail';
import Icon, { iconObj } from 'components/DesignSystem/Base/Icons';

// class & scss
import classNames from 'classnames/bind';
import classes from '../styles.module.scss';
const cx = classNames.bind(classes);

// 這是 player component
const Player = ({ getImageUrl, player, reg, isT8tCheckin }) => {
    // const { getUseGetRank } = useContext(EditManageContext);
    const { username, icon_image, t8t_checkin_at, is_seed_admission, is_seed_checkin } = player;

    return (
        <>
            {is_seed_admission && (
                <tr>
                    <td>{reg}</td>
                    <td>
                        <div className={classes.flex}>
                            <div className={classes.manBox}>
                                <Thumbnail imgUrl={getImageUrl(icon_image)} size="48px" border={{ gap: 2 }} />
                            </div>
                            {username}
                        </div>
                    </td>

                    {/* Check in */}
                    {/* t8t_checkin_at  !==  null 才有 勾勾icon */}
                    <td className={cx('compTd_2')}>
                        {t8t_checkin_at !== null && is_seed_admission && (
                            <Icon name={'PassA'} theme={'dark'} width={'23px'} />
                        )}
                    </td>

                    {/* Final Selected */}
                    {/* is_t8t_checkin 是說明 使用者是否需要 check-in */}
                    <td>
                        {isT8tCheckin !== null && isT8tCheckin ? (
                            <>{is_seed_checkin ? <Icon name={'PassA'} theme={'dark'} width={'23px'} /> : ''}</>
                        ) : (
                            <>{is_seed_admission ? <Icon name={'PassA'} theme={'dark'} width={'23px'} /> : ''}</>
                        )}
                    </td>
                </tr>
            )}
        </>
    );
};

const SinglePlayerList = props => {
    const { intl, players, teams, configData, onDelete, isT8tCheckin } = props;
    const { getImageUrl } = configData;

    return (
        <div className={cx('group', 'needTop')}>
            <table className={classes.manTableNoBlckBg}>
                <tbody>
                    <tr>
                        <td>{intl.formatMessage({ id: 'Manage-Tournament-Bracket-Seeding_REG#' })}</td>
                        <td className={cx('compTd_1')}>
                            {intl.formatMessage({ id: 'Manage-Tournament-Page_User Name' })}
                        </td>
                        <td className={cx('compTd_2')}>
                            {intl.formatMessage({ id: 'Manage-Tournament-Page_Check-in' })}
                        </td>
                        <td className={cx('compTd_2')}>
                            {intl.formatMessage({ id: 'Manage-Tournament-Page_Final Selected' })}
                        </td>
                    </tr>

                    {players ? (
                        players.map((player, index) => {
                            return (
                                <Player
                                    player={player}
                                    key={index}
                                    reg={index + 1}
                                    deletePlayer={onDelete}
                                    getImageUrl={getImageUrl}
                                    isT8tCheckin={isT8tCheckin}
                                />
                            );
                        })
                    ) : (
                        <></>
                    )}

                    {teams ? (
                        teams.map((team, index) => {
                            return (
                                <Player
                                    player={{
                                        username: team.team_name,
                                        icon_image: team.icon_image,
                                        t8t_checkin_at: team.is_all_checkin,
                                        is_seed_admission: team.is_seed_admission,
                                        is_seed_checkin: team.is_seed_checkin
                                    }}
                                    key={index}
                                    reg={index + 1}
                                    deletePlayer={onDelete}
                                    getImageUrl={getImageUrl}
                                    isT8tCheckin={isT8tCheckin}
                                />
                            );
                        })
                    ) : (
                        <></>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default withRouter(injectIntl(withAuthConsumer(withConfigConsumer(SinglePlayerList))));
