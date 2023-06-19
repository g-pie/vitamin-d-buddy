PRAGMA foreign_keys = ON;

CREATE TABLE players(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(20) NOT NULL,
    email VARCHAR(40),
    password VARCHAR(256)
    -- created DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- CREATE TABLE users(
--   username VARCHAR(20) NOT NULL,
--   fullname VARCHAR(40) NOT NULL,
--   email VARCHAR(40) NOT NULL,
--   filename VARCHAR(64) NOT NULL,
--   password VARCHAR(256) NOT NULL,
--   created DATETIME DEFAULT CURRENT_TIMESTAMP,
--   PRIMARY KEY(username)
-- );

CREATE TABLE puffles(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    playerid INTEGER NOT NULL,
    puffleName VARCHAR(50) DEFAULT 'Buddy',
    bodyColor VARCHAR(50) NOT NULL,
    eyeColor VARCHAR(50) DEFAULT 'blk',
    glasses VARCHAR(50),
    hat VARCHAR(50),
    FOREIGN KEY (playerid)
        REFERENCES players
        ON DELETE CASCADE
);

-- Pregenerated tasks, only hardcoded tasks
CREATE TABLE tasks(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(255) NOT NULL,
    pointVal INTEGER NOT NULL
);

-- Tasks for each player, including hardcoded
CREATE TABLE playersTasks(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    taskid INTEGER,
    playerid INTEGER NOT NULL,
    status INTEGER NOT NULL,
    FOREIGN KEY (taskid)
        REFERENCES tasks
        ON DELETE CASCADE
    FOREIGN KEY (playerid)
        REFERENCES players
        ON DELETE CASCADE  
);

CREATE TABLE leaderboard(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    playerid INTEGER NOT NULL,
    score INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    FOREIGN KEY (playerid)
        REFERENCES players
        ON DELETE CASCADE
);

-- CREATE TABLE posts(
--   postid INTEGER PRIMARY KEY AUTOINCREMENT,
--   filename VARCHAR(64) NOT NULL,
--   owner VARCHAR(20) NOT NULL,
--   created DATETIME DEFAULT CURRENT_TIMESTAMP,
--   FOREIGN KEY (owner)
--     REFERENCES users
--     ON DELETE CASCADE
-- );

-- CREATE TABLE following(
--   username1 VARCHAR(20) NOT NULL,
--   username2 VARCHAR(20) NOT NULL,
--   created DATETIME DEFAULT CURRENT_TIMESTAMP,
--   FOREIGN KEY (username1)
--     REFERENCES users
--     ON DELETE CASCADE,
--   FOREIGN KEY (username2)
--     REFERENCES users
--     ON DELETE CASCADE,
--   PRIMARY KEY (username1, username2)
-- );
