export type GameMode = 'CLASSIC' | 'VENGEANCE';

export interface CreateGameDto {
    playerName: string;
    playerAvatar: string;
    mode?: GameMode;
}

export interface JoinGameDto {
    playerName: string;
    playerAvatar: string;
    roomCode: string;
}

export interface GameSession {
    gameId: string;
    roomCode: string;
    playerId: string;
    playerName: string;
    playerAvatar: string;
    host: boolean;
    gameStatus: GameStatus;
    mode: GameMode;
}

export type GameStatus = 'WAITING_FOR_PLAYERS' | 'IN_PROGRESS' | 'COMPLETED';

export interface PlayerDto {
    id: string;
    name: string;
    avatar: string;
    score: number;
    host: boolean;
}

export interface GameStateEvent {
    gameStatus: GameStatus;
    players: PlayerDto[];
}