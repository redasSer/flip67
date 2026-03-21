package com.redis.flip67.repository;

import com.redis.flip67.model.Game;
import com.redis.flip67.model.GameStatus;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Mapper
@Repository
public interface GameRepository {

    @Select("SELECT id, room_code, game_status, mode FROM games WHERE id = #{id}")
    Optional<Game> getById(@Param("id") UUID id);

    @Select("SELECT id, room_code, game_status, mode FROM games WHERE room_code = #{roomCode}")
    Optional<Game> getByRoomCode(@Param("roomCode") String roomCode);

    @Insert("INSERT INTO games (id, room_code, game_status, mode) VALUES (#{id}, #{roomCode}, #{gameStatus}, #{mode})")
    void insert(Game game);

    @Update("UPDATE games SET game_status = #{status} WHERE id = #{id}")
    void updateStatusById(@Param("id") UUID id, @Param("status") GameStatus status);

    @Select("SELECT EXISTS(SELECT 1 FROM games WHERE room_code = #{roomCode} AND game_status != 'COMPLETED')")
    boolean roomCodeExists(@Param("roomCode") String roomCode);
}
