CREATE TABLE players (
    id      UUID PRIMARY KEY,
    game_id UUID         NOT NULL,
    name    VARCHAR(255) NOT NULL,
    avatar  VARCHAR(1) NOT NULL ,
    score   INTEGER      NOT NULL DEFAULT 0
);

