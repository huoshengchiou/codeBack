import React from 'react';
import IconImage from '../../IconImage';
import Card, { CardBody } from 'components/DesignSystem/DataDisplay/Card';
import classes from './style.module.scss';

/**
 * RewardCard
 * @param {*} param0
 */
const RewardCard = ({ title, name, description, prize_image, link }) => {
    return (
        <>
            <Card size="col-3" customClass={classes.cardWrapper}>
                <div
                    className={classes.rewardCard}
                    onClick={() => {
                        if (!link) {
                            return;
                        }
                        window.open(link);
                    }}
                >
                    <CardBody>
                        <div className={classes.rewardStatus}>
                            <div>{title}</div>
                        </div>
                        <div className={classes.ImgWrapper}>{prize_image && <IconImage iconImage={prize_image} />}</div>
                        <div className={classes.rewardContent}>
                            <h4>{name}</h4>
                            <p>{description}</p>
                        </div>
                    </CardBody>
                </div>
            </Card>
        </>
    );
};

export default RewardCard;
