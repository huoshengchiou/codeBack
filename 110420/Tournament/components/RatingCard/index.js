import React, { useState, useEffect, useReducer, useRef, useContext } from 'react';
import { from } from 'rxjs';
import { injectIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';

//popSource
import { PopWindowStorage } from 'components/DesignSystem/PopWindow_V2';
import { withDialog_V2Consumer } from 'components/layouts/Dialog_V2/Context';

import Rating from 'components/DesignSystem/Input/Rating';

//apis
import { getMemberRatedData, postRatingRate } from 'apis/rating';

// style component
import Textarea from 'components/DesignSystem/Input/Textarea';
import Button from 'components/DesignSystem/Input/Button';
import Icon from 'components/DesignSystem/Base/Icons';
import ReviewScore from 'components/blocks/ReviewScore';
//child
import TagList from './TagList';

import { withAuthConsumer } from 'contexts/Auth';
// Style
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const ACTIONS = {
    SET_INIT: 'SET_INIT',
    CHANGE_SCORE: 'CHANGE_SCORE',
    PICK_TAG: 'PICK_TAG',
    MAKE_COMMENT: 'MAKE_COMMENT',
    POST_RATING: 'POST_RATING',
    CLEAR_TAGS: 'CLEAR_TAGS'
};

// ----------------------------------------------------------------------------------------

function reducer(ratingInfo, action) {
    console.log('action', action);
    const { payload } = action;
    switch (action.type) {
        case ACTIONS.SET_INIT:
            const { fetchTags, fetchComment, fetchStar } = payload;
            return { ...ratingInfo, collectTags: fetchTags, myComment: fetchComment, myScore: fetchStar };
        case ACTIONS.CHANGE_SCORE:
            const { score } = payload;
            return { ...ratingInfo, myScore: score };
        case ACTIONS.PICK_TAG:
            const { tag } = payload;
            const { collectTags } = ratingInfo;
            if (collectTags.includes(tag)) {
                return { ...ratingInfo, collectTags: collectTags.filter(val => val !== tag) };
            }
            return { ...ratingInfo, collectTags: [...ratingInfo.collectTags, tag] };
        case ACTIONS.CLEAR_TAGS:
            return { ...ratingInfo, collectTags: [] };
        case ACTIONS.MAKE_COMMENT:
            const { comment } = payload;
            return { ...ratingInfo, myComment: comment };
        case ACTIONS.POST_RATING:
            return { ...ratingInfo, sendRating: true };
        default:
            return ratingInfo;
    }
}
// --------------------------------------main-------------------------------------------
//TODO完成後移除預設
//props type for api setting
function RatingCard({
    authData,
    type = '',
    type_id = '',
    rateTitle = '',
    urlAfterRating = null,
    callbackAfterRating = false,
    history,
    location,
    intl,
    dialog_V2Data
}) {
    // console.log('callbackAfterRating', callbackAfterRating)
    const popWindowData = useContext(PopWindowStorage);
    const { closePopWindow } = popWindowData;
    const { openDialog_V2Func, closeDialog_V2Func } = dialog_V2Data;

    //comment length limit
    const commentLimit = 500;
    const { apiWithTokenWrapper } = authData;
    const iniState = {
        myScore: null,
        collectTags: [],
        myComment: '',
        sendRating: false
    };
    //latest Star
    const preStar = useRef(0);
    const [ratingInfo, dispatch] = useReducer(reducer, iniState);

    // -----------------------------------fetch old data from db---------------------------------
    //rated flag
    const rateBefore = useRef(false);
    const fetchListener = useRef(null);
    useEffect(() => {
        const data = { type, type_id };
        fetchListener.current = from(apiWithTokenWrapper(getMemberRatedData, data)).subscribe(response => {
            if (response.status === 200) {
                const { header, body } = response.data;
                if (header.status.toUpperCase() === 'OK') {
                    const { rated_info } = body;
                    //no data in db=>null
                    if (!rated_info) return;
                    rateBefore.current = true;
                    const { comment, rated_tags, star } = body.rated_info;
                    const arr = rated_tags.map(val => val.sys_rating_star_tag_rel_id);
                    //fetch時的選擇保留//反正好像不用再調?
                    preStar.current = star;
                    // TODO 檢驗有資料的時候是否正常
                    dispatch({
                        type: ACTIONS.SET_INIT,
                        payload: { fetchTags: arr, fetchComment: comment, fetchStar: star }
                    });
                }
            }
        });
        return () => {
            //取消fetch監聽
            if (fetchListener.current) fetchListener.current.unsubscribe();
        };
    }, []);

    // ------------------------------------------send new data to db-------------------------
    const fetchListener2 = useRef(null);
    const sendRating = finalData => {
        const data = { type, type_id, ...finalData };
        // return console.log('最後資料', data)
        fetchListener2.current = from(apiWithTokenWrapper(postRatingRate, data)).subscribe(response => {
            if (response.status === 200) {
                const { header, body } = response.data;
                // console.table(body)
                if (header.status.toUpperCase() === 'OK') {
                    //off pop and redirect
                    closePopWindow();
                    // 'Warning', 'Error', 'Info', 'Success'
                    openDialog_V2Func({
                        title: intl.formatMessage({ id: 'T8T-111_Thank you for your rating' }),
                        message: '',
                        type: 'Success',
                        buttons: []
                    });
                    if (callbackAfterRating) {
                        callbackAfterRating();
                        setTimeout(() => {
                            closeDialog_V2Func();
                        }, 3000);
                        return;
                    }

                    if (urlAfterRating) {
                        history.push({
                            ...location,
                            pathname: urlAfterRating
                        });
                        setTimeout(() => {
                            closeDialog_V2Func();
                        }, 3000);
                        return;
                    }
                    setTimeout(() => {
                        closeDialog_V2Func();
                    }, 3000);
                }
                switch (header.status) {
                    case 'R1001':
                        closePopWindow();
                        console.log('already rated');
                        break;
                    case 'R1004':
                        closePopWindow();
                        console.log('no participt');
                        break;
                    default:
                        break;
                }
            }
        });
        return () => {
            //取消fetch監聽
            if (fetchListener2.current) fetchListener2.current.unsubscribe();
        };
    };
    //sending to db when state change
    useEffect(() => {
        if (!ratingInfo.sendRating) return;
        //pick data from reducer state
        const finalData = {
            star: ratingInfo.myScore,
            comment: ratingInfo.myComment,
            rating_tags: [...new Set(ratingInfo.collectTags)]
        };
        sendRating(finalData);
    }, [ratingInfo.sendRating]);

    useEffect(() => {
        //給星發生異動清除原來的tag選擇
        if (preStar.current !== ratingInfo.myScore) {
            dispatch({ type: ACTIONS.CLEAR_TAGS });
            preStar.current = ratingInfo.myScore;
        }
    }, [ratingInfo.myScore]);

    //decide rating info by type
    let ratingForDes = '';
    switch (type) {
        case 't8t':
            ratingForDes = intl.formatMessage(
                {
                    id: 'T8T-111_Feel free to leave your rating to'
                },
                { tournamentName: rateTitle }
            );
            break;
        default:
            break;
    }

    return (
        <>
            <pop-content>
                <div className={cx('popWrapper')}>
                    <div className={cx('bg')}>
                        <section style={{ borderBottom: ratingInfo.myScore ? '' : '0' }}>
                            <h3>{intl.formatMessage({ id: 'T8T-111_Thank for your participation!' })}</h3>
                            <p>{ratingForDes}</p>
                            <div className={cx('starScore', '.flexCC')}>
                                <Rating
                                    maxScore={5}
                                    score={ratingInfo.myScore}
                                    starWidth={28.5}
                                    gap={20}
                                    editable={!rateBefore.current}
                                    onChange={val => {
                                        dispatch({ type: ACTIONS.CHANGE_SCORE, payload: { score: val } });
                                    }}
                                />
                                {/* <ReviewScore reviewData={{ score: myScore, total: 5 }} customClass={cx('starBox')} isEditable={!rateBefore.current} callback={({ score }) => setMyScore(score)} /> */}
                            </div>
                        </section>
                        {ratingInfo.myScore && (
                            <>
                                <p>{intl.formatMessage({ id: 'T8T-111_Excellent rating! What did you enjoy' })}</p>
                                <TagList
                                    dispatch={dispatch}
                                    ratingInfo={ratingInfo}
                                    apiWithTokenWrapper={apiWithTokenWrapper}
                                    rateBefore={rateBefore}
                                    intl={intl}
                                />
                                <Textarea
                                    name="textarea"
                                    disabled={rateBefore.current}
                                    theme="dark"
                                    placeholder={intl.formatMessage({ id: 'T8T-111_Please enter' })}
                                    value={ratingInfo.myComment}
                                    onChange={e =>
                                        dispatch({ type: ACTIONS.MAKE_COMMENT, payload: { comment: e.target.value } })
                                    }
                                    maxLength={commentLimit}
                                    // warning={(ratingInfo.myComment.length > commentLimit) && intl.formatMessage({ id: 'T8T-111_Your comment is too long' })}
                                />
                            </>
                        )}
                    </div>
                </div>
            </pop-content>
            <btn-group>
                {/*with old data show ok only*/}
                {rateBefore.current ? (
                    <Button
                        title={intl.formatMessage({ id: 'T8T-111_[btn]OK' })}
                        onClick={() => {
                            closePopWindow();
                        }}
                    />
                ) : (
                    <>
                        <Button
                            title={intl.formatMessage({ id: 'T8T-111_[btn]Send' })}
                            onClick={() => dispatch({ type: ACTIONS.POST_RATING })}
                        />
                        <Button
                            title={
                                ratingInfo.myScore
                                    ? intl.formatMessage({ id: 'T8T-111_[btn]Skip' })
                                    : intl.formatMessage({ id: 'T8T-111_[btn]Cancel' })
                            }
                            theme="dark_2"
                            onClick={() => {
                                closePopWindow();
                            }}
                        />
                    </>
                )}
            </btn-group>
        </>
    );
}

export default withRouter(withAuthConsumer(withDialog_V2Consumer(injectIntl(RatingCard))));
