package com.redis.flip67.dto;

import com.redis.flip67.model.Game;
import com.redis.flip67.model.GameStatus;
import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class GameStateEvent {
    private GameStatus gameStatus;
    private List<PlayerDto> players;

    public static GameStateEvent from(Game game, List<PlayerDto> players) {
        return GameStateEvent.builder()
                .gameStatus(game.getGameStatus())
                .players(players)
                .build();
    }
}

