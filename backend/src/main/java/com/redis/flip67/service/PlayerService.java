package com.redis.flip67.service;

import com.redis.flip67.dto.PlayerDto;
import com.redis.flip67.model.Player;
import com.redis.flip67.repository.PlayerRepository;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.javassist.NotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PlayerService {

    private final PlayerRepository playerRepository;

    @Transactional
    public Player createPlayer(UUID gameId, String name, String avatar, boolean isHost) {
        Player player = Player.builder()
                .id(UUID.randomUUID())
                .gameId(gameId)
                .name(name)
                .avatar(avatar)
                .score(0)
                .isHost(isHost)
                .build();

        playerRepository.insertPlayer(player);

        return player;
    }

    @Transactional(readOnly = true)
    public Player getPlayerById(UUID playerId) throws NotFoundException {
        return playerRepository.getPlayerById(playerId)
                .orElseThrow(() -> new NotFoundException("Player not found"));
    }

    @Transactional(readOnly = true)
    public List<PlayerDto> getPlayersByGameId(UUID gameId) {
        return playerRepository.getPlayersByGameId(gameId).stream()
                .map(PlayerDto::from)
                .toList();
    }

    @Transactional
    public void scorePoints(UUID playerId, int points) {
        playerRepository.addScore(playerId, points);
    }

    @Transactional
    public void resetScores(UUID gameId) {
        playerRepository.resetScores(gameId);
    }

    @Transactional
    public void deletePlayer(UUID playerId) {
        playerRepository.deletePlayer(playerId);
    }

    @Transactional(readOnly = true)
    public int countByGameId(UUID gameId) {
        return playerRepository.countByGameId(gameId);
    }
}
