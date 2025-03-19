<?php

// Database connection
$db = new PDO('sqlite:telemetry.db');
$db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

// Function to fetch and insert telemetry data
function fetchAndStoreTelemetry($db) {
    $url = 'http://82.145.73.158:25555/api/ets2/telemetry';

    // Fetch data from the API
    $json = file_get_contents($url);
    if ($json === false) {
        echo "Failed to fetch data from API." . PHP_EOL;
        return;
    }

    $data = json_decode($json, true);
    if (json_last_error() !== JSON_ERROR_NONE) {
        echo "Invalid JSON format." . PHP_EOL;
        return;
    }

    // Insert game telemetry data
    $stmt = $db->prepare("INSERT INTO game_telemetry (connected, paused, game_name, game_time, time_scale, next_rest_stop_time, version, telemetry_plugin_version) 
                          VALUES (:connected, :paused, :game_name, :game_time, :time_scale, :next_rest_stop_time, :version, :telemetry_plugin_version)");
    $stmt->execute([
        ':connected' => $data['game']['connected'],
        ':paused' => $data['game']['paused'],
        ':game_name' => $data['game']['gameName'],
        ':game_time' => $data['game']['time'],
        ':time_scale' => $data['game']['timeScale'],
        ':next_rest_stop_time' => $data['game']['nextRestStopTime'],
        ':version' => $data['game']['version'],
        ':telemetry_plugin_version' => $data['game']['telemetryPluginVersion']
    ]);

    $gameTelemetryId = $db->lastInsertId();

    // Insert truck telemetry data
    $stmt = $db->prepare("INSERT INTO truck_telemetry (truck_id, truck_make, truck_model, truck_speed, gameSteer, userClutch, userBrake, userThrottle, shifterSlot, game_telemetry_id) 
                          VALUES (:truck_id, :truck_make, :truck_model, :truck_speed, :gameSteer, :userClutch, :userBrake, :userThrottle, :shifterSlot, :game_telemetry_id)");
    $stmt->execute([
        ':truck_id' => $data['truck']['id'],
        ':truck_make' => $data['truck']['make'],
        ':truck_model' => $data['truck']['model'],
        ':truck_speed' => $data['truck']['speed'],
        ':gameSteer' => $data['truck']['gameSteer'],
        ':userClutch' => $data['truck']['userClutch'],
        ':userBrake' => $data['truck']['userBrake'],
        ':userThrottle' => $data['truck']['userThrottle'],
        ':shifterSlot' => $data['truck']['shifterSlot'],
        ':game_telemetry_id' => $gameTelemetryId
    ]);

    echo "Telemetry data stored successfully." . PHP_EOL;
}

// Run the function every 10 seconds
while (true) {
    fetchAndStoreTelemetry($db);
    sleep(1);
}

?>
