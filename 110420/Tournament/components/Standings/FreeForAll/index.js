import React, { useState, useRef, useEffect, Fragment } from 'react';
import { withRouter } from 'react-router-dom';

// Ant Design
import { withConfigConsumer } from 'contexts/Config';
import TournamentTable from 'components/pages/Tournament/components/TournamentTable';

// Styles
import classNames from 'classnames/bind';
import classes from './style.module.scss';

// Design System
import TabLv2 from 'components/DesignSystem/DataDisplay/Tab/TabLv2';
import Thumbnail from 'components/DesignSystem/DataDisplay/Thumbnail';

// Contexts
import { withAuthConsumer } from 'contexts/Auth';
import { from } from 'rxjs';
import { getGameStandingStageInfo, getStandingInfo } from 'apis/ffaStandings';

// Components
import { getGroupName } from 'components/blocks/FFABracketMaster/components/RoomService/IssueCards/GroupCard';
import AwardPodium from 'components/pages/Tournament/components/Standings/Basic/AwardPodium';
import NoData from 'components/blocks/NoData';
import Loading from 'components/DesignSystem/Base/Loading';
import { t8tFormatTypes } from 'components/blocks/FFABracketMaster/contexts';
import { injectIntl } from 'react-intl';

const cx = classNames.bind(classes);

const columnsFormat = (numberOfGame, intl) => {
    const gameObjList = [...new Array(numberOfGame)].map((_, index) => ({
        title: `${intl.formatMessage({ id: 'FFA-See-Scoreboard_Game' })} ${index + 1}`,
        dataIndex: `game_${index + 1}`,
        width: '90px',
        align: 'text-center'
    }));

    return [
        {
            title: intl.formatMessage({ id: 'FFA-See-Scoreboard_Rank' }),
            width: '90px',
            dataIndex: 'rank',
            fixed: true,
            align: 'text-center',
            render: rank => (
                <div className={cx('rankBlock')}>
                    #<span>{rank}</span>
                </div>
            )
        },
        {
            title: '',
            width: '40px',
            dataIndex: 'status',
            fixed: 'left',
            align: 'text-center',
            render: (_, data) => {
                const { previous_rank, rank } = data;
                const rankingRise = previous_rank - rank;
                if (rankingRise === 0 || previous_rank === 0) {
                    return;
                }
                const className = rankingRise > 0 ? 'rise' : 'down';

                return (
                    <div className={cx('statusBlock')}>
                        {rankingRise > 0 ? (
                            <img src={require('../imgs/ico_rise.svg')} alt="ico_rise" />
                        ) : (
                            <img src={require('../imgs/ico_down.svg')} alt="ico_down" />
                        )}
                        <span className={cx(className)}>{Math.abs(rankingRise)}</span>
                    </div>
                );
            }
        },
        {
            title: '',
            width: '40px',
            dataIndex: 'is_winner',
            fixed: 'left',
            align: 'text-center',
            render: is_winner => {
                return is_winner ? <img src={require('../imgs/ico_ranking.png')} alt="" /> : null;
            }
        },
        {
            title: intl.formatMessage({ id: 'FFA-See-Scoreboard_Competition' }),
            width: '200px',
            dataIndex: 'competition',
            fixed: 'left',
            render: (_, data) => (
                <div className={cx('userBlock')}>
                    <Thumbnail imgUrl={data.imageUrl} border={{ double: true, gap: 3 }} theme="dark" size="40px" />
                    <span>{data.name}</span>
                </div>
            )
        },

        ...gameObjList,

        {
            title: intl.formatMessage({ id: 'FFA-See-Scoreboard_Total Kills' }),
            dataIndex: 'total_kill',
            width: '90px',
            align: 'text-center'
        },
        {
            title: intl.formatMessage({ id: 'FFA-See-Scoreboard_Total Score' }),
            dataIndex: 'total_score',
            width: '90px',
            align: 'text-center'
        }
    ];
};

const dataFormat = (data, getImageUrl, isIndividual) => {
    const { game_score_map: gameScoreMap } = data;
    const imageUrl = getImageUrl(data.avatar.logo_image);
    const newData = Object.assign(data);

    let scoreObj = {
        imageUrl,
        key: data.seed_no,
        icon_image: data.avatar.logo_image
    };

    if (isIndividual) {
        Object.assign(scoreObj, {
            username: data.avatar.name
        });
    } else {
        Object.assign(scoreObj, {
            team_name: data.avatar.name,
            team_url_key: data.avatar.url_key
        });
    }

    Object.keys(gameScoreMap).forEach(number => {
        Object.assign(newData, {
            [`game_${number}`]: gameScoreMap[number]
        });
    });
    return Object.assign(newData, scoreObj);
};

const Standings = props => {
    const { authData, configData, match, intl } = props;
    const fetchListener = useRef();

    const { getImageUrl } = configData;
    const { apiWithTokenWrapper } = authData;
    const { t8t_serial } = match.params;

    const [defaultIndex, setDefaultIndex] = useState(0);
    const [groupTable, setGroupTable] = useState(null);
    const [columns, setColumns] = useState(null);
    const [tabList, setTabList] = useState(null);
    const [isIndividual, setIsIndividual] = useState(null);

    useEffect(() => {
        getStandingDetail(1);
        getStageInfo();
        return () => {
            if (fetchListener.current) {
                fetchListener.current.unsubscribe();
            }
        };
    }, []);

    const getStageInfo = () => {
        const data = { t8t_serial };
        from(apiWithTokenWrapper(getStandingInfo, data)).subscribe(res => {
            const { data, status } = res;
            const { body, header } = data;
            if (status === 200 && header.status === 'OK') {
                const { stage_no_list } = body;
                const tabList = stage_no_list.map((data, index) => ({
                    index: index,
                    title: data,
                    disabled: false
                }));
                setIsIndividual(body.format_type.toUpperCase() === t8tFormatTypes.ONEvONE);
                setTabList(tabList);
            }
        });
    };

    const getStandingDetail = stage_no => {
        const data = {
            t8t_serial,
            stage_no
        };

        from(apiWithTokenWrapper(getGameStandingStageInfo, data)).subscribe(res => {
            const { data, status } = res;
            const { body, header } = data;
            if (status === 200 && header.status === 'OK') {
                const { group_standing_list: groupList, game_amount } = body;
                const groupTable = groupList.map(groupData => {
                    const { group_standing_list: memberList } = groupData;
                    const data = memberList.map(memberData => {
                        return dataFormat(memberData, getImageUrl, isIndividual);
                    });
                    return {
                        title: getGroupName(groupData.group_no - 1),
                        status: groupData.group_status === 'completed',
                        data
                    };
                });
                setColumns(columnsFormat(game_amount, intl));
                setGroupTable(groupTable);
            }
        });
    };

    if (!tabList) {
        return <Loading />;
    }

    return (
        <div className={cx('box')}>
            <h2>
                {`
                    ${intl.formatMessage({ id: 'Single-Tournament-Page_Free For All' })}
                    ${intl.formatMessage({ id: 'Tournament-Management-Page_Bracket' })}
                    `}
            </h2>
            <div className={cx('tabContainer')}>
                <div className={cx('leftCol', 'line')}>{intl.formatMessage({ id: 'Brackets_Stage' })}</div>
                <div className={cx('rightCol')}>
                    <TabLv2
                        theme="dark"
                        tabList={tabList}
                        defaultIndex={defaultIndex}
                        onClick={index => {
                            setDefaultIndex(index);
                            getStandingDetail(index + 1);
                            setGroupTable(null);
                        }}
                    />
                </div>
            </div>

            {!groupTable && <Loading />}

            {!!groupTable && groupTable.length === 0 && <NoData />}

            {!!groupTable && groupTable.length !== 0 && (
                <div className={cx('groupContainer')}>
                    {groupTable.map((item, index) => (
                        <Fragment key={`row_${index}`}>
                            {defaultIndex === tabList.length - 1 && (
                                <div className={cx('cardContainer')} key={`AwardPodium_${index}`}>
                                    <AwardPodium rank={item.data.slice(0, 3)} isIndividual={isIndividual} />
                                </div>
                            )}
                            <div className={cx('row')}>
                                <div className={cx('titleBar')}>
                                    <h4>
                                        {`${intl.formatMessage({ id: 'Brackets_Group' }, { groupname: item.title })}`}
                                    </h4>
                                    {item.status ? (
                                        <span className={cx('green')}>
                                            {intl.formatMessage({ id: 'Single-Tournament-Page_Completed' })}
                                        </span>
                                    ) : (
                                        <span className={cx('yellow')}>
                                            {intl.formatMessage({ id: 'See-Scoreboard-FFA_Waiting for Result' })}
                                        </span>
                                    )}
                                </div>
                                {item.data.length === 0 ? (
                                    <NoData />
                                ) : (
                                    <div className={cx('groupTable')}>
                                        <TournamentTable columns={columns} dataSource={item.data} scrollY={615} />
                                    </div>
                                )}
                            </div>
                        </Fragment>
                    ))}
                </div>
            )}
        </div>
    );
};

export default withConfigConsumer(withAuthConsumer(withRouter(injectIntl(Standings))));
