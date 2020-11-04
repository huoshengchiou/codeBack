import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { withConfigConsumer } from 'contexts/Config';
import { withAuthConsumer } from 'contexts/Auth';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';
import qs from 'qs';
import classes from './styles.module.scss';

import Loading from 'components/utils/Loading';
import Button from 'components/DesignSystem/Input/Button';
import Autocomplete from 'components/DesignSystem/Input/AutoComplete_V2';

const GameList = props => {
    const { configData, onSelect, game, intl, history, location } = props;
    const { getImageUrl, gamesV2 } = configData;
    const [filterText, setFilterText] = useState('');
    const [selectGame, setSelectGame] = useState(game);

    const { handleSubmit, formState } = useForm({ mode: 'onChange' });
    const { isValid } = formState;

    const onSubmit = () => {
        onSelect(selectGame);
    };
    const handleCancel = () => {
        history.replace({
            ...location,
            pathname: `${configData.pathPrefix}/tournament/`
        });
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={classes.create}>
                    <div className={classes.title}>
                        {intl.formatMessage({ id: 'Create-Tournament-Page_Create New Tournament' })}
                    </div>
                    <div className={classes.createcontent}>
                        <div className={classes.inner}>
                            <div className={classes.banner}></div>
                            <div className={classes.main}>
                                <div className={classes.innerTitle}>
                                    {intl.formatMessage({ id: 'Create-Tournament-Page_Select Game' })}
                                </div>
                                <div className={classes.search}>
                                    <Autocomplete type="search" onChange={val => setFilterText(val)} />
                                </div>
                                <ul className={classes.gameList}>
                                    {gamesV2
                                        .filter(item => {
                                            if (filterText !== '') {
                                                return item.name.toUpperCase().includes(filterText.toUpperCase());
                                            }
                                            return item;
                                        })
                                        .map((item, index) => {
                                            return (
                                                <li
                                                    key={index}
                                                    className={
                                                        selectGame?.game_id === item.game_id ? classes.current : ''
                                                    }
                                                    onClick={e => setSelectGame(item)}
                                                >
                                                    <img
                                                        src={
                                                            item.cover_image !== null
                                                                ? getImageUrl(item.cover_image)
                                                                : ''
                                                        }
                                                    />
                                                    <p>{item.name}</p>
                                                </li>
                                            );
                                        })}
                                </ul>
                            </div>
                        </div>
                        <div className={classes.myBtn}>
                            <Button
                                title={intl.formatMessage({
                                    id: 'Tournament-Management-Create-New-Tournament_[btn]Cancel'
                                })}
                                theme="dark_2"
                                onClick={() => handleCancel()}
                            />
                            <Button
                                title={intl.formatMessage({
                                    id: 'Tournament-Management-Create-New-Tournament_[btn]Next'
                                })}
                                disabled={!selectGame}
                                type="submit"
                            />
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default withRouter(withAuthConsumer(withConfigConsumer(injectIntl(GameList))));
