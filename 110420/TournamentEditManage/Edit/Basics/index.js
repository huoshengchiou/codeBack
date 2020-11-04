import React, { useState, useEffect, useRef, useReducer, useContext } from 'react';

import classes from './styles.module.scss';
import classNames from 'classnames/bind';
import { Controller, useForm } from 'react-hook-form';
import moment from 'moment-timezone';

import Textfield from 'components/DesignSystem/Input/TextField';
import CalendarDatePicker from 'components/DesignSystem/Input/DatePicker/CalendarDatePicker';
import Button from 'components/DesignSystem/Input/Button';
import Card, { CardHeader, CardBody } from 'components/DesignSystem/DataDisplay/Card';

import { EditManageContext } from '../../Context';
import EditImageIcon from '../../EditImageIcon';
const cx = classNames.bind(classes);

const Basics = prop => {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const { t8tDetail, configData, intl, saveT8tDetail, getDatepickerDisable, handleSelectImage } = useContext(
        EditManageContext
    );
    const { event_start_at, t8t_lite, is_create_finished, status } = t8tDetail;
    const { name, game, banner_image } = t8t_lite;
    const { getImageUrl, currentLocale } = configData;

    const [bannerImage, setBannerImage] = useState([]);
    // image_is_delete
    const [isBannerImage, setIsBannerImage] = useState(banner_image === null ? true : false);

    const { handleSubmit, triggerValidation, control, formState } = useForm({ mode: 'onChange' });
    const { isValid } = formState;

    useEffect(() => {
        triggerValidation();
    }, []);

    const onSubmit = data => {
        let updateData = { ...t8tDetail };
        updateData.name = data.name;
        updateData.event_start_at = data.startDate;
        updateData.indexKey = 2;
        if (bannerImage.length > 0) {
            updateData.updatBanner_image = bannerImage[0];
        }
        saveT8tDetail(updateData);
    };

    const handleUploadImage = (imageFile, callback) => {
        if (imageFile) {
            const imageUrl = URL.createObjectURL(imageFile);
            const imageBlob = imageFile;
            imageBlob.src = imageUrl;
            bannerImage[0] = imageBlob;

            if (!isBannerImage) {
                setIsBannerImage(true);
            }
            setBannerImage(bannerImage);
        }
        callback();
    };

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Card size="col-9" customClass={classes.cardWrapper}>
                    <CardHeader>
                        {intl.formatMessage({ id: 'Tournament-Management-Page-Clone-Tournament_Basic Fields' })}
                    </CardHeader>
                    <CardBody customClass={classes.cardBody}>
                        <div className={cx('group')}>
                            <div className={classes.bold}>
                                {intl.formatMessage({
                                    id: 'Tournament-Management-Page-Clone-Tournament_Selected Game'
                                })}
                            </div>
                            <div className={classes.inner}>
                                <span className={classes.blue}>{game.name}</span>
                            </div>
                        </div>
                        <div className={cx('group', 'needTop')}>
                            <div className={classes.bold}>
                                {intl.formatMessage({
                                    id: 'Tournament-Management-Page-Clone-Tournament_Tournament Name'
                                })}
                            </div>
                            <div className={classes.innerInput}>
                                <Controller
                                    as={
                                        <Textfield
                                            customClass={classes.basicInp}
                                            theme="dark"
                                            name="name"
                                            placeholder={intl.formatMessage({
                                                id:
                                                    'Tournament-Management-Create-New-Tournament_Please Enter the Tournament Name'
                                            })}
                                            type="text"
                                        />
                                    }
                                    defaultValue={name}
                                    control={control}
                                    rules={{ required: true, minLength: 5, maxLength: 30 }}
                                    name="name"
                                />
                            </div>
                        </div>
                        <table className={classes.basicsTable}>
                            <tbody>
                                <tr>
                                    <td>
                                        <div className={classes.basicsTableWord}>
                                            {intl.formatMessage({
                                                id: 'Tournament-Management-Page-Clone-Tournament_Start Date'
                                            })}
                                        </div>
                                        <div>
                                            <Controller
                                                as={
                                                    <CalendarDatePicker
                                                        name="startDate"
                                                        theme="dark"
                                                        disabledDateTime={moment().add(-1, 'days')}
                                                        isShowTime={true}
                                                        setMinuteStep={15}
                                                        currentLocale={currentLocale}
                                                        disabled={getDatepickerDisable(status)}
                                                    ></CalendarDatePicker>
                                                }
                                                control={control}
                                                rules={{ required: true }}
                                                defaultValue={event_start_at === null ? '' : moment(event_start_at)}
                                                name="startDate"
                                            />
                                        </div>
                                        <div className={classes.basicsGrayWord}>
                                            {/* Display in {moment.tz.guess()}{}(+8){" "} */}
                                            {/* {TimeZoneDisplay} */}
                                        </div>
                                    </td>
                                    <td></td>
                                </tr>
                            </tbody>
                        </table>
                    </CardBody>
                </Card>
                <Card size="col-9" customClass={classes.cardWrapper}>
                    <CardHeader>
                        {intl.formatMessage({ id: 'Tournament-Management-Page-Clone-Tournament_Head Banner' })}
                    </CardHeader>
                    <CardBody customClass={classes.cardBody}>
                        <div className={classes.basicsPic}>
                            {!isBannerImage ? (
                                <img alt="" src={getImageUrl(banner_image)} className={classes.bigBanner} />
                            ) : bannerImage !== null ? (
                                <img alt="" src={bannerImage[0].src} className={classes.bigBanner} />
                            ) : (
                                ''
                            )}

                            <div
                                className={classes.mask}
                                onClick={() => handleSelectImage(handleUploadImage, { width: 1129, height: 350 })}
                            >
                                <EditImageIcon></EditImageIcon>
                                <div className={classes.size}>{`W 1129 x H 350 pxs`}</div>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                <div className={classes.buttonCon}>
                    {is_create_finished ? (
                        <Button
                            title={intl.formatMessage({
                                id: 'Tournament-Management-Bracket-Settings-After-Publish_[btn]Save'
                            })}
                            disabled={!isValid}
                            type="submit"
                        />
                    ) : (
                        <Button
                            title={intl.formatMessage({
                                id: 'Tournament-Management-Page-Clone-Tournament_[btn]Next'
                            })}
                            disabled={!isValid}
                            type="submit"
                        />
                    )}
                </div>
            </form>
        </>
    );
};

export default Basics;
