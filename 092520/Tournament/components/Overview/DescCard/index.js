import React from 'react';
import isNil from 'lodash/isNil';
import classes from '../style.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(classes);

const DescCard = ({ title, desc, emptyText }) => {
  return (
    <div className={cx('descCard')}>
      <h3>{title}</h3>
      <p>{desc === '' || isNil(desc) ? emptyText : desc}</p>
    </div>
  );
};

export default DescCard;
