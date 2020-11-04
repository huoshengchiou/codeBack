import React, { useState, useEffect, useRef } from 'react';
import { from } from 'rxjs';

import { getRatingTagPool } from 'apis/rating';

// style component
import Button from 'components/DesignSystem/Input/Button';

// Style
import classes from './style.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const ACTIONS = {
    PICK_TAG: 'PICK_TAG'
};

function TagList({ ratingInfo, apiWithTokenWrapper, dispatch, rateBefore, intl }) {
    const { collectTags, myScore } = ratingInfo;
    const [renderTags, setRenderTags] = useState([]);

    const oriFetchArr = useRef(null);
    const [fetchFin, setFetchFin] = useState(false);

    // sys_rating_star_tag_rel_id
    const fetchListener = useRef();
    useEffect(() => {
        const data = {
            type: 't8t'
        };
        fetchListener.current = from(apiWithTokenWrapper(getRatingTagPool, data)).subscribe(response => {
            if (response.status === 200) {
                const { header, body } = response.data;
                // console.table(body.tag_pool_list)
                if (header.status.toUpperCase() === 'OK') {
                    const { tag_pool_list } = body;
                    oriFetchArr.current = tag_pool_list;
                    setFetchFin(true);
                }
            }
        });
        return () => {
            //取消fetch監聽
            if (fetchListener.current) fetchListener.current.unsubscribe();
        };
    }, []);

    useEffect(() => {
        if (!fetchFin || !oriFetchArr.current) return;
        const arr = oriFetchArr.current.map(val => {
            if (collectTags.includes(val.sys_rating_star_tag_rel_id)) {
                return { ...val, selected: true };
            }
            return { ...val, selected: false };
        });
        setRenderTags(arr);
    }, [fetchFin, collectTags, myScore]);

    return (
        <>
            <div className={cx('tagList')}>
                <ul>
                    {renderTags.map((val, idx) => {
                        if (val.star !== myScore) return;
                        //i18n_key換翻譯字
                        return (
                            <li key={idx + 'tag'}>
                                <Button
                                    title={intl.formatMessage({ id: val.i18n_key })}
                                    theme={val.selected ? 'dark_3' : 'dark_2'}
                                    size="sm_2"
                                    onClick={() => {
                                        if (rateBefore.current) return;
                                        dispatch({
                                            type: ACTIONS.PICK_TAG,
                                            payload: { tag: val.sys_rating_star_tag_rel_id, currentStar: myScore }
                                        });
                                    }}
                                />
                            </li>
                        );
                    })}
                </ul>
            </div>
        </>
    );
}

export default TagList;
