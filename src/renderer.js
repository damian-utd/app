// Pobieramy wszystkie elementy o klasie "card"
const cards = document.getElementsByClassName("card");

// Iterujemy po kolekcji i dodajemy nasłuchiwacz zdarzeń dla każdego elementu
Array.from(cards).forEach(card => {
    card.addEventListener("click", function () {
        // Pobieramy ID klikniętej karty
        const cardId = card.id;

        switch (cardId) {
            case 'main-report':
                document.getElementById(cardId).addEventListener('click', () => {
                    window.electronAPI.send('change-page', `/sub/mainReport.html`);
                });
                break;
            case 'short-report':
                break;
            case 'test-settings':

                break;
            case 'general-settings':

                break;
            default:
                alert("Nieznana karta");
                break;
        }
    });
});
