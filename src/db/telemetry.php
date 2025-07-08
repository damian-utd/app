<?php

// Database connection
try {
    $path = __DIR__ . '/data.db'; // bierze aktualny folder tego skryptu
    $db = new PDO("sqlite:$path");
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Czyszczenie tabel na starcie
    $db->exec("DELETE FROM truck_telemetry");
    $db->exec("DELETE FROM game_telemetry");
    echo "Tabele wyczyszczone." . PHP_EOL;

} catch (PDOException $e) {
    die("Database connection failed: " . $e->getMessage() . PHP_EOL);
}

// Function to fetch and insert telemetry data
function fetchAndStoreTelemetry($db) {
//     $url = 'http://192.168.56.1:25555/api/ets2/telemetry';
    $url = 'http://82.145.73.127:25555/api/ets2/telemetry';

    // Fetch data from the API
    $json = @file_get_contents($url);
    if ($json === false) {
        echo "Failed to fetch data from API." . PHP_EOL;
        return;
    }

    $data = json_decode($json, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo "Invalid JSON format." . PHP_EOL;
        return;
    }

    // Check if necessary keys exist
    if (!isset($data['game']) || !isset($data['truck'])) {
        echo "Missing expected data fields." . PHP_EOL;
        return;
    }

    try {
        // Insert game telemetry data
        $stmt = $db->prepare("INSERT INTO game_telemetry (connected, paused, game_name, game_time, time_scale, next_rest_stop_time, version, telemetry_plugin_version) 
                              VALUES (:connected, :paused, :game_name, :game_time, :time_scale, :next_rest_stop_time, :version, :telemetry_plugin_version)");
        $stmt->execute([
            ':connected' => isset($data['game']['connected']) ? $data['game']['connected'] : 0,
            ':paused' => isset($data['game']['paused']) ? $data['game']['paused'] : 0,
            ':game_name' => isset($data['game']['gameName']) ? $data['game']['gameName'] : 'Unknown',
            ':game_time' => isset($data['game']['time']) ? $data['game']['time'] : null,
            ':time_scale' => isset($data['game']['timeScale']) ? $data['game']['timeScale'] : null,
            ':next_rest_stop_time' => isset($data['game']['nextRestStopTime']) ? $data['game']['nextRestStopTime'] : null,
            ':version' => isset($data['game']['version']) ? $data['game']['version'] : 'Unknown',
            ':telemetry_plugin_version' => isset($data['game']['telemetryPluginVersion']) ? $data['game']['telemetryPluginVersion'] : 'Unknown'
        ]);

        $gameTelemetryId = $db->lastInsertId();

        // Insert truck telemetry data
        $stmt = $db->prepare("INSERT INTO truck_telemetry (truck_id, truck_make, truck_model, truck_speed, gameSteer, userClutch, userBrake, userThrottle, shifterSlot, game_telemetry_id) 
                              VALUES (:truck_id, :truck_make, :truck_model, :truck_speed, :gameSteer, :userClutch, :userBrake, :userThrottle, :shifterSlot, :game_telemetry_id)");
        $stmt->execute([
            ':truck_id' => isset($data['truck']['id']) ? $data['truck']['id'] : 'Unknown',
            ':truck_make' => isset($data['truck']['make']) ? $data['truck']['make'] : 'Unknown',
            ':truck_model' => isset($data['truck']['model']) ? $data['truck']['model'] : 'Unknown',
            ':truck_speed' => isset($data['truck']['speed']) ? $data['truck']['speed'] : 0,
            ':gameSteer' => isset($data['truck']['gameSteer']) ? $data['truck']['gameSteer'] : 0,
            ':userClutch' => isset($data['truck']['userClutch']) ? $data['truck']['userClutch'] : 0,
            ':userBrake' => isset($data['truck']['userBrake']) ? $data['truck']['userBrake'] : 0,
            ':userThrottle' => isset($data['truck']['userThrottle']) ? $data['truck']['userThrottle'] : 0,
            ':shifterSlot' => isset($data['truck']['shifterSlot']) ? $data['truck']['shifterSlot'] : 0,
            ':game_telemetry_id' => $gameTelemetryId
        ]);

        echo "Telemetry data stored successfully." . PHP_EOL;
    } catch (PDOException $e) {
        echo "Database error: " . $e->getMessage() . PHP_EOL;
    }
}

// Run the function every 10 seconds
while (true) {
    fetchAndStoreTelemetry($db);
    sleep(1);
}

?>
