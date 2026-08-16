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

## Logowanie (Google)

Strona jest zamknięta za bramką logowania „Zaloguj się przez Google”.
Dostęp mają tylko: `kminczynski@gmail.com`, `kingaswit@gmail.com`,
`fminczynski@gmail.com`, `zminczynska@gmail.com`, `jminczynski@gmail.com`.

Ochrona ma dwie warstwy:

1. **Google Cloud Console — ekran zgody OAuth w trybie „Testing” + lista
   „Test users”.** To jest właściwa ochrona: Google odrzuci logowanie
   każdemu, kogo nie ma na liście test userów, zanim jeszcze trafi na
   naszą stronę.
2. **`assets/js/config.js` — `ALLOWED_EMAILS`.** Dodatkowe sprawdzenie
   e-maila po stronie strony (kosmetyczne — kod frontendowy da się
   ominąć, więc to tylko druga warstwa, nie właściwe zabezpieczenie).

### Jednorazowa konfiguracja w Google Cloud Console

1. Wejdź na [console.cloud.google.com](https://console.cloud.google.com/)
   i utwórz nowy projekt (np. „Minczynscy Family Site”).
2. **APIs & Services → OAuth consent screen**:
   - User Type: **External**
   - App name: np. „Mińczyńscy”, support email: Twój adres
   - Zapisz jako **Testing** (nie publikuj/nie wysyłaj do weryfikacji)
   - W sekcji **Test users** dodaj dokładnie te 5 adresów z listy wyżej
3. **APIs & Services → Credentials → Create Credentials → OAuth client
   ID**:
   - Application type: **Web application**
   - Authorized JavaScript origins: `https://minczynscy.pl` (dodaj też
     adres testowy, jeśli testujesz lokalnie, np. `http://localhost:8000`)
   - Utwórz i skopiuj wygenerowany **Client ID**
     (`...apps.googleusercontent.com`)
4. Wklej ten Client ID do `assets/js/config.js`
   (`window.GOOGLE_CLIENT_ID = "..."`), zastępując placeholder.

Dopóki `GOOGLE_CLIENT_ID` w `config.js` jest placeholderem, przycisk
logowania nie zadziała — strona zostanie zablokowana dla wszystkich, więc
tę konfigurację trzeba zrobić przed wdrożeniem na produkcję.

## Publikacja (GitHub Pages)

Strona publikuje się automatycznie przez GitHub Actions
(`.github/workflows/deploy.yml`) przy każdym pushu do `main`. Warunek:
w ustawieniach repo **Settings → Pages → Build and deployment → Source**
musi być ustawione na **GitHub Actions** (nie "Deploy from a branch").

Domena własna (`minczynscy.pl`) jest ustawiona w pliku `CNAME` w
katalogu głównym repo — publikowana jest razem z resztą strony przy
każdym wdrożeniu.

## Struktura

```
index.html
CNAME
.github/workflows/deploy.yml
assets/
  css/style.css
  js/config.js   (Client ID + allowlista e-maili)
  js/auth.js     (logowanie przez Google, bramka)
  js/app.js      (dyżury domowe)
```
