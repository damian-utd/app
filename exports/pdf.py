import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from fpdf import FPDF
import os

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

df = pd.read_csv(csv_path)
df['timestamp'] = pd.to_datetime(df['timestamp'])

# --- Funkcje generujące wykresy ---

def save_plot_speed(df):
    plt.figure(figsize=(10, 4))
    plt.plot(df['timestamp'], df['truck_speed'], label='Predkosc', color='blue')
    plt.xlabel('Czas')
    plt.ylabel('Predkosc (km/h)')
    plt.title('Predkosc ciezarowki w czasie')
    plt.grid(True)
    plt.tight_layout()
    plt.savefig("plot_speed.png")
    plt.close()

def save_plot_controls(df):
    avg = df[['userThrottle', 'userBrake', 'userClutch']].mean()
    plt.figure(figsize=(6, 4))
    sns.barplot(x=avg.index, y=avg.values, hue=avg.index, palette='viridis', legend=False)
    plt.title('Srednie uzycie pedalow')
    plt.ylabel('Wartosc srednia (0-1)')
    plt.tight_layout()
    plt.savefig("plot_controls.png")
    plt.close()

def save_plot_shifter(df):
    plt.figure(figsize=(6, 4))
    sns.countplot(x='shifterSlot', data=df, hue='shifterSlot', palette='coolwarm', legend=False)
    plt.title('Rozklad pozycji biegow')
    plt.tight_layout()
    plt.savefig("plot_shifter.png")
    plt.close()

def save_plot_models(df):
    plt.figure(figsize=(8, 4))
    order = df['truck_model'].value_counts().index
    sns.countplot(y='truck_model', data=df, order=order, hue='truck_model', palette='mako', legend=False)
    plt.title('Najczesciej uzywane modele ciezarowek')
    plt.tight_layout()
    plt.savefig("plot_models.png")
    plt.close()

def save_plot_speed_by_model(df):
    avg = df.groupby('truck_model')['truck_speed'].mean().sort_values()
    plt.figure(figsize=(8, 4))
    avg.plot(kind='barh', color='darkgreen')
    plt.title('Srednia predkosc wg modelu')
    plt.xlabel('Predkosc (km/h)')
    plt.tight_layout()
    plt.savefig("plot_speed_by_model.png")
    plt.close()

def save_plot_speed_histogram(df):
    plt.figure(figsize=(8, 4))
    plt.hist(df['truck_speed'], bins=30, color='skyblue', edgecolor='black')
    plt.title('Histogram predkosci ciezarowki')
    plt.xlabel('Predkosc (km/h)')
    plt.ylabel('Ilosc probek')
    plt.tight_layout()
    plt.savefig("plot_speed_histogram.png")
    plt.close()

def save_plot_pedals_boxplot(df):
    plt.figure(figsize=(8, 5))
    sns.boxplot(data=df[['userThrottle', 'userBrake', 'userClutch']], palette='pastel')
    plt.title('Rozklad uzycia pedalow (boxplot)')
    plt.ylabel('Wartosc (0-1)')
    plt.tight_layout()
    plt.savefig("plot_pedals_boxplot.png")
    plt.close()

def save_plot_corr_heatmap(df):
    plt.figure(figsize=(8, 6))
    corr = df[['truck_speed', 'userThrottle', 'userBrake', 'userClutch']].corr()
    sns.heatmap(corr, annot=True, cmap='coolwarm', fmt=".2f")
    plt.title('Macierz korelacji')
    plt.tight_layout()
    plt.savefig("plot_corr_heatmap.png")
    plt.close()

# Generujemy wykresy
save_plot_speed(df)
save_plot_controls(df)
save_plot_shifter(df)
save_plot_models(df)
save_plot_speed_by_model(df)
save_plot_speed_histogram(df)
save_plot_pedals_boxplot(df)
save_plot_corr_heatmap(df)

# --- Tworzenie PDF z usuniętymi polskimi znakami ---

class PDF(FPDF):
    def header(self):
        self.set_font("Arial", 'B', 14)
        self.cell(0, 10, remove_polish_chars("Raport telemetryczny z gry"), ln=True, align='C')
        self.ln(10)

pdf = PDF()
pdf.add_page()
pdf.set_font("Arial", '', 12)

# Dodaj wykresy z opisami
pdf.cell(0, 10, remove_polish_chars("1. Predkosc ciezarowki w czasie"), ln=True)
pdf.image("plot_speed.png", w=180)

pdf.ln(5)
pdf.cell(0, 10, remove_polish_chars("2. Srednie uzycie gazu, hamulca i sprzegla"), ln=True)
pdf.image("plot_controls.png", w=120)

pdf.ln(5)
pdf.cell(0, 10, remove_polish_chars("3. Rozklad pozycji biegow"), ln=True)
pdf.image("plot_shifter.png", w=120)

pdf.ln(5)
pdf.cell(0, 10, remove_polish_chars("4. Najczesciej uzywane modele ciezarowek"), ln=True)
pdf.image("plot_models.png", w=160)

pdf.ln(5)
pdf.cell(0, 10, remove_polish_chars("5. Srednia predkosc wg modelu ciezarowki"), ln=True)
pdf.image("plot_speed_by_model.png", w=160)

pdf.ln(5)
pdf.cell(0, 10, remove_polish_chars("6. Histogram predkosci ciezarowki"), ln=True)
pdf.image("plot_speed_histogram.png", w=160)

pdf.ln(5)
pdf.cell(0, 10, remove_polish_chars("7. Rozklad uzycia pedalow (boxplot)"), ln=True)
pdf.image("plot_pedals_boxplot.png", w=160)

pdf.ln(5)
pdf.cell(0, 10, remove_polish_chars("8. Macierz korelacji wartosci telemetrycznych"), ln=True)
pdf.image("plot_corr_heatmap.png", w=160)

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

pdf.output("raport_telemetryczny.pdf")
print("✅ Raport zapisany jako raport_telemetryczny.pdf")
