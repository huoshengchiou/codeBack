import React, { useContext } from 'react';

import Basic from './Basic';
import FreeForAll from './FreeForAll';

import { EditManageContext } from '../../Context';

const SeedBracketSettings = () => {
    const { t8tDetail } = useContext(EditManageContext);

    const getComponent = () => {
        switch (t8tDetail.bracket_type) {
            case 'ffa':
                return <FreeForAll></FreeForAll>;
            default:
                return <Basic></Basic>;
        }
    };

    return <>{getComponent()}</>;
};

export default SeedBracketSettings;
