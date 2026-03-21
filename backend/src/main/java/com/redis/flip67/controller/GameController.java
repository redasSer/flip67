package com.redis.flip67.controller;

import com.redis.flip67.dto.*;
import com.redis.flip67.service.GameService;
import com.redis.flip67.service.PlayerService;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.javassist.NotFoundException;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/game")
public class GameController {

    private final GameService gameService;
    private final PlayerService playerService;

    @PostMapping("/create")
    public GameSession createNewGame(@RequestBody CreateGameDto createGameDto) {
        return gameService.createNewGame(createGameDto);
    }

    @PostMapping("/join")
    public GameSession joinGame(@RequestBody JoinGameDto joinGameDto) {
        return gameService.joinGame(joinGameDto);
    }

    @GetMapping("/exists/{roomCode}")
    public ResponseEntity<Void> gameExists(@PathVariable("roomCode") String roomCode) {
        return gameService.gameExists(roomCode)
                ? ResponseEntity.ok().build()
                : ResponseEntity.notFound().build();
    }

    @GetMapping("/{gameId}/player/{playerId}")
    public GameSession getGameSession(@PathVariable("gameId") UUID gameId,
                                      @PathVariable("playerId") UUID playerId) throws NotFoundException {
        return gameService.getGameSession(gameId, playerId);
    }

    @GetMapping("/{gameId}/players")
    public List<PlayerDto> getPlayers(@PathVariable("gameId") UUID gameId) {
        return playerService.getPlayersByGameId(gameId);
    }

    @PostMapping("/{gameId}/start")
    public ResponseEntity<Void> startGame(@PathVariable("gameId") UUID gameId) {
        gameService.startGame(gameId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/score")
    public ResponseEntity<Void> scorePoints(@RequestBody ScorePointsRequest request) {
        gameService.scorePointsForPlayer(request);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{gameId}/player/{playerId}/leave")
    public ResponseEntity<Void> leaveGame(@PathVariable("gameId") UUID gameId,
                                          @PathVariable("playerId") UUID playerId) {
        gameService.leaveGame(gameId, playerId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{gameId}/reset")
    public ResponseEntity<Void> resetGame(@PathVariable("gameId") UUID gameId) {
        gameService.resetGame(gameId);
        return ResponseEntity.ok().build();
    }
}
