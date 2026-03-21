import apiClient from './client';
import type { CreateGameDto, JoinGameDto, GameSession, PlayerDto } from '@/types/api';

export const createGame = async (dto: CreateGameDto): Promise<GameSession> => {
    const { data } = await apiClient.post<GameSession>('/api/game/create', dto);
    return data;
};

export const joinGame = async (dto: JoinGameDto): Promise<GameSession> => {
    const { data } = await apiClient.post<GameSession>('/api/game/join', dto);
    return data;
};

export const checkGameExists = async (roomCode: string): Promise<boolean> => {
    try {
        await apiClient.get(`/api/game/exists/${roomCode}`);
        return true;
    } catch {
        return false;
    }
};

export const getSession = async (gameId: string, playerId: string): Promise<GameSession> => {
    const { data } = await apiClient.get<GameSession>(`/api/game/${gameId}/player/${playerId}`);
    return data;
};

export const getPlayers = async (gameId: string): Promise<PlayerDto[]> => {
    const { data } = await apiClient.get<PlayerDto[]>(`/api/game/${gameId}/players`);
    return data;
};

export const leaveGame = async (gameId: string, playerId: string): Promise<void> => {
    await apiClient.post(`/api/game/${gameId}/player/${playerId}/leave`);
};

export const startGame = async (gameId: string): Promise<void> => {
    await apiClient.post(`/api/game/${gameId}/start`);
};

export const scorePoints = async (gameId: string, playerId: string, points: number): Promise<void> => {
    await apiClient.post('/api/game/score', { gameId, playerId, points });
};

export const resetGame = async (gameId: string): Promise<void> => {
    await apiClient.post(`/api/game/${gameId}/reset`);
};
