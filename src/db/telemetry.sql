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

-- Tabela urządzeń (adresy urządzeń, jeden wpis na każde urządzenie)
CREATE TABLE IF NOT EXISTS device (
                                      id INTEGER PRIMARY KEY AUTOINCREMENT,
                                      device_address TEXT UNIQUE NOT NULL
);

-- Tabela połączeń urządzeń (czy się połączyło, kiedy itd.)
CREATE TABLE IF NOT EXISTS device_connection (
                                                 id INTEGER PRIMARY KEY AUTOINCREMENT,
                                                 device_id INTEGER NOT NULL,
                                                 did_connect BOOLEAN NOT NULL,
                                                 timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                                                 FOREIGN KEY (device_id) REFERENCES device(id) ON DELETE CASCADE
);

-- Tabela pomiarów (np. tętno, poziom baterii)
CREATE TABLE IF NOT EXISTS device_metrics (
                                              id INTEGER PRIMARY KEY AUTOINCREMENT,
                                              device_id INTEGER NOT NULL,
                                              battery_level INTEGER,
                                              heart_rate INTEGER,
                                              timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
                                              FOREIGN KEY (device_id) REFERENCES device(id) ON DELETE CASCADE
);
