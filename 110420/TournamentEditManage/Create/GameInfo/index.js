import React, { useState, useEffect, useRef } from 'react';

import { Controller, useForm } from 'react-hook-form';

import { withConfigConsumer } from 'contexts/Config';
import { withAuthConsumer } from 'contexts/Auth';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';

import classes from './styles.module.scss';

import { getSearchWithOptions } from 'apis/tournament';
import { from } from 'rxjs';

import Textfield from 'components/DesignSystem/Input/TextField';
import Dropdown from 'components/DesignSystem/Input/Dropdown_V3';
import Loading from 'components/utils/Loading';
import Button from 'components/DesignSystem/Input/Button';

const GameInfo = props => {
    const { configData, onSubmit, game, goBack, intl, authData } = props;
    const { apiWithTokenWrapper, getUsername } = authData;
    const { getImageUrl } = configData;
    const [isLoading, setIsLoading] = useState(true);
    const [RenOldGames, setRenOldGames] = useState([]);
    const { handleSubmit, setValue, control, formState } = useForm({ mode: 'onChange' });
    const { isValid } = formState;

    const defaultOption = [
        {
            key: null,
            value: intl.formatMessage({ id: 'common_please_select' })
        }
    ];
    const fetchListener = useRef();

    const getOldGameCreateList = () => {
        const data = {
            game_id: game.game_id,
            username_create: getUsername()
        };

        fetchListener.current = from(apiWithTokenWrapper(getSearchWithOptions, data)).subscribe(response => {
            if (response.status === 200) {
                if (response.data.header.status === 'OK') {
                    const Arr = response.data.body.t8ts.map((val, idx) => {
                        return {
                            id: idx,
                            key: val.t8t_lite.t8t_serial,
                            name: val.t8t_lite.name,
                            value: val.t8t_lite.name
                        };
                    });
                    setRenOldGames(defaultOption.concat(Arr));
                    setIsLoading(false);
                }
            }
        });
    };
    useEffect(() => {
        getOldGameCreateList();
        return () => {
            if (fetchListener.current) {
                fetchListener.current.unsubscribe();
            }
        };
    }, []);

    return (
        <>
            {isLoading ? (
                <Loading />
            ) : (
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
                                        {intl.formatMessage({
                                            id: 'Tournament-Management-Create-New-Tournament_Selected Game'
                                        })}
                                    </div>
                                    <div className={classes.gameInfo}>
                                        <img src={game.icon_image !== null ? getImageUrl(game.icon_image) : ''} />
                                        <div className={classes.gameName}>{game.name}</div>
                                    </div>
                                    <div className={classes.select}>
                                        {intl.formatMessage({
                                            id:
                                                'Tournament-Management-Create-New-Tournament_Clone Previous Tournaments (Optional)'
                                        })}
                                        <div className={classes.innerSelect}>
                                            <Controller
                                                as={<Dropdown options={RenOldGames} defaultKey={null} />}
                                                defaultValue={null}
                                                control={control}
                                                name={'tournament'}
                                                //onchange在control時，不會再直接綁值到submit，必須透過return
                                                onChange={e => {
                                                    setValue('name', e[0].name + ' (new)', { shouldValidate: true });
                                                    return e[0].key;
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div className={classes.select}>
                                        {intl.formatMessage({
                                            id: 'Tournament-Management-Create-New-Tournament_Tournament Name'
                                        })}
                                        <div className={classes.innerSelect}>
                                            <Controller
                                                as={
                                                    <Textfield
                                                        theme="dark"
                                                        placeholder={intl.formatMessage({
                                                            id:
                                                                'Tournament-Management-Create-New-Tournament_Please Enter the Tournament Name'
                                                        })}
                                                        type="text"
                                                        name="name"
                                                    />
                                                }
                                                defaultValue={''}
                                                control={control}
                                                rules={{ required: true, minLength: 5, maxLength: 30 }}
                                                name="name"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className={classes.myBtn}>
                                <Button
                                    title={intl.formatMessage({
                                        id: 'Tournament-Management-Create-New-Tournament_[btn]Back'
                                    })}
                                    theme="dark_2"
                                    onClick={() => goBack()}
                                />
                                <Button
                                    title={intl.formatMessage({
                                        id: 'Tournament-Management-Create-New-Tournament_[btn]Next'
                                    })}
                                    disabled={!isValid}
                                    type="submit"
                                />
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </>
    );
};

export default withRouter(withAuthConsumer(withConfigConsumer(injectIntl(GameInfo))));
