import React, { Fragment } from 'react';
import Card, { CardHeader, CardBody } from 'components/DesignSystem/DataDisplay/Card';
import classes from '../style.module.scss';

/**
 * Overview Menu
 * @param {*} param0
 */
const OverviewMenu = ({ title, contents }) => {
    return (
        <>
            <Card size="col-3" customClass={classes.cardWrapper}>
                <div className={classes.block}>
                    <CardHeader>
                        <h4>{title}</h4>
                    </CardHeader>
                    <CardBody customClass={classes.cardBody}>
                        <div className={classes.content}>
                            {contents?.map((contentChild, i) => (
                                <div key={i} className={classes.list}>
                                    {contentChild.item && <h5>{contentChild.item}</h5>}
                                    {contentChild.content?.map((o, i) => (
                                        <Fragment key={i}>{o}</Fragment>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </CardBody>
                </div>
            </Card>
        </>
    );
};

export default OverviewMenu;
