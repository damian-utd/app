<?php
// Ustawienie nagłówka odpowiedzi na JSON
header('Content-Type: application/json');

// Połączenie z bazą danych SQLite
try {
    // Poprawiona ścieżka do bazy danych
    $db = new PDO('sqlite:' . __DIR__ . '/../../data.db');  // Zmieniamy na odpowiednią ścieżkę
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Zapytanie do bazy danych, które pobiera dane o grze oraz ciężarówce
    $query = "
        SELECT g.timestamp, g.game_name, g.game_time, g.time_scale, g.next_rest_stop_time, g.version, g.telemetry_plugin_version,
               t.truck_id, t.truck_make, t.truck_model, t.truck_speed, t.game_throttle, t.wear_wheels, t.shifter_slot
        FROM game_telemetry g
        INNER JOIN truck_telemetry t ON g.id = t.game_telemetry_id
        ORDER BY g.timestamp DESC
        LIMIT 1;  // Pobieramy tylko najnowszy wpis
    ";

    $stmt = $db->query($query);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($data) {
        // Zwracamy dane w formacie JSON, w tym nowe pola
        echo json_encode([
            'timestamp' => $data['timestamp'],
            'game_name' => $data['game_name'],
            'game_time' => $data['game_time'],
            'time_scale' => $data['time_scale'],
            'next_rest_stop_time' => $data['next_rest_stop_time'],
            'version' => $data['version'],
            'telemetry_plugin_version' => $data['telemetry_plugin_version'],
            'truck_id' => $data['truck_id'],
            'truck_make' => $data['truck_make'],
            'truck_model' => $data['truck_model'],
            'truck_speed' => $data['truck_speed'],
            'game_throttle' => $data['game_throttle'],  // Nowe pole
            'wear_wheels' => $data['wear_wheels'],      // Nowe pole
            'shifter_slot' => $data['shifter_slot'],    // Nowe pole
            'status' => [
                'connected' => true,
                'errors' => []
            ]
        ]);
    } else {
        // Jeśli nie ma danych, zwrócimy komunikat o błędzie
        echo json_encode(['error' => 'No data available']);
    }

} catch (PDOException $e) {
    // W przypadku błędu w bazie danych, zwrócimy komunikat o błędzie
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
}
?>
