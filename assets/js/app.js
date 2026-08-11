(function () {
  "use strict";

  // --- Dane bazowe -----------------------------------------------------

  var DUTIES = [
    { key: "kuchnia", name: "Kuchnia", icon: "🍳" },
    { key: "smieci", name: "Śmieci", icon: "🗑️" },
    { key: "sprzatanie", name: "Sprzątanie", icon: "🧹" }
  ];

  var KIDS = [
    { key: "zosia", name: "Zosia" },
    { key: "franek", name: "Franek" },
    { key: "jerzyk", name: "Jerzyk" }
  ];

  // Poniedziałek – punkt odniesienia dla liczenia tygodni/dni rotacji.
  var REFERENCE_DATE = Date.UTC(2024, 0, 1);
  var DAY_MS = 24 * 60 * 60 * 1000;
  var STORAGE_KEY = "minczynscy.dyzury.wakacje";

  // --- Logika rotacji ----------------------------------------------------

  function toUtcMidnight(date) {
    return Date.UTC(date.getFullYear(), date.getMonth(), date.getDate());
  }

  function daysSinceReference(date) {
    return Math.floor((toUtcMidnight(date) - REFERENCE_DATE) / DAY_MS);
  }

  // Numer "okresu" rotacji: w trybie wakacyjnym zmiana jest codzienna,
  // w trybie zwykłym - co tydzień (od poniedziałku do niedzieli).
  function periodIndex(date, vacationMode) {
    var days = daysSinceReference(date);
    return vacationMode ? days : Math.floor(days / 7);
  }

  // Dla danego dnia zwraca tablicę { duty, kid } - każdy dyżur przesuwa się
  // o jedno miejsce w kolejce dzieci przy każdej zmianie okresu.
  function assignmentsFor(date, vacationMode) {
    var p = periodIndex(date, vacationMode);
    return DUTIES.map(function (duty, i) {
      var kid = KIDS[(i + p) % KIDS.length];
      return { duty: duty, kid: kid };
    });
  }

  // --- Renderowanie --------------------------------------------------

  var POLISH_DATE_FMT = new Intl.DateTimeFormat("pl-PL", {
    weekday: "long",
    day: "numeric",
    month: "long"
  });

  var POLISH_SHORT_FMT = new Intl.DateTimeFormat("pl-PL", {
    weekday: "short",
    day: "numeric",
    month: "numeric"
  });

  function renderToday(date, vacationMode) {
    document.getElementById("today-date").textContent =
      "Dziś, " + POLISH_DATE_FMT.format(date);

    var container = document.getElementById("duty-cards");
    container.innerHTML = "";

    assignmentsFor(date, vacationMode).forEach(function (a) {
      var card = document.createElement("div");
      card.className = "duty-card kid-" + a.kid.key;
      card.innerHTML =
        '<div class="duty-icon">' + a.duty.icon + "</div>" +
        '<div class="duty-name">' + a.duty.name + "</div>" +
        '<div class="kid-avatar">' + a.kid.name.charAt(0) + "</div>" +
        '<div class="kid-name">' + a.kid.name + "</div>";
      container.appendChild(card);
    });
  }

  function renderPreview(today, vacationMode, days) {
    var tbody = document.querySelector("#preview-table tbody");
    tbody.innerHTML = "";

    for (var i = 0; i < days; i++) {
      var d = new Date(today);
      d.setDate(d.getDate() + i);

      var assignments = assignmentsFor(d, vacationMode);
      var row = document.createElement("tr");
      if (i === 0) row.className = "is-today";

      var dateCell = "<td>" + POLISH_SHORT_FMT.format(d) + "</td>";
      var dutyCells = assignments
        .map(function (a) {
          return "<td>" + a.kid.name + "</td>";
        })
        .join("");

      row.innerHTML = dateCell + dutyCells;
      tbody.appendChild(row);
    }
  }

  function renderModeDescription(vacationMode) {
    document.getElementById("mode-description").textContent = vacationMode
      ? "obowiązki zmieniają się codziennie"
      : "obowiązki zmieniają się co tydzień";
  }

  function render() {
    var vacationMode = getVacationMode();
    var today = new Date();

    renderModeDescription(vacationMode);
    renderToday(today, vacationMode);
    renderPreview(today, vacationMode, 7);
  }

  // --- Tryb wakacyjny (zapisywany lokalnie w przeglądarce) ------------

  function getVacationMode() {
    return localStorage.getItem(STORAGE_KEY) === "1";
  }

  function setVacationMode(value) {
    localStorage.setItem(STORAGE_KEY, value ? "1" : "0");
  }

  function initToggle() {
    var toggle = document.getElementById("vacation-toggle");
    toggle.checked = getVacationMode();
    toggle.addEventListener("change", function () {
      setVacationMode(toggle.checked);
      render();
    });
  }

  // --- Start -----------------------------------------------------------

  document.addEventListener("DOMContentLoaded", function () {
    initToggle();
    render();
  });
})();
