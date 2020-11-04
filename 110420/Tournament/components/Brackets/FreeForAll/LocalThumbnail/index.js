import React, { useMemo, useState, useEffect } from 'react'
import classes from 'components/DesignSystem/DataDisplay/Thumbnail/style.module.scss'
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { Link } from "react-router-dom";
import axios from "axios";

export default function Thumbnail({
    imgUrl, shape, border, size, theme, icon, onClick, online, title, linkTo
}) {

    const [base64, setBase64] = useState("");
    const getIconClassNames = (position) => {
        const arr = [classes.icon];
        if (position) {
            position.trim().split(' ').forEach(pos => {
                arr.push(classes[pos])
            })
        }
        return classnames(...arr);
    }

    const themeClass = useMemo(() => {
        switch (theme) {
            case 'dark':
                return classes.dark
            case 'light':
                return classes.light
            case 'dark_1':
                return classes.dark1
            default:
                return border.double ? classes.light : classes.dark
        }
    }, [])



    const imgBase64 = () => {
        let url = imgUrl + `?${new Date().getTime()}`;

        axios({
            url: url,
            method: "GET",
            mode: 'cors', // no-cors, cors, *same-origin
            redirect: 'follow', // manual, *follow, error
            referrer: 'no-referrer', // *client, no-referrer
            responseType: 'blob',
            timeout: 60000,
        }).then(response => {
            let reader = new FileReader();
            reader.readAsDataURL(response.data);
            reader.onloadend = () => {
                const base64String = reader.result;
                setBase64(base64String);
                return base64String;
            }
        })

        // fetch(imgUrl, {
        //     method: 'GET', // *GET, POST, PUT, DELETE, etc.
        //     mode: 'cors', // no-cors, cors, *same-origin
        //     redirect: 'follow', // manual, *follow, error
        //     referrer: 'no-referrer', // *client, no-referrer
        //     responseType: 'arraybuffer',
        // }).then((response) => response.blob())
        //     .then(blob => {
        //         var reader = new FileReader();
        //         reader.readAsDataURL(blob);
        //         reader.onloadend = function () {
        //             var base64String = reader.result;
        //             // console.log(base64String);
        //             setBase64(base64String);
        //             return base64String;
        //         }
        //     })
    };

    useEffect(() => {
        imgBase64();
    }, [imgUrl])

    const ThumbnailInner = () => {


        return (
            <>
                <div
                    className={classnames(
                        classes.thumbnail,
                        shape === "circle" ? classes.circle : classes.square,
                        border.double ? classes.double : classes.single,
                        themeClass,
                        onClick && classes.func,
                    )}
                    style={{
                        width: size,
                        height: size,
                        padding: `${border.gap}px`,
                    }}
                    onClick={onClick}
                >
                    <div className={classnames(classes.imgContainer, theme === "light" ? classes.light : null,)}
                        style={{ borderWidth: `${border.gap}px` }}
                    >
                        {/* <img alt="" src={imgUrl} title={title} /> */}
                        <img alt="" src={base64} title={title} />

                    </div>
                    {icon && (
                        <div className={getIconClassNames(icon.position)} >
                            {icon.component}
                        </div>
                    )}
                    {(online !== "none") && (
                        <span className={classnames(classes.onlineIcon, online && classes.online)}></span>
                    )}
                </div>
            </>
        )
    }

    if (linkTo) {
        return (
            <Link to={linkTo}>
                <ThumbnailInner />
            </Link>
        );
    } else {
        return <ThumbnailInner />;
    }
}

Thumbnail.propTypes = {
    imgUrl: PropTypes.string.isRequired,
    shape: PropTypes.oneOf(["circle", "square"]),
    /** double: 是否第二層外框, gap: 線框粗度 (框與框之間的距離) */
    border: PropTypes.shape({
        double: PropTypes.bool,
        gap: PropTypes.number
    }),
    /** 點擊頭像的function，滑鼠會變成pointer */
    onClick: PropTypes.func,
    size: PropTypes.string,
    /** border 為 double 時 light 為 藍綠色漸層，dark 為紅藍色漸層 */
    theme: PropTypes.oneOf(["light", "dark", "dark_1"]),
    /** position 請傳 top left, bottom right 這種字串 */
    icon: PropTypes.shape({
        component: PropTypes.element,
        position: PropTypes.string
    }),
    online: PropTypes.oneOf([true, false, "none"]),
    /** title 文字 */
    title: PropTypes.string,
    /** 超連結 */
    linkTo: PropTypes.string,
}

Thumbnail.defaultProps = {
    shape: "circle",
    border: { double: false, gap: 0 },
    size: "110px",
    online: "none",
}