import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from fpdf import FPDF
import os
import sys

# Funkcja do zamiany polskich znaków na ASCII
def remove_polish_chars(text):
    replacements = {
        'ą': 'a', 'ć': 'c', 'ę': 'e', 'ł': 'l',
        'ń': 'n', 'ó': 'o', 'ś': 's', 'ź': 'z',
        'ż': 'z', 'Ą': 'A', 'Ć': 'C', 'Ę': 'E',
        'Ł': 'L', 'Ń': 'N', 'Ó': 'O', 'Ś': 'S',
        'Ź': 'Z', 'Ż': 'Z'
    }
    for pl_char, ascii_char in replacements.items():
        text = text.replace(pl_char, ascii_char)
    return text

# Wczytaj dane
base_path = os.path.dirname(__file__)
csv_path = os.path.join(base_path, "telemetry_data.csv")

userData = sys.argv[1:]
studentName = userData[0]
testName = userData[1]

df = pd.read_csv(csv_path)
df['timestamp'] = pd.to_datetime(df['timestamp'])  # konwersja na datetime
df['date'] = df['timestamp'].dt.date  # nowa kolumna z samą datą

# --- Funkcje generujące wykresy ---

def save_plot_speed(df):
    plt.figure(figsize=(10, 4))
    plt.plot(df['timestamp'], df['truck_speed'], label='Predkosc', color='blue')
    plt.xlabel('Czas')
    plt.ylabel('Predkosc (km/h)')
    plt.title('Predkosc ciezarowki w czasie')
    plt.grid(True)
    plt.tight_layout()
    plt.savefig("exports/imgs/plot_speed.png")
    plt.close()

def save_plot_controls(df):
    avg = df[['userThrottle', 'userBrake', 'userClutch']].mean()
    plt.figure(figsize=(6, 4))
    sns.barplot(x=avg.index, y=avg.values, hue=avg.index, palette='viridis', legend=False)
    plt.title('Srednie uzycie pedalow')
    plt.ylabel('Wartosc srednia (0-1)')
    plt.tight_layout()
    plt.savefig("exports/imgs/plot_controls.png")
    plt.close()

def save_plot_shifter(df):
    plt.figure(figsize=(6, 4))
    sns.countplot(x='shifterSlot', data=df, hue='shifterSlot', palette='coolwarm', legend=False)
    plt.title('Rozklad pozycji biegow')
    plt.tight_layout()
    plt.savefig("exports/imgs/plot_shifter.png")
    plt.close()

def save_plot_models(df):
    plt.figure(figsize=(8, 4))
    order = df['truck_model'].value_counts().index
    sns.countplot(y='truck_model', data=df, order=order, hue='truck_model', palette='mako', legend=False)
    plt.title('Najczesciej uzywane modele ciezarowek')
    plt.tight_layout()
    plt.savefig("exports/imgs/plot_models.png")
    plt.close()

def save_plot_speed_by_model(df):
    import matplotlib.pyplot as plt

    if 'truck_model' not in df.columns or 'truck_speed' not in df.columns:
        print("Brak wymaganych kolumn: 'truck_model' i 'truck_speed'")
        return

    avg = df.groupby('truck_model')['truck_speed'].mean().sort_values()

    if avg.empty:
        print("Brak danych do wykresu średnich prędkości.")
        return

    avg.plot(kind='barh', color='darkgreen')
    plt.xlabel("Średnia prędkość")
    plt.title("Średnia prędkość wg modelu ciężarówki")
    plt.tight_layout()
    plt.savefig("exports/imgs/plot_speed_by_model.png")
    plt.close()


def save_plot_speed_histogram(df):
    plt.figure(figsize=(8, 4))
    plt.hist(df['truck_speed'], bins=30, color='skyblue', edgecolor='black')
    plt.title('Histogram predkosci ciezarowki')
    plt.xlabel('Predkosc (km/h)')
    plt.ylabel('Ilosc probek')
    plt.tight_layout()
    plt.savefig("exports/imgs/plot_speed_histogram.png")
    plt.close()

def save_plot_pedals_boxplot(df):
    plt.figure(figsize=(8, 5))
    sns.boxplot(data=df[['userThrottle', 'userBrake', 'userClutch']], palette='pastel')
    plt.title('Rozklad uzycia pedalow (boxplot)')
    plt.ylabel('Wartosc (0-1)')
    plt.tight_layout()
    plt.savefig("exports/imgs/plot_pedals_boxplot.png")
    plt.close()

def save_plot_corr_heatmap(df):
    plt.figure(figsize=(8, 6))
    corr = df[['truck_speed', 'userThrottle', 'userBrake', 'userClutch']].corr()
    sns.heatmap(corr, annot=True, cmap='coolwarm', fmt=".2f")
    plt.title('Macierz korelacji')
    plt.tight_layout()
    plt.savefig("exports/imgs/plot_corr_heatmap.png")
    plt.close()


def get_unique_filename(base_path, date_str, test_name):
    # usuń polskie znaki z test_name w nazwie pliku
    test_name_clean = remove_polish_chars(test_name)
    # podstawowa nazwa pliku
    filename = f"{date_str}_{test_name_clean}.pdf"
    full_path = os.path.join(base_path, filename)

    i = 1
    # dopóki plik istnieje, zmieniaj nazwę
    while os.path.exists(full_path):
        filename = f"{date_str}_{test_name_clean}_{i}.pdf"
        full_path = os.path.join(base_path, filename)
        i += 1

    return full_path


# Generujemy wykresy
save_plot_speed(df)
save_plot_controls(df)
save_plot_shifter(df)
# save_plot_models(df)
# save_plot_speed_by_model(df)
save_plot_speed_histogram(df)
save_plot_pedals_boxplot(df)
save_plot_corr_heatmap(df)

# --- Tworzenie PDF z usuniętymi polskimi znakami ---

class PDF(FPDF):
    def header(self):
        self.set_font("Arial", 'B', 14)
        self.cell(0, 10, remove_polish_chars(f"Raport telemetryczny: {testName}"), ln=True, align='C')
        self.cell(0, 10, remove_polish_chars(f"Uzytkownik: {studentName}"), ln=True, align='C')
        self.ln(10)

pdf = PDF()
pdf.add_page()
pdf.set_font("Arial", '', 12)

# Dodaj wykresy z opisami
pdf.cell(0, 10, remove_polish_chars("1. Predkosc ciezarowki w czasie"), ln=True)
pdf.image("exports/imgs/plot_speed.png", w=180)

pdf.ln(5)
pdf.cell(0, 10, remove_polish_chars("2. Srednie uzycie gazu, hamulca i sprzegla"), ln=True)
pdf.image("exports/imgs/plot_controls.png", w=120)

pdf.ln(5)
pdf.cell(0, 10, remove_polish_chars("3. Rozklad pozycji biegow"), ln=True)
pdf.image("exports/imgs/plot_shifter.png", w=120)

# pdf.ln(5)
# pdf.cell(0, 10, remove_polish_chars("4. Najczesciej uzywane modele ciezarowek"), ln=True)
# pdf.image("exports/imgs/plot_models.png", w=160)
#
# pdf.ln(5)
# pdf.cell(0, 10, remove_polish_chars("5. Srednia predkosc wg modelu ciezarowki"), ln=True)
# pdf.image("exports/imgs/plot_speed_by_model.png", w=160)

pdf.ln(5)
pdf.cell(0, 10, remove_polish_chars("6. Histogram predkosci ciezarowki"), ln=True)
pdf.image("exports/imgs/plot_speed_histogram.png", w=160)

pdf.ln(5)
pdf.cell(0, 10, remove_polish_chars("7. Rozklad uzycia pedalow (boxplot)"), ln=True)
pdf.image("exports/imgs/plot_pedals_boxplot.png", w=160)

pdf.ln(5)
pdf.cell(0, 10, remove_polish_chars("8. Macierz korelacji wartosci telemetrycznych"), ln=True)
pdf.image("exports/imgs/plot_corr_heatmap.png", w=160)

# Dodaj sekcję podsumowania
pdf.add_page()
pdf.set_font("Arial", 'B', 14)
pdf.cell(0, 10, "Podsumowanie statystyk", ln=True, align='C')
pdf.ln(5)

pdf.set_font("Arial", '', 12)
summary_stats = df[['truck_speed', 'userThrottle', 'userBrake', 'userClutch']].describe().T

for idx, row in summary_stats.iterrows():
    pdf.cell(0, 10, f"{remove_polish_chars(idx)}:", ln=True)
    pdf.cell(0, 10, f"  Srednia: {row['mean']:.2f}", ln=True)
    pdf.cell(0, 10, f"  Mediana: {df[idx].median():.2f}", ln=True)
    pdf.cell(0, 10, f"  Min: {row['min']:.2f}", ln=True)
    pdf.cell(0, 10, f"  Max: {row['max']:.2f}", ln=True)
    pdf.ln(3)




# potem używasz tak:

base_export_path = "exports"
os.makedirs(base_export_path, exist_ok=True)  # upewnij się, że folder istnieje

date_str = str(df['date'].values[0])



unique_pdf_path = get_unique_filename(base_export_path, date_str, testName)

pdf.output(unique_pdf_path)
print(f"Raport zapisany jako {unique_pdf_path}")

