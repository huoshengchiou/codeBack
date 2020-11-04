import React, { useState, useEffect, useRef, useReducer, createRef, useContext } from 'react';
import { useFormsller, Controller, useForm } from 'react-hook-form';

import Button from 'components/DesignSystem/Input/Button';
import { TrashIcon } from 'components/utils/Icons';
// import plus from "../../Img/plus.png";
import Card, { CardHeader, CardBody } from 'components/DesignSystem/DataDisplay/Card';
import Textarea from 'components/DesignSystem/Input/Textarea';
import Dropdown from 'components/DesignSystem/Input/Dropdown_V3';
import Textfield from 'components/DesignSystem/Input/TextField';
import Loading from 'components/utils/Loading';
import EditImageIcon from '../../EditImageIcon';

import { EditManageContext } from '../../Context';

import classes from './styles.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const Info = prop => {
    const [ignored, forceUpdate] = useReducer(x => x + 1, 0);
    const {
        t8tDetail,
        paramList,
        contextIsLoading,
        configData,
        intl,
        saveT8tDetail,
        editClickBack,
        isNullorEmpty,
        handleSelectImage
    } = useContext(EditManageContext);

    const { getImageUrl } = configData;
    const { description, rule, total_prize_type, total_prize_pool, contacts, prizes, is_create_finished } = t8tDetail;
    const { t8t_contact_type, t8t_total_prize_type } = paramList.t8t_params;
    const defaultOption = [
        {
            key: 'null',
            value: intl.formatMessage({ id: 'common_please_select' })
        }
    ];

    const contactType = defaultOption.concat(
        t8t_contact_type.map((item, index) => {
            return { id: index, key: item, name: item, value: item };
        })
    );
    const totalPrizeType = defaultOption.concat(
        t8t_total_prize_type.map((item, index) => {
            return {
                id: index,
                key: item,
                name: item,
                value: intl.formatMessage({ id: `Tournament-Management-Setup-Info-Prize_${item}` })
            };
        })
    );

    const [contactList, setContactList] = useState(contacts);
    const [priceInfoList, setPriceInfoList] = useState(prizes);
    const [prizeImages, setPrizeImages] = useState([]);

    const { handleSubmit, setValue, triggerValidation, control, formState, getValues } = useForm({ mode: 'onChange' });
    const { isValid } = formState;

    //mount時強制進行Validation
    useEffect(() => {
        triggerValidation();
    }, []);

    const onSubmit = data => {
        let updateData = { ...t8tDetail };
        Object.keys(data).forEach(key => {
            updateData[key] = data[key];
        });

        updateData.updatPrize_Images = prizeImages;
        updateData.indexKey = 3;
        updateData.currindexKey = 3;

        saveT8tDetail(updateData);
    };

    const addContact = () => {
        let lists = contactList;
        let item = {
            t8t_contact_id: '',
            contact_type: ' ',
            contact_value: '',
            is_delete: false
        };

        lists.push(item);
        setContactList(lists);
    };

    const deleteContact = (item, index) => {
        let list = contactList;
        if (item.t8t_contact_id === '') {
            list.splice(index, 1);
        } else {
            setValue(`contacts[${index}].is_delete`, 'true');
            list[index].is_delete = true;
        }
        setContactList(list);
        forceUpdate();
    };

    const addPrizeInfo = () => {
        let lists = priceInfoList;
        let item = {
            t8t_prize_id: '',
            title: '',
            prize_image: null,
            name: '',
            description: '',
            link: '',
            is_delete: false,
            image_index: null
        };

        lists.push(item);
        setPriceInfoList(lists);
    };

    const deletePrizeInfo = (item, index) => {
        let lists = priceInfoList;

        if (item.t8t_prize_id === '') {
            lists.splice(index, 1);
        } else {
            setValue(`prizes[${index}].is_delete`, 'true');

            lists[index].is_delete = true;
        }

        setPriceInfoList(lists);
        forceUpdate();
    };

    const handleUploadImage = (imageFile, callback, index) => {
        if (imageFile) {
            const imageUrl = URL.createObjectURL(imageFile);
            const imageBlob = imageFile;
            imageBlob.src = imageUrl;

            let i = prizeImages.length;
            let imageIndex = getValues(`prizes[${index}].image_index`);
            if (imageIndex === null || imageIndex === '') {
                i = i + 1;
                prizeImages.push(imageBlob);
            } else {
                prizeImages[imageIndex - 1] = imageBlob;
            }

            setPrizeImages(prizeImages);
            priceInfoList[index].prize_image = imageBlob;
            setValue(`prizes[${index}].image_index`, `${imageIndex === null || imageIndex === '' ? i : imageIndex}`);
            setPriceInfoList(priceInfoList);
        }
        callback();
    };

    return (
        <>
            {contextIsLoading ? (
                <Loading />
            ) : (
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={classes.infoCon}>
                        <Card size="col-9" customClass={classes.cardWrapper}>
                            <CardHeader>
                                {intl.formatMessage({ id: 'Tournament-Management-Setup-Info_Contact (Optional)' })}
                            </CardHeader>
                            <CardBody customClass={classes.cardBody}>
                                <div className={classes.infoInner}>
                                    <div className={classes.word}>
                                        <b className={classes.wordLine}>
                                            {intl.formatMessage({ id: 'Tournament-Management-Setup-Info_Notice' })} !
                                        </b>
                                        <br />
                                        {intl.formatMessage({
                                            id: 'Tournament-Management-Setup-Info_Notice Description'
                                        })}
                                        <br />
                                        <b className={classes.wordLine}>
                                            {intl.formatMessage({
                                                id: 'Tournament-Management-Setup-Info_Contact Window'
                                            })}
                                        </b>
                                    </div>
                                    <table className={classes.trashTable}>
                                        <tbody>
                                            {contactList.map((item, index) => {
                                                return (
                                                    <tr key={index} className={!item.is_delete ? '' : classes.padding0}>
                                                        <td>
                                                            <Controller
                                                                as={
                                                                    <Textfield
                                                                        name={`contacts[${index}].t8t_contact_id`}
                                                                        type="hidden"
                                                                    />
                                                                }
                                                                defaultValue={item.t8t_contact_id}
                                                                control={control}
                                                                name={`contacts[${index}].t8t_contact_id`}
                                                            />
                                                            <Controller
                                                                as={
                                                                    <Textfield
                                                                        name={`contacts[${index}].is_delete`}
                                                                        type="hidden"
                                                                    />
                                                                }
                                                                defaultValue={!item.is_delete ? 'false' : 'true'}
                                                                control={control}
                                                                name={`contacts[${index}].is_delete`}
                                                            />

                                                            {item.is_delete ? (
                                                                <Controller
                                                                    as={
                                                                        <Textfield
                                                                            name={`contacts[${index}].contact_type`}
                                                                            type="hidden"
                                                                        />
                                                                    }
                                                                    defaultValue={item.is_delete}
                                                                    control={control}
                                                                    name={`contacts[${index}].contact_type`}
                                                                />
                                                            ) : (
                                                                <Controller
                                                                    as={
                                                                        <Dropdown
                                                                            type="select"
                                                                            placeholder="select"
                                                                            options={contactType}
                                                                            defaultKey={
                                                                                !isNullorEmpty(item.contact_type)
                                                                                    ? item.contact_type
                                                                                    : 'null'
                                                                            }
                                                                        />
                                                                    }
                                                                    defaultValue={
                                                                        !isNullorEmpty(item.contact_type)
                                                                            ? item.contact_type
                                                                            : 'null'
                                                                    }
                                                                    control={control}
                                                                    name={`contacts[${index}].contact_type`}
                                                                    onChange={e => {
                                                                        return e[0].key;
                                                                    }}
                                                                />
                                                            )}
                                                        </td>
                                                        <td>
                                                            <Controller
                                                                as={
                                                                    <Textfield
                                                                        theme="dark"
                                                                        name={`contacts[${index}].contact_value`}
                                                                        placeholder={
                                                                            ''
                                                                            // intl.formatMessage({ id: "Tournament-Management-Setup-Info_Paste your E-mail address" })
                                                                        }
                                                                        type={item.is_delete ? 'hidden' : 'text'}
                                                                    />
                                                                }
                                                                defaultValue={item.contact_value}
                                                                control={control}
                                                                name={`contacts[${index}].contact_value`}
                                                            />
                                                        </td>
                                                        <td>
                                                            {item.is_delete ? (
                                                                ''
                                                            ) : (
                                                                <div onClick={() => deleteContact(item, index)}>
                                                                    <TrashIcon></TrashIcon>
                                                                </div>
                                                            )}
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                    <a className={classes.add} href="#" onClick={() => addContact()}>
                                        + {intl.formatMessage({ id: 'Tournament-Management-Setup-Info_Add Contact' })}
                                    </a>
                                </div>
                            </CardBody>
                        </Card>
                        <Card size="col-9" customClass={classes.cardWrapper}>
                            <CardHeader>
                                {intl.formatMessage({ id: 'Tournament-Management-Setup-Info_Description Optional' })}
                            </CardHeader>
                            <CardBody customClass={classes.cardBody}>
                                <div className={classes.infoInner}>
                                    <Controller
                                        as={<Textarea name="description" theme="dark" maxLength={7000} />}
                                        defaultValue={description !== null ? description : ''}
                                        rules={{ maxLength: 7000 }}
                                        control={control}
                                        name="description"
                                        onChange={e => {
                                            //change 時強制進行 Validation
                                            triggerValidation();
                                            return e[0];
                                        }}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                        <Card size="col-9" customClass={classes.cardWrapper}>
                            <CardHeader>
                                {intl.formatMessage({ id: 'Tournament-Management-Setup-Info_Rule Optional' })}
                            </CardHeader>
                            <CardBody customClass={classes.cardBody}>
                                <div className={classes.infoInner}>
                                    <Controller
                                        as={<Textarea name="rule" theme="dark" maxLength={7000} />}
                                        defaultValue={rule !== null ? rule : ''}
                                        rules={{ maxLength: 7000 }}
                                        control={control}
                                        name="rule"
                                        onChange={e => {
                                            triggerValidation();
                                            return e[0];
                                        }}
                                    />
                                </div>
                            </CardBody>
                        </Card>
                        <Card size="col-9" customClass={classes.cardWrapper}>
                            <CardHeader>
                                {intl.formatMessage({ id: 'Tournament-Management-Setup-Info_Prize Optional' })}
                            </CardHeader>
                            <CardBody customClass={classes.cardBody}>
                                <div className={classes.infoInner}>
                                    <table className={classes.prizeTable}>
                                        <tbody>
                                            <tr>
                                                <td>
                                                    {intl.formatMessage({
                                                        id: 'Tournament-Management-Setup-Info_Prize Pool'
                                                    })}
                                                    <div className={classes.marginTop10}>
                                                        <Controller
                                                            as={
                                                                <Dropdown
                                                                    type="select"
                                                                    placeholder="select"
                                                                    options={totalPrizeType}
                                                                    defaultKey={
                                                                        isNullorEmpty(total_prize_type)
                                                                            ? 'null'
                                                                            : total_prize_type
                                                                    }
                                                                />
                                                            }
                                                            defaultValue={
                                                                isNullorEmpty(total_prize_type)
                                                                    ? 'null'
                                                                    : total_prize_type
                                                            }
                                                            control={control}
                                                            name={`total_prize_type`}
                                                            onChange={e => {
                                                                return e[0].key;
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                                <td>
                                                    {intl.formatMessage({
                                                        id: 'Tournament-Management-Setup-Info_Amount'
                                                    })}
                                                    <br />
                                                    <div className={classes.marginTop10}>
                                                        <Controller
                                                            as={
                                                                <Textfield
                                                                    theme="dark"
                                                                    name={`total_prize_pool`}
                                                                    type="number"
                                                                />
                                                            }
                                                            defaultValue={
                                                                total_prize_pool === null ? '' : total_prize_pool
                                                            }
                                                            control={control}
                                                            name={`total_prize_pool`}
                                                            onChange={e => {
                                                                if (+e[0].target.value < 0) {
                                                                    return `0`;
                                                                }
                                                                return e[0].target.value;
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                    <div className={classes.smallTitle}>
                                        {intl.formatMessage({
                                            id: 'Tournament-Management-Setup-Info_Place Prize info'
                                        })}
                                    </div>
                                    {priceInfoList.map((item, index) => {
                                        return (
                                            <div
                                                className={cx(
                                                    classes.pizeCon,
                                                    item.is_delete ? classes.marginBottom : ''
                                                )}
                                                key={index}
                                            >
                                                {console.log(item)}
                                                <Controller
                                                    as={
                                                        <Textfield
                                                            customContainerClass={classes.displayWidth0}
                                                            name={`prizes[${index}].t8t_prize_id`}
                                                            type="hidden"
                                                        />
                                                    }
                                                    defaultValue={item.t8t_prize_id}
                                                    control={control}
                                                    name={`prizes[${index}].t8t_prize_id`}
                                                />
                                                <Controller
                                                    as={
                                                        <Textfield
                                                            customContainerClass={classes.displayWidth0}
                                                            name={`prizes[${index}].is_delete`}
                                                            type="hidden"
                                                        />
                                                    }
                                                    defaultValue={item.is_delete ? 'true' : 'false'}
                                                    control={control}
                                                    name={`prizes[${index}].is_delete`}
                                                />
                                                <Controller
                                                    as={
                                                        <Textfield
                                                            customContainerClass={classes.displayWidth0}
                                                            name={`prizes[${index}].image_index`}
                                                            type="hidden"
                                                        />
                                                    }
                                                    defaultValue={
                                                        item.image_index === null ? '' : `${item.image_index}`
                                                    }
                                                    control={control}
                                                    name={`prizes[${index}].image_index`}
                                                />

                                                {item.is_delete ? (
                                                    <>
                                                        <Controller
                                                            as={
                                                                <Textfield
                                                                    customContainerClass={classes.displayWidth0}
                                                                    name={`prizes[${index}].title`}
                                                                    type="hidden"
                                                                />
                                                            }
                                                            defaultValue={item.title}
                                                            control={control}
                                                            name={`prizes[${index}].title`}
                                                        />
                                                        <Controller
                                                            as={
                                                                <Textfield
                                                                    customContainerClass={classes.displayWidth0}
                                                                    name={`prizes[${index}].name`}
                                                                    type="hidden"
                                                                />
                                                            }
                                                            defaultValue={`${item.name}`}
                                                            control={control}
                                                            name={`prizes[${index}].name`}
                                                        />
                                                        <Controller
                                                            as={
                                                                <Textfield
                                                                    customContainerClass={classes.displayWidth0}
                                                                    name={`prizes[${index}].description`}
                                                                    type="hidden"
                                                                />
                                                            }
                                                            defaultValue={item.description}
                                                            control={control}
                                                            name={`prizes[${index}].description`}
                                                        />
                                                        <Controller
                                                            as={
                                                                <Textfield
                                                                    customContainerClass={classes.displayWidth0}
                                                                    name={`prizes[${index}].link`}
                                                                    type="hidden"
                                                                />
                                                            }
                                                            defaultValue={item.link}
                                                            control={control}
                                                            name={`prizes[${index}].link`}
                                                        />
                                                    </>
                                                ) : (
                                                    <div className={classes.ll}>
                                                        {item.is_delete ? (
                                                            ''
                                                        ) : (
                                                            <div className={classes.pic}>
                                                                {item.prize_image === null ? (
                                                                    ''
                                                                ) : item.prize_image.src ? (
                                                                    <img
                                                                        src={item.prize_image.src}
                                                                        className={classes.bigBanner}
                                                                    />
                                                                ) : (
                                                                    <img
                                                                        src={
                                                                            item.prize_image
                                                                                ? getImageUrl(item.prize_image)
                                                                                : ''
                                                                        }
                                                                        className={classes.bigBanner}
                                                                    />
                                                                )}

                                                                <div
                                                                    className={classes.mask}
                                                                    onClick={() =>
                                                                        handleSelectImage(
                                                                            handleUploadImage,
                                                                            { width: 274, height: 250 },
                                                                            index
                                                                        )
                                                                    }
                                                                >
                                                                    <EditImageIcon></EditImageIcon>
                                                                    {/* <input
                                                                    type="file"
                                                                    multiple
                                                                    ref={imageIconRef[index]}
                                                                    accept="image/png, image/jpeg, image/jpg"
                                                                    onChange={e => handleUploadImage(e, index)}
                                                                    className={classes.uploadImageText}
                                                                /> */}
                                                                    {/* <img alt="" src={plus} /> */}
                                                                    <div className={classes.size}>W 274 x H 250 px</div>
                                                                </div>
                                                            </div>
                                                        )}

                                                        <table>
                                                            <tbody>
                                                                <tr>
                                                                    <td>
                                                                        {intl.formatMessage({
                                                                            id:
                                                                                'Tournament-Management-Setup-Info_Reward Title'
                                                                        })}
                                                                        <br />
                                                                        <Controller
                                                                            as={
                                                                                <Textfield
                                                                                    theme="dark"
                                                                                    name={`prizes[${index}].title`}
                                                                                    placeholder={''}
                                                                                    type={'text'}
                                                                                />
                                                                            }
                                                                            defaultValue={item.title}
                                                                            control={control}
                                                                            name={`prizes[${index}].title`}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        {intl.formatMessage({
                                                                            id:
                                                                                'Tournament-Management-Setup-Info_Item Name'
                                                                        })}
                                                                        <br />
                                                                        <Controller
                                                                            as={
                                                                                <Textfield
                                                                                    theme="dark"
                                                                                    name={`prizes[${index}].name`}
                                                                                    placeholder={''}
                                                                                    type={'text'}
                                                                                />
                                                                            }
                                                                            defaultValue={`${item.name}`}
                                                                            control={control}
                                                                            name={`prizes[${index}].name`}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        {intl.formatMessage({
                                                                            id:
                                                                                'Tournament-Management-Setup-Info_Description'
                                                                        })}
                                                                        <br />
                                                                        {/* <textarea></textarea> */}
                                                                        <Controller
                                                                            as={
                                                                                <Textarea
                                                                                    name={`prizes[${index}].description`}
                                                                                    theme="dark"
                                                                                    placeholder=""
                                                                                />
                                                                            }
                                                                            defaultValue={item.description}
                                                                            control={control}
                                                                            name={`prizes[${index}].description`}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                                <tr>
                                                                    <td>
                                                                        {intl.formatMessage({
                                                                            id: 'Tournament-Management-Setup-Info_Link'
                                                                        })}
                                                                        <br />
                                                                        {/* <img alt="" src={link} /> */}
                                                                        <Controller
                                                                            as={
                                                                                <Textfield
                                                                                    theme="dark"
                                                                                    customClass={classes.linkInput}
                                                                                    name={`prizes[${index}].link`}
                                                                                    placeholder={''}
                                                                                    type={'text'}
                                                                                    isLink={true}
                                                                                />
                                                                            }
                                                                            defaultValue={item.link}
                                                                            control={control}
                                                                            name={`prizes[${index}].link`}
                                                                        />
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}

                                                {item.is_delete ? (
                                                    ''
                                                ) : (
                                                    <div
                                                        className={classes.rr}
                                                        onClick={() => deletePrizeInfo(item, index)}
                                                    >
                                                        <TrashIcon></TrashIcon>
                                                        {/* <img alt="" src={trash} /> */}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                    <a href="#" className={classes.add} onClick={() => addPrizeInfo()}>
                                        + {intl.formatMessage({ id: 'Tournament-Management-Setup-Info_Add Rewards' })}
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
                                        onClick={() => editClickBack(1)}
                                    />
                                    <Button
                                        title={intl.formatMessage({
                                            id: 'Tournament-Management-Create-New-Tournament_[btn]Next'
                                        })}
                                        disabled={!isValid}
                                        type="submit"
                                    />
                                </>
                            )}
                        </div>
                    </div>
                </form>
            )}
        </>
    );
};

export default Info;
