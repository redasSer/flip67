CREATE TABLE games (
    id          UUID PRIMARY KEY,
    room_code   VARCHAR(10)  NOT NULL UNIQUE,
    game_status VARCHAR(50)  NOT NULL
);

