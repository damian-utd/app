<?php
while (true) {
    $jsonPath = __DIR__ . '/aidmed.json';

    if (!file_exists($jsonPath)) {
        echo "Plik JSON nie istnieje.\n";
        sleep(5);
        continue;
    }

    $json = file_get_contents($jsonPath);
    $data = json_decode($json, true);

    if (!$data || !isset($data['deviceAddress'])) {
        echo "Nieprawidłowy JSON.\n";
        sleep(5);
        continue;
    }

    try {
        $db = new PDO('sqlite:' . __DIR__ . '/telemetry.db');
        $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $deviceAddress = $data['deviceAddress'];
        $stmt = $db->prepare("SELECT id FROM device WHERE device_address = ?");
        $stmt->execute([$deviceAddress]);
        $device = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$device) {
            $stmt = $db->prepare("INSERT INTO device (device_address) VALUES (?)");
            $stmt->execute([$deviceAddress]);
            $deviceId = $db->lastInsertId();
        } else {
            $deviceId = $device['id'];
        }

        $stmt = $db->prepare("INSERT INTO device_connection (device_id, did_connect, timestamp)
                              VALUES (?, ?, datetime('now'))");
        $stmt->execute([$deviceId, $data['didConnect']]);

        $stmt = $db->prepare("INSERT INTO device_metrics (device_id, battery_level, heart_rate, timestamp)
                              VALUES (?, ?, ?, datetime('now'))");
        $stmt->execute([$deviceId, $data['batteryLevel'], $data['heartRate']]);

        echo "Dane zapisane poprawnie.\n";

    } catch (PDOException $e) {
        echo "Błąd DB: " . $e->getMessage() . "\n";
    }

    sleep(5);  // odczekaj 5 sekund przed kolejnym odczytem
}
