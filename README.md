# minczynscy.pl

Strona internetowa rodziny Mińczyńskich.

## Sekcje

### Dyżury domowe

Trzy dyżury: **Kuchnia**, **Śmieci**, **Sprzątanie** — rozdzielane rotacyjnie
między dzieci: **Zosię**, **Franka** i **Jerzyka**.

- **Tryb zwykły** — dyżury zmieniają się co tydzień (od poniedziałku).
- **Tryb wakacyjny** — dyżury zmieniają się codziennie. Przełącznik
  "Tryb wakacyjny" widoczny na stronie zapisuje wybór w przeglądarce
  (`localStorage`), więc trzeba go ustawić na każdym urządzeniu (np.
  tablecie na lodówce), na którym strona jest wyświetlana.

Przydział jest wyliczany deterministycznie na podstawie daty (bez
backendu/bazy danych), więc każde urządzenie w tym samym trybie pokaże
ten sam wynik. Sekcja zawiera też podgląd przydziałów na najbliższe 7 dni.

## Uruchomienie lokalne

To statyczna strona (HTML/CSS/JS, bez procesu budowania). Wystarczy
otworzyć `index.html` w przeglądarce albo odpalić lokalny serwer, np.:

```bash
python3 -m http.server 8000
```

i wejść na `http://localhost:8000`.

## Struktura

```
index.html
assets/
  css/style.css
  js/app.js
```
