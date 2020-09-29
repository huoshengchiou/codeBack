import React, { useCallback, useContext } from 'react';
import classNames from 'classnames/bind';
import VideoMedia from 'components/DesignSystem/DataDisplay/VideoMedia';
import { TournamentContext } from '../../TournamentContext';
import classes from './style.module.scss';

const cx = classNames.bind(classes);

const Media = () => {
    const { renderT8tInfo } = useContext(TournamentContext);
    const { medias } = renderT8tInfo;

    return (
        <div className={classes.box}>
            <div className={cx('mediaBox')}>
                {medias?.map(({ t8t_media_id, video_uri }) => (
                    <VideoMedia key={t8t_media_id} videoUrl={video_uri} />
                ))}
            </div>
        </div>
    );
};

export default Media;
