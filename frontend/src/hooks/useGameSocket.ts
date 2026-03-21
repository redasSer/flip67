import { useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { useNavigate } from 'react-router-dom';
import useGameStore from '@/stores/gameStore';
import type { GameStateEvent } from '@/types/api';
import { getPlayers } from '@/api/game';
import { getBaseURL } from '@/api/client';

const WS_URL = getBaseURL() + '/ws';

export const useGameSocket = (gameId: string | undefined) => {
    const setPlayers = useGameStore((s) => s.setPlayers);
    const setGameStatus = useGameStore((s) => s.setGameStatus);
    const navigate = useNavigate();
    const clientRef = useRef<Client | null>(null);

    useEffect(() => {
        if (!gameId) return;

        const client = new Client({
            webSocketFactory: () => new SockJS(WS_URL),
            onConnect: () => {
                client.subscribe(`/topic/game/${gameId}`, (message) => {
                    const event: GameStateEvent = JSON.parse(message.body);

                    setPlayers(event.players);
                    setGameStatus(event.gameStatus);

                    if (event.gameStatus === 'IN_PROGRESS') {
                        navigate('/game');
                    } else if (event.gameStatus === 'COMPLETED') {
                        navigate('/');
                    }
                });

                // Covers page refresh — mutations handle create/join
                getPlayers(gameId).then(setPlayers).catch(console.error);
            },
            onStompError: (frame) => {
                console.error('STOMP error', frame);
            },
        });

        client.activate();
        clientRef.current = client;

        return () => {
            client.deactivate();
            clientRef.current = null;
        };
    }, [gameId]);
};
