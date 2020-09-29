import React, { useState, useEffect, useRef, useCallback } from "react";
//判斷進入的參數type，會有錯誤提示
import PropTypes from 'prop-types';
//語言翻譯包
import { injectIntl } from 'react-intl';
import { Link, withRouter } from "react-router-dom";
import qs from 'qs';
import { InView } from 'react-intersection-observer';

//結合api
import { from } from 'rxjs';
//引入外寫api
import { getCareerListAPI } from "apis/careers";
//自製彈跳視窗模組
import { withPopWindowConsumer } from 'components/layouts/PopWindow/Context';

//取得content
import { withConfigConsumer } from 'contexts/Config';
//取得loading圖示component
import Loading from 'components/utils/Loading';

import Logo from "media/images/logop9.png";

import classes from "./styles.module.scss";

// ---------------------------------fetch_list_data  functional component----------------
import useCareersearch from "components/pages/Careers/useCareersearch";

const Careers = ({ configData, intl, location, history }) => {
     // TODO預設router?
     let currentURLpageNumber = location.search.split('=')[1] * 1

     // //當進入URL為/TW/zh/careers//增加預設router並覆蓋頁碼
     // if (!location.search) {
     //      window.history.pushState(null, null, `?page=1`)
     //      currentURLpageNumber = 1
     // }
     //下方處理避免history被push過多資料
     useEffect(() => {
          if (!location.search) {
               history.replace({
                    ...location,
                    search: `?page=1`,
               });
               currentURLpageNumber = 1
          }
     }, [])
     const { currentLocale } = configData;
     const [pagenumber, setPageNumber] = useState(currentURLpageNumber)
     // useCareersearch(currentLocale = 'en_GLOBAL', page_number, pagedatalimit)



     //每頁筆數
     const dataperPage = 10
     //state===>fetch功能型component=======>outputdata 
     const { loading, error, careerlist, hasmoredata } = useCareersearch(currentLocale, pagenumber, dataperPage)
     // -----------------------------------infinite--setting--------start------
     const observer = useRef();
     const lastlistelement = useCallback(
          (node) => {
               if (loading) return
               if (observer.current) observer.current.disconnect()
               observer.current = new IntersectionObserver(entries => {
                    if (entries[0].isIntersecting && hasmoredata) {
                         // console.log('visible')
                         setPageNumber(pagenumber + 1)
                    }
               })


               if (node) observer.current.observe(node);

          },
          [loading, hasmoredata],
     )


     // -----------------------------------infinite--setting--------end------
     //page變動改變URL
     useEffect(() => {
          if (hasmoredata) {
               history.replace({
                    ...location,
                    search: `?page=${pagenumber - 1}`,
               });
          }
     }, [pagenumber]);

     //重新render時回到預設URL
     // useEffect(() => {
     //      // window.history.pushState(null, null, `?page=${pagenumber}`);
     //      //當URL不是預設的pagenumber
     //      //根據router修正pagenumber
     //      const currentURLpageNumber = location.search.split('=')[1]
     //      // trans type  string to number
     //      if (currentURLpageNumber * 1 !== pagenumber) {
     //           // TODO調整router
     //           window.history.pushState(null, null, `?page=${currentURLpageNumber}`);
     //           // setPageNumber(currentURLpageNumber * 1)
     //      }
     // }, [])

     // ---------------------------------old version------------------------------------


     // const params = qs.parse(location.search.substring(1));
     // 產生一個暫存的obj
     const fetchListener = useRef();
     //開關loading
     const [isLoading, setIsLoading] = useState(true);
     const [isMoreLoading, setIsMoreLoading] = useState(false);

     const [payload, setPayload] = useState([]);
     // const [ showCount, setShowCount ] = useState(params?.total_count && Number.isInteger(Number(params.total_count)) ? params.total_count : null);

     const [pagination, setPagination] = useState({});

     // useEffect(() => {
     //      getCareersList();
     //      return () => {
     //           console.log('cancel')
     //           //fetch完成後取消監聽 //離開頁面觸發
     //           if (fetchListener.current) {
     //                fetchListener.current.unsubscribe();
     //           }
     //      }
     // }, []);


     // ----------------------------------------------------------------------------

     // const getCareersList = (isMore = false) => {
     //      if (isMore) {
     //           setIsMoreLoading(true);
     //      } else {
     //           setIsLoading(true);
     //      }
     //      //取得api專用key
     //      const { currentLocale } = configData;

     //      const data = {
     //           _pageno: isMore ? Number(pagination.current) + 1 : 1,
     //           _limit: 10,
     //      }

     //      fetchListener.current = from(getCareerListAPI(data, currentLocale)).subscribe(response => {
     //           if (response.status === 200) {
     //                const { header, body } = response.data;
     //                if (header.status.toUpperCase() === 'OK') {
     //                     const { careers, meta_page } = body;
     //                     setIsLoading(false);
     //                     setIsMoreLoading(false);
     //                     setPayload(isMore ? [...payload, ...careers] : careers);
     //                     setPagination({ ...meta_page });
     //                }
     //           }
     //      });
     // }

     // const fectchResult = (
     //      <>
     //           {payload.map((val, idx) => {
     //                return (<div className={classes.careerUnit} key={`careerunit_${idx + 1}`}>
     //                     <ul>
     //                          <li className={classes.careerTitle}>
     //                               <Link to={{ pathname: `${configData.pathPrefix}/careers/${val.career_id}` }}>
     //                                    <h3>{val.title}</h3>
     //                               </Link>
     //                          </li>
     //                          <li className={classes.careerLocation}><p>{val.location}</p></li>
     //                     </ul>
     //                </div>)
     //           })}
     //      </>
     // )




     return (
          <>
               <div className={classes.box}>
                    {/* header */}
                    <Link to={`${configData.pathPrefix}/home`}>
                         <div className={classes.header}>
                              <img src={Logo} alt="" />
                         </div>
                    </Link>
                    {/* banner */}
                    <div className={classes.banner}>
                         <div className={classes.bannerTitle}>

                              <h1>{intl.formatMessage({ id: 'Careers_Fight With US' })}</h1>
                              <h3>{intl.formatMessage({ id: 'Careers_[content]Fight With US' })}</h3>

                         </div>
                         {/* <div className={classes.testbox} style={{ width: "100%", height: "200px" }}></div> */}
                         {/* <div className={classes.bannerImageContainer}>
                              <img src="http://lol-stats.net/uploads/4oFJWfOt73gESxXmHb0aAyij5wSDnQU5shtOjf8p.jpeg" alt="" />
                         </div> */}
                    </div>
                    <div className={classes.innerContainer}>
                         <div className={classes.inner}>
                              <div className={classes.innerTitle}>
                                   <h1>{intl.formatMessage({ id: 'Careers_Job Openings' })}</h1>
                              </div>
                              <div className={classes.careerList}>
                                   {/* ----------------careers List------------ */}
                                   {/* -----------------------------------infinite--setting--------start------ */}

                                   {
                                        careerlist.map((val, idx) => {
                                             if (careerlist.length === idx + 1) {
                                                  return (<div className={classes.careerUnit} ref={lastlistelement} key={`careerunit_${idx + 'career'}`}>
                                                       <ul>
                                                            <li className={classes.careerTitle}>
                                                                 <Link to={{ pathname: `${configData.pathPrefix}/careers/${val.career_id}` }}>
                                                                      <h3>{val.title}</h3>
                                                                 </Link>
                                                            </li>
                                                            <li className={classes.careerLocation}><p>{val.location}</p></li>
                                                       </ul>
                                                  </div>)
                                             } else {
                                                  return (<div className={classes.careerUnit} key={`careerunit_${idx + 'career'}`}>
                                                       <ul>
                                                            <li className={classes.careerTitle}>
                                                                 <Link to={{ pathname: `${configData.pathPrefix}/careers/${val.career_id}` }}>
                                                                      <h3>{val.title}</h3>
                                                                 </Link>
                                                            </li>
                                                            <li className={classes.careerLocation}><p>{val.location}</p></li>
                                                       </ul>
                                                  </div>)
                                             }

                                        })
                                   }
                                   {/* -----------------------------------infinite--setting--------end------ */}
                                   {/* //old version關掉 */}
                                   {/* {isLoading ? <Loading theme="dark" /> : fectchResult} */}
                                   {/* {fectchResult} */}
                              </div>
                              {loading && <Loading theme="dark" />}

                              {/* ----------old-------------------- */}
                              {/* {isMoreLoading && <Loading theme="dark" />} */}
                              {/* {pagination?.current && pagination.current !== pagination.pages &&
                                   <InView onChange={(inView, entry) => {
                                        if (pagination.current === pagination.pages)
                                             return;

                                        if (!isLoading && inView) {
                                             getCareersList(true);
                                             console.log(inView, entry);
                                        }
                                   }}
                                   >
                                        {({ inView, ref, entry }) => (
                                             <div className={classes.inView} ref={ref}></div>
                                        )}
                                   </InView>
                              } */}

                         </div>
                    </div>
               </div>
          </>
     )
}

Careers.defaultProps = {

};

Careers.propTypes = {
     configData: PropTypes.object.isRequired
};

export default withRouter(
     withConfigConsumer(
          injectIntl(
               withPopWindowConsumer(Careers)
          )
     )
);
