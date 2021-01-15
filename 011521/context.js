import React, { createContext, useRef, useEffect, useState } from "react";
import { from } from "rxjs";
//apis
import {
  // postV2MemberSearchListName,
  postV2MemberSearchList,
  getMemberConnectListAPI,
  // postV2MemberAutoFill
} from "apis/member";
import { postGameFilter } from "apis/gameSetting";

export const ContextStates = createContext();
//change context devTool name
ContextStates.displayName = "playerListContext";

//確認使用者是否有connect (Member214) 同時執行的api必須避開listener共用
const getMyConnect = ({ $listener, data, refUserHasConnect }) => {
  $listener.current = from(getMemberConnectListAPI(data)).subscribe(
    (response) => {
      if (response.status === 200) {
        const { header, body } = response.data;
        //general
        if (header.status.toUpperCase() === "OK") {
          const { club_list, team_list } = body;
          refUserHasConnect.current =
            club_list.length !== 0 || team_list.length !== 0;
          if ($listener.current) $listener.current.unsubscribe();
        }
      }
    }
  );
};

//player autoComplete
// const searchAutoFill=(ref, data, setAutoPlayerList)=> {
//     ref.current = from(postV2MemberAutoFill(data)).subscribe(response => {
//         if (response.status === 200) {
//             const { header, body } = response.data;
//             //general
//             if (header.status.toUpperCase() === 'OK') {
//                 const { avatar_list } = body;
//                 const arr = avatar_list.map(val => {
//                     return { value: val.name, key: val.url_key };
//                 });
//                 setAutoPlayerList(arr);
//                 if (ref.current) ref.current.unsubscribe();
//             }
//         }
//     });
// }

// 變更Game後變更下拉選單項目
const getGameDetail = (
  intl,
  ref,
  data,
  gameServer,
  setFetchBkDetail,
  setFetchHashTags,
  getImageUrl,
  setPending
) => {
  setPending(true);
  ref.current = from(postGameFilter(data)).subscribe((response) => {
    if (response.status === 200) {
      const { header, body } = response.data;
      //general
      if (header.status.toUpperCase() === "OK") {
        // selectInfo.gameServer
        const { position, ranking } = body.game_filters;
        // const hashTagArr = role.option_list.map(val => {
        //     return { key: val.tag_code, value: intl.formatMessage({ id: `GameCfg_${val.tag_code}` }) };
        // });
        const serverArr = gameServer.map((val) => {
          return { value: val.display_name, key: val.game_server_code };
        });
        //default option for server
        serverArr.unshift({
          value: intl.formatMessage({ id: `C5T-12-P_All Servers` }),
          key: null,
        });

        const rankArr = ranking.option_list.map((val) => {
          return {
            value: intl.formatMessage({ id: `GameCfg_${val.tag_code}` }),
            key: val.tag_code,
            icon: <img src={getImageUrl(val.image)} alt="" />,
          };
        });
        //default option for rank
        rankArr.unshift({
          value: intl.formatMessage({ id: `C5T-12-P_All Ranks` }),
          key: null,
        });

        const posArr = position.option_list.map((val) => {
          return {
            value: intl.formatMessage({ id: `GameCfg_${val.tag_code}` }),
            key: val.tag_code,
            icon: <img src={getImageUrl(val.image)} alt="" />,
          };
        });
        // setFetchHashTags(hashTagArr);
        setFetchBkDetail({
          rank: rankArr,
          position: posArr,
          server: serverArr,
        });
        if (ref.current) ref.current.unsubscribe();
        setPending(false);
      }
    }
  });
};
const urlNotFromHere = (str) => /&/.test(str);
// 'created_at&asc'
//由URL取得初步選項配置
const initSetting = ({ location }) => {
  const { search } = location;
  if (search === "" || urlNotFromHere(search)) {
    return {
      gameCode: null,
      pos: [],
      hash: [],
      server: null,
      rank: null,
      lang: null,
      goal: null,
      openInvite: false,
      p9certify: false,
      sortOrder: "followers_num&desc",
      findName: "",
      initialpage: `?_pageno=1&_limit=10`,
      page: 1,
    };
  }
  //search非''時
  const reqFromStr = JSON.parse(atob(search.split("?")[1]));
  reqFromStr.search_input = decodeURIComponent(reqFromStr.search_input);
  const { page: pageFromReq } = reqFromStr;
  // const pageNum = +pageFromReq.match(/(?<=_pageno=)[0-9]*/)[0];
  const pageNum = +pageFromReq.split("?_pageno=")[1];
  reqFromStr.page = `?_pageno=1&_limit=${pageNum * 10}`;
  const {
    game_code,
    is_open_to_invited,
    is_p9_official_player,
    language_code,
    order,
    page,
    personal_goal,
    position_code_list,
    rank_code,
    role_hashtag_list,
    server_code,
    sorted_by,
    search_input,
  } = reqFromStr;
  return {
    gameCode: game_code,
    pos: position_code_list,
    hash: role_hashtag_list,
    server: server_code,
    rank: rank_code,
    initialpage: page,
    lang: language_code,
    goal: personal_goal,
    openInvite: is_open_to_invited,
    p9certify: is_p9_official_player,
    sortOrder: `${sorted_by}&${order}`,
    findName: search_input,
  };
};

export const Context = (props) => {
  const { configData, authData, history, location, intl } = props;
  const { getImageUrl } = configData;
  const { apiWithTokenWrapper, isLoggedIn, getUsername } = authData;
  //autocompelte search player not associate total list
  // const [findPlayer, setFinder] = useState(null);
  //TODO
  //fetch total list associate materials
  // const [collectSearchInfo, setCollectSearchInfo] = useState({
  //     gameCode: null,
  //     pos: [],
  //     hash: [],
  //     server: null,
  //     rank: null,
  //     page: 1,
  //     lang: null,
  //     goal: null,
  //     openInvite: false,
  //     p9certify: false,
  //     sortOrder: 'created_at&asc',
  //     findName: ''
  // });
  //TODO
  //init by destructure URL
  const [collectSearchInfo, setCollectSearchInfo] = useState(() =>
    initSetting({ location })
  );
  // const [gameDetail, setGameDetail] = useState(null);
  //change when select game change
  // const [fetchHashTags, setFetchHashTags] = useState([]);
  //main displayList
  const [memberList, setMemberList] = useState(null);
  //main player list $listener
  const fetchListener = useRef();
  //main myconnect $listener
  const $listener = useRef();
  const refUserName = useRef(null);

  //user是否有team 或 club
  const refUserHasConnect = useRef(false);

  useEffect(() => {
    if (!isLoggedIn) return;
    refUserName.current = getUsername();
    const data = {
      username: getUsername(),
    };
    getMyConnect({ $listener, data, refUserHasConnect });
  }, []);

  //是否完成第一次fetch
  const refFirstFetch = useRef(false);
  //紀錄當下meta data
  const refPageInfo = useRef(null);
  //pre fetch data
  const oldList = useRef(null);
  //所有玩家列表
  const searchAllList = (data) => {
    fetchListener.current = from(
      apiWithTokenWrapper(postV2MemberSearchList, data)
    ).subscribe((response) => {
      if (response.status === 200) {
        const { header, body } = response.data;
        //general
        if (header.status.toUpperCase() === "OK") {
          const { member_list, meta_page } = body;
          const { current, pages, size, total } = meta_page;
          //convert str to num
          const currentPage = +current;
          const allPages = +pages;
          //每頁筆數，目前為固定
          const itemPerPage = +size;
          const allItems = +total;
          const hasMoreData = +current < +pages;

          if (!refFirstFetch.current) {
            //renderData
            refPageInfo.current = {
              currentPage: itemPerPage / 10,
              allPages: allPages,
              itemPerPage: itemPerPage,
              allItems: allItems,
              hasMoreData: hasMoreData,
              requestData: data,
            };
          } else {
            refPageInfo.current = {
              currentPage: currentPage,
              allPages: allPages,
              itemPerPage: itemPerPage,
              allItems: allItems,
              hasMoreData: hasMoreData,
              requestData: data,
            };
          }

          //page為1 資料不疊加
          if (currentPage === 1) {
            setMemberList(member_list);
            oldList.current = member_list;
          }
          //還有資料時，資料疊加
          if (currentPage !== 1 && currentPage <= allPages && oldList.current) {
            setMemberList([...oldList.current, ...member_list]);
            oldList.current = [...oldList.current, ...member_list];
            // 1 55 10 545
          }
          refFirstFetch.current = true;
          if (fetchListener.current) fetchListener.current.unsubscribe();
        }
      }
    });
  };

  // ---------------------------------------頁碼顯示----------------------
  //TODO調整頁碼 不同進入點處理
  useEffect(() => {
    if (!refPageInfo.current) return;
    // console.log('觸發', refPageInfo.current);
    const { requestData } = refPageInfo.current;
    //TODO
    // let searchStr = '';
    // for (const [key, val] of Object.entries(requestData)) {
    //     console.log('結果', `${key}: ${val}`);

    //     switch (key) {
    //         case 'page':
    //             break;
    //         case 'position_code_list':
    //         case 'role_hashtag_list':
    //             if (val.length === 0) {
    //                 searchStr = searchStr + `&${key}=null`;
    //             } else {
    //                 val.forEach(val2 => {
    //                     searchStr = searchStr + `&${key}=${val2}`;
    //                 });
    //             }
    //             break;
    //         default:
    //             searchStr = searchStr + `&${key}=${val}`;
    //             break;
    //     }
    // }
    // console.log('searchStr', btoa(JSON.stringify(requestData)));
    //TODO
    //中文字encode
    requestData.search_input = encodeURIComponent(requestData.search_input);
    history.replace({
      ...location,
      search: btoa(JSON.stringify(requestData)),
    });
  }, [refPageInfo.current]);

  // ---------------------------------------頁碼顯示----------------------

  useEffect(() => {
    // const { search } = location;
    // if (search === '' || refFirstFetch.current) {
    const {
      lang,
      gameCode,
      hash,
      server,
      rank,
      pos,
      initialpage,
      goal,
      openInvite,
      p9certify,
      sortOrder,
      findName,
      page,
    } = collectSearchInfo;
    const orderStr = sortOrder.split("&");
    const data = {
      page: initialpage,
      // page: `?_pageno=${page}&_limit=10`,
      sorted_by: orderStr[0],
      order: orderStr[1],
      game_code: gameCode,
      language_code: lang,
      personal_goal: goal,
      role_hashtag_list: hash,
      is_open_to_invited: openInvite,
      is_p9_official_player: p9certify,
      server_code: server,
      rank_code: rank,
      position_code_list: pos,
      search_input: findName,
    };
    if (refFirstFetch.current) {
      data.page = `?_pageno=${page}&_limit=10`;
    }

    // console.log('送的資料', data);
    searchAllList(data);
    // } else {
    //     let reqFromStr = JSON.parse(atob(search.split('?')[1]));
    //     reqFromStr.search_input = decodeURIComponent(reqFromStr.search_input);
    //     const { page } = reqFromStr;
    //     const pageNum = +page.match(/(?<=_pageno=)[0-9]*/)[0];
    //     reqFromStr.page = `?_pageno=1&_limit=${pageNum * 10}`;
    //     searchAllList(reqFromStr);
    // }
  }, [collectSearchInfo]);

  const accumulate = {
    configData,
    // searchAutoFill,
    getGameDetail,
    searchAllList,
    getImageUrl,
    intl,
    //
    // findPlayer,
    // setFinder,
    // gameDetail,
    // setGameDetail,
    memberList,
    // fetchHashTags,
    // setFetchHashTags,
    collectSearchInfo,
    setCollectSearchInfo,
    refPageInfo,
    isLoggedIn,
    refUserHasConnect,
    refFirstFetch,
    refUserName,
  };
  return (
    <>
      <ContextStates.Provider value={accumulate}>
        {props.children}
      </ContextStates.Provider>
    </>
  );
};
