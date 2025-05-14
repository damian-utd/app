<?php
header('Content-Type: application/json');
header('Cache-Control: no-cache, must-revalidate');

try {
    $db = new PDO('sqlite:C:/Users/Kapi/Desktop/studia/projekt platforma/app/data.db');
    $db->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    $stmt = $db->query("SELECT * FROM truck_telemetry ORDER BY timestamp DESC LIMIT 1");
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if (!$data) {
        echo json_encode(['error' => 'No telemetry data found']);
        exit;
    }

    echo json_encode($data);
} catch (PDOException $e) {
    echo json_encode(['error' => $e->getMessage()]);
}
?>
