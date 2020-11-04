import React, { useContext, useEffect, useRef, useState, useCallback } from 'react';

import { TournamentContext } from '../../../TournamentContext';

import classes from './style.module.scss';
import { from } from "rxjs";
import { getMatchCard, getSingleBracket } from "apis/tournament";
import Loading from 'components/utils/Loading';

import MatchCard from '../../MatchCard/Basic';

import {
  Bracket
} from "components/DesignSystem/Tournament";
// import DEMO_DATA from "stories/Tournament/demo-data.js";
// import DEMO_DATA from "stories/Tournament/demo_data2.js";
import * as JSOG from "jsog";
import * as _ from "underscore";

const Brackets = (props) => {
  const { renderT8tInfo, match, intl, authData, popWindowData } = useContext(TournamentContext);
  const { bracket_type } = renderT8tInfo;
  const fetchListener = useRef();
  // const { match, intl } = props;
  const { openPopWindowFunc, closePopWindowFunc } = popWindowData;
  const { apiWithTokenWrapper } = authData;
  const [isLoading, setIsLoading] = useState(true);
  const [bracketList, setBracketList] = useState([])
  // const [noMatchFlag, setNoMatchFlag] = useState(false)

  const getBracketList = useCallback(() => {

    let data = {};
    data.t8t_serial = match.params.t8t_serial;

    fetchListener.current = from(
      apiWithTokenWrapper(getSingleBracket, data)
    ).subscribe(res => {
      if (res.status === 200) {
        if (res.data.header.status.toUpperCase() === "OK") {

          // console.log('看看', res.data.body)
          if (res.data.body.bracket_matches.length > 0) {
            setBracketList(res.data.body.bracket_matches)
          }
          // if (res.data.body.bracket_matches.length === 0) {
          //   setNoMatchFlag(true)
          //   setBracketList([])
          // }
          setIsLoading(false)
        }
      }
    });

  }, [match.params.t8t_serial])

  useEffect(() => {

    getBracketList()

    return () => {
      if (fetchListener.current) {
        fetchListener.current.unsubscribe();
      }
    };
  }, [match.params.t8t_serial, getBracketList])


  const goMagicCard = (matchProps) => {
    fetchListener.current = from(
      apiWithTokenWrapper(getMatchCard, "", matchProps.id)
    ).subscribe(res => {

      if (res.status === 200) {
        if (res.data.header.status.toUpperCase() === "OK") {
          openPopWindowFunc({
            component: MatchCard,
            componentProps: {
              title: intl.formatMessage({ id: 'Match-Card-Team-vs-Team_Match Card' }),
              customWindowContentClass: classes.customWindowContentClass,
              status: "matchCard_1",
              t8t: renderT8tInfo,
              data: res.data.body.t8t_match,
              closePopWindowFunc: () => closePopWindowFunc()
            },
            closeByButtonOnly: true

          });

        }
      }
    });
  }

  return (
    <>
      {isLoading ? (<Loading />)
        : (bracketList.length > 0 ?
          <div className={classes.box}>
            <h2>{bracket_type === "single" ?
              intl.formatMessage({ id: 'Tournament-Management-Bracket-Settings-Single-Elimination_Single Elimination Bracket' }) :
              intl.formatMessage({ id: 'Tournament-Management-Bracket-Settings-Double-Elimination_Double Elimination Bracket' })}</h2>
            {bracketList.filter(item => item.type === "final").map((item, index) => {
              if (item.bracket_tree.length === 0) {
                return ""
              }

              let DEMO_DATA = item.bracket_tree;
              let rootName = DEMO_DATA[(DEMO_DATA.length) - 1].name;
              let MATCH_DATA = JSOG.decode(DEMO_DATA);
              let ROOT = _.findWhere(MATCH_DATA, { name: rootName });

              return (<div className={classes.bracketsContainer} key={index}>
                <Bracket
                  key={index}
                  match={ROOT}
                  data={item}
                  homeOnTop={false}
                  isSearch={true}
                  clickEvent={(matchProps) => goMagicCard(matchProps)}
                />
              </div>
              )
            })}

            {bracketList.filter(item => item.type !== "final").map((item, index) => {
              if (item.bracket_tree.length === 0) {
                return ""
              }
              let DEMO_DATA = item.bracket_tree;
              let rootName = DEMO_DATA[(DEMO_DATA.length) - 1].name;
              let MATCH_DATA = JSOG.decode(DEMO_DATA);

              let ROOT = _.findWhere(MATCH_DATA, { name: rootName });

              return (<div className={classes.bracketsContainer} key={index}>
                <Bracket
                  key={index}
                  match={ROOT}
                  data={item}
                  homeOnTop={false}
                  isSearch={true}
                  clickEvent={(matchProps) => goMagicCard(matchProps)}
                />
              </div>
              )
            })}
          </div>
          :
          <div className={classes.blockMsg}>{intl.formatMessage({ id: 'Single-Tournament-Page_Bracket Coming soon' })}</div>
        )
      }
    </>
  )
}

export default Brackets