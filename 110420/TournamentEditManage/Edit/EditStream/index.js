import React, { useState, useRef, useReducer, useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';
import Card, { CardHeader, CardBody } from 'components/DesignSystem/DataDisplay/Card';

import classes from './styles.module.scss';

import classNames from 'classnames/bind';
import { TrashIcon } from 'components/utils/Icons';

import Button from 'components/DesignSystem/Input/Button';

import Dropdown from 'components/DesignSystem/Input/Dropdown_V3';
import Textfield from 'components/DesignSystem/Input/TextField';
import { EditManageContext } from '../../Context';

const cx = classNames.bind(classes);

const EditStream = prop => {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const { t8tDetail, paramList, intl, saveT8tDetail, editClickBack } = useContext(EditManageContext);

    const { medias, is_create_finished } = t8tDetail;
    const { t8t_params } = paramList;
    const { t8t_media } = t8t_params;

    const [steamList, setSteamList] = useState(medias);
    const defaultOption = [
        {
            key: null,
            value: intl.formatMessage({ id: 'common_please_select' })
        }
    ];
    const mediaType = defaultOption.concat(
        t8t_media.map((item, index) => {
            return { id: index, key: item, name: item, value: item };
        })
    );

    const { handleSubmit, setValue, control, formState } = useForm({ mode: 'onChange' });
    const { isValid } = formState;

    const onSubmit = data => {
        let updateData = { ...t8tDetail };

        Object.keys(data).forEach(key => {
            updateData[key] = data[key];
        });
        updateData.indexKey = t8tDetail.t8t_lite.club_sales_type === 'general' ? 10 : 9;

        saveT8tDetail(updateData);
    };

    const addSteamList = () => {
        let lists = steamList;
        let item = {
            t8t_media_id: '',
            platform_code: ' ',
            video_uri: '',
            is_delete: false
        };

        lists.push(item);
        setSteamList(lists);
    };

    const deleteSteamList = (item, index) => {
        setValue(`medias[${index}].is_delete`, 'true');

        steamList[index].is_delete = true;

        setSteamList(steamList);
        forceUpdate();
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={classes.infoCon}>
                    <Card size="col-9" customClass={classes.cardWrapper}>
                        <CardHeader>
                            {intl.formatMessage({
                                id: 'Tournament-Management-Bracket-Settings-Media_Edit Stream Optional'
                            })}
                        </CardHeader>
                        <CardBody customClass={classes.cardBody}>
                            <div className={classes.infoInner}>
                                <div className={classes.word}>
                                    <b>
                                        {intl.formatMessage({
                                            id: 'Tournament-Management-Bracket-Settings-Media_New Stream'
                                        })}
                                    </b>
                                </div>
                                <table className={classes.trashTable}>
                                    <tbody>
                                        {steamList.map((item, index) => {
                                            return (
                                                <tr key={index}>
                                                    <td>
                                                        <Controller
                                                            as={
                                                                <Textfield
                                                                    customContainerClass={classes.displayWidth0}
                                                                    name={`medias[${index}].t8t_media_id`}
                                                                    type="hidden"
                                                                />
                                                            }
                                                            defaultValue={item.t8t_media_id}
                                                            control={control}
                                                            name={`medias[${index}].t8t_media_id`}
                                                        />
                                                        <Controller
                                                            as={
                                                                <Textfield
                                                                    customContainerClass={classes.displayWidth0}
                                                                    name={`medias[${index}].is_delete`}
                                                                    type="hidden"
                                                                />
                                                            }
                                                            defaultValue={item.is_delete ? 'true' : 'false'}
                                                            control={control}
                                                            name={`medias[${index}].is_delete`}
                                                        />
                                                        {item.is_delete ? (
                                                            <Controller
                                                                as={
                                                                    <Textfield
                                                                        customContainerClass={classes.displayWidth0}
                                                                        name={`medias[${index}].platform_code`}
                                                                        type="hidden"
                                                                    />
                                                                }
                                                                defaultValue={item.platform_code}
                                                                control={control}
                                                                name={`medias[${index}].platform_code`}
                                                            />
                                                        ) : (
                                                            <Controller
                                                                as={
                                                                    <Dropdown
                                                                        options={mediaType}
                                                                        defaultKey={item.platform_code}
                                                                    />
                                                                }
                                                                defaultValue={item.platform_code}
                                                                control={control}
                                                                name={`medias[${index}].platform_code`}
                                                                onChange={e => {
                                                                    return e[0].key;
                                                                }}
                                                            />
                                                        )}
                                                    </td>
                                                    <td>
                                                        {item.is_delete ? (
                                                            <Controller
                                                                as={
                                                                    <Textfield
                                                                        customContainerClass={classes.displayWidth0}
                                                                        name={`medias[${index}].video_uri`}
                                                                        type="hidden"
                                                                    />
                                                                }
                                                                defaultValue={item.video_uri}
                                                                control={control}
                                                                name={`medias[${index}].video_uri`}
                                                            />
                                                        ) : (
                                                            <Controller
                                                                as={
                                                                    <Textfield
                                                                        theme="dark"
                                                                        placeholder={intl.formatMessage({
                                                                            id:
                                                                                'Tournament-Management-Bracket-Settings-Media_Channel URL'
                                                                        })}
                                                                        isLink={true}
                                                                    />
                                                                }
                                                                defaultValue={item.video_uri}
                                                                control={control}
                                                                name={`medias[${index}].video_uri`}
                                                            />
                                                        )}
                                                    </td>
                                                    <td>
                                                        {item.is_delete ? (
                                                            ''
                                                        ) : (
                                                            <div onClick={() => deleteSteamList(item, index)}>
                                                                <TrashIcon></TrashIcon>
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                                <a className={classes.add} href="#" onClick={() => addSteamList()}>
                                    +{' '}
                                    {intl.formatMessage({
                                        id: 'Tournament-Management-Bracket-Settings-Media_Add New Stream'
                                    })}
                                </a>
                            </div>
                        </CardBody>
                    </Card>
                    <div className={classes.buttonCon}>
                        {is_create_finished ? (
                            <Button
                                title={intl.formatMessage({
                                    id: 'Tournament-Management-Bracket-Settings-After-Publish_[btn]Save'
                                })}
                                type="submit"
                            />
                        ) : (
                            <>
                                <Button
                                    title={intl.formatMessage({
                                        id: 'Tournament-Management-Create-New-Tournament_[btn]Back'
                                    })}
                                    theme="dark_2"
                                    onClick={() => editClickBack(5)}
                                />
                                <Button
                                    title={intl.formatMessage({
                                        id: 'Tournament-Management-Create-New-Tournament_[btn]Next'
                                    })}
                                    // disabled={!isValid}
                                    type="submit"
                                />
                            </>
                        )}
                    </div>
                </div>
            </form>
        </>
    );
};

export default EditStream;
