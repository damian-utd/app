<?php
// Ścieżka do pliku CSV na serwerze
$exportDir = __DIR__ . '/../../exports';
$filename = 'telemetry_data.csv';
$filepath = $exportDir . '/' . $filename;

try {
    $db = new PDO('sqlite:' . __DIR__ . '/data.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Pobierz dane
    $query = "
        SELECT
            g.timestamp,
            g.game_name,
            g.game_time,
            g.version,
            t.truck_id,
            t.truck_make,
            t.truck_model,
            t.truck_speed,
            t.userThrottle,
            t.userBrake,
            t.userClutch,
            t.shifterSlot
        FROM game_telemetry g
        INNER JOIN truck_telemetry t ON g.id = t.game_telemetry_id
        ORDER BY g.timestamp DESC
        LIMIT 100
    ";

    $stmt = $db->query($query);
    $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

    // Upewnij się, że folder istnieje
    if (!is_dir($exportDir)) {
        mkdir($exportDir, 0777, true);
    }

    // Otwórz plik do zapisu
    $file = fopen($filepath, 'w');

    if ($rows && count($rows)) {
        // Nagłówki
        fputcsv($file, array_keys($rows[0]));

        // Wiersze danych
        foreach ($rows as $row) {
            fputcsv($file, $row);
        }

        echo "CSV zapisany jako: $filepath";
    } else {
        fputcsv($file, ['Brak danych do zapisania.']);
        echo "Brak danych do zapisania.";
    }

    fclose($file);

} catch (PDOException $e) {
    echo "Blad bazy danych: " . $e->getMessage();
}
?>
