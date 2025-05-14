async function fetchTelemetryData() {
    try {
        let response = await fetch('/src/db/getTelemetry.php'); // Pobieramy dane
        let text = await response.text(); // Pobieramy jako tekst (do debugowania)

        try {
            let data = JSON.parse(text); // Sprawdzamy poprawność JSON-a

            if (data.error) {
                console.error("Database error:", data.error);
                document.getElementById('liveData').innerText = "Error fetching data.";
                return;
            }

            // Jeśli brak danych, wyświetlamy komunikat
            if (!data.truck_make || !data.truck_model) {
                document.getElementById('liveData').innerText = "No telemetry data available.";
                return;
            }

            // Aktualizacja zawartości HTML
            document.getElementById('liveData').innerHTML = `
                <p><strong>Truck:</strong> ${data.truck_make} ${data.truck_model}</p>
                <p><strong>Speed:</strong> ${data.truck_speed} km/h</p>
                <p><strong>Steer:</strong> ${data.gameSteer}</p>
                <p><strong>Throttle:</strong> ${data.userThrottle}</p>
                <p><strong>Brake:</strong> ${data.userBrake}</p>
                <p><strong>Clutch:</strong> ${data.userClutch}</p>
                <p><strong>Timestamp:</strong> ${data.timestamp}</p>
            `;
        } catch (jsonError) {
            console.error("Invalid JSON response:", text);
            document.getElementById('liveData').innerText = "Invalid JSON data received.";
        }
    } catch (error) {
        console.error("Fetch error:", error);
        document.getElementById('liveData').innerText = "Failed to load telemetry data.";
    }
}

// 🔁 Pobieranie danych co 1 sekundę
setInterval(fetchTelemetryData, 1000);
fetchTelemetryData(); // Pierwsze pobranie danych
