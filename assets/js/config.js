// Konfiguracja logowania przez Google.
//
// GOOGLE_CLIENT_ID: identyfikator klienta OAuth z Google Cloud Console
// (APIs & Services -> Credentials -> Create Credentials -> OAuth client ID
// -> Web application). Jako "Authorized JavaScript origins" dodaj adresy,
// pod którymi strona jest dostępna, np. https://minczynscy.pl
//
// Instrukcja krok po kroku jest w README.md.
window.GOOGLE_CLIENT_ID =
  "578246373172-h9nvbvj8aft0ipgk7505d35n5371ft9r.apps.googleusercontent.com";

// Adresy e-mail, którym wolno się zalogować (małymi literami).
// To dodatkowa warstwa - główna ochrona to lista "Test users" na ekranie
// zgody OAuth w Google Cloud Console (patrz README.md).
window.ALLOWED_EMAILS = [
  "kminczynski@gmail.com",
  "kingaswit@gmail.com",
  "fminczynski@gmail.com",
  "zminczynska@gmail.com",
  "jminczynski@gmail.com"
];
