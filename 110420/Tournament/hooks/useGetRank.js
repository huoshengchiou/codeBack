import React, { useState, useEffect, useRef } from 'react';

import Bronze from '../../../../images/Tournament/Rank/LOL/rank_bronze.png';
import Challenger from '../../../../images/Tournament/Rank/LOL/rank_challenger.png';
import Diamond from '../../../../images/Tournament/Rank/LOL/rank_diamond.png';
import Gold from '../../../../images/Tournament/Rank/LOL/rank_gold.png';
import Grandmaster from '../../../../images/Tournament/Rank/LOL/rank_grandmaster.png';
import Iron from '../../../../images/Tournament/Rank/LOL/rank_iron.png';
import LolMaster from '../../../../images/Tournament/Rank/LOL/rank_master.png';
import Platinum from '../../../../images/Tournament/Rank/LOL/rank_platinum.png';
import PlatinumPlus from '../../../../images/Tournament/Rank/LOL/rank_platinum_plus.png';
import Silver from '../../../../images/Tournament/Rank/LOL/rank_silver.png';

import Bronze01 from '../../../../images/Tournament/Rank/PUBG/Bronze_1.png';
import Bronze02 from '../../../../images/Tournament/Rank/PUBG/Bronze_2.png';
import Bronze03 from '../../../../images/Tournament/Rank/PUBG/Bronze_3.png';
import Bronze04 from '../../../../images/Tournament/Rank/PUBG/Bronze_4.png';
import Bronze05 from '../../../../images/Tournament/Rank/PUBG/Bronze_5.png';

import Silver01 from '../../../../images/Tournament/Rank/PUBG/Silver_1.png';
import Silver02 from '../../../../images/Tournament/Rank/PUBG/Silver_2.png';
import Silver03 from '../../../../images/Tournament/Rank/PUBG/Silver_3.png';
import Silver04 from '../../../../images/Tournament/Rank/PUBG/Silver_4.png';
import Silver05 from '../../../../images/Tournament/Rank/PUBG/Silver_5.png';

import Gold01 from '../../../../images/Tournament/Rank/PUBG/Gold_1.png';
import Gold02 from '../../../../images/Tournament/Rank/PUBG/Gold_2.png';
import Gold03 from '../../../../images/Tournament/Rank/PUBG/Gold_3.png';
import Gold04 from '../../../../images/Tournament/Rank/PUBG/Gold_4.png';
import Gold05 from '../../../../images/Tournament/Rank/PUBG/Gold_5.png';

import Platinum01 from '../../../../images/Tournament/Rank/PUBG/Platinum_1.png';
import Platinum02 from '../../../../images/Tournament/Rank/PUBG/Platinum_2.png';
import Platinum03 from '../../../../images/Tournament/Rank/PUBG/Platinum_3.png';
import Platinum04 from '../../../../images/Tournament/Rank/PUBG/Platinum_4.png';
import Platinum05 from '../../../../images/Tournament/Rank/PUBG/Platinum_5.png';

import Diamond01 from '../../../../images/Tournament/Rank/PUBG/Diamond_1.png';
import Diamond02 from '../../../../images/Tournament/Rank/PUBG/Diamond_2.png';
import Diamond03 from '../../../../images/Tournament/Rank/PUBG/Diamond_3.png';
import Diamond04 from '../../../../images/Tournament/Rank/PUBG/Diamond_4.png';
import Diamond05 from '../../../../images/Tournament/Rank/PUBG/Diamond_5.png';
import PubgMaster from '../../../../images/Tournament/Rank/PUBG/Master.png';
import unknown from '../../../../images/Tournament/Rank/PUBG/Unranked.png';

export function useGetRank() {
    let rankFunc = (gameCode, gameData, isShowRank = false) => {
        let badge = ""

        if (gameData === null) {
            return badge
        }

        const dota2Rank = {
            '0': 'Uncalibrated',
            '1': 'Herald',
            '2': 'Guardian',
            '3': 'Crusader',
            '4': 'Archon',
            '5': 'Legend',
            '6': 'Ancient',
            '7': 'Divine',
            '8': 'Immortal',
        };


        const pubgRank = {
            '0-1': { img: unknown, text: "unknown" },
            '1-1': { img: Bronze01, text: "Bronze01" },
            '1-2': { img: Bronze02, text: "Bronze02" },
            '1-3': { img: Bronze03, text: "Bronze03" },
            '1-4': { img: Bronze04, text: "Bronze04" },
            '1-5': { img: Bronze05, text: "Bronze05" },
            '2-1': { img: Silver01, text: "Silver01" },
            '2-2': { img: Silver02, text: "Silver02" },
            '2-3': { img: Silver03, text: "Silver03" },
            '2-4': { img: Silver04, text: "Silver04" },
            '2-5': { img: Silver05, text: "Silver05" },
            '3-1': { img: Gold01, text: "Gold01" },
            '3-2': { img: Gold02, text: "Gold02" },
            '3-3': { img: Gold03, text: "Gold03" },
            '3-4': { img: Gold04, text: "Gold04" },
            '3-5': { img: Gold05, text: "Gold05" },
            '4-1': { img: Platinum01, text: "Platinum01" },
            '4-2': { img: Platinum02, text: "Platinum02" },
            '4-3': { img: Platinum03, text: "Platinum03" },
            '4-4': { img: Platinum04, text: "Platinum04" },
            '4-5': { img: Platinum05, text: "Platinum05" },
            '5-1': { img: Diamond01, text: "Diamond01" },
            '5-2': { img: Diamond02, text: "Diamond02" },
            '5-3': { img: Diamond03, text: "Diamond03" },
            '5-4': { img: Diamond04, text: "Diamond04" },
            '5-5': { img: Diamond05, text: "Diamond05" },
            '6-0': { img: PubgMaster, text: "PubgMaster" },
            '7-0': { img: PubgMaster, text: "PubgMaster" }
        };



        const lolRank = {
            'CHALLENGER': Challenger,
            'GRANDMASTER': Grandmaster,
            'MASTER': LolMaster,
            'DIAMOND': Diamond,
            'PLATINUM+': PlatinumPlus,
            'PLATINUM': Platinum,
            'GOLD': Gold,
            'SILVER': Silver,
            'BRONZE': Bronze,
            'IRON': Iron,
        };

        let imgsSrc = "";
        let imgText = "UNKNOWN";
        switch (gameCode) {
            case "lol":
                imgText = gameData.rank_level;
                imgsSrc = lolRank[gameData.rank_level]
                break
            case "pubg":
                if (pubgRank[gameData.rank_level]) {
                    imgsSrc = pubgRank[gameData.rank_level].img;
                    imgText = pubgRank[gameData.rank_level].text;
                }

                break
            case "dota2":
                imgsSrc = gameData.rank_level.substring(0, 1);
                imgText = dota2Rank[gameData.rank_level.substring(0, 1)].toUpperCase();
                break
        }

        if (!imgsSrc) {
            return badge
        }

        return badge = (<>
            <img alt="" src={gameCode === "dota2" ?
                `https://www.opendota.com/assets/images/dota2/rank_icons/rank_icon_${imgsSrc}.png`
                : imgsSrc}
                style={{ width: '25px', height: '25px' }} alt="" />
            {
                isShowRank && <span>{imgText}</span>
            }


        </>

        )
    }
    return { rankFunc }

}
