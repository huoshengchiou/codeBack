import React, { useContext, useState } from 'react';
import Search from 'components/DesignSystem/Input/Search';
import { TournamentContext } from '../../TournamentContext';
import Registration from './Registration';
import Pending from './Pending';
import classes from './style.module.scss';

const Participants = () => {
  const { isIndividual, intl } = useContext(TournamentContext);
  const [search, setSearch] = useState('');
  const [isRegistered, setIsRegistered] = useState(true);

  const handleChange = e => {
    setSearch(e.target.value);
  };

  return (
    <div className={classes.box}>
      <div className={classes.search}>
        <Search
          name="search"
          placeholder={isIndividual ? intl.formatMessage({ id: 'Single-Tournament-Page_Player Name' }) : intl.formatMessage({ id: 'Single-Tournament-Page_Team Name' })}
          value={search}
          onChange={handleChange}
        />
      </div>

      <Registration search={search} setIsRegistered={setIsRegistered} />

      {isRegistered && <Pending search={search} />}
    </div>
  );
};

export default Participants;
