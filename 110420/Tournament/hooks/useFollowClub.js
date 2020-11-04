import { useState, useEffect, useRef } from 'react';
import { from } from 'rxjs';
import { postClubFollowAPI } from 'apis/club';

// api  info
//追蹤(含取消)社團(Club011)
// export const postClubFollowAPI = (data, access_token) => request(
//     'POST',
//     `${domain}/club/follow`,
//     {
//         data,
//         headers: {
//             contentType: 'application/json',
//             Authorization: `Bearer ${access_token}`
//         }
//     }
// )

export function useFollowClub({
    ProcessFollow,
    apiWithTokenWrapper,
    CbId,
    setProcessFollow,
}) {
    const fetchListener = useRef();
    const [FchFollowFin, setFchFollowFin] = useState(true);
    const [FchBkData, setFchBkData] = useState(null);

    function fetchFollowCb(data) {
        // func block
        // return console.log(data)
        fetchListener.current = from(
            apiWithTokenWrapper(postClubFollowAPI, data)
        ).subscribe((response) => {
            if (response.status === 200) {
                const { header, body } = response.data;
                if (header.status.toUpperCase() === 'OK') {
                    const { is_follower, follower_count } = body.club;
                    // console.log(body)
                    setFchBkData({ is_follower, follower_count });
                    setFchFollowFin(true);
                    //reset fetch switch
                }
            }
        });
    }
    useEffect(() => {
        if (ProcessFollow) {
            setFchFollowFin(false);
            console.log('開始追蹤');
            const data = {
                club_id: CbId,
            };
            fetchFollowCb(data);
        }
        return () => {
            //取消fetch監聽
            if (fetchListener.current) fetchListener.current.unsubscribe();
        };
    }, [ProcessFollow]);

    return { FchFollowFin, FchBkData };
}
