# 🛠️ Etap 5 — Debugowanie aplikacji Space Invaders

**Aplikacja:** Space Invaders v0.6  
**Technologie:** HTML5 · CSS3 · JavaScript (Vanilla)  
**Data:** 2026-02-18

---

## 📋 1. Metoda debugowania

### Wybrana metoda

> **Debugowanie manualne** — analiza kodu źródłowego + testy w przeglądarce

### Użyte narzędzia

| 🔧 Narzędzie | 📝 Zastosowanie |
|--------------|-----------------|
| **Chrome DevTools — Console** | Podgląd zmiennych i błędów JS w trakcie gry |
| **Chrome DevTools — Sources** | Breakpointy w podejrzanych funkcjach |
| **Code review** | Ręczna analiza logiki przepływu kodu |

### Dlaczego ta metoda?

- Gra działa w przeglądarce — Chrome DevTools to naturalne środowisko
- Błąd jest **wizualnie zauważalny** (za dużo wrogów po restarcie)
- Reprodukcja wymaga tylko kilku kliknięć — nie trzeba testów automatycznych

---

## 🔍 2. Proces debugowania

### 🔄 Krok 1 — Reprodukcja błędu

| Nr | Akcja | Co się dzieje |
|----|-------|---------------|
| 1 | Otwórz grę → kliknij **Play** | Gra startuje normalnie, wrogowie co ~2s |
| 2 | Przegraj (stracisz 3 życia) | Pojawia się ekran **GAME OVER** |
| 3 | Kliknij **Restart** → potem **Play** | ⚠️ Wrogowie pojawiają się **2× szybciej**! |
| 4 | Powtórz restart jeszcze raz | ❌ Wrogowie **3× szybciej** — gra niegrywalna |

---

### 🎯 Krok 2 — Wyizolowanie źródła

Prześledziłem kolejność wywołań funkcji:

```
Gracz traci życia
    └─→ gameOver()              ← ❓ podejrzana
          └─→ [Restart]
                └─→ restartGame()
                      └─→ [Play]
                            └─→ startGame()
                                  └─→ startEnemySpawning()   ← tworzy NOWY timer
```

> 💡 Problem leży na linii `gameOver()` → `startEnemySpawning()`, bo dotyczy częstotliwości spawnu wrogów.

---

### 🐛 Krok 3 — Identyfikacja przyczyny

| | |
|---|---|
| **Typ błędu** | Błąd logiczny — wyciek zasobów (timer leak) |
| **Plik** | `script.js` |
| **Funkcja** | `gameOver()` — linia 674 |

**Wadliwy kod:**

```javascript
// ❌ KOD Z BŁĘDEM:
function gameOver() {
  gameActive = false;
  playSound('gameover');
  // BRAK: clearInterval(enemySpawnTimer)
  // Timer spawnu wrogów dalej działa w tle!
}
```

**Co się dzieje:**
1. `gameOver()` **nie zatrzymuje** starego timera spawnu wrogów
2. Po restarcie `startGame()` tworzy **nowy** timer → działają **dwa jednocześnie**
3. Każdy restart dodaje kolejny timer → wrogowie mnożą się coraz szybciej

---

### ✅ Krok 4 — Naprawa błędu

Dodanie jednej linijki w `gameOver()`:

```diff
 function gameOver() {
   gameActive = false;
   playSound('gameover');
+  if (enemySpawnTimer) { clearInterval(enemySpawnTimer); enemySpawnTimer = null; }
```

> `clearInterval()` zatrzymuje stary timer, `= null` resetuje zmienną żeby nie było duplikatów.

---

### ✔️ Krok 5 — Weryfikacja naprawy

| 🧪 Test | Wynik |
|---------|-------|
| Gra startuje normalnie | ✅ PASS |
| Game Over po utracie 3 żyć | ✅ PASS |
| Po restarcie spawn rate normalny (~2s) | ✅ PASS |
| 3 restarty pod rząd — brak kumulacji | ✅ PASS |
| Konsola DevTools — brak błędów JS | ✅ PASS |

---

## 📄 3. Aktualizacja dokumentacji

| 📁 Element | Typ | Opis zmiany |
|-----------|-----|-------------|
| `script.js` — linia 677 | 🔧 Poprawka | Dodano `clearInterval(enemySpawnTimer)` w `gameOver()` |
| `ETAP5_DEBUGOWANIE.md` | 📝 Nowy | Raport z procesu debugowania (ten dokument) |

---

## 🏷️ 4. Wersjonowanie

> **Format:** Semantic Versioning — `MAJOR.MINOR.PATCH`

| Wersja | Data | Typ | Opis |
|--------|------|-----|------|
| 0.6.0 | 2026-02-18 | MINOR | Mechanika Game Over, overlay, restart |
| 0.6.1 | 2026-02-18 | MINOR | System żyć, typy wrogów, power-upy, dźwięki, high score |
| 0.6.2 | 2026-02-18 | PATCH | Balansowanie trudności gry |
| **0.6.3** | **2026-02-18** | **PATCH** | **🐛 Bugfix: naprawa wycieku timera w `gameOver()`** |

### 📌 Aktualna wersja: `0.6.3`

```
Changelog [0.6.3]:
🐛 Fixed: Wyciek timera setInterval w gameOver()
   Timer spawnu wrogów nie był czyszczony przy końcu gry,
   co powodowało podwójny spawn wrogów po restarcie.
   Rozwiązanie: clearInterval + reset zmiennej na null.
```
