import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { GameMode, GameSession, GameStatus, PlayerDto } from '@/types/api';

export const SESSION_STORAGE_KEY = 'flip67_session';

interface GameStore {
    session: GameSession | null;
    setSession: (session: GameSession) => void;
    clearSession: () => void;

    players: PlayerDto[];
    setPlayers: (players: PlayerDto[]) => void;

    gameStatus: GameStatus | null;
    setGameStatus: (status: GameStatus) => void;

    mode: GameMode;
}

const useGameStore = create<GameStore>()(
    devtools((set) => ({
        session: null,
        setSession: (session) => {
            localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify({
                gameId: session.gameId,
                playerId: session.playerId,
            }));
            set({ session, gameStatus: session.gameStatus, mode: session.mode ?? 'CLASSIC' });
        },
        clearSession: () => {
            localStorage.removeItem(SESSION_STORAGE_KEY);
            set({ session: null, players: [], gameStatus: null, mode: 'CLASSIC' });
        },

        players: [],
        setPlayers: (players) => set({ players }),

        gameStatus: null,
        setGameStatus: (gameStatus) =>
            set((state) => ({
                gameStatus,
                session: state.session ? { ...state.session, gameStatus } : null,
            })),

        mode: 'CLASSIC',
    }))
);

export default useGameStore;
