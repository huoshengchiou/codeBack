import { useState, useEffect, useRef } from 'react';
import { from } from 'rxjs';
import { postDiscardreg } from 'apis/tournament';

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

export function useKillReg({
    ProcessRegKill,
    apiWithTokenWrapper,
    RegId,
    GameSerial,
}) {
    const fetchListener = useRef();
    const [IsRegDelete, setIsRegDelete] = useState(false);

    function fetchkillreg(data) {
        // func block
        // return console.log(data)
        fetchListener.current = from(
            apiWithTokenWrapper(postDiscardreg, data)
        ).subscribe((response) => {
            if (response.status === 200) {
                const { header, body } = response.data;
                if (header.status.toUpperCase() === 'OK') {
                    // console.log(body)
                    setIsRegDelete(true);
                }
            }
        });
    }
    useEffect(() => {
        if (ProcessRegKill) {
            console.log('殺掉資料了');
            const data = {
                t8t_serial: GameSerial,
                target_id: RegId,
            };
            console.log('data', data)
            fetchkillreg(data);
        }
        return () => {
            //取消fetch監聽
            if (fetchListener.current) fetchListener.current.unsubscribe();
        };
    }, [ProcessRegKill]);

    return { IsRegDelete };
}
