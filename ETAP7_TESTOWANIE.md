# 🧪 Etap 7 — Testowanie aplikacji Space Invaders

**Aplikacja:** Space Invaders v0.6.3 → v0.6.4  
**Technologie:** HTML5 · CSS3 · JavaScript (Vanilla)  
**Data:** 2026-05-31  
**Nazwa pliku projektu:** PROJOPP_AP_e7

---

## 📋 1. Wybór metod testowania

Na potrzeby tego etapu wybrano **dwie metody testowania**:

| # | Metoda | Narzędzie | Uzasadnienie |
|---|--------|-----------|--------------|
| 1 | **Testy jednostkowe** (Unit Testing) | Własny mini-runner JS (`testy_jednostkowe.html`) | Pozwala testować izolowane funkcje logiki gry bez uruchamiania całej aplikacji |
| 2 | **Testy manualne** (Manual Testing) | Przeglądarka + tabela przypadków testowych | Pozwala zweryfikować zachowanie UI, interakcje gracza i scenariusze rozgrywki |

---

## 🔬 Metoda 1 — Testy Jednostkowe

### Opis

Testy jednostkowe sprawdzają izolowane funkcje logiki gry — bez przeglądarki, DOM-u ani pętli gry. Każda funkcja jest testowana osobno z różnymi danymi wejściowymi.

### Uruchomienie

Otwórz plik `testy_jednostkowe.html` w przeglądarce. Testy wykonują się automatycznie po załadowaniu strony.

### Zestawy testów (Test Suites)

#### Suite 1 — Kolizje (`rectsOverlap`)

| ID | Opis testu | Oczekiwany wynik | Status |
|----|------------|-----------------|--------|
| U1.1 | Nakładające się prostokąty | `true` | ✅ PASS |
| U1.2 | Brak kolizji poziomo | `false` | ✅ PASS |
| U1.3 | Brak kolizji pionowo | `false` | ✅ PASS |
| U1.4 | Jeden prostokąt w drugim | `true` | ✅ PASS |
| U1.5 | Styk krawędziami | `true` | ✅ PASS |

#### Suite 2 — Ruch gracza (`clampPlayerX`)

| ID | Opis testu | Oczekiwany wynik | Status |
|----|------------|-----------------|--------|
| U2.1 | Pozycja w środku planszy | 300 | ✅ PASS |
| U2.2 | Wyjście poza lewą krawędź | 0 | ✅ PASS |
| U2.3 | Wyjście poza prawą krawędź | 740 | ✅ PASS |
| U2.4 | Bardzo duże x | 740 | ✅ PASS |
| U2.5 | Pozycja 0 (lewa krawędź) | 0 | ✅ PASS |

#### Suite 3 — Skalowanie trudności

| ID | Opis testu | Oczekiwany wynik | Status |
|----|------------|-----------------|--------|
| U3.1 | Mnożnik przy score=0 | 1.0 | ✅ PASS |
| U3.2 | Mnożnik rośnie ze score | true | ✅ PASS |
| U3.3 | Prędkość wrogów rośnie | true | ✅ PASS |
| U3.4 | Prędkość przy score=0 = ENEMY_SPEED_BASE | 0.8 | ✅ PASS |
| U3.5 | Interwał spawnu maleje | true | ✅ PASS |
| U3.6 | Interwał ≥ 500ms (cap) | ≥ 500 | ✅ PASS |

#### Suite 4 — Typy wrogów

| ID | Opis testu | Oczekiwany wynik | Status |
|----|------------|-----------------|--------|
| U4.1 | Normal: 1 HP, 10 pkt | hp=1, pts=10 | ✅ PASS |
| U4.2 | Fast: speedMult > 1 | 2.2 | ✅ PASS |
| U4.3 | Tank: 3 HP, powolny | hp=3, mult<1 | ✅ PASS |
| U4.4 | Tank ma max punkty | 30 | ✅ PASS |
| U4.5 | Random type z 4 opcji | jeden z 4 typów | ✅ PASS |
| U4.6 | Zigzag: 1 HP, 20 pkt | hp=1, pts=20 | ✅ PASS |

#### Suite 5 — Punktacja i High Score

| ID | Opis testu | Oczekiwany wynik | Status |
|----|------------|-----------------|--------|
| U5.1 | Brak zapisu → 0 | 0 | ✅ PASS |
| U5.2 | Parsowanie liczby | 350 | ✅ PASS |
| U5.3 | Nowy wynik lepszy | 500 | ✅ PASS |
| U5.4 | Nowy wynik gorszy | 300 | ✅ PASS |
| U5.5 | Remis | 300 | ✅ PASS |

#### Suite 6 — Stałe konfiguracji

| ID | Opis testu | Oczekiwany wynik | Status |
|----|------------|-----------------|--------|
| U6.1 | MAX_LIVES = 3 | 3 | ✅ PASS |
| U6.2 | HITS_PER_LIFE = 2 | 2 | ✅ PASS |
| U6.3 | POWERUP_DROP_CHANCE ∈ (0,1) | 0.3 | ✅ PASS |
| U6.4 | POWERUP_DURATION > 0 | 8000 | ✅ PASS |
| U6.5 | Pocisk gracza szybszy od wroga | 5 > 3 | ✅ PASS |
| U6.6 | Interwał bazy spawnu | 2000ms | ✅ PASS |
| U6.7 | 4 skórki statku | 4 | ✅ PASS |

### Podsumowanie testów jednostkowych

| Zestawy | Testy łącznie | Zaliczone | Niezaliczone |
|---------|--------------|-----------|-------------|
| 6 | 32 | **32** | **0** |

**Wynik: ✅ 32/32 — wszystkie testy przeszły pomyślnie.**

---

## 🖱️ Metoda 2 — Testy Manualne

### Opis

Testy manualne polegają na ręcznym uruchamianiu scenariuszy w przeglądarce i weryfikacji zgodności zachowania aplikacji z oczekiwaniami.

### Środowisko testowe

| Element | Wartość |
|---------|---------|
| Przeglądarka | Chrome 124+ |
| Rozdzielczość | 1920×1080 |
| System | Windows 11 |
| Wersja aplikacji | 0.6.3 |
| Pliki | `index.html`, `style.css`, `script.js` |

---

### Przypadki testowe

#### TC-01 — Uruchomienie gry

| Pole | Opis |
|------|------|
| **Kroki** | 1. Otwórz `index.html` 2. Kliknij **Play** |
| **Oczekiwany wynik** | Okno gry, statek widoczny, wrogowie po ~2s, HUD: Score 0, ❤️❤️❤️ |
| **Wynik** | ✅ PASS |

#### TC-02 — Ruch statku

| Pole | Opis |
|------|------|
| **Kroki** | 1. Naciśnij A/← 2. Naciśnij D/→ 3. Doprowadź do krawędzi |
| **Oczekiwany wynik** | Ruch w obu kierunkach, brak wyjścia poza planszę |
| **Wynik** | ✅ PASS |

#### TC-03 — Strzelanie

| Pole | Opis |
|------|------|
| **Kroki** | 1. Naciśnij Spację raz 2. Naciśnij kilka razy szybko |
| **Oczekiwany wynik** | Pocisk leci w górę, cooldown zapobiega spamowi |
| **Wynik** | ✅ PASS |

#### TC-04 — Punktacja za zestrzelenie

| Pole | Opis |
|------|------|
| **Kroki** | 1. Zestrzel wroga Normal (czerwony) |
| **Oczekiwany wynik** | Eksplozja, Score +10 |
| **Wynik** | ✅ PASS |

#### TC-05 — Utrata życia (wróg przeleciał)

| Pole | Opis |
|------|------|
| **Kroki** | 1. Nie strzelaj, pozwól wrogowi przelecieć |
| **Oczekiwany wynik** | HUD traci serce, dźwięk |
| **Wynik** | ✅ PASS |

#### TC-06 — Game Over

| Pole | Opis |
|------|------|
| **Kroki** | 1. Stać 3 życia |
| **Oczekiwany wynik** | Overlay "GAME OVER" z wynikiem i przyciskiem Restart |
| **Wynik** | ✅ PASS |

#### TC-07 — Restart gry (regresja z Etapu 5)

| Pole | Opis |
|------|------|
| **Kroki** | 1. Restart 2. Play 3. Powtórz 3x — obserwuj spawn rate |
| **Oczekiwany wynik** | Wrogowie zawsze co ~2s, brak kumulacji timerów |
| **Wynik** | ✅ PASS |

#### TC-08 — Power-up: Tarcza

| Pole | Opis |
|------|------|
| **Kroki** | 1. Zbierz 🛡 2. Pozwól się trafić |
| **Oczekiwany wynik** | Tarcza pochłania trafienie, gracz nie traci życia |
| **Wynik** | ✅ PASS |

#### TC-09 — Power-up: Double Fire

| Pole | Opis |
|------|------|
| **Kroki** | 1. Zbierz ⚡ 2. Strzel Spacją |
| **Oczekiwany wynik** | Dwa pociski jednocześnie |
| **Wynik** | ✅ PASS |

#### TC-10 — Zmiana skórki

| Pole | Opis |
|------|------|
| **Kroki** | 1. Kliknij Skins 2. Wybierz Phoenix 3. Play |
| **Oczekiwany wynik** | Statek wygląda jak Phoenix, wybór zachowany po odświeżeniu |
| **Wynik** | ✅ PASS |

#### TC-11 — High Score

| Pole | Opis |
|------|------|
| **Kroki** | 1. Zdobądź punkty 2. Przegraj 3. Odśwież stronę |
| **Oczekiwany wynik** | Best: X widoczny w HUD po powrocie |
| **Wynik** | ✅ PASS |

#### TC-12 — Skalowanie trudności

| Pole | Opis |
|------|------|
| **Kroki** | 1. Zdobądź 200+ punktów |
| **Oczekiwany wynik** | Wrogowie szybsi i częstsi niż na początku |
| **Wynik** | ✅ PASS |

#### TC-13 — Klawisz Escape (wyjście z gry) 🐛

| Pole | Opis |
|------|------|
| **Kroki** | 1. Uruchom grę (Play) 2. Naciśnij **Escape** podczas rozgrywki |
| **Oczekiwany wynik** | Gra wraca do ekranu głównego (zgodnie z README: "Esc — Wyjście z gry") |
| **Wynik** | ❌ **FAIL** — naciśnięcie Escape nie robi nic, gra toczy się dalej |

---

## 🐛 4. Wykryty defekt — TC-13

| Pole | Opis |
|------|------|
| **ID defektu** | BUG-01 |
| **Wykryty w** | TC-13 — test manualny klawisza Escape |
| **Typ** | Brakująca funkcjonalność (feature gap) |
| **Plik** | `script.js` — funkcja `handleKeyDown()` |
| **Priorytet** | Niski (nie psuje rozgrywki, ale niezgodne z dokumentacją) |
| **Opis** | README aplikacji dokumentuje sterowanie: *"Esc — Wyjście z gry"*. Klawisz Escape jest jednak w ogóle nieobsługiwany w funkcji `handleKeyDown()`. Naciśnięcie Escape podczas rozgrywki nie wywołuje żadnej akcji. |

### Wadliwy kod (przed naprawą)

```javascript
// ❌ KOD Z BŁĘDEM — brak obsługi Escape
function handleKeyDown(e) {
  keysPressed[e.key] = true;
  if (e.key === ' ' || e.code === 'Space') { e.preventDefault(); shootBullet(); }
  // brak: obsługi klawisza Escape
}
```

### Naprawa

```diff
 function handleKeyDown(e) {
   keysPressed[e.key] = true;
   if (e.key === ' ' || e.code === 'Space') { e.preventDefault(); shootBullet(); }
+  if (e.key === 'Escape' && gameActive) { restartGame(); }
 }
```

### Weryfikacja naprawy

| Test | Wynik |
|------|-------|
| Escape podczas gry → ekran główny | ✅ PASS |
| Escape poza grą (brak efektu ubocznego) | ✅ PASS |
| Po Escape → Play → gra działa normalnie | ✅ PASS |

---

## 📊 5. Podsumowanie całego Etapu 7

| Metoda | Liczba testów | Zaliczone | Niezaliczone |
|--------|-------------|-----------|-------------|
| Testy jednostkowe | 32 | 32 | 0 |
| Testy manualne | 13 | 12 | **1 (TC-13)** |
| **RAZEM** | **45** | **44** | **1** |

**Wykryty defekt: BUG-01 — brak obsługi klawisza Escape → naprawiony w v0.6.4.**

---

## 📄 6. Dokumentacja zmian i wersjonowanie

| Element | Typ | Opis |
|---------|-----|------|
| `ETAP7_TESTOWANIE.md` | 📝 Nowy | Raport z testowania (ten dokument) |
| `testy_jednostkowe.html` | 🧪 Nowy | Automatyczny runner 32 testów jednostkowych |
| `script.js` — `handleKeyDown()` | 🔧 Poprawka | Dodano obsługę klawisza Escape |

### Wersja aplikacji po Etapie 7: `0.6.4`

```
Changelog [0.6.4]:
🐛 Fixed: Brak obsługi klawisza Escape (BUG-01)
   Klawisz Esc był udokumentowany w README jako "Wyjście z gry",
   ale nie był zaimplementowany w handleKeyDown().
   Rozwiązanie: dodano warunek if (e.key === 'Escape' && gameActive).
🧪 Added: 32 testy jednostkowe (testy_jednostkowe.html)
📋 Added: 13 przypadków testowych manualnych
```

---

*Dokument przygotowany na potrzeby zaliczenia Etapu 7 projektu PROJOPP_AP_e7*
