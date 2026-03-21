package com.redis.flip67.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Player {
    private UUID id;
    private UUID gameId;
    private String name;
    private String avatar;
    private Integer score;
    private boolean isHost;
}
