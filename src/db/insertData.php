<?php
// Ustawienie nagłówka odpowiedzi na JSON
header('Content-Type: application/json');

try {
    // Połączenie z bazą danych SQLite
    $db = new PDO('sqlite:C:/Users/Kapi/Desktop/studia/projekt platforma/app/data.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Dodanie przykładowych danych do tabeli game_telemetry
    $db->exec("INSERT INTO game_telemetry (connected, paused, game_name, game_time, time_scale, next_rest_stop_time, version, telemetry_plugin_version) 
               VALUES (1, 0, 'Euro Truck Simulator 2', '12:34:56', 1.0, '2025-03-17 14:00:00', '1.0', '2.5')");

    // Pobranie ID ostatnio dodanego rekordu w game_telemetry
    $gameTelemetryId = $db->lastInsertId();

    // Dodanie przykładowych danych do tabeli truck_telemetry
    $db->exec("INSERT INTO truck_telemetry (truck_id, truck_make, truck_model, truck_speed, gameSteer, userClutch, userBrake, userThrottle, shifterSlot, game_telemetry_id) 
               VALUES 
               ('TRK123', 'MAN', 'TGX', 80.5, -0.42, 0.0, 0.0, 0.17, 4, $gameTelemetryId),
               ('TRK124', 'Volvo', 'FH16', 65.0, 0.30, 1.0, 0.5, 0.8, 3, $gameTelemetryId)");

    // Jeśli zapytania zostały wykonane pomyślnie, zwróć odpowiedź JSON
    echo json_encode(['status' => 'success', 'message' => 'Dane zostały dodane do bazy danych.']);
} catch (PDOException $e) {
    // Obsługa błędów
    echo json_encode(['status' => 'error', 'message' => 'Błąd bazy danych: ' . $e->getMessage()]);
}
?>
