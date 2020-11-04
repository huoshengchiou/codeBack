import React, { useState, useContext } from 'react';

import Card, { CardHeader, CardBody } from 'components/DesignSystem/DataDisplay/Card';

import Basic from './Basic';
import FreeForAll from './FreeForAll';

import { EditManageContext } from '../../Context';
import classes from './styles.module.scss';
import classNames from 'classnames/bind';
const cx = classNames.bind(classes);

const SelectElimination = () => {
    const { t8tDetail, configData, intl, saveT8tDetail } = useContext(EditManageContext);

    //DB 操作控制賽制顯示flag
    const { bracket } = configData.t8t;

    let dressCount = 0;
    const lockerRoom = val => {
        const Skins = ['defultBar1', 'defultBar2', 'defultBar3', 'defultBar4'];

        let display = {
            value: val.type,
            text: '',
            subvalue: intl.formatMessage({
                id: 'Bracket-Settings-Default-Page_Create a Bracket'
            }),
            class: Skins[0],
            disabled: false
        };
        switch (val.type) {
            case 'single':
                display.text = intl.formatMessage({
                    id: 'Tournament-Main-Page_Single Elimination'
                });
                break;
            case 'double':
                display.text = intl.formatMessage({
                    id: 'Tournament-Main-Page_Double Elimination'
                });
                break;
            case 'ffa':
                display.text = intl.formatMessage({
                    id: 'Tournament-Main-Page_Free For All'
                });
                break;
            case 'rr':
                display.text = intl.formatMessage({
                    id: 'Tournament-Main-Page_Round Robin'
                });
                display.subvalue = 'Create an Bracket(Single round robin schedule)';
                break;
            case 'swiss':
                display.text = intl.formatMessage({
                    id: 'Tournament-Main-Page_Swiss'
                });
                display.subvalue = 'Create an Bracket(Single swiss schedule)';
                break;
            default:
                break;
        }

        switch (val.value) {
            case 'on':
                display.class = Skins[dressCount];
                dressCount++;
                if (dressCount > 2) dressCount = 0;
                break;
            case 'soon':
                display.class = Skins[3];
                display.disabled = true;
                break;
            default:
                break;
        }

        return display;
    };

    const climinations = bracket.filter(val => val.value !== 'off').map(val2 => lockerRoom(val2));

    const clickSetElimination = item => {
        let updateData = { ...t8tDetail };

        updateData.bracket_type = item === null ? null : item.value;

        if (item.value === 'ffa') {
            if (updateData.bracket_info === null) {
                updateData.bracket_info = {};
            }
            updateData.bracket_info.score_type = 'battle_royale';
            updateData.bracket_info.kill_pts = 1;
            updateData.bracket_info.is_stage = false;
        }
        updateData.indexKey = 5;

        saveT8tDetail(updateData);
    };

    return (
        <>
            <div className="col-9">
                {climinations.map((item, index) => {
                    return (
                        <div
                            className={cx('defultBar', item.class)}
                            onClick={() => {
                                if (item.disabled) return;
                                clickSetElimination(item);
                            }}
                            key={index + 'setBracket'}
                        >
                            {item.disabled ? <div className={classes.say}>Comming Soon</div> : ''}
                            <div className={classes.defultTT}>
                                <div className={classes.defultTitle}>{item.text}</div>
                                <div className={classes.defultTxt}>{item.subvalue}</div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </>
    );
};

const BracketSettings = () => {
    const { t8tDetail } = useContext(EditManageContext);

    const getComponent = type => {
        switch (type) {
            case 'single':
            case 'double':
                return <Basic></Basic>;
            case 'ffa':
                return <FreeForAll></FreeForAll>;
        }
    };

    return (
        <>
            {t8tDetail.bracket_type === null ? (
                <SelectElimination></SelectElimination>
            ) : (
                getComponent(t8tDetail.bracket_type)
            )}
        </>
    );
};

export default BracketSettings;
