import React, { useContext } from 'react';
import { withRouter } from 'react-router-dom';

import { withAuthConsumer } from 'contexts/Auth';
import { withNotificationConsumer } from 'contexts/Notification';

import Button from 'components/DesignSystem/Input/Button';
import OverviewMenu from '../OverviewMenu';
import ContactContent from '../ContactContent';
import { TournamentContext } from '../../../TournamentContext';

import { OpenClubChatroom } from 'components/blocks/Chat/openChatroom/club.js';

import classes from '../style.module.scss';

const Contact = ({ location, history, info, contacts, authData, notificationData }) => {
    const content = contacts?.map(o => ContactContent({ ...o }));
    const { intl } = useContext(TournamentContext);

    const onClick = () => {
        const { isLoggedIn } = authData;
        if (!isLoggedIn) {
            history.push({
                ...location,
                hash: '#sign-in'
            });
        } else {
            OpenClubChatroom(info.t8t_lite.club, authData, notificationData);
        }
    };

    return (
        <OverviewMenu
            title={intl.formatMessage({ id: 'Single-Tournament-Page_Contact' })}
            contents={[
                //block button during UAT
                {
                    content: [
                        <div style={{ width: '100%', padding: '0 16%' }}>
                            <Button
                                title={intl.formatMessage({ id: 'Single-Tournament-Page_[btn]Message' })}
                                theme="dark_2"
                                icon={{ name: 'Message', color: 'dark' }}
                                customClass={classes.contactBtn}
                                onClick={onClick}
                            />
                        </div>
                    ]
                },
                {
                    content
                }
            ]}
        />
    );
};

export default withRouter(withAuthConsumer(withNotificationConsumer(Contact)));
