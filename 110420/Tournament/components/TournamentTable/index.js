import React, { useContext, useState } from 'react';
import ReactDOM from 'react-dom';
// Ant Design
import { Table } from 'antd';
// import "antd/dist/antd.css";
import 'components/DesignSystem/antd.css';
// Styles
// import classNames from 'classnames/bind';
import style from './tableStyle.scss';
// Design System

//data 內Obj的key值對應 columns 內的dataIndex

const { Column } = Table;

const TournamentTable = props => {
    const { columns, dataSource, scrollY = 500 } = props;

    //定義table頭資料
    // title為顯示字樣
    //width為定義寬度
    //fixed 為 freeze範圍 left(===true) or right

    const renderColumn = col => {
        const textAlign = () => {
            switch (col.align) {
                case 'text-right':
                    return 'right';
                case 'text-center':
                    return 'center';
                case 'text-left':
                default:
                    return 'left';
            }
        };

        const thStyle = {
            textAlign: textAlign(),
            wordBreak: 'normal',
            width: col.width,
            margin: ' 0'
        };

        const tdStyle = { ...thStyle };

        const columnContent = (col, colValue, rowData) => {
            return !!col.render && typeof col.render === 'function' ? (
                col.render(colValue, rowData)
            ) : (
                <span>{colValue}</span>
            );
        };

        return (
            <Column
                key={col.dataIndex}
                dataIndex={col.dataIndex}
                fixed={col.fixed || false}
                width={!!col.fixed ? col.width : ''}
                title={<div style={thStyle}>{col.title}</div>}
                render={(colValue, rowData) => <div style={tdStyle}>{columnContent(col, colValue, rowData)}</div>}
            />
        );
    };

    return (
        <>
            <Table
                dataSource={dataSource}
                scroll={{ x: (columns.length - 4) * 150 + 350, y: scrollY }}
                pagination={false}
                bordered={false}
            >
                {columns.map(col => renderColumn(col))}
            </Table>
        </>
    );
};

export default TournamentTable;
