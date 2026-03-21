package com.redis.flip67.dto;

import com.redis.flip67.model.GameMode;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CreateGameDto {
    private String playerName;
    private String playerAvatar;
    private GameMode mode;
}
