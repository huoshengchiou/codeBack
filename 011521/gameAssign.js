import React, { useState, useContext, useEffect, useRef } from "react";
import { ContextStates } from "../../Context";
//styleC
import Dropdown from "components/DesignSystem/Input/Dropdown_V3";
//child
import DetailMenu from "./DetailMenu";
//Style
import classes from "./styles.module.scss";
import classNames from "classnames/bind";
const cx = classNames.bind(classes);

const GameAssign = () => {
  const {
    configData,
    getGameDetail,
    setFetchHashTags,
    getImageUrl,
    collectSearchInfo,
    setCollectSearchInfo,
    intl,
    refFirstFetch,
  } = useContext(ContextStates);
  const $listener = useRef();
  //------defaultGameList prep----
  const { gamesV2 } = configData;

  //所有遊戲資料
  const DefaultGameOption = {
    value: intl.formatMessage({ id: "C5T-12-P_All Games" }),
    key: null,
    server: [],
  };
  const realGameList = gamesV2.map((val) => {
    return {
      value: val.short_name,
      key: val.game_code,
      server: val.game_servers,
    };
  });
  const defaultGameList = [DefaultGameOption, ...realGameList];
  //------------------------------
  const [pickGameInfo, setPickGameInfo] = useState(null);
  const [fetchBkDetail, setFetchBkDetail] = useState(null);
  const [pending, setPending] = useState(false);
  const preSelectGame = useRef(null);
  useEffect(() => {
    if (!pickGameInfo) return;
    const data = {
      game_code: pickGameInfo.key,
      category_list: ["position", "ranking", "role"],
    };
    if (preSelectGame.current !== pickGameInfo.key) {
      setCollectSearchInfo({
        ...collectSearchInfo,
        gameCode: pickGameInfo.key,
        pos: [],
        // hash: [],
        server: null,
        rank: null,
        findName: "",
        sortOrder: "followers_num&desc",
        page: 1,
      });
    } else {
      setCollectSearchInfo({
        ...collectSearchInfo,
        gameCode: pickGameInfo.key,
        page: 1,
      });
    }
    preSelectGame.current = pickGameInfo.key;
    getGameDetail(
      intl,
      $listener,
      data,
      pickGameInfo.server,
      setFetchBkDetail,
      setFetchHashTags,
      getImageUrl,
      setPending
    );
  }, [pickGameInfo]);
  //working only for initial
  useEffect(() => {
    if (refFirstFetch.current || !collectSearchInfo.gameCode) return;
    preSelectGame.current = collectSearchInfo.gameCode;
    const singleGameSevers = gamesV2.find(
      (val) => val.game_code === collectSearchInfo.gameCode
    ).game_servers;

    setPickGameInfo({
      key: collectSearchInfo.gameCode,
      server: singleGameSevers,
    });
  }, [collectSearchInfo.gameCode]);

  return (
    <>
      <div className={cx("list", "gameCollapse")}>
        <h3>{intl.formatMessage({ id: "C5T-12-P_Games" })}</h3>
        <Dropdown
          placeholder={intl.formatMessage({ id: "C5T-12-P_Select Game" })}
          options={defaultGameList}
          defaultOption={
            collectSearchInfo.gameCode &&
            defaultGameList.find(
              (val) => val.key === collectSearchInfo.gameCode
            )
          }
          onChange={(e) => {
            setPickGameInfo({ key: e.key, server: e.server });
          }}
        />
        {/* gameDetail class style--------------根據選擇game的值隱藏 */}
        {/* 強制re-render重置drop */}
        {collectSearchInfo.gameCode !== null && !pending && (
          <DetailMenu fetchBkDetail={fetchBkDetail} />
        )}
      </div>
    </>
  );
};

export default GameAssign;
