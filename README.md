# Aplikacja do zbierania i wyświetlania danych sprzętowych z platformy i czujników  
**Inżynierski Projekt Zespołowy 2024/25 – ZUT**

## Autorzy

- Damian Ratańczuk  
- Kacper Król

---

## Opis projektu

Aplikacja umożliwia zbieranie i wizualizację danych sprzętowych oraz pomiarów z czujników. Projekt został zrealizowany w ramach zajęć **Inżynierski Projekt Zespołowy** na Zachodniopomorskim Uniwersytecie Technologicznym w roku akademickim 2024/2025.

---

## Technologie

- [Electron.js](https://www.electronjs.org/)  
- [Node.js](https://nodejs.org/)  
- JavaScript 
- HTML/CSS
- Python
- PHP

---

## Wymagania systemowe

- Node.js (v18 lub wyższy)  
- npm (v9 lub wyższy)  
- System operacyjny: Windows / Linux / macOS
- PHP 8.4.8
- Python 3.13.5

---

## Instalacja i uruchomienie

1. Sklonuj repozytorium:
   ```bash
   git clone https://github.com/damian-utd/app.git
   cd nazwa-repozytorium
   ```

2. Zainstaluj [Node.js](https://nodejs.org/en/download/).  

3. Utwórz katalog projektu i zainicjalizuj npm:
   ```bash
   mkdir app
   cd app
   npm init -y
   ```

4. Zainstaluj Electron lokalnie:
   ```bash
   npm install electron --save-dev
   ```

5. Zainstaluj PHP oraz python

6. W /exports
   ```bash
   pip install pandas
   pip install matplotlib
   pip install seaborn
   pip install fpdf
   ```

8. Uruchom aplikację:
   ```bash
   npm start
   ```
---

## Działanie aplikacji w praktyce

Poniżej przedstawiono przykładowe ekrany prezentujące sposób działania aplikacji:

1. Rozpoczęcie testu
Ekran przedstawiający interfejs przed uruchomieniem testu.
![start_testu 1](https://github.com/user-attachments/assets/5e2d398f-a8e3-4f6c-bafc-6710c22f0d6e)


2. Test w trakcie działania
Widok aplikacji podczas zbierania danych z czujników.
![jazda 1](https://github.com/user-attachments/assets/b2806724-2e96-4323-b8f4-38ea18060a91)


3. Wygenerowany raport
Przykład automatycznie wygenerowanego raportu w formacie PDF.

   [2025-06-18_testdamian.pdf](https://github.com/user-attachments/files/20819367/2025-06-18_testdamian.pdf)

5. Komunikacja z aplikacją zespołu odpowiedzialnego za symulacje zmęczenia kierowcy
   
   ![wysylanie_do_drugiego_zespolu 1](https://github.com/user-attachments/assets/dcb89f91-3ca3-4395-b220-fa318870fad3)


---

## Kontakt

W razie pytań:  
📧 Damian Ratańczuk – `rd53964@zut.edu.pl`  
📧 Kacper Król – `kk53734@zut.edu.pl`
