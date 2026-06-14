(function () {
  const THEME_KEY = "site-theme";
  const LANG_KEY = "site-lang";
  const SITE_TITLE = "何莲英 / HE Lianying";

  function applyTheme(theme) {
    const isDark = theme === "dark";
    document.body.classList.toggle("quarto-dark", isDark);
    document.body.classList.toggle("quarto-light", !isDark);
    document.documentElement.setAttribute("data-theme", theme);

    const toggle = document.getElementById("theme-toggle");
    if (toggle) {
      const lang = document.body.dataset.lang || localStorage.getItem(LANG_KEY) || "zh";
      toggle.setAttribute("aria-pressed", String(isDark));
      toggle.title =
        lang === "zh"
          ? isDark
            ? "切换到白天模式"
            : "切换到夜晚模式"
          : isDark
            ? "Switch to day mode"
            : "Switch to night mode";
      toggle.setAttribute("aria-label", toggle.title);
    }
  }

  function applyLang(lang) {
    const normalized = lang === "en" ? "en" : "zh";
    document.documentElement.lang = normalized;
    document.body.dataset.lang = normalized;
    document.title = SITE_TITLE;

    document.querySelectorAll("[data-i18n-en][data-i18n-zh]").forEach((el) => {
      const text = normalized === "en" ? el.dataset.i18nEn : el.dataset.i18nZh;
      if (text !== undefined) el.textContent = text;
    });

    document.querySelectorAll("[data-i18n-alt-en][data-i18n-alt-zh]").forEach((el) => {
      const alt = normalized === "en" ? el.dataset.i18nAltEn : el.dataset.i18nAltZh;
      if (alt !== undefined) el.alt = alt;
    });

    document.querySelectorAll(".site-lang-btn").forEach((btn) => {
      const active = btn.dataset.lang === normalized;
      btn.classList.toggle("active", active);
      btn.setAttribute("aria-pressed", String(active));
    });

    document.querySelectorAll(".site-cv-link").forEach((link) => {
      const label = normalized === "en" ? link.dataset.i18nEn : link.dataset.i18nZh;
      if (label) {
        link.title = label;
        link.setAttribute("aria-label", label);
      }
    });

    applyTheme(document.body.classList.contains("quarto-dark") ? "dark" : "light");
  }

  function initThemeToggle() {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;

    if (!localStorage.getItem(THEME_KEY)) {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      applyTheme(prefersDark ? "dark" : "light");
    }

    toggle.addEventListener("click", () => {
      const next = document.body.classList.contains("quarto-dark") ? "light" : "dark";
      localStorage.setItem(THEME_KEY, next);
      applyTheme(next);
    });
  }

  function initLangToggle() {
    const saved = localStorage.getItem(LANG_KEY) || "zh";
    applyLang(saved);

    document.querySelectorAll(".site-lang-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const lang = btn.dataset.lang;
        if (!lang) return;
        localStorage.setItem(LANG_KEY, lang);
        applyLang(lang);
      });
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    const savedTheme = localStorage.getItem(THEME_KEY);
    if (savedTheme) applyTheme(savedTheme);
    initThemeToggle();
    initLangToggle();
  });
})();
