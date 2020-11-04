import React from 'react';
import classNames from 'classnames/bind';
import classes from '../style.module.scss';
import { withRouter } from 'react-router-dom';
import { withConfigConsumer } from 'contexts/Config';



const cx = classNames.bind(classes);

const ContactContent = ({ contact_type, contact_value, configData }) => {

    const { pathPrefix } = configData
    //show string only
    const disTextGroup = ['Discord', 'Facebook', 'Twitter', 'Twitch']
    // href="mailto:someone@example.com"

    // http://localhost:3000/GLOBAL/en
    const fullPath = "http://" + window.location.host + pathPrefix
    const disLinkGroup = {
        'Planet 9': fullPath + '/player/',
        'E-mail': 'mailto:',
    }

    return (

        (disTextGroup.includes(contact_type)) ? (<><a className={cx(`ico_${contact_type.toLowerCase().replace(/ /g,'')}`)}>{contact_value}</a></>) : (<><a
            href={disLinkGroup[contact_type] + contact_value}
            className={cx(
                `ico_${contact_type.toLowerCase().replace(/ /g,'')}`
            )}
        >
            {contact_value}

        </a></>)

    )
};

export default withRouter(withConfigConsumer(ContactContent));
