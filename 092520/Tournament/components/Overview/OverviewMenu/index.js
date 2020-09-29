import React, { Fragment } from 'react';
import classes from '../style.module.scss';

/**
 * Overview Menu
 * @param {*} param0
 */
const OverviewMenu = ({ title, contents }) => {
    return (
        <div className={classes.block}>
            <div className={classes.title}>
                <h4>{title}</h4>
            </div>

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
        </div>
    );
};

export default OverviewMenu;
