import React, { useContext } from 'react';
import classes from '../style.module.scss';
import classNames from 'classnames/bind';
import { displayDateTime } from 'utils/formatters';
import { TournamentContext } from '../../../TournamentContext';
const cx = classNames.bind(classes);

/**
 * Double Schedule
 */
const FFASchedule = ({ rounds }) => {
  const { intl } = useContext(TournamentContext);
  if (!rounds) {
    return null;
  }

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
            <th>{intl.formatMessage({ id: 'Single-Tournament-Page_Stage' })}</th>
            <th>{intl.formatMessage({ id: 'Single-Tournament-Page_Event Time' })}</th>
            <th>{intl.formatMessage({ id: 'Single-Tournament-Page_Status' })}</th>
          </tr>
        </thead>
        <tbody>
          {rounds?.map(
            ({
              bracket_ffa_stage_id,
              stage_no,
              start_at,
              status,
            }) => (

                <tr key={bracket_ffa_stage_id}>
                  <td className={classes.round}>
                    {`${intl.formatMessage({ id: 'Single-Tournament-Page_Stage' })} ${stage_no}`}
                  </td>
                  <td>{displayDateTime(start_at)}</td>
                  <td className={cx('capitalize', status)}>{status === 'upcomping' ? '' : getTranslate(status)}</td>
                </tr>
              )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default FFASchedule;
