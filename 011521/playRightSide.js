import React, { useContext } from "react";
import Dropdown from "components/DesignSystem/Input/Dropdown_V3";
import { ContextStates } from "../Context";

//child
import List from "./List";
//Style
import classes from "./styles.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(classes);

const RightSide = () => {
  const {
    refPageInfo,
    setCollectSearchInfo,
    collectSearchInfo,
    intl,
  } = useContext(ContextStates);

  // ------------prepare------------sort---list---------------
  const sortType = new Map([
    ["created_at", intl.formatMessage({ id: "C5T-12-P_By Create Time" })],
    ["followers_num", intl.formatMessage({ id: "C5T-12-P_By Followers" })],
    // ['in_game_rank', intl.formatMessage({ id: 'C5T-12-P_By Game Rank' })],
    //TODO 暫時關閉
    // ['member_lv', intl.formatMessage({ id: 'C5T-12-P_By Member Level' })]
  ]);
  //appear when game select?
  collectSearchInfo.gameCode !== null &&
    sortType.set(
      "in_game_rank",
      intl.formatMessage({ id: "C5T-12-P_By Game Rank" })
    );

  const orderType = new Map([
    ["asc", "⬆"],
    ["desc", "⬇"],
  ]);
  //final sort list
  let sortList = [];
  for (let [key, val] of sortType.entries()) {
    for (let [key2, val2] of orderType.entries()) {
      sortList = [
        ...sortList,
        { key: `${key}&${key2}`, value: `${val} ${val2}` },
      ];
    }
  }
  // ------------prepare------------sort---list---------------

  return (
    <>
      <div className={cx("rightSide", "col-9")}>
        <div className={cx("listInfo")}>
          {/* All 68 items */}
          {/* {`All ${refPageInfo.current.allItems} items`} */}
          <p>
            {refPageInfo.current !== null &&
              intl.formatMessage(
                {
                  id: "C5T-12-P_All {total} items",
                },
                { total: refPageInfo.current.allItems }
              )}
          </p>
          <div>
            <p>{`${intl.formatMessage({ id: "C5T-12-P_Sorting" })} :`}</p>
            {/* placeholder="By Create Time" */}
            <Dropdown
              placeholder={intl.formatMessage({ id: "C5T-12-P_Order by" })}
              options={sortList}
              defaultOption={sortList.find(
                (val) => val.key === collectSearchInfo.sortOrder
              )}
              onChange={(e) =>
                setCollectSearchInfo({
                  ...collectSearchInfo,
                  sortOrder: e.key,
                  page: 1,
                })
              }
            />
          </div>
        </div>
        <div className={cx("listWrapper")}>
          <List />
        </div>
        {refPageInfo.current !== null && refPageInfo.current.hasMoreData && (
          <div
            className={cx("moreBtn")}
            onClick={() => {
              setCollectSearchInfo({
                ...collectSearchInfo,
                page: refPageInfo.current.currentPage + 1,
              });
            }}
          >
            {intl.formatMessage({ id: "C5T-12-P_[btn]More" })}
          </div>
        )}
        {/* <RcmdFriend /> */}
      </div>
    </>
  );
};

export default RightSide;
