import React, { useContext } from 'react';
import IconImage from '../../IconImage';
import classes from './style.module.scss';
import { TournamentContext } from '../../../TournamentContext';

/**
 * Sponsor
 * @param {*} param0
 */
const Sponsor = ({ sponsors }) => {
  const { intl } = useContext(TournamentContext);

  if (!sponsors || sponsors.length === 0) {
    return null;
  }

  return (
    <div className={classes.sponsor}>
      <h3>{intl.formatMessage({ id: 'Single-Tournament-Page_Sponsor' })}</h3>

      <div className={classes.sponsorSlide}>
        {sponsors?.map(({ sponsor_url, t8t_sponsor_id, sponsor_image }) => (
          <a href={sponsor_url} key={t8t_sponsor_id}>
            {sponsor_image && <IconImage iconImage={sponsor_image} />}
          </a>
        ))}
      </div>
    </div>
  );
};

export default Sponsor;
