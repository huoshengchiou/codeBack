import { useContext, useState, useEffect, useRef } from 'react';
import { from } from 'rxjs';
import { getParticipant } from 'apis/tournament';

export const useFetchParticipants = ({
    t8t_serial,
    isIndividual = true,
    limit = 12,
    pageNo = 1,
    pending = false,
    search = '',
    setMetaPage,
    setParticipantType,
    setList,
}) => {
    const fetchListener = useRef();

    const fetchParticipants = (data) => {
        fetchListener.current = from(
            getParticipant(data)
        ).subscribe(({ status, data }) => {
            if (
                status === 200 &&
                data?.header?.status?.toUpperCase() === 'OK'
            ) {
                const {
                    body: {
                        meta_page,
                        t8t_participant_type,
                        t8t_players,
                        t8t_teams,
                    },
                } = data;
                // console.log('參加者', data)
                setMetaPage && setMetaPage(meta_page);
                setParticipantType && setParticipantType(t8t_participant_type);
                setList && setList(isIndividual ? t8t_players : t8t_teams);
            }
        });
    };

    useEffect(() => {
        const req = {
            ...(pending && { search_pending: true }),
            ...(search && { search_string: search }),
        };
        const data = {
            bodyData: req,
            pathParam: {
                _limit: limit,
                _pageno: pageNo,
            },
            t8t_serial: t8t_serial,
        }
        t8t_serial && fetchParticipants(data);

        return () => {
            fetchListener.current && fetchListener.current.unsubscribe();
        };
    }, [t8t_serial, setList, isIndividual, limit, pageNo, pending, search]);

    return {};
};
