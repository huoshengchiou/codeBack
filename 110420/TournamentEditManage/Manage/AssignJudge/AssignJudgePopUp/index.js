import React, { useState } from 'react';
import { withConfigConsumer } from 'contexts/Config';
import { injectIntl } from "react-intl";
import classes from './styles.module.scss';
import Checkbox from 'components/form/Checkbox';
import Button from "components/DesignSystem/Input/Button";
import { withAuthConsumer } from "contexts/Auth";

import Thumbnail from "components/DesignSystem/DataDisplay/Thumbnail"


const PopUp = (props) => {
    const getImageUrl = props.configData.getImageUrl;
    const [staffList, setStaffList] = useState(props.staffList);
    const [activeJudgeCount, setActiveJudgeCount] = useState(props.activeJudgeCount);
    const { intl } = props;

    const judgeChangeHandler = (id) => {
        let updateStaffList = [...staffList];
        let activeCount = 0;
        for (let key in updateStaffList) {
            if (updateStaffList[key].member_id === id) {
                updateStaffList[key].is_t8t_judge = !updateStaffList[key].is_t8t_judge
            }
            if (updateStaffList[key].is_t8t_judge) activeCount++;
        }
        setStaffList(updateStaffList);
        setActiveJudgeCount(activeCount);
    }

    const updateHandler = () => {
        props.onClose();
        props.onUpdate(staffList);
    }

    return (<>
        <pop-content>
            <div className={classes.window}>
                <div className={classes.reqBox}>
                    <span className={classes.required}>{intl.formatMessage({ id: 'TournamentJoin_Required' })}</span>
                    <span className={classes.reqNum}>{activeJudgeCount}/{props.maxJudgeCount}</span>
                </div>
                <div className={classes.list}>
                    <div className={classes.nameHeader}>
                        <p className={classes.nameHeaderText}>{intl.formatMessage({ id: 'Manage-Tournament-Page_User Name' })}</p>
                    </div>
                    {staffList.sort((a, b) => {
                        if (a.member_id === props.initMemberId) {
                            return -1
                        }
                        if (b.member_id === props.initMemberId) {
                            return 1
                        }
                        return 0
                    }).map(staff => {
                        return (<div key={staff.member_id} className={classes.userList}>
                            <div className={`${classes.checkbox} ${staff.member_id === props.initMemberId ? classes.checkboxFixed : ""}`}>
                                <Checkbox title={null} checked={staff.is_t8t_judge} onChange={() => judgeChangeHandler(staff.member_id)}
                                    disabled={!(activeJudgeCount < props.maxJudgeCount)} />
                            </div>
                            <div className={`${classes.manBox} 
                            ${!staff.is_t8t_judge && activeJudgeCount === props.maxJudgeCount ? classes.manBoxFixed :
                                    staff.member_id === props.initMemberId ? classes.manBoxFixed : ""}`} >
                                <Thumbnail
                                    imgUrl={getImageUrl(staff.icon_image)}
                                    size="52px"
                                />
                                <span>{staff.username}</span>
                            </div>
                        </div>)
                    })
                    }
                </div>
            </div>
        </pop-content>
        <btn-group>
            <Button
                key="confirm"
                title={intl.formatMessage({ id: "Manage-Tournament-Page_[btn]Confirm" })}
                onClick={() => updateHandler()}
            />
        </btn-group>
    </>)
}

export default withAuthConsumer(withConfigConsumer(injectIntl(PopUp)));