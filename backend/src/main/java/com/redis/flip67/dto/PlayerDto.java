package com.redis.flip67.dto;

import com.redis.flip67.model.Player;
import lombok.Builder;
import lombok.Data;

import java.util.UUID;

@Data
@Builder
public class PlayerDto {
    private UUID id;
    private String name;
    private String avatar;
    private Integer score;
    private boolean isHost;

    public static PlayerDto from(Player player) {
        return PlayerDto.builder()
                .id(player.getId())
                .name(player.getName())
                .avatar(player.getAvatar())
                .score(player.getScore())
                .isHost(player.isHost())
                .build();
    }
}
