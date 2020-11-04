import React, { useState, useReducer, createRef, useContext } from 'react';
import { Controller, useForm } from 'react-hook-form';

import classes from './styles.module.scss';
import classNames from 'classnames/bind';

import Button from 'components/DesignSystem/Input/Button';
import Textfield from 'components/DesignSystem/Input/TextField';
import { TrashIcon } from 'components/utils/Icons';
import EditImageIcon from '../../EditImageIcon';
import Card, { CardHeader, CardBody } from 'components/DesignSystem/DataDisplay/Card';

import { EditManageContext } from '../../Context';

const cx = classNames.bind(classes);

const Sponsor = prop => {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const { t8tDetail, intl, saveT8tDetail, configData, editClickBack, handleSelectImage } = useContext(
        EditManageContext
    );
    const { getImageUrl } = configData;
    const { sponsors, is_create_finished } = t8tDetail;

    const [sponsorsList, setSponsorsList] = useState(sponsors);
    const [sponsorsImages, setSponsorsImages] = useState([]);

    const { handleSubmit, setValue, control, formState, getValues } = useForm({ mode: 'onChange' });
    const { isValid } = formState;

    const onSubmit = data => {
        let updateData = { ...t8tDetail };
        Object.keys(data).forEach(key => {
            updateData[key] = data[key];
        });
        updateData.updatSponsors_Images = sponsorsImages;
        updateData.indexKey = 10;

        saveT8tDetail(updateData);
    };

    const handleUploadImage = (imageFile, callback, index) => {
        if (imageFile) {
            const imageUrl = URL.createObjectURL(imageFile);
            const imageBlob = imageFile;
            imageBlob.src = imageUrl;

            let i = sponsorsImages.length;
            let imageIndex = getValues(`sponsors[${index}].image_index`);
            if (imageIndex === null || imageIndex === '') {
                i = i + 1;
                sponsorsImages.push(imageBlob);
            } else {
                sponsorsImages[imageIndex - 1] = imageBlob;
            }

            setSponsorsImages(sponsorsImages);
            sponsorsList[index].sponsor_image = imageBlob;
            setValue(`sponsors[${index}].image_index`, `${imageIndex === null || imageIndex === '' ? i : imageIndex}`);
            setSponsorsList(sponsorsList);
        }
        callback();
    };

    const addSponsorsList = () => {
        let lists = sponsorsList;
        let item = {
            t8t_sponsor_id: '',
            sponsor_image: null,
            sponsor_url: '',
            is_delete: false,
            image_index: null
        };
        // sponsorsList上限6筆
        //102920 上修至12筆
        if (sponsorsList.length >= 12) return;

        lists.push(item);
        setSponsorsList(lists);

        forceUpdate();
    };

    const deleteSponsorsList = (item, index) => {
        setValue(`sponsors[${index}].is_delete`, 'true');

        sponsorsList[index].is_delete = true;
        setSponsorsList(sponsorsList);
        forceUpdate();
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className={classes.sponsorCon}>
                    <Card size="col-9" customClass={classes.cardWrapper}>
                        <CardHeader>
                            {intl.formatMessage({ id: 'Tournament-Management-Bracket-Settings-Sponsor_Sponsor Info' })}
                        </CardHeader>
                        <CardBody customClass={classes.cardBody}>
                            <div className={classes.infoInner}>
                                {sponsorsList.map((item, index) => {
                                    return (
                                        <div className={classes.sponsorBlock} key={index}>
                                            {item.is_delete ? (
                                                ''
                                            ) : (
                                                <div className={classes.picBox}>
                                                    {item.sponsor_image === null ? (
                                                        ''
                                                    ) : (
                                                        <img
                                                            src={
                                                                item.sponsor_image.src
                                                                    ? item.sponsor_image.src
                                                                    : getImageUrl(item.sponsor_image)
                                                            }
                                                            className={classes.bigBanner}
                                                        />
                                                    )}
                                                    <div
                                                        className={classes.mask}
                                                        onClick={() =>
                                                            handleSelectImage(
                                                                handleUploadImage,
                                                                { width: 274, height: 142 },
                                                                index
                                                            )
                                                        }
                                                    >
                                                        <EditImageIcon></EditImageIcon>
                                                        <div className={classes.size}>W 274 x H 142 px</div>
                                                    </div>
                                                </div>
                                            )}

                                            <div className={classes.linkInput}>
                                                <Controller
                                                    as={
                                                        <Textfield
                                                            name={`sponsors[${index}].t8t_sponsor_id`}
                                                            type="hidden"
                                                        />
                                                    }
                                                    defaultValue={item.t8t_sponsor_id}
                                                    control={control}
                                                    name={`sponsors[${index}].t8t_sponsor_id`}
                                                />
                                                <Controller
                                                    as={
                                                        <Textfield
                                                            name={`sponsors[${index}].is_delete`}
                                                            type="hidden"
                                                        />
                                                    }
                                                    defaultValue={item.is_delete ? 'true' : 'false'}
                                                    control={control}
                                                    name={`sponsors[${index}].is_delete`}
                                                />
                                                <Controller
                                                    as={
                                                        <Textfield
                                                            name={`sponsors[${index}].image_index`}
                                                            type="hidden"
                                                        />
                                                    }
                                                    defaultValue={
                                                        item.image_index === null ? '' : `${item.image_index}`
                                                    }
                                                    control={control}
                                                    name={`sponsors[${index}].image_index`}
                                                />

                                                <Controller
                                                    as={
                                                        <Textfield
                                                            theme="dark"
                                                            placeholder={intl.formatMessage({
                                                                id:
                                                                    'Tournament-Management-Bracket-Settings-Sponsor_Sponsor Official Link'
                                                            })}
                                                            isLink={true}
                                                            type={item.is_delete ? 'hidden' : 'text'}
                                                        />
                                                    }
                                                    defaultValue={item.sponsor_url}
                                                    control={control}
                                                    name={`sponsors[${index}].sponsor_url`}
                                                />
                                            </div>
                                            {item.is_delete ? (
                                                ''
                                            ) : (
                                                <div onClick={() => deleteSponsorsList(item, index)}>
                                                    <TrashIcon></TrashIcon>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                                <a className={classes.add} href="#" onClick={() => addSponsorsList()}>
                                    +{' '}
                                    {intl.formatMessage({
                                        id: 'Tournament-Management-Bracket-Settings-Sponsor_Add Sponsor'
                                    })}{' '}
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
                                    onClick={() => editClickBack(7)}
                                />
                                <Button
                                    title={intl.formatMessage({
                                        id: 'Tournament-Management-Create-New-Tournament_[btn]Next'
                                    })}
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

export default Sponsor;
