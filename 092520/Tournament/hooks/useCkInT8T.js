import { useState, useEffect, useRef } from 'react';
import { from } from 'rxjs';
import { PostT8tCheckin } from 'apis/tournament';

// api  info
// 1.32. t8t報到 (t8t032)
// export const PostT8tCheckin = (data, access_token) => {
//     return request('POST', `${domain}/t8t/t8t-checkin/${data.t8t_serial}`, {
//         headers: {
//             'content-type': 'application/json',
//             Authorization: `Bearer ${access_token}`,
//         },
//     });
// };

export function useCkInT8T({ ProcessCk, apiWithTokenWrapper, GameSerial }) {
    const fetchListener = useRef();
    const [FchCkFin, setFchCkFin] = useState(false);
    const ckInOK = useRef(false)

    function fetchCkT8T(data) {
        // func block
        // return console.log(data);
        fetchListener.current = from(
            apiWithTokenWrapper(PostT8tCheckin, data)
        ).subscribe((response) => {
            if (response.status === 200) {
                const { header, body } = response.data;
                // const { header } = response.data;
                if (header.status.toUpperCase() === 'OK') {
                    // console.log(body)
                    //if ok body ===true
                    if (body === true) {
                        ckInOK.current = true
                    }
                    //reset fetch switch
                    setFchCkFin(true);
                }
            }
        });
    }
    useEffect(() => {
        if (ProcessCk) {
            setFchCkFin(false);
            console.log('開始check in');
            const data = {
                t8t_serial: GameSerial,
            };
            fetchCkT8T(data);
        }
        return () => {
            //取消fetch監聽
            if (fetchListener.current) fetchListener.current.unsubscribe();
        };
    }, [ProcessCk]);

    return { FchCkFin, ckInOK };
}
