import React, { useContext } from 'react';
import classes from '../style.module.scss';
import classNames from 'classnames/bind';
import { displayDateTime } from 'utils/formatters';
import { TournamentContext } from '../../../TournamentContext';
const cx = classNames.bind(classes);

/**
 * Schedule
 * @param {*} param0
 */
const Schedule = ({ rounds }) => {
  const { intl, bracketType } = useContext(TournamentContext);

  const getTranslate = (key) => {
    switch (key) {
      case "ongoing":
        return intl.formatMessage({ id: 'Single-Tournament-Page_Ongoing' })
      case "upcoming":
        return intl.formatMessage({ id: 'Single-Tournament-Page_Upcoming' })
      case "completed":
        return intl.formatMessage({ id: 'Single-Tournament-Page_Completed' })
    }
  }

  return (
    <div className={classes.schedule}>
      <h3>{intl.formatMessage({ id: 'Single-Tournament-Page_Schedule' })}</h3>
      <table className={classes.scheduleTable}>
        <thead>
          <tr>
            <th>{bracketType.current}{intl.formatMessage({ id: 'Single-Tournament-Page_Round' })}</th>
            <th>{intl.formatMessage({ id: 'Single-Tournament-Page_Event Time' })}</th>
            <th>{intl.formatMessage({ id: 'Single-Tournament-Page_Status' })}</th>
          </tr>
        </thead>
        <tbody>
          {rounds?.map(
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
                  <td className={cx('capitalize', status)}>{status === 'upcoming' ? '' : getTranslate(status)}</td>
                </tr>
              )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Schedule;
