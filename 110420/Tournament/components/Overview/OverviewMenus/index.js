import React, { useContext } from 'react';
import classes from '../style.module.scss';
import { displayDateTime } from 'utils/formatters';
import { TournamentContext } from '../../../TournamentContext';
import OverviewMenu from '../OverviewMenu';
import Contact from '../Contact';

// intl.formatMessage({ id: 'Single-Tournament-Page_Event Time' })


/**
 * Left-side overview menus
 * @param {*} param0
 */
const OverviewMenus = () => {
  const { renderT8tInfo: info, intl } = useContext(TournamentContext);

  const bracketType = {

    single: intl.formatMessage({ id: 'Single-Tournament-Page_Single Elimination' }),
    double: intl.formatMessage({ id: 'Single-Tournament-Page_Double Elimination' }),
    round_robin: intl.formatMessage({ id: 'Single-Tournament-Page_Round Robin' }),
    ffa: intl.formatMessage({ id: 'Single-Tournament-Page_Free For All' }),
    swiss: intl.formatMessage({ id: 'Single-Tournament-Page_Swiss' }),
  };


  const tournamentFormat = {
    //abnormal key
    '1v1': intl.formatMessage({ id: 'Single-Tournament-Page_Solo' }),
    TvT: intl.formatMessage({ id: 'Single-Tournament-Page_Team' })
  };


  if (!info) {
    return null;
  }
  const game_api_setting = JSON.parse(info?.game_api_setting ?? null);

  const region = game_api_setting?.server_type
    ? game_api_setting[game_api_setting.server_type]
    : null;

  const regionContent = region
    ? [
      {
        item: 'Server',
        content: [<p>{region}</p>],
      },
    ]
    : [];

  const getTicketTypeTranslate = (key) => {
    switch (key) {
      case "free":
        return intl.formatMessage({ id: "Single-Tournament-Page_For Free" });
      case "using_stargems":
        return intl.formatMessage({ id: "Single-Tournament-Page_Using StarGems" });
      case "using_startcoins":
        return intl.formatMessage({ id: "Single-Tournament-Page-Settings_ " });
    }
  }


  // console.warn('info', info.registration_start_at)
  return (
    <div className={classes.innerLeft}>
      <OverviewMenu
        title={intl.formatMessage({ id: 'Single-Tournament-Page_Tournament Time' })}
        contents={[
          {
            item: intl.formatMessage({ id: 'Single-Tournament-Page_Registration Time' }),
            content: [<>
              <p>{`[${intl.formatMessage({
                id: 'Single-Tournament-Page_Start',
              })}] ${displayDateTime(info.registration_start_at
              )}`}</p>
              <p>{`[${intl.formatMessage({
                id: 'Single-Tournament-Page_End',
              })}] ${displayDateTime(info.registration_end_at
              )}`}</p>
            </>],
          },
          {
            item: intl.formatMessage({ id: 'Single-Tournament-Page_Event Time' }),
            content: [
              <p>{`[${intl.formatMessage({
                id: 'Single-Tournament-Page_Start',
              })}] ${displayDateTime(info.event_start_at)}`}</p>,
            ],
          },
        ]}
      />

      <OverviewMenu
        title={intl.formatMessage({ id: 'Single-Tournament-Page_Detail' })}
        contents={[
          {
            item: intl.formatMessage({ id: 'Single-Tournament-Page_Game' }),
            content: [<p>{info.t8t_lite?.game?.name}</p>],
          },
          ...regionContent,
          {
            item: intl.formatMessage({ id: 'Single-Tournament-Page_Region' }),
            content: [<p>{info.region ? info.region : 'Global'}</p>],
          },
          {
            item: intl.formatMessage({ id: 'Single-Tournament-Page_Tournament Format' }),
            content: [
              <p>
                {tournamentFormat[info.tournament_format]}- {bracketType[info.bracket_type]}
              </p>,
            ],
          },
          {
            item: intl.formatMessage({ id: 'Single-Tournament-Page_Bracket Size' }),
            content: [<p>{info.bracket_info?.bracket_size}</p>],
          },
          {
            item: intl.formatMessage({ id: 'Single-Tournament-Page_Ticket' }),
            content: [<p className="capitalize">{getTicketTypeTranslate(info.ticket_type)}</p>],
          },
        ]}
      />

      <OverviewMenu
        title={intl.formatMessage({ id: 'Single-Tournament-Page_Participants' })}
        contents={[
          {
            item: intl.formatMessage({
              id: 'Single-Tournament-Page_Registered Maximum Participants',
            }),
            content: [
              <p>{`${info.participants_count} / ${info.participant_limit || intl.formatMessage({ id: 'Single-Tournament-Page_Unlimited' })}`}</p>,
            ],
          },
        ]}
      />

      <Contact info={info} contacts={info.contacts} />
    </div>
  );
};

export default OverviewMenus;
