package com.redis.flip67.controller;

import com.redis.flip67.dto.GameStateEvent;
import com.redis.flip67.model.Game;
import com.redis.flip67.repository.GameRepository;
import com.redis.flip67.service.PlayerService;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.javassist.NotFoundException;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.util.UUID;

@Controller
@RequiredArgsConstructor
public class GameWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;
    private final GameRepository gameRepository;
    private final PlayerService playerService;

    /**
     * Client sends to /app/game/{gameId}/state to request the current state.
     * Useful on reconnect.
     */
    @MessageMapping("/game/{gameId}/state")
    public void requestGameState(@DestinationVariable UUID gameId) throws NotFoundException {
        broadcastGameState(gameId);
    }

    /**
     * Broadcasts the full game state to /topic/game/{gameId}.
     * Called by services after any mutation (join, start, score).
     */
    public void broadcastGameState(UUID gameId) throws NotFoundException {
        Game game = gameRepository.getById(gameId)
                .orElseThrow(() -> new NotFoundException("Game not found: " + gameId));

        GameStateEvent event = GameStateEvent.from(game, playerService.getPlayersByGameId(gameId));

        messagingTemplate.convertAndSend("/topic/game/" + gameId, event);
    }
}

