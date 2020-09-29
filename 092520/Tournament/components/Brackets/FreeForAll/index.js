import React, { useContext, useEffect, useRef, useState } from 'react';
import { withConfigConsumer } from "contexts/Config";
import { withAuthConsumer } from "contexts/Auth";
import { withDialogConsumer } from "components/layouts/Dialog/Context";
import { PopWindow_V2, withPopWindowProvider_V2, PopWindowStorage, withPopWindowConsumer } from 'components/DesignSystem/PopWindow_V2'

import { injectIntl } from 'react-intl';
import { withRouter } from "react-router-dom";
import { TournamentContext } from '../../../TournamentContext';
import { from } from "rxjs";
import { map } from 'rxjs/operators';
import { getMatchCard, getFFABracket, getFFAMatchCard } from "apis/tournament";
import Loading from 'components/utils/Loading';
// Styles
import classNames from 'classnames/bind';
import classes from './style.module.scss';
// Design System
import SortTable from 'components/DesignSystem/DataDisplay/SortTable_V2';
import Icon, { iconObj } from 'components/DesignSystem/Base/Icons'
import TabLv2 from "components/DesignSystem/DataDisplay/Tab/TabLv2"
import Thumbnail from "components/DesignSystem/DataDisplay/Thumbnail"
import LocalThumbnail from "./LocalThumbnail";


import MatchCard from '../../MatchCard/FreeForAll';

const cx = classNames.bind(classes);

const sortKeyList = [
  {
    sortKey: 'img',
    width_pct: '10%'
  },
  {
    sortKey: 'seed',
    width_pct: "11%"
  },
  {
    sortKey: 'content',
    intlKey: 'purchase-history_content',
    sortable: false,
    width_pct: "51%"
  },
  {
    sortKey: 'score',
    intlKey: 'Score',
    sortable: false,
    width_pct: "20%"
  },
  {
    sortKey: 'icon',
    intlKey: '',
    sortable: false,
    width_pct: "8%"
  },
];


const FreeForAll = (props) => {
  const fetchListener = useRef();
  const { match, intl, t8t, noCard } = props;
  const { apiWithTokenWrapper, profile, isLoggedIn } = props.authData;
  const [isLoading, setIsLoading] = useState(true);
  const [stage, setStage] = useState(0);
  const popWindowData = useContext(PopWindowStorage);
  const { closePopWindow, openPopWindow } = popWindowData;

  const [tabList, setTabList] = useState([])
  const [ffaBracketList, setFfaBracketList] = useState([])

  const { getImageUrl } = props.configData;
  useEffect(() => {
    let data = {};
    data.t8t_serial = match.params.t8t_serial;
    fetchListener.current = from(
      apiWithTokenWrapper(getFFABracket, data)
    ).pipe(
      map((item) => {
        item.data.body.ffa_bracket_list.forEach((item) => {
          item.ffa_groups.forEach((group) => {
            group.displaydata = group.participants.map((participant, index) => {
              participant.bracket_ffa_group_id = group.bracket_ffa_group_id;
              return formatData(participant)
            })
          })
        })
        return item
      })
    ).subscribe(res => {
      if (res.status === 200) {
        if (res.data.header.status.toUpperCase() === "OK") {
          let tabs = [];
          res.data.body.ffa_bracket_list.forEach((data, index) => {
            if (data.ffa_groups.length > 0) {
              tabs.push({
                index: index + 1,
                title: `${index + 1}`,
                disabled: false,
              })
            }

          })
          setFfaBracketList(res.data.body.ffa_bracket_list);
          setTabList(tabs);
          setIsLoading(false)
        }
      }
    });

    return () => {
      if (fetchListener.current) {
        fetchListener.current.unsubscribe();
      }
    };
  }, [match.params.t8t_serial]);


  if (!t8t) {
    return null;
  }


  const formatData = (data) => {
    return {
      img:
        data.is_winner ?
          <>
            <div className={cx('ico')}>
              <img src={require('../imgs/ico_ranking.png')} alt='' />
              {/* <Icon name="PinTop" /> */}
            </div>
          </> : "",
      seed: data.seed,
      content:
        <>
          <div className={cx('clubImg')} >
            {window.navigator.userAgent.toLocaleLowerCase().indexOf("firefox") > -1 ?
              <Thumbnail
                imgUrl={getImageUrl(data.avatar.logo_image)}
                border={{ double: true, gap: 3 }}
                size="53px"
              />
              :
              <LocalThumbnail
                imgUrl={getImageUrl(data.avatar.logo_image)}
                border={{ double: true, gap: 3 }}
                size="53px"
              />
            }
            <span>{data.avatar.name}</span>
          </div>
        </>,
      score: data.group_score,
      icon:
        <>
          <img src={require('../imgs/arrow.svg')} />
        </>
      ,
      rowOnClick: () => {
        if (noCard) {
          return
        }
        goMagicCard(data)
      }
    }
  }

  const goMagicCard = (matchProps) => {
    fetchListener.current = from(
      apiWithTokenWrapper(getFFAMatchCard, { bracket_ffa_group_id: matchProps.bracket_ffa_group_id })
    ).pipe(map((item) => {
      switch (item.data.body.t8t_group.tournament_format) {
        case "TvT":
          item.data.body.t8t_group.isme = false;
          item.data.body.t8t_group.participants.every(participant => {
            if (participant.avatar.id === matchProps.avatar.id) {
              item.data.body.t8t_group.participant = participant;
              if (!isLoggedIn) {
                return false
              }
              let player = participant.team_players.find(i => i.id === profile.member_id)
              if (player) {
                item.data.body.t8t_group.isme = true;

                return false
              }
            }
            return true
          })

          break;
        default:
          item.data.body.t8t_group.participant = item.data.body.t8t_group.participants.find(i => i.avatar.id === matchProps.avatar.id)
          if (isLoggedIn) {
            item.data.body.t8t_group.isme = profile.member_id === matchProps.avatar.id ? true : false;
          }
          break;
      }
      return item

    }))
      .subscribe(res => {
        if (res.status === 200) {
          if (res.data.header.status.toUpperCase() === "OK") {
            openPopWindow({
              title: '',
              component: <MatchCard data={res.data.body.t8t_group} participantid={matchProps.avatar.id}></MatchCard>
            })

          }
        }
      });
  }

  const onChangeStage = (stage) => {
    setStage(stage)
  }


  const getGroupName = (index) => {
    const engLetter = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
    let letter = "";
    const getletter = (num) => {
      if (num <= 25) {
        letter = letter + engLetter[num];
        return
      }
      const num1 = Math.floor(num / 26) - 1;
      const num2 = num % 26;
      letter = letter + engLetter[num1];
      getletter(num2)
    }
    getletter(index)
    return letter

  }

  return (
    <>
      {isLoading ? (<Loading />)
        : (
          <div className={cx('box')}>
            <h2>Free For All Bracket</h2>
            <div className={cx('tabContainer')}>
              {tabList.length > 0 ? (<>
                <div className={cx('leftCol', 'line')}>
                  Stage
              </div>
                <div className={cx('rightCol')}>
                  <TabLv2 theme="dark" tabList={tabList} defaultIndex={stage} onClick={(index) => onChangeStage(index)}></TabLv2>
                </div></>) : ""}

            </div>
            <div className={cx('groupContainer')}>
              {
                ffaBracketList[stage].ffa_groups.map((group, index) => {
                  return (
                    <div className={cx('row')} key={index}>
                      <div className={cx('gap')}>
                        <div className={cx('groupCard')}>
                          <h4>group {getGroupName(index)}</h4>
                          <div className={cx('groupTable')}>
                            <SortTable sortKeyList={sortKeyList} data={group.displaydata} showRows={8} rowClick={() => { goMagicCard() }} />
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })
              }
            </div>
            {/* <MatchCard data={renderT8tInfo}></MatchCard> */}
          </div>)

      }
    </>
  )
}

export default withRouter(withPopWindowConsumer(
  withConfigConsumer(withAuthConsumer(withDialogConsumer(injectIntl(FreeForAll))))))