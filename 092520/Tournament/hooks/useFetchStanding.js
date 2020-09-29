import { useContext, useState, useEffect, useRef } from 'react';
import { from } from 'rxjs';
import { getT8tStanding } from 'apis/tournament';

export const useFetchStanding = ({ t8t_serial }) => {
    const fetchListener = useRef();
    const [IsFetchFin, setIsFetchFin] = useState(false)
    const [IsGame1v1, setIsGame1v1] = useState(false)
    const [standing, setStanding] = useState();
    const [Ranklist, setRanklist] = useState([])

    const fetchStanding = () => {
        setIsFetchFin(false)
        fetchListener.current = from(
            getT8tStanding({ t8t_serial, req: {} })
        ).subscribe(({ status, data }) => {
            if (
                status === 200 &&
                data?.header?.status?.toUpperCase() === 'OK'
            ) {
                const { body } = data;
                const { t8t_players, t8t_teams } = body
                // console.log('t8t_players', t8t_players, t8t_teams)
                //switch loading depend on data size
                setIsGame1v1(t8t_players.length !== 0)
                setRanklist((t8t_players.length !== 0) ? t8t_players : t8t_teams)
                setStanding(body);
                setIsFetchFin(true)
            }
        });
    };

    useEffect(() => {

        t8t_serial && fetchStanding();


        return () => {
            fetchListener.current && fetchListener.current.unsubscribe();
        };
    }, [t8t_serial]);

    return { standing, IsFetchFin, IsGame1v1, Ranklist };
};
