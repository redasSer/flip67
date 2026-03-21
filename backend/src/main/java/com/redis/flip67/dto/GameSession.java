package com.redis.flip67.dto;

import com.redis.flip67.model.Game;
import com.redis.flip67.model.GameMode;
import com.redis.flip67.model.GameStatus;
import com.redis.flip67.model.Player;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class GameSession {
    private UUID gameId;
    private String roomCode;
    private UUID playerId;
    private String playerName;
    private String playerAvatar;
    private boolean isHost;
    private GameStatus gameStatus;
    private GameMode mode;

    public static GameSession from(Game game, Player player) {
        return GameSession.builder()
                .gameId(game.getId())
                .roomCode(game.getRoomCode())
                .playerId(player.getId())
                .playerName(player.getName())
                .playerAvatar(player.getAvatar())
                .isHost(player.isHost())
                .gameStatus(game.getGameStatus())
                .mode(game.getMode())
                .build();
    }
}
