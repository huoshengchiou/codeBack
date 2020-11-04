import React, { useState, useEffect, useRef, createElement } from 'react';

// import cx from 'classnames';
import classes from './style.module.scss';
import classNames from 'classnames/bind';
import { fromEvent } from "rxjs";


const cx = classNames.bind(classes);

const BarContainer = (props) => {

    const { height, topBar, floatBar, data } = props;
    const [showFloatBar, setShowFloatBar] = useState(false)
    const scroll = useRef(null)

    useEffect(() => {
        const scrollCapture = document.querySelector('#scrollCapture')
        scroll.current = fromEvent(scrollCapture, 'scroll')
            .subscribe(e => handleScrollRx(e))
        return () => {
            scroll.current.unsubscribe()
        };
    }, []);

    const handleScrollRx = e => {
        if (height === undefined) {
            return
        }
        // Prevent old MS Edge (not chromium) from crashing 
        if (window.navigator.userAgent.toLocaleLowerCase().indexOf("edge") > -1) {
            return;
        }
        let path = e.path || (e.composedPath && e.composedPath());
        setShowFloatBar(path[0].scrollTop > height ? true : false)

    }

    return (
        <>
            <div className={classes.container}>
                {createElement(topBar, {
                    contentData: {
                        ...data,
                    }
                })}
            </div>
            <div className={cx(classes.container, classes.scrollToFix, showFloatBar && classes.show)} >
                {floatBar !== undefined ? createElement(floatBar, data) : ""}
            </div>
        </>
    )
}

export default BarContainer