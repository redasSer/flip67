package com.redis.flip67.service;

import com.redis.flip67.controller.GameWebSocketController;
import com.redis.flip67.dto.CreateGameDto;
import com.redis.flip67.dto.GameSession;
import com.redis.flip67.dto.JoinGameDto;
import com.redis.flip67.dto.ScorePointsRequest;
import com.redis.flip67.model.Game;
import com.redis.flip67.model.GameStatus;
import com.redis.flip67.model.Player;
import com.redis.flip67.repository.GameRepository;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.javassist.NotFoundException;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Service
@RequiredArgsConstructor
public class GameService {

    private final PlayerService playerService;
    private final GameRepository gameRepository;
    @Lazy
    private final GameWebSocketController gameWebSocketController;

    private final ConcurrentHashMap<UUID, Object> gameLocks = new ConcurrentHashMap<>();

    @Transactional
    public GameSession createNewGame(CreateGameDto createGameDto) {
        String roomCode = generateRoomCode();

        if (gameRepository.roomCodeExists(roomCode)) {
            throw new RuntimeException("Room code already exists");
        }

        Game game = Game.builder()
            .id(UUID.randomUUID())
            .roomCode(roomCode)
            .gameStatus(GameStatus.WAITING_FOR_PLAYERS)
            .mode(createGameDto.getMode())
            .build();
        gameRepository.insert(game);

        Player player = playerService.createPlayer(
            game.getId(),
            createGameDto.getPlayerName(),
            createGameDto.getPlayerAvatar(),
            true
        );

        broadcast(game.getId());
        return GameSession.from(game, player);
    }

    @Transactional(readOnly = true)
    public GameSession getGameSession(UUID gameId, UUID playerId) throws NotFoundException {
        Game game = gameRepository.getById(gameId)
                .orElseThrow(() -> new NotFoundException("Game not found"));

        Player player = playerService.getPlayerById(playerId);

        return GameSession.from(game, player);
    }

    @Transactional
    public GameSession joinGame(JoinGameDto joinGameDto) {
        Game game = gameRepository.getByRoomCode(joinGameDto.getRoomCode())
                .orElseThrow(() -> new RuntimeException("Game not found"));

        Player player = playerService.createPlayer(
                game.getId(),
                joinGameDto.getPlayerName(),
                joinGameDto.getPlayerAvatar(),
                false
        );

        broadcast(game.getId());
        return GameSession.from(game, player);
    }

    @Transactional
    public void startGame(UUID gameId) {
        gameRepository.updateStatusById(gameId, GameStatus.IN_PROGRESS);
        broadcast(gameId);
    }

    @Transactional
    public void leaveGame(UUID gameId, UUID playerId) {
        playerService.deletePlayer(playerId);

        if (playerService.countByGameId(gameId) == 0) {
            gameRepository.updateStatusById(gameId, GameStatus.COMPLETED);
        }

        broadcast(gameId);
    }

    @Transactional
    public void resetGame(UUID gameId) {
        playerService.resetScores(gameId);
        broadcast(gameId);
    }

    @Transactional(readOnly = true)
    public boolean gameExists(String roomCode) {
        return gameRepository.roomCodeExists(roomCode);
    }

    @Transactional
    public void scorePointsForPlayer(ScorePointsRequest request) {
        UUID gameId = request.getGameId();
        Object lock = gameLocks.computeIfAbsent(gameId, id -> new Object());
        synchronized (lock) {
            playerService.scorePoints(request.getPlayerId(), request.getPoints());
            broadcast(gameId);
        }
    }

    private void broadcast(UUID gameId) {
        try {
            gameWebSocketController.broadcastGameState(gameId);
        } catch (NotFoundException ignored) {}
    }

    private String generateRoomCode() {
        String roomCode = "";
        for (int i = 0; i < 4; i++) {
            roomCode += (int) (Math.random() * 10);
        }

        return roomCode;
    }
}
