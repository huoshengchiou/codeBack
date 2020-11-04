import React, { useContext } from 'react';
import classes from '../style.module.scss';
import classNames from 'classnames/bind';
import { displayDateTime } from 'utils/formatters';
import { TournamentContext } from '../../../TournamentContext';
const cx = classNames.bind(classes);

/**
 * Double Schedule
 */
const DoubleSchedule = ({ rounds }) => {
  const { intl } = useContext(TournamentContext);
  if (!rounds) {
    return null;
  }

  const winners = [];
  const losers = [];
  const final = [];

  rounds.forEach(o => {
    switch (o.bracket_type) {
      case 'winner':
        winners.push(o);
        break;
      case 'loser':
        losers.push(o);
        break;
      case 'final':
        final.push(o);
        break;
      default:
    }
  });

  //#region table data
  const genTable = (rows, caption) => (
    <table className={classes.scheduleTable}>
      <thead>
        <tr>
          <th>{caption}</th>
          <th>{intl.formatMessage({ id: 'Single-Tournament-Page_Event Time' })}</th>
          <th>{intl.formatMessage({ id: 'Single-Tournament-Page_Status' })}</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(
          ({
            bracket_elimination_round_id,
            t8t_bracket_round_id,
            round_no,
            game_bo,
            start_at,
            status,
          }) => (
              <tr key={bracket_elimination_round_id ?? t8t_bracket_round_id}>
                <td className={classes.round}>
                  {`${intl.formatMessage({ id: 'Single-Tournament-Page_Round' })} ${round_no}`}
                  <div>{`${intl.formatMessage({ id: 'Single-Tournament-Page_Best of' })} ${game_bo}`}</div>
                </td>
                <td>{displayDateTime(start_at)}</td>
                <td className={cx('capitalize', status)}>{status === 'upcoming' ? '' : status}</td>
              </tr>
            )
        )}
      </tbody>
    </table>
  );
  //#endregion

  return (
    <div className={classes.schedule}>
      <h3>{intl.formatMessage({ id: 'Single-Tournament-Page_Schedule' })}</h3>
      {winners.length > 0 && genTable(winners, intl.formatMessage({ id: 'Single-Tournament-Page_Winner Round' }))}
      {losers.length > 0 && genTable(losers, intl.formatMessage({ id: 'Single-Tournament-Page_Loser Round' }))}
      {final.length > 0 && genTable(final, intl.formatMessage({ id: 'Single-Tournament-Page_Grand Final' }))}
    </div>
  );
};

export default DoubleSchedule;
