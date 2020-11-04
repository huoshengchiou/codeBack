import React from "react";

import classes from "./styles.module.scss";

import { Bracket } from "components/DesignSystem/Tournament";

import * as JSOG from "jsog";
import * as _ from "underscore";

const BracketMap = (props) => {

    const { bracketList } = props;


    return <>
        <div className={classes.box} id="bracketsBox">
            {bracketList.filter(item => item.type === "final").map((item, index) => {
                if (item.bracket_tree.length === 0) {
                    return ""
                }
                const DEMO_DATA = item.bracket_tree;

                const rootName = DEMO_DATA[(DEMO_DATA.length) - 1].name;
                const MATCH_DATA = JSOG.decode(DEMO_DATA);
                const ROOT = _.findWhere(MATCH_DATA, { name: rootName });

                return (<div className={classes.bracketsContainer} key={index}>
                    <Bracket
                        match={ROOT}
                        homeOnTop={false}
                        data={item}
                    />
                </div>)

            })}
            {bracketList.filter(item => item.type !== "final").map((item, index) => {
                if (item.bracket_tree.length === 0) {
                    return ""
                }

                const DEMO_DATA = item.bracket_tree;

                const rootName = DEMO_DATA[(DEMO_DATA.length) - 1].name;
                const MATCH_DATA = JSOG.decode(DEMO_DATA);
                const ROOT = _.findWhere(MATCH_DATA, { name: rootName });

                return (<div className={classes.bracketsContainer} key={index}>
                    <Bracket
                        match={ROOT}
                        homeOnTop={false}
                        data={item}
                    />
                </div>)

            })}
        </div>
    </>
}
export default BracketMap;
