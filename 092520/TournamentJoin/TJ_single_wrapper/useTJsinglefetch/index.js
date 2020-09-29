import { useState, useEffect, useRef } from "react";
import { from } from 'rxjs';

import { postRegisteragree1v1, postRegister1v1, postDiscardreg, getDoItLater } from 'apis/tournament'

// useMyteams, useMyteamMembers 


//1.15.	報名錦標賽-同意政策ByPlayer(t8t015) //創建報名資料
// export const postRegisteragree1v1 = (data, access_token) => {
//     return request("POST", `${domain}/t8t/register-agree/1v1/${data.t8t_serial}`,
//         {
//             headers: {
//                 "content-type": "application/json"
//                 , Authorization: `Bearer ${access_token}`
//             }
//         });
// };

export function useCreateSingleReg({ createreg, gameserial, apiWithTokenWrapper }) {
    // apiWithTokenWrapper(postRegisteragree1v1,data)

    // console.log(loginUsername) //default null

    const fetchListener = useRef();
    const [single_reg_id, setSingle_Reg_Id] = useState('')
    // const [dataLoading, setDataLoading] = useState(false)
    // const [finishcreatejoin, setFinishCreateJoin] = useState(false)

    function fetchmyregid(gameserial) {
        // gameserial
        const data = { t8t_serial: gameserial }


        fetchListener.current = from(apiWithTokenWrapper(postRegisteragree1v1, data)).subscribe(response => {
            if (response.status === 200) {
                const { header, body } = response.data;
                if (header.status.toUpperCase() === 'OK') {
                    // console.log(body.t8t_player.t8t_player_id)
                    //拉回reg id
                    console.log('啟動完成')
                    setSingle_Reg_Id(body.t8t_player.t8t_player_id)
                    // t8t_player_id
                }
            }

        })
    }

    useEffect(() => {
        //確認不是空字串才觸發fetch
        if (gameserial === '') return
        if (createreg) {
            fetchmyregid(gameserial)
        }
        return () => {
            //取消fetch監聽
            if (fetchListener.current) fetchListener.current.unsubscribe();
        }
    }, [createreg])


    return { single_reg_id }

}






// 1.7.	報名錦標賽ByPlayer(t8t007)    //提交報名資料
// export const postRegister1v1 = (data, access_token) => {
//     return request("POST", `${domain}/t8t/register/1v1/${data.t8t_serial}`, {
//         headers: {
//             "content-type": "application/json",
//             Authorization: `Bearer ${access_token}`
//         }
//     });
// };



// TODO  處理postman行為

export function useSendSingleReg({ readytosend, apiWithTokenWrapper, finalregdata, setReadyToSend }) {



    const [fetchfinish, setFetchFinish] = useState(false)
    const RegBkOK = useRef(false)


    const fetchListener = useRef();

    function fetchsendsinglereg(finalregdata) {
        setFetchFinish(false)

        // apiWithTokenWrapper(postRegisteragree1v1, data)


        fetchListener.current = from(apiWithTokenWrapper(postRegister1v1, finalregdata)).subscribe(response => {

            if (response.status === 200) {
                const { header, body } = response.data;
                if (header.status.toUpperCase() === 'OK') {

                    if (body.is_register_finish) {
                        console.log('最終註冊成功')
                        RegBkOK.current = true
                    }
                    console.log('資料更新成功')
                    setReadyToSend(false)
                    setFetchFinish(true)
                }
            }

        })
    }

    useEffect(() => {
        // console.log('偷跑')



        if (readytosend) {
            // console.log('跑進來了')
            // console.log(finalregdata)
            fetchsendsinglereg(finalregdata)
        }


        return () => {
            //取消fetch監聽
            if (fetchListener.current) fetchListener.current.unsubscribe();
        }

    }, [readytosend])




    return { fetchfinish, RegBkOK }


}


//1.23	取消報名(t8t023)  //1v1 //TvT 共用

// carry
// data.target_id = t8t_team_id / t8t_player_id



// export const postDiscardreg = (data, access_token) => {
//     return request("POST", `${domain}/t8t/discard/${data.t8t_serial}`, {
//         data,
//         headers: {
//             "content-type": "application/json",
//             Authorization: `Bearer ${access_token}`
//         }
//     });
// };




export function useKillReg({ ProcessRegKill, apiWithTokenWrapper, gameserial, regid }) {

    const fetchListener = useRef();
    const [IsRegDelete, setIsRegDelete] = useState(false)

    function fetchkillreg(data) {
        // return console.log(data)  //test block
        fetchListener.current = from(apiWithTokenWrapper(postDiscardreg, data)).subscribe(response => {
            if (response.status === 200) {
                const { header } = response.data;
                if (header.status.toUpperCase() === 'OK') {

                    // console.log(body)
                    setIsRegDelete(true)


                }
            }

        })
    }
    useEffect(() => {
        if (ProcessRegKill) {
            const data = {
                t8t_serial: gameserial,
                target_id: regid
            }
            console.log('殺掉資料了', data)
            fetchkillreg(data)
        }
        return () => {
            //取消fetch監聽
            if (fetchListener.current) fetchListener.current.unsubscribe();
        }
    }, [ProcessRegKill])



    return { IsRegDelete }
}




// 1.34.	稍後報名 (t8t034) 由後端發訊號用 072120
// export const getDoItLater = (data, access_token) => {
//     return request('GET', `${domain}/t8t/do-it-later/${data.t8t_serial}`, {
//         headers: {
//             'content-type': 'application/json',
//             Authorization: `Bearer ${access_token}`,
//         },
//     });
// };



export function useDoItLater({ ProcessDIL, gameserial, apiWithTokenWrapper }) {


    const fetchListener = useRef();
    const [IsDILFin, setIsDILFin] = useState(false)

    function fetchDoItLater(gameserial) {
        // gameserial
        const data = { t8t_serial: gameserial }


        fetchListener.current = from(apiWithTokenWrapper(getDoItLater, data)).subscribe(response => {
            if (response.status === 200) {
                // const { header, body } = response.data;
                const { header } = response.data;
                if (header.status.toUpperCase() === 'OK') {
                    setIsDILFin(true)
                }
            }

        })
    }

    useEffect(() => {
        //確認不是空字串才觸發fetch
        // console.log('DIL')
        if (!ProcessDIL || gameserial === '') return
        console.log('觸發DIL')
        setIsDILFin(false)
        fetchDoItLater(gameserial)

        return () => {
            //取消fetch監聽
            if (fetchListener.current) fetchListener.current.unsubscribe();
        }
    }, [ProcessDIL])


    return { IsDILFin }

}