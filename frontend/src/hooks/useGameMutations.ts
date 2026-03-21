import { useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { createGame, joinGame, getSession, getPlayers, leaveGame, startGame, scorePoints, resetGame } from '@/api/game';
import type { CreateGameDto, JoinGameDto } from '@/types/api';
import useGameStore from '@/stores/gameStore';
import { SESSION_STORAGE_KEY } from '@/stores/gameStore';
import { useNavigate, useLocation } from 'react-router-dom';
import { useGameSocket } from '@/hooks/useGameSocket';

export const useCreateGame = () => {
    const setSession = useGameStore((s) => s.setSession);
    const setPlayers = useGameStore((s) => s.setPlayers);

    return useMutation({
        mutationFn: (dto: CreateGameDto) => createGame(dto),
        onSuccess: (data) => {
            setSession(data);
            getPlayers(data.gameId).then(setPlayers).catch(console.error);
        },
    });
};

export const useJoinGame = () => {
    const setSession = useGameStore((s) => s.setSession);
    const setPlayers = useGameStore((s) => s.setPlayers);

    return useMutation({
        mutationFn: (dto: JoinGameDto) => joinGame(dto),
        onSuccess: (data) => {
            setSession(data);
            getPlayers(data.gameId).then(setPlayers).catch(console.error);
        },
    });
};

export const useLeaveGame = () => {
    const clearSession = useGameStore((s) => s.clearSession);
    const navigate = useNavigate();

    return useMutation({
        mutationFn: ({ gameId, playerId }: { gameId: string; playerId: string }) =>
            leaveGame(gameId, playerId),
        onSettled: () => {
            clearSession();
            navigate('/');
        },
    });
};

export const useStartGame = () => {
    return useMutation({
        mutationFn: (gameId: string) => startGame(gameId),
    });
};

export const useScorePoints = () => {
    const session = useGameStore((s) => s.session);

    return useMutation({
        mutationFn: (points: number) => scorePoints(session!.gameId, session!.playerId, points),
    });
};

export const useResetGame = () => {
    const session = useGameStore((s) => s.session);

    return useMutation({
        mutationFn: () => resetGame(session!.gameId),
    });
};

function getRequiredPath(gameStatus: string | undefined): string {
    if (gameStatus === 'WAITING_FOR_PLAYERS') return '/lobby';
    if (gameStatus === 'IN_PROGRESS') return '/game';
    return '/';
}

export const useRestoreSession = () => {
    const setSession = useGameStore((s) => s.setSession);
    const clearSession = useGameStore((s) => s.clearSession);
    const session = useGameStore((s) => s.session);
    const navigate = useNavigate();
    const location = useLocation();

    const stored = (() => {
        try {
            const raw = localStorage.getItem(SESSION_STORAGE_KEY);
            return raw ? (JSON.parse(raw) as { gameId: string; playerId: string }) : null;
        } catch {
            return null;
        }
    })();

    const { data, isError } = useQuery({
        queryKey: ['session', stored?.gameId, stored?.playerId],
        queryFn: () => getSession(stored!.gameId, stored!.playerId),
        enabled: !!stored && !session,
        retry: false,
    });

    // Connect to WS once we have a gameId (from restored or live session)
    useGameSocket(session?.gameId ?? stored?.gameId);

    useEffect(() => {
        if (data) {
            if (data.gameStatus === 'COMPLETED') {
                clearSession();
                navigate('/');
                return;
            }
            setSession(data);
        }
    }, [data]);

    useEffect(() => {
        if (isError) {
            clearSession();
            navigate('/');
        }
    }, [isError]);

    // Redirect based on current session status on every navigation
    useEffect(() => {
        // No localStorage — block /lobby and /game
        if (!stored) {
            if (location.pathname === '/lobby' || location.pathname === '/game') {
                navigate('/');
            }
            return;
        }

        // localStorage exists but session not yet resolved from backend — wait
        if (!session) return;

        if (session.gameStatus === 'COMPLETED') {
            clearSession();
            navigate('/');
            return;
        }

        const required = getRequiredPath(session.gameStatus);
        if (location.pathname !== required) {
            navigate(required);
        }
    }, [location.pathname, session, stored]);
};
