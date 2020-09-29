import React, { useState, useEffect, useRef } from "react";

//判斷進入的參數type，會有錯誤提示
import PropTypes from 'prop-types';
//語言翻譯包
import { injectIntl } from 'react-intl';
import { Link, withRouter } from "react-router-dom";
//結合api
import { from } from 'rxjs';
//引入外寫api
import { getCareerCareerIdAPI } from "apis/careers";
//彈出視窗的框架，讓行為一致
import { withPopWindowConsumer } from 'components/layouts/PopWindow/Context';

//取得content
import { withConfigConsumer } from 'contexts/Config';
//取得loading圖示component
import Loading from 'components/utils/Loading';

import Logo from "media/images/logop9.png";

import { LoactionIcon } from 'components/utils/Icons';
import Button from 'components/DesignSystem/Input/Button';
import classes from "./styles.module.scss";
//icons
// import facebookIcon from 'media/brand_logos/fIcon.png';
// import igIcon from 'media/brand_logos/instagram.png';
import linkIcon from 'media/icons/linkicon.png';
import ApplyCareer from './ApplyCareer';

//FB share btn
import FB_share from './FB_share'
import makeAsyncScriptLoader from "react-async-script";

//prevent inject
import DOMPurify from 'dompurify';


const CareerDetail = ({ configData, match, popWindowData, intl }) => {
     // 產生一個暫存的obj
     const fetchListener = useRef();
     //開關loading
     const [isLoading, setIsLoading] = useState(false);
     const [payload, setPayload] = useState({})


     useEffect(() => {


          //調整用呼叫
          // openApplyWin()
          // console.log(popWindowData);


          //?取得id丟給api
          // console.log(match)
          const { career_id } = match.params;
          setIsLoading(true);
          //取得api對應key
          // const { currentLocale } = configData;
          //放入api需要的key值
          fetchListener.current = from(getCareerCareerIdAPI(career_id)).subscribe(response => {
               if (response.status === 200) {
                    const { header, body } = response.data;
                    if (header.status.toUpperCase() === 'OK') {
                         // console.log('getData', body)
                         const { career } = body;
                         setIsLoading(false);
                         // console.log('test', career)
                         setPayload(career)
                         console.log('career', String(career.requirement.replace(/(\r\n|\n|\r)/gm, "<br/>")))

                    }
               }
          });
          //補一個移除subscribe的處理
          return () => {
               //fetch完成後取消監聽
               if (fetchListener.current) {
                    fetchListener.current.unsubscribe();
               }
          }


     }, [])
     //職缺單元
     // const fectchResult = (
     //      <>
     //           {payload.map(val => {
     //                return (<div className={classes.careerUnit} >
     //                     <ul>
     //                          <li><h3>{val.title}</h3></li>
     //                          <li><p>{val.description}</p></li>
     //                     </ul>
     //                </div>)
     //           })}
     //      </>
     // )
     const openApplyWin = () => {
          //送id到跳窗
          const { career_id } = match.params;
          const { openPopWindowFunc, closePopWindowFunc } = popWindowData;
          const popWindowAttributes = {
               component: ApplyCareer,
               componentProps: {
                    title: payload.title,
                    locationAddress: payload.location,
                    career_id,
                    closePopWindowFunc: closePopWindowFunc,
               },
               closeByButtonOnly: true,
               isFullModeForMobile: true,
          };
          openPopWindowFunc(popWindowAttributes);
     }
     //複製href
     const textAreaRef = useRef(null);
     const copyToClipboard = (e) => {
          const selection = window.getSelection()
          const range = document.createRange()
          range.selectNodeContents(textAreaRef.current)
          selection.removeAllRanges();
          selection.addRange(range);

          document.execCommand('copy');

          // console.log(document.location.href)
          // e.target.focus();
          // setCopySuccess('Code copied!');
          // setTimeout(() => {
          // setCopySuccess(' ');
          // }, 1000)
     };


     // console.log('here' + JSON.stringify(payload.requirement))


     // --------------------------職缺細節內容----------------------------
     //利用DOMPurify當作middleware，過濾成安全字串再給danger
     //將\n \r 後端資料庫換行字串處理為<br/>

     // const testString = "test↵test↵test↵test↵"
     // const re = /↵/g

     const filtered_descriptionString = DOMPurify.sanitize(String(payload.description?.replace(/(\r\n|\n|\r)/gm, "<br/>")));
     const filtered_requirementString = DOMPurify.sanitize(String(payload.requirement?.replace(/(\r\n|\n|\r)/gm, "<br/>")));


     const innerContent = (<>
          {/* {console.log('payload.requirement', payload.requirement)} */}
          <div className={classes.inner}>
               <div className={classes.innerHead}>
                    <div className={classes.jobTitle}>
                         <h1>{payload.title}</h1>
                    </div>
                    <div className={classes.share}>
                         {/* <div className="fb-share-button" data-href="https://dz-dev.xyzcamp.com/TW/zh" data-layout="button" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdz-dev.xyzcamp.com%2FTW%2Fzh&amp;src=sdkpreparse" className="fb-xfbml-parse-ignore">分享</a></div> */}

                         <ul>
                              <li><h3>{intl.formatMessage({ id: 'Careers_Share to :' })}</h3></li>
                              <li>
                                   {/* <img src={facebookIcon} alt="" /> */}
                                   <div className={classes.fbIcon}> <FB_share /></div>
                              </li>
                              {/* <div className={classes.igIcon}><img src={igIcon} alt="" /></div> */}
                              <li></li>
                              <li>
                                   {/* hidden div */}

                                   {/* TODO  新增UI提示完成copy */}
                                   <div className={classes.linkIcon} onClick={e => copyToClipboard(e)}>  <div className={classes.ref} ref={textAreaRef}>{document.location.href}</div><img src={linkIcon} alt="" /></div>
                              </li>
                         </ul>
                         {/* <input
                                   ref={textAreaRef}
                                   type={"text"}
                                   disable={"true"}
                                   value={document.location.href}
                                   hidden
                              /> */}
                    </div>
               </div>

               <div className={classes.location}>
                    <h3>{intl.formatMessage({ id: 'Careers_Location' })}</h3>
                    <span><LoactionIcon color="#f6a800" /></span><p>{payload.location}
                    </p>
               </div>
               <div className={classes.jobdes}>
                    <h3>{intl.formatMessage({ id: 'Careers_Job Description' })}</h3>
                    {/* <p>{payload.description}</p> */}
                    <div dangerouslySetInnerHTML={{ __html: filtered_descriptionString }} />
               </div>
               <div className={classes.qul}>
                    <h3>{intl.formatMessage({ id: 'Careers_Preferred Qualifications' })}</h3>

                    {/* <ul> */}
                    {/* TODO 測試style component ref hook */}
                    {/* <li>{payload.requirement}</li>
                    </ul>
                     */}
                    {/* //TODO 強制丟html還要處理攻擊漏洞 */}
                    <div dangerouslySetInnerHTML={{ __html: filtered_requirementString }} />
               </div>
               {/* <div className={classes.innerTitle}>
                                   <h1>Job Openings</h1>
                              </div>
                              <div className={classes.careerList}>
                                   {isLoading && <Loading theme="dark" />}
                                   {fectchResult}
                              </div> */}

               <div className={classes.footer}>
                    <Button title={intl.formatMessage({ id: 'Careers_[btn]Apply Now' })}
                         onClick={() => openApplyWin()}></Button>
                    {/* {console.log('msg', intl.formatMessage({ id: 'Careers_[btn]Apply Now' }))} */}
               </div>
          </div>

     </>)

     // function createMarkup() { return { __html: 'First &middot; Second' }; };



     return (
          <>
               {/* {console.log('操作前', `${payload.requirement}`)}
               {console.log('hello', filtered_requirementString)} */}
               <div className={classes.box}>
                    {/* header */}
                    <Link to={`${configData.pathPrefix}/home`}>
                         <div className={classes.header}>
                              <img src={Logo} alt="" />
                         </div>
                    </Link>
                    {/* banner */}
                    <div className={classes.banner}>

                         {/* <div className={classes.testbox} style={{ width: "100%", height: "200px" }}></div> */}
                         {/* <div className={classes.bannerImageContainer}>
                              <img src="http://lol-stats.net/uploads/4oFJWfOt73gESxXmHb0aAyij5wSDnQU5shtOjf8p.jpeg" alt="" />
                         </div> */}
                    </div>
                    <div id="innerContainer" className={classes.innerContainer}>
                         {/* //div塞變數 */}
                         {/* <div className="fb-share-button" data-href="https://dz-dev.xyzcamp.com/TW/zh" data-layout="button" data-size="large"><a target="_blank" href="https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fdevelopers.facebook.com%2Fdocs%2Fplugins%2F&amp;src=sdkpreparse" className="fb-xfbml-parse-ignore">分享</a></div> */}
                         {isLoading ? <Loading theme="dark" /> : innerContent}
                         {/* {isLoading && <Loading theme="dark" />}
                         {isLoading || innerContent} */}

                    </div>
               </div>
          </>
     )
}

CareerDetail.defaultProps = {

};

CareerDetail.propTypes = {
     configData: PropTypes.object.isRequired
};
//包一層loading SDK
const FB_shareWrapper = makeAsyncScriptLoader("https://connect.facebook.net/en_US/sdk.js", {
     globalName: "FB",
})(CareerDetail);

export default withRouter(
     withConfigConsumer(
          injectIntl(
               withPopWindowConsumer(FB_shareWrapper)
          )
     )
);
