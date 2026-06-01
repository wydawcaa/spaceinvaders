# 👾 Space Invaders

Implementacja klasycznej gry zręcznościowej **Space Invaders**. Gra polega na sterowaniu statkiem kosmicznym, unikaniu pocisków wrogów i eliminowaniu nadchodzących fal obcych w celu zdobycia jak najwyższego wyniku.

---

## 🕹️ Funkcje i mechanika gry

* **Pętla gry (Game Loop):** Płynne odświeżanie obrazu, renderowanie obiektów i obsługa klawiatury w czasie rzeczywistym.
* **Poruszanie się i strzelanie:** Gracz może poruszać się w osi poziomej i wystrzeliwać pociski.
* **Przeciwnicy:** Formacja obcych porusza się po ekranie, schodząc w dół po osiągnięciu krawędzi bocznej.
* **System kolizji:** Wykrywanie trafień pocisków w obcych oraz pocisków obcych w statek gracza.

---

## 📂 Struktura kodu (OOP)

Gra została napisana obiektowo z podziałem na logiczne klasy:
* **Główny silnik gry:** Inicjalizacja okna, zarządzanie stanem gry i główna pętla.
* **Gracz:** Klasa odpowiedzialna za pozycję, sterowanie i życie statku gracza.
* **Przeciwnicy:** Klasa zarządzająca pozycją i ruchem pojedynczych kosmitów oraz całej formacji.
* **Pociski:** Obsługa wystrzałów, ruchu pocisku oraz czyszczenie pamięci po wylocie poza ekran.

---

## 💻 Jak uruchomić?

Gra działa bezpośrednio w przeglądarce internetowej i nie wymaga żadnej instalacji.

1. Pobierz pliki projektu na dysk (kliknij zielony przycisk **Code** -> **Download ZIP** i rozpakuj archiwum).
2. Otwórz plik `index.html` w dowolnej przeglądarce (np. Chrome, Firefox, Edge) poprzez dwukrotne kliknięcie myszką.

---

## 🎮 Sterowanie

| Klawisz | Akcja |
| :--- | :--- |
| `Strzałki / A-D` | Ruch w lewo / prawo |
| `Spacja` | Strzał |
| `R / Enter` | Restart gry |

---
