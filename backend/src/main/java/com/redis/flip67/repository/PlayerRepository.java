package com.redis.flip67.repository;

import com.redis.flip67.model.Player;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Mapper
@Repository
public interface PlayerRepository {
    @Insert("""
       INSERT INTO players (id, game_id, name, avatar, score, is_host)
       VALUES (#{id}, #{gameId}, #{name}, #{avatar}, #{score}, #{isHost})
    """)
    void insertPlayer(Player player);

    @Select("""
        SELECT id, game_id, name, avatar, score, is_host
        FROM players
        WHERE id = #{id}
    """)
    Optional<Player> getPlayerById(@Param("id") UUID id);

     @Select("""
         SELECT id, game_id, name, avatar, score, is_host
         FROM players
         WHERE game_id = #{gameId}
     """)
     List<Player> getPlayersByGameId(@Param("gameId") UUID gameId);

    @Update("UPDATE players SET score = score + #{points} WHERE id = #{id}")
    void addScore(@Param("id") UUID id, @Param("points") int points);

    @Update("UPDATE players SET score = 0 WHERE game_id = #{gameId}")
    void resetScores(@Param("gameId") UUID gameId);

    @Delete("DELETE FROM players WHERE id = #{id}")
    void deletePlayer(@Param("id") UUID id);

    @Select("SELECT COUNT(*) FROM players WHERE game_id = #{gameId}")
    int countByGameId(@Param("gameId") UUID gameId);
}
