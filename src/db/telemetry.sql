-- Tabela do przechowywania danych o grze
CREATE TABLE IF NOT EXISTS game_telemetry (
                                              id INTEGER PRIMARY KEY AUTOINCREMENT,
                                              connected BOOLEAN NOT NULL,
                                              paused BOOLEAN NOT NULL,
                                              game_name TEXT NOT NULL,
                                              game_time TEXT,
                                              time_scale REAL,
                                              next_rest_stop_time TEXT,
                                              version TEXT,
                                              telemetry_plugin_version TEXT,
                                              timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabela do przechowywania danych o ciężarówce
CREATE TABLE IF NOT EXISTS truck_telemetry (
                                               id INTEGER PRIMARY KEY AUTOINCREMENT,
                                               truck_id TEXT,
                                               truck_make TEXT,
                                               truck_model TEXT,
                                               truck_speed REAL,
                                               gameSteer REAL,         -- Kierowanie (-1 do 1)
                                               userClutch REAL,        -- Sprzęgło (-1 do 1)
                                               userBrake REAL,         -- Hamulec (-1 do 1)
                                               userThrottle REAL,      -- Gaz (-1 do 1)
                                               shifterSlot INTEGER,    -- Aktualny slot skrzyni biegów
                                               game_telemetry_id INTEGER,
                                               timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                                               FOREIGN KEY (game_telemetry_id) REFERENCES game_telemetry (id) ON DELETE CASCADE
);
