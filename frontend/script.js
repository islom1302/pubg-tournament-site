function getCurrentLanguage() {
  return localStorage.getItem("lang") || "en";
}

function setLanguage(lang) {
  localStorage.setItem("lang", lang);
  applyTranslations(lang);
  updateLanguageButton(lang);
}

function t(key) {
  const lang = getCurrentLanguage();
  return translations[lang]?.[key] || translations.en[key] || key;
}

function applyTranslations(lang = getCurrentLanguage()) {
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = translations[lang]?.[key] || translations.en[key];
    if (value) el.textContent = value;
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    const value = translations[lang]?.[key] || translations.en[key];
    if (value) el.placeholder = value;
  });

  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    const value = translations[lang]?.[key] || translations.en[key];
    if (value) el.title = value;
  });

  const titleKey = document.body?.getAttribute("data-page-title");
  if (titleKey) {
    document.title =
      translations[lang]?.[titleKey] ||
      translations.en[titleKey] ||
      document.title;
  }
}

function updateLanguageButton(lang = getCurrentLanguage()) {
  const btn = document.getElementById("langButton");
  if (!btn) return;

  btn.innerHTML = "🌐";
  btn.setAttribute("title", lang.toUpperCase());
}

function initLanguageSelector() {
  document.querySelectorAll("[data-lang-switch]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const lang = btn.getAttribute("data-lang-switch");
      setLanguage(lang);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initLanguageSelector();
  applyTranslations();
  updateLanguageButton();
});

function getCurrentLanguage() {
  return localStorage.getItem("lang") || "en";
}

function setLanguage(lang) {
  localStorage.setItem("lang", lang);
  applyTranslations(lang);
  updateLanguageButton(lang);
}

function t(key) {
  const lang = getCurrentLanguage();
  return translations[lang]?.[key] || translations.en[key] || key;
}

function applyTranslations(lang = getCurrentLanguage()) {
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    const value = translations[lang]?.[key] || translations.en[key];
    if (value) el.textContent = value;
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    const value = translations[lang]?.[key] || translations.en[key];
    if (value) el.placeholder = value;
  });

  document.querySelectorAll("[data-i18n-title]").forEach((el) => {
    const key = el.getAttribute("data-i18n-title");
    const value = translations[lang]?.[key] || translations.en[key];
    if (value) el.title = value;
  });

  const titleKey = document.body?.getAttribute("data-page-title");
  if (titleKey) {
    document.title = translations[lang]?.[titleKey] || translations.en[titleKey] || document.title;
  }
}

function updateLanguageButton(lang = getCurrentLanguage()) {
  const btn = document.getElementById("langButton");
  if (!btn) return;

  btn.innerHTML = "🌐";
  btn.title = lang.toUpperCase();
}

function injectLanguageSelector() {
  const navbarNav = document.querySelector(".navbar nav");

  if (!navbarNav) return;

  // If selector already exists in HTML, do not create another one
  if (document.getElementById("langButton")) {
    document.querySelectorAll("[data-lang-switch]").forEach((btn) => {
      btn.addEventListener("click", () => {
        setLanguage(btn.getAttribute("data-lang-switch"));
      });
    });

    updateLanguageButton();
    return;
  }

  const wrapper = document.createElement("div");
  wrapper.className = "dropdown";
  wrapper.id = "langDropdownWrap";

  wrapper.innerHTML = `
    <button
      class="btn btn-warning dropdown-toggle"
      type="button"
      id="langButton"
      data-bs-toggle="dropdown"
      aria-expanded="false"
      style="margin-top:0;"
    >
      🌐 English
    </button>
    <ul class="dropdown-menu dropdown-menu-end dropdown-menu-dark">
      <li><button class="dropdown-item" type="button" data-lang-switch="en">English</button></li>
      <li><button class="dropdown-item" type="button" data-lang-switch="ru">Русский</button></li>
      <li><button class="dropdown-item" type="button" data-lang-switch="uz">O‘zbek</button></li>
    </ul>
  `;

  navbarNav.appendChild(wrapper);

  wrapper.querySelectorAll("[data-lang-switch]").forEach((btn) => {
    btn.addEventListener("click", () => {
      setLanguage(btn.getAttribute("data-lang-switch"));
    });
  });

  function updateLanguageButton(lang = getCurrentLanguage()) {
  const btn = document.getElementById("langButton");
  if (!btn) return;

  btn.innerHTML = "🌐";
  btn.setAttribute("title", lang.toUpperCase());
}
}

document.addEventListener("DOMContentLoaded", () => {
  injectLanguageSelector();
  applyTranslations();
});