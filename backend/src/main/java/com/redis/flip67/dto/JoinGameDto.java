package com.redis.flip67.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class JoinGameDto {
    private String playerName;
    private String playerAvatar;
    private String roomCode;
}
