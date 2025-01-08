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
