(function () {
  "use strict";

  var AUTH_STORAGE_KEY = "minczynscy_user";

  // --- Pomocnicze -------------------------------------------------------

  // Dekoduje payload tokenu JWT (bez weryfikacji podpisu - robimy to
  // wyłącznie po to, żeby odczytać e-mail; realna ochrona to lista
  // "Test users" w Google Cloud Console, patrz README.md).
  function decodeJwtPayload(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var json = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(json);
  }

  function isAllowed(email) {
    return (
      typeof email === "string" &&
      window.ALLOWED_EMAILS.indexOf(email.toLowerCase()) !== -1
    );
  }

  function getStoredUser() {
    try {
      var raw = localStorage.getItem(AUTH_STORAGE_KEY);
      if (!raw) return null;
      var user = JSON.parse(raw);
      if (!user || !isAllowed(user.email)) return null;
      return user;
    } catch (e) {
      return null;
    }
  }

  function storeUser(user) {
    localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
  }

  function clearStoredUser() {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  // --- UI -----------------------------------------------------------

  function showError(message) {
    var el = document.getElementById("login-error");
    el.textContent = message;
    el.hidden = false;
  }

  function clearError() {
    var el = document.getElementById("login-error");
    el.hidden = true;
    el.textContent = "";
  }

  function applyAuthedUI(user) {
    document.documentElement.classList.add("authed");
    document.getElementById("user-name").textContent = user.name || user.email;
    var avatar = document.getElementById("user-avatar");
    if (user.picture) {
      avatar.src = user.picture;
      avatar.hidden = false;
    } else {
      avatar.hidden = true;
    }
  }

  function logout() {
    clearStoredUser();
    if (window.google && google.accounts && google.accounts.id) {
      google.accounts.id.disableAutoSelect();
    }
    document.documentElement.classList.remove("authed");
    location.reload();
  }

  // --- Google Identity Services --------------------------------------

  function handleCredentialResponse(response) {
    var payload;
    try {
      payload = decodeJwtPayload(response.credential);
    } catch (e) {
      showError("Nie udało się odczytać danych logowania. Spróbuj ponownie.");
      return;
    }

    var email = (payload.email || "").toLowerCase();

    if (!payload.email_verified || !isAllowed(email)) {
      showError("Konto " + email + " nie ma dostępu do tej strony.");
      return;
    }

    clearError();

    var user = {
      email: email,
      name: payload.name || email,
      picture: payload.picture || "",
      loginAt: Date.now()
    };
    storeUser(user);
    applyAuthedUI(user);
  }

  window.handleCredentialResponse = handleCredentialResponse;

  function initGoogleButton() {
    if (!window.google || !google.accounts || !google.accounts.id) {
      // Skrypt Google Identity Services jeszcze się ładuje.
      setTimeout(initGoogleButton, 200);
      return;
    }
    google.accounts.id.initialize({
      client_id: window.GOOGLE_CLIENT_ID,
      callback: handleCredentialResponse
    });
    google.accounts.id.renderButton(document.getElementById("g_id_signin"), {
      theme: "outline",
      size: "large",
      locale: "pl",
      text: "signin_with"
    });
  }

  // --- Start -----------------------------------------------------------

  document.addEventListener("DOMContentLoaded", function () {
    var stored = getStoredUser();
    if (stored) {
      applyAuthedUI(stored);
    } else {
      initGoogleButton();
    }
    document.getElementById("logout-btn").addEventListener("click", logout);
  });
})();
