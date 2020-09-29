import { useState, useEffect, useRef } from "react";
import { from } from 'rxjs';

import { getT8t } from 'apis/tournament';



//api 描述

// // 1.12. 取得單一錦標賽(t8t012)
// export const getT8t = (data, access_token = null) => {
//     //使用者未登錄path
//     if (access_token === null) {
//         return request("GET", `${domain}/t8t/${data.t8t_serial}`, {
//             headers: {
//                 "content-type": "application/json",
//             }
//         });
//     }
//     return request("GET", `${domain}/t8t/${data.t8t_serial}`, {
//         headers: {
//             "content-type": "application/json",
//             Authorization: `Bearer ${access_token}`

//         }
//     });
// };




export function useGetgamedetail({ t8t_serial, apiWithTokenWrapper }) {

    const [gamedetail, setGameDetail] = useState(null)
    const [IsIniFetchOK, setIsIniFetchOK] = useState(false)
    const [IsUserInCb, setIsUserInCb] = useState(null)

    const fetchListener = useRef();


    function fetchgamedetail(data) {

        // 'T8T2005G8NSD' TVT   T8T2005U468W 1V1 T8T2005JDHHL  T8T2005U468W T8T20057V4G9
        fetchListener.current = from(apiWithTokenWrapper(getT8t, data)).subscribe(response => {
            // fetchListener.current = from(getT8t(data)).subscribe(response => {

            if (response.status === 200) {
                const { header, body } = response.data;
                if (header.status.toUpperCase() === 'OK') {
                    console.log('拿到比賽資料', body.t8t)
                    //分離需要資料
                    setIsUserInCb(body.t8t.t8t_lite.club.is_member)
                    setGameDetail(body.t8t)
                    setIsIniFetchOK(true)





                }
            }

        })

    }

    useEffect(() => {
        // console.log('t8t_serial', t8t_serial)
        setIsIniFetchOK(false)
        const data = { t8t_serial }
        fetchgamedetail(data)


        return () => {
            //取消fetch監聽
            if (fetchListener.current) fetchListener.current.unsubscribe();
        }

    }, [t8t_serial])






    return { gamedetail, IsIniFetchOK, IsUserInCb }
}




// export function useGetgamedetail() {

//     const [gamedetail, setGameDetail] = useState([])

//     const fetchListener = useRef();


//     function fetchgamedetail() {
//         fetchListener.current = from(getTeamInfo(data)).subscribe(response => {
//             if (response.status === 200) {
//                 const { header, body } = response.data;
//                 if (header.status.toUpperCase() === 'OK') {


//                     console.log('here', body)




//                 }
//             }

//         })

//     }

//     useEffect(() => {

//         fetchgamedetail()


//         return () => {
//             //取消fetch監聽
//             if (fetchListener.current) fetchListener.current.unsubscribe();
//         }

//     }, [])






//     return {}
// }
