package com.redis.flip67.model;

import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class Game {
    private UUID id;
    private String roomCode;
    private GameStatus gameStatus;
    private GameMode mode;
}
