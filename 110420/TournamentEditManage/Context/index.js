//react
import React, { useState, createContext, useEffect, useRef, useCallback, useContext } from 'react';

import { Route, Switch, withRouter } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import { withAuthConsumer } from 'contexts/Auth';
import { withConfigConsumer } from 'contexts/Config';
import { withDialogConsumer } from 'components/layouts/Dialog/Context';
import { withDialog_V2Consumer } from 'components/layouts/Dialog_V2/Context';
import { PopWindowStorage, withPopWindowConsumer } from 'components/DesignSystem/PopWindow_V2';

import { from } from 'rxjs';
import { getParamsList, postEdit, getT8t } from 'apis/tournament';

import { formatUploadDatetimeWithSpecific } from 'utils/formattersV2/date';
import { getBooleanFromENV } from 'components/utils';
import DialogBlock from 'components/blocks/DialogBlock';
import Button from 'components/DesignSystem/Input/Button';
import { useGetRank } from 'components/pages/Tournament/hooks/useGetRank';

import ImageEditor from 'components/DesignSystem/Input/ImageEditor';

export const EditManageContext = createContext();

const EditManageContainer = props => {
    const { history, match, location, configData, dialogData, intl, authData } = props;
    const { openDialogFunc, closeDialogFunc } = dialogData;
    const { apiWithTokenWrapper } = authData;

    const popWindowData = useContext(PopWindowStorage);
    const { openPopWindow, closePopWindow } = popWindowData;

    const [percent, setPercent] = useState(20);
    const [t8tDetail, setT8tDetail] = useState([]);
    const [paramList, setParamList] = useState([]);
    const [contextIsLoading, setContextIsLoading] = useState(true);
    const [selectEditIndex, setSelectEditIndex] = useState(1);
    const { rankFunc } = useGetRank();

    const fetchListener = useRef();

    const [urlHash, setUrlHash] = useState(null);
    useEffect(() => {
        if (location.hash !== '') {
            setUrlHash(location.hash);
        }
    }, []);

    const tabList = [
        {
            index: 0,
            key: 'edit',
            title: intl.formatMessage({ id: 'Tournament-Management-Page-Clone-Tournament_Edit' }),
            TabName: intl.formatMessage({ id: 'Tournament-Management-Page-Clone-Tournament_Edit' }),
            disabled: false,
            exact: false
        },
        {
            index: 1,
            key: 'manage',
            title: intl.formatMessage({ id: 'Tournament-Management-Page-Clone-Tournament_Manage' }),
            TabName: intl.formatMessage({ id: 'Tournament-Management-Page-Clone-Tournament_Manage' }),
            disabled: false,
            exact: false
        }
    ];

    const editMenuList = [
        { key: 0, title: intl.formatMessage({ id: 'Tournament-Management-Page-Clone-Tournament_Setup' }), layer: 0 },
        {
            key: 1,
            title: intl.formatMessage({ id: 'Tournament-Management-Page-Clone-Tournament_Basics' }),
            layer: 1,
            action: true,
            percent: 20
        },
        {
            key: 2,
            title: intl.formatMessage({ id: 'Tournament-Management-Page-Clone-Tournament_Info' }),
            layer: 1,
            action: false,
            percent: 30
        },
        {
            key: 3,
            title: intl.formatMessage({ id: 'Tournament-Management-Page-Clone-Tournament_Settings' }),
            layer: 1,
            action: false,
            percent: 40
        },
        { key: 4, title: intl.formatMessage({ id: 'Tournament-Management-Page-Clone-Tournament_Bracket' }), layer: 0 },
        {
            key: 5,
            title: intl.formatMessage({ id: 'Tournament-Management-Page-Clone-Tournament_Bracket Settings' }),
            layer: 1,
            action: false,
            percent: 60
        },
        { key: 6, title: intl.formatMessage({ id: 'Tournament-Management-Page-Clone-Tournament_Media' }), layer: 0 },
        {
            key: 7,
            title: intl.formatMessage({ id: 'Tournament-Management-Page-Clone-Tournament_Edit Stream' }),
            layer: 1,
            action: false,
            percent: 70
        },
        { key: 8, title: intl.formatMessage({ id: 'Tournament-Management-Page-Clone-Tournament_Publish' }), layer: 0 },
        {
            key: 9,
            title: intl.formatMessage({ id: 'Tournament-Management-Page-Clone-Tournament_Sponsor' }),
            layer: 1,
            action: false,
            percent: 80
        },
        {
            key: 10,
            title: intl.formatMessage({ id: 'Tournament-Management-Page-Clone-Tournament_Publish Settings' }),
            layer: 1,
            action: false,
            percent: 100
        }
    ];

    const manageMenuList = [
        { key: 0, title: intl.formatMessage({ id: 'Manage-Tournament-Page_Participants' }), layer: 0 },

        {
            key: 1,
            title: intl.formatMessage({ id: 'Manage-Tournament-Page_Participants List' }),
            layer: 1,
            action: true
        },
        getBooleanFromENV('REACT_APP_IS_COMPETITION_OPEN', false)
            ? {
                  key: 2,
                  title: intl.formatMessage({ id: 'Single-Tournament-Page_Competition List' }),
                  layer: 1,
                  action: false
              }
            : '',

        { key: 3, title: intl.formatMessage({ id: 'Manage-Tournament-Page_Notifications' }), layer: 1, action: false },
        { key: 4, title: intl.formatMessage({ id: 'TournamentJoin_Required Data' }), layer: 1, action: false },
        { key: 5, title: intl.formatMessage({ id: 'Manage-Tournament-Page_Bracket' }), layer: 0 },
        {
            key: 6,
            title: intl.formatMessage({ id: 'Manage-Tournament-Page_Seed Bracket Settings' }),
            layer: 1,
            action: false
        },
        { key: 7, title: intl.formatMessage({ id: 'Manage-Tournament-Page_Activity and Judge' }), layer: 0 },
        { key: 8, title: intl.formatMessage({ id: 'Manage-Tournament-Page_Assign Judge' }), layer: 1, action: false },
        { key: 9, title: intl.formatMessage({ id: 'Manage-Tournament-Page_Activity log' }), layer: 1, action: false },
        { key: 10, title: intl.formatMessage({ id: 'Manage-Tournament-Page_Share' }), layer: 0 },
        {
            key: 11,
            title: intl.formatMessage({ id: 'Manage-Tournament-Page_Share Link and Codes' }),
            layer: 1,
            action: false
        }
    ];

    useEffect(() => {
        getT8Params();
        getT8tDetail();
        return () => {
            if (fetchListener.current) {
                fetchListener.current.unsubscribe();
            }
        };
    }, [match.params?.t8t_serial]);

    const getT8Params = useCallback(() => {
        let data = {};
        fetchListener.current = from(apiWithTokenWrapper(getParamsList, data)).subscribe(res => {
            if (res.status === 200) {
                if (res.data.header.status.toUpperCase() === 'OK') {
                    setParamList(res.data.body);
                    // setContextIsLoading(false);
                }
            }
        });
    }, [match.params?.t8t_serial]);

    const getT8tDetail = () => {
        if (match.params?.t8t_serial === undefined || match.params?.t8t_serial === null) {
            return;
        }
        let data = { t8t_serial: match.params?.t8t_serial };

        fetchListener.current = from(apiWithTokenWrapper(getT8t, data)).subscribe(res => {
            if (res.status === 200) {
                if (res.data.header.status.toUpperCase() === 'OK') {
                    setT8tDetail(res.data.body.t8t);
                    setContextIsLoading(false);
                }
            }
        });
    };

    const saveT8tDetail = data => {
        setContextIsLoading(true);

        //block data to DB by limit
        if (data.description && data.description.length > 7000) {
            const limitLength = 7000;
            data.description = data.description.substring(0, limitLength - 1);
        }
        if (data.description && data.rule.length > 7000) {
            const limitLength = 7000;
            data.rule = data.rule.substring(0, limitLength - 1);
        }

        // 時間格式format
        data.event_start_at =
            data.event_start_at !== null ? formatUploadDatetimeWithSpecific(data.event_start_at, 'YYYYMMDDHHmm') : null;

        data.registration_start_at =
            data.registration_start_at !== null
                ? formatUploadDatetimeWithSpecific(data.registration_start_at, 'YYYYMMDDHHmm')
                : null;

        data.registration_end_at =
            data.registration_end_at !== null
                ? formatUploadDatetimeWithSpecific(data.registration_end_at, 'YYYYMMDDHHmm')
                : null;

        data.bracket_rounds = data.bracket_rounds.map(item => {
            item.start_at = formatUploadDatetimeWithSpecific(item.start_at, 'YYYYMMDDHHmm');
            return item;
        });

        // 圖片上傳格式改成 form_data
        const formData = new FormData();
        if (data.updatBanner_image) {
            formData.append('banner_image', data.updatBanner_image);
        }

        if (data.updatSponsors_Images) {
            data.updatSponsors_Images.forEach((element, index) => {
                if (element === null) {
                    return;
                }
                formData.append(`sponsor_images`, element);
            });
        }

        if (data.updatPrize_Images) {
            data.updatPrize_Images.forEach((element, index) => {
                if (element === null) {
                    return;
                }

                formData.append(`prize_images`, element);
            });
        }

        const json = JSON.stringify(data);
        const req = new Blob([json], {
            type: 'application/json'
        });
        formData.append('req', req);

        //call api
        from(apiWithTokenWrapper(postEdit, formData, data.t8t_lite.t8t_serial)).subscribe(res => {
            if (res.status === 200) {
                if (res.data.header.status.toUpperCase() === 'OK') {
                    //從Basic頁之後，取用DB值的地方
                    // if sponsors still [],give empty
                    const { t8t } = res.data.body;
                    // console.log('t8t', t8t)
                    //sponsor為[] //給default

                    // if (t8t.sponsors.length === 0) {
                    //     t8t.sponsors.push({
                    //         t8t_sponsor_id: "",
                    //         sponsor_image: null,
                    //         sponsor_url: "",
                    //         is_delete: false
                    //     })
                    // }
                    //contacts為[] //給default

                    if (t8t.contacts.length === 0) {
                        t8t.contacts.push({
                            t8t_contact_id: '',
                            contact_type: ' ',
                            contact_value: '',
                            is_delete: false,
                            image_index: ''
                        });
                    }

                    if (t8t.prizes.length === 0) {
                        t8t.prizes.push({
                            t8t_prize_id: '',
                            title: '',
                            prize_image: null,
                            name: '',
                            description: ' ',
                            link: '',
                            is_delete: false,
                            image_index: ''
                        });
                    }

                    if (t8t.medias.length === 0) {
                        t8t.medias.push({
                            t8t_media_id: '',
                            platform_code: ' ',
                            video_uri: '',
                            is_delete: false
                        });
                    }

                    setT8tDetail(t8t);

                    let mentItem = editMenuList.find(item => item.key === data.indexKey);
                    if (mentItem) {
                        setPercent(mentItem.percent);
                    }

                    setSelectEditIndex(data.indexKey);

                    setContextIsLoading(false);
                    goTop();
                    // finish and choice goto which page
                    if (data.indexKey === -1 && data.is_create_finished) {
                        openDialogFunc({
                            component: DialogBlock,
                            componentProps: {
                                type: 'success',
                                title: intl.formatMessage({
                                    id: 'Tournament-Management-Bracket-Settings-Publish-Tournament_Finished'
                                }),
                                message: intl.formatMessage({
                                    id: 'Tournament-Management-Bracket-Settings-Publish-Tournament_[content]Finished'
                                }),
                                buttons: [
                                    <Button
                                        key="confirm"
                                        title={intl.formatMessage({
                                            id:
                                                'Tournament-Management-Bracket-Settings-Publish-Tournament_[btn]Go to Tournament Page'
                                        })}
                                        onClick={() => {
                                            history.replace({
                                                ...location,
                                                pathname: `${configData.pathPrefix}/tournament/list/${match.params?.t8t_serial}/home`
                                            });
                                            closeDialogFunc();
                                        }}
                                    />,
                                    <Button
                                        key="cancel"
                                        title={intl.formatMessage({
                                            id:
                                                'Tournament-Management-Bracket-Settings-Publish-Tournament_[btn]View Manage Tournament'
                                        })}
                                        theme="light_2"
                                        onClick={() => {
                                            history.replace({
                                                ...location,
                                                pathname: `${configData.pathPrefix}/tournament/management/${match.params.clubid}`
                                            });
                                            closeDialogFunc();
                                        }}
                                    />
                                ]
                            },
                            closeByButtonOnly: true
                        });
                    }
                }
            }
        });
    };

    const resetSetElimination = item => {
        let updateData = { ...t8tDetail };

        openDialogFunc({
            component: DialogBlock,
            componentProps: {
                type: 'warning',
                title: intl.formatMessage({
                    id: 'Tournament-Management-Bracket-Settings-Single-Elimination_Delete Bracket'
                }),
                message: intl.formatMessage({
                    id: 'Tournament-Management-Bracket-Settings-Single-Elimination_[content]Delete Bracket'
                }),
                buttons: [
                    <Button
                        key="confirm"
                        title={intl.formatMessage({
                            id: 'common_confirm'
                        })}
                        onClick={() => {
                            updateData.bracket_info = {
                                is_match_checkin: false,
                                is_enable_3rd_place: false,
                                bracket_size: 0
                            };
                            updateData.bracket_rounds = [];

                            updateData.bracket_type = item === null ? null : `${item}_delete`;
                            updateData.indexKey = 5;

                            saveT8tDetail(updateData);

                            closeDialogFunc();
                        }}
                    />,
                    <Button
                        key="cancel"
                        title={intl.formatMessage({
                            id: 'common_cancel'
                        })}
                        theme="light_2"
                        onClick={() => {
                            closeDialogFunc();
                        }}
                    />
                ]
            },
            closeByButtonOnly: true
        });
    };

    const goTop = () => {
        const node = document.querySelector('#scrollCapture');
        node.scrollTo({
            top: 0,
            left: 0,
            behavior: 'auto'
        });
    };

    const setEditSelectMenu = prop => {
        if (!t8tDetail.is_create_finished) {
            return;
        }
        editClickBack(prop.item.key);
    };

    const editClickBack = key => {
        let mentItem = editMenuList.find(item => item.key === key);

        setPercent(mentItem.percent);
        setSelectEditIndex(key);
    };

    const getDatepickerDisable = status => {
        switch (status) {
            case 'completed':
            case 'ongoing':
                return true;
            default:
                return false;
        }
    };

    const getUseGetRank = gameData => {
        const { game } = t8tDetail.t8t_lite;
        const badge = rankFunc(game.game_code, gameData);
        return badge;
    };

    const isNullorEmpty = value => {
        if (value === null) {
            return true;
        }
        if (value.trim() === '') {
            return true;
        }

        return false;
    };

    const handleSelectImage = (uploadFunc, size, index) => {
        openPopWindow({
            title: intl.formatMessage({ id: 'common_image_edit' }),
            component: (
                <ImageEditor
                    shape="rect"
                    size={size}
                    uploadFunc={(data, callback) => uploadFunc(data, callback, index)}
                    closePopWindowFunc={closePopWindow}
                    lockerKey={null}
                />
            )
        });
    };

    return (
        <EditManageContext.Provider
            value={{
                ...props,
                t8tDetail,
                contextIsLoading,
                paramList,
                editMenuList,
                percent,
                goTop,
                selectEditIndex,
                saveT8tDetail,
                getT8tDetail,
                tabList,
                resetSetElimination,
                manageMenuList,
                setEditSelectMenu,
                editClickBack,
                getDatepickerDisable,
                getUseGetRank,
                PopWindowStorage,
                FormattedMessage,
                isNullorEmpty,
                handleSelectImage,
                urlHash,
                setUrlHash
            }}
        >
            {props.children}
        </EditManageContext.Provider>
    );
};

export default withRouter(
    withAuthConsumer(
        withConfigConsumer(
            withDialog_V2Consumer(withDialogConsumer(withPopWindowConsumer(injectIntl(EditManageContainer))))
        )
    )
);
