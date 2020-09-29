import React, { useState, useEffect, useRef } from "react";
import { withRouter } from 'react-router-dom';
import { withConfigConsumer } from 'contexts/Config';

import makeAsyncScriptLoader from "react-async-script";

import facebookIcon from 'media/brand_logos/fIcon.png';

const FB_share = (props) => {
    const { FB } = props
    // console.log(props)
    useEffect(() => {
        if (FB) {
            FB.init({
                // 實際使用帳號
                // appId: configData.apiKeys.facebook_share,
                //測試帳號
                appId: 2726110374281904,
                cookie: true,  // enable cookies to allow the server to access
                xfbml: true,  // parse social plugins on this page
                version: 'v8.0' // use version 8.0 
            })
        }
        // console.log('effect on')
    }, [])

    const handleFBshare = () => {
        const { message } = props;

        window.FB.ui({
            method: 'share',
            // href: `${configData.domains.website}${location.pathname}${location.search}`,
            // 測試用網址
            // href: `https://dz-dev.xyzcamp.com/HK/zh/policy/privacy-policy`,
            href: document.location.href,
            quote: message,
        }, function (response) { });
    };

    return (<>
        <div onClick={handleFBshare}><img src={facebookIcon} alt="" /></div>

    </>)
}

const FB_shareWrapper = makeAsyncScriptLoader("https://connect.facebook.net/en_US/sdk.js", {
    globalName: "FB",
})(FB_share);

export default withRouter(withConfigConsumer(FB_shareWrapper))


