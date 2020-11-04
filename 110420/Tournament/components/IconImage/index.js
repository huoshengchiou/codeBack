import React from 'react';
import { withConfigConsumer } from 'contexts/Config';

const IconImage = ({ configData, iconImage, className }) => {

    const { getImageUrl } = configData;
    if (!iconImage) return null
    return <img alt="" className={className} src={getImageUrl(iconImage)} alt="" />;
};

export default withConfigConsumer(IconImage);
