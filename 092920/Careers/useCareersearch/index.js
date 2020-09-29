import { useState, useEffect, useRef } from "react";
import { from } from 'rxjs';

//resource
// import { withConfigConsumer } from 'contexts/Config';
import { getCareerListAPI } from "apis/careers";



function useCareersearch(currentLocale = 'en_GLOBAL', page_number, pagedatalimit) {

    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false);
    const [careerlist, setCareerList] = useState([])
    //重複過濾arr
    const [careerIdcollect, setCareerIdCollect] = useState([])
    //no more data
    const [hasmoredata, setHasMoreData] = useState(false)
    //api

    // 轉換為api專用key
    const _locale = currentLocale
    // console.log('_locale', _locale)

    const data = { _pageno: page_number, _limit: pagedatalimit }

    //fetch models
    const fetchListener = useRef();
    const secondfetchListener = useRef();
    //record code first run
    const First_time_entry = useRef(true)



    function fetchAmodel() {
        console.log('fetch1')
        fetchListener.current = from(getCareerListAPI(data, _locale)).subscribe(response => {
            if (response.status === 200) {
                const { header, body } = response.data;
                if (header.status.toUpperCase() === 'OK') {
                    // console.log(body);
                    const { careers, meta_page } = body;
                    //根據backend資料判斷loading signal//提早關閉loading
                    // { current: "1", pages: "2", size: "10", total: "11" }
                    //當資料到底直接關掉loading
                    if (meta_page.current === meta_page.pages) {
                        setLoading(false)
                    }


                    // console.log('careerIdcollect', careerIdcollect)
                    if (careerIdcollect.length > 0) {
                        //取用filter arr濾出新資料  //不存在為保留條件
                        const filteredarr = careers.filter(val => careerIdcollect.indexOf(val.career_id) === -1)
                        // console.log('filteredarr', filteredarr)
                        // 為舊arr加上新arr
                        setCareerList(preList => {
                            return [...preList, ...filteredarr]
                        })
                        // console.log('old')
                    } else {
                        //創造新arr
                        setCareerList(careers)
                        //準備filter arr
                        const arr = careers.map(val => {
                            return val.career_id
                        })

                        setCareerIdCollect(arr)
                    }

                    // 還撈的到資料//維持true
                    setHasMoreData(careers.length > 0)
                    setLoading(false)
                }
            }

        })
    }
    // ---------------------------------處理URL進入點不為page 時-------------------------------

    function fetchBmodel(data, _locale) {
        console.log('fetch2')
        secondfetchListener.current = from(getCareerListAPI(data, _locale)).subscribe(response => {
            if (response.status === 200) {
                const { header, body } = response.data;
                if (header.status.toUpperCase() === 'OK') {
                    // console.log(body);
                    const { careers, meta_page } = body;
                    console.log('meta_page', meta_page)
                    setCareerList(careers)
                    // 準備filter arr
                    const arr = careers.map(val => {
                        return val.career_id
                    })
                    // console.log(arr)
                    setCareerIdCollect(arr)
                    setHasMoreData(meta_page.total > meta_page.size)
                    setLoading(false)
                }
            }

        })
    }


    useEffect(() => {

        //開始fetch
        setLoading(true)

        // 當進入點為直接輸入URL時_第一次執行一律走B model
        if (First_time_entry.current) {
            const data = { _limit: (pagedatalimit * page_number) }
            fetchBmodel(data, _locale)
            First_time_entry.current = false
        } else {
            fetchAmodel(data, _locale)
            console.log('data', data)
        }

        // ------------------------------------ end----------------------

        //等換頁之後才進行下面return，和一般return想法不同
        return () => {
            //取消fetch監聽
            if (fetchListener.current) fetchListener.current.unsubscribe();
            //取消fetch監聽
            if (secondfetchListener.current) secondfetchListener.current.unsubscribe();
        }

    }, [currentLocale, page_number, pagedatalimit]) //值改變後觸發fetch=>render


    //回傳調整後的狀態
    return { loading, error, careerlist, hasmoredata };
}


export default useCareersearch