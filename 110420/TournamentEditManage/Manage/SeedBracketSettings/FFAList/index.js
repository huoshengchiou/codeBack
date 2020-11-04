import React, { useState, useRef, useContext } from "react";
import { withConfigConsumer } from 'contexts/Config';
import { injectIntl } from 'react-intl';

import classNames from "classnames/bind";
import classes from "./styles.module.scss";

import Button from "components/DesignSystem/Input/Button";
import Pagination from 'components/DesignSystem/DataDisplay/Pagination'
import Autocomplete from 'components/DesignSystem/Input/AutoComplete_V2'
import Thumbnail from "components/DesignSystem/DataDisplay/Thumbnail"
import Radio from 'components/DesignSystem/Input/RadioButton/Radio';

import { PopWindowStorage } from 'components/DesignSystem/PopWindow_V2'

const cx = classNames.bind(classes);

const FFAList = (props) => {
    const popWindowData = useContext(PopWindowStorage);
    const slideEl = useRef(null);
    const { lists, onAdd, seedNo, leftCount, intl, configData, } = props;
    const { getImageUrl } = configData;
    const { closePopWindow } = popWindowData;

    const count = Math.ceil(lists.length / 16);

    const [paticipantList, setParticipantList] = useState(lists)
    const [displayCount, setDisplayCount] = useState({
        s: 0,
        e: 16
    });
    const [active, setActive] = useState(0);

    const onSeedAdd = () => {
        active.seed = seedNo;
        onAdd(active)
        closePopWindow()
    }

    return <>
        {/* <pop-content> */}
        <div className={classes.box}>
            <div className={cx("block", "needTop")}>
                <div >
                    <Autocomplete
                        placeholder="live search"
                        type="liveSearch"
                        onChange={(val) => {
                            setParticipantList(lists.filter((item) => { return item.avatar.name.toUpperCase().includes(val.toUpperCase()) }))
                        }}
                    />
                </div>
                <div className={cx("title")}>{leftCount} {intl.formatMessage({ id: "Seed-List_Participants left" })} </div>
                <div className={cx("titleBar")}>
                    <div>{intl.formatMessage({ id: "Seed-List_Competition" })}</div>
                </div>
                <div className={cx("itemCon")} ref={slideEl}>
                    {paticipantList.slice(displayCount.s, displayCount.e).map((item, index) => {
                        return (
                            <div className={cx("item")} key={index} onClick={() => { setActive(item) }}>
                                <Radio value={item.participant_id} active={item.participant_id === active.participant_id}></Radio>
                                <div className={cx("info")}>
                                    <div className={cx("info", "infoHasData")}>
                                        <div className={cx("hand")}>
                                            <Thumbnail
                                                imgUrl={getImageUrl(item.avatar.logo_image)}
                                                border={{ gap: 2 }}
                                                size="48px" />
                                        </div>
                                        <div className={cx("inner")}>
                                            <div className={cx("name")}>
                                                {item.avatar.name}
                                            </div>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        )
                    })}
                </div>

            </div>
            <div className={classes.pageContainer}>
                <Pagination count={count} onChange={(event, page) => {
                    setDisplayCount({ s: 16 * (page - 1), e: 16 * (page) })
                    slideEl.current.scrollTop = 0;
                }} />
            </div>
        </div>
        {/* </pop-content> */}
        <btn-group>
            <div className={classes.buttonContainer}>
                <Button title={intl.formatMessage({ id: "Seed-List_[btn]Cancel" })} className={classes.mr10} theme="dark_2" onClick={() => { closePopWindow() }} />
                <Button title={intl.formatMessage({ id: "Seed-List_[btn]Add" })} themes="dark_1" onClick={() => { onSeedAdd() }} />
            </div>
        </btn-group>
    </>
}
export default withConfigConsumer(injectIntl(FFAList));
