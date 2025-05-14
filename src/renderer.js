document.addEventListener("DOMContentLoaded", () => {
    // Pobieramy wszystkie elementy o klasie "card"
    const cards = document.getElementsByClassName("menu-cards");

// Iterujemy po kolekcji i dodajemy nasłuchiwacz zdarzeń dla każdego elementu
    Array.from(cards).forEach(card => {
        card.addEventListener("click", function () {
            // Pobieramy ID klikniętej karty
            const cardId = card.id;

            switch (cardId) {
                case 'menu-main-report':
                    window.electronAPI.send('change-page', `/sub/mainReport.html`);
                    break;
                case 'menu-short-report':
                    window.electronAPI.send('change-page', `/sub/shortReport.html`);
                    break;
                case 'menu-test-settings':
                    window.electronAPI.send('change-page', `/sub/testSettings.html`);
                    break;
                case 'menu-general-settings':
                    window.electronAPI.send('change-page', `/sub/generalSettings.html`);
                    break;
                case 'menu-main-site':
                    window.electronAPI.send('change-page', `/index.html`);
                    break;
                default:
                    alert("Nieznana karta");
                    break;
            }
        });
    });
});

{
    // załadowanie kamerki na małe okno
    const game = document.getElementById('sub-camera');

    // Uzyskiwanie dostępu do kamerki
    navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            game.srcObject = stream;
        })
        .catch(error => {
            console.error('Błąd podczas uzyskiwania dostępu do kamerki:', error);
        });
}

window.addEventListener('DOMContentLoaded', () => {
    console.log("Kod renderer.js uruchomiony!");

    (async () => {
        try {
            // Pobierz ID okna, które chcemy przechwycić
            const sourceId = await window.electronAPI.getWindowSources();
            console.log('Wybrane okno gry ID:', sourceId);

            // Uzyskaj strumień wideo z tego okna
            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: sourceId
                    }
                }
            });

            // Znajdź element <video> na stronie
            const videoElement = document.getElementById('main-camera');

            // Przypisz strumień wideo do tagu <video>
            videoElement.srcObject = stream;
            videoElement.play();  // Uruchom odtwarzanie wideo

        } catch (error) {
            console.error('Błąd przechwytywania strumienia:', error);
        }
    })();
});

function swapVideoStreams() {
    const mainCamera = document.getElementById('main-camera');
    const subCamera = document.getElementById('sub-camera');

    // Zapamiętaj obecne strumienie
    const mainStream = mainCamera.srcObject;
    const subStream = subCamera.srcObject;

    // Zamień strumienie
    mainCamera.srcObject = subStream;
    subCamera.srcObject = mainStream;

    // Zamień style transform
    const mainTransform = mainCamera.style.transform;
    const subTransform = subCamera.style.transform;

    mainCamera.style.transform = subTransform;
    subCamera.style.transform = mainTransform;
}


// Przykład użycia: podpięcie pod przycisk
document.getElementById('sub-camera').addEventListener('click', swapVideoStreams);



