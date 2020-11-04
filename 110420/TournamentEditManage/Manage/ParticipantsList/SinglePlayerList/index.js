import React, { useContext } from 'react';
import { injectIntl } from 'react-intl';
import { withConfigConsumer } from 'contexts/Config';
import { EditManageContext } from '../../../Context';

// components
import { TrashIcon } from 'components/utils/Icons';
import Thumbnail from 'components/DesignSystem/DataDisplay/Thumbnail';
import Icon, { iconObj } from 'components/DesignSystem/Base/Icons';

// // class & scss
import classNames from 'classnames/bind';
import classes from '../styles.module.scss';
const cx = classNames.bind(classes);

const Player = props => {
    const { getUseGetRank } = useContext(EditManageContext);

    const { getImageUrl, player, reg, deletePlayer } = props;
    const { username, t8t_player_id, icon_image, game_data, is_seed_admission } = player;

    return (
        <>
            <tr>
                <td>{is_seed_admission && <Icon name={'PassA'} theme={'dark'} width={'23px'} />}</td>
                <td>{reg}</td>
                <td>
                    <div className={classes.flex}>
                        <div className={classes.manBox}>
                            <Thumbnail imgUrl={getImageUrl(icon_image)} size="48px" border={{ gap: 2 }} />
                        </div>
                        {username}
                    </div>
                </td>
                {/* <td>{in_game_id}</td> */}
                <td>{getUseGetRank(game_data)}</td>
                <td>
                    <div
                        onClick={() => {
                            deletePlayer(t8t_player_id);
                        }}
                    >
                        <TrashIcon></TrashIcon>
                    </div>
                </td>
            </tr>
        </>
    );
};

const SinglePlayerList = props => {
    const { intl, players, configData, onDelete } = props;
    const { getImageUrl } = configData;
    return (
        <div className={cx('group', 'needTop')}>
            <table className={classes.manTableNoBlckBg}>
                <tbody>
                    <tr>
                        <td>{intl.formatMessage({ id: 'Manage-Tournament-Page_Selected' })}</td>
                        <td>{intl.formatMessage({ id: 'Manage-Tournament-Bracket-Seeding_REG#' })}</td>
                        <td>{intl.formatMessage({ id: 'Manage-Tournament-Page_User Name' })}</td>
                        {/* <td>{intl.formatMessage({ id: "Manage-Tournament-Page_In-Game ID" })}</td> */}
                        <td>{intl.formatMessage({ id: 'Manage-Tournament-Page_Rank' })}</td>
                        <td></td>
                    </tr>
                    {players.map((player, index) => (
                        <Player
                            player={player}
                            key={index}
                            reg={index + 1}
                            deletePlayer={onDelete}
                            getImageUrl={getImageUrl}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default withConfigConsumer(injectIntl(SinglePlayerList));
