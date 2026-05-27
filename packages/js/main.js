const root = document.documentElement;
root.classList.add("js");

const navToggle = document.querySelector(".nav__toggle");
const navMenu = document.getElementById("nav-menu");
const navLinks = document.querySelectorAll(".nav__link");
const themeToggle = document.getElementById("theme-toggle");

const storedTheme = localStorage.getItem("selected-theme");
const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
const initialTheme = storedTheme || (prefersDark ? "dark" : "light");

function setTheme(theme) {
  root.dataset.theme = theme;
  localStorage.setItem("selected-theme", theme);

  if (themeToggle) {
    const nextTheme = theme === "dark" ? "light" : "dark";
    themeToggle.setAttribute("aria-label", `Switch to ${nextTheme} theme`);
  }
}

setTheme(initialTheme);

function closeNavigation() {
  document.body.classList.remove("nav-open");
  navToggle?.setAttribute("aria-expanded", "false");
  navToggle?.setAttribute("aria-label", "Open navigation");
}

function toggleNavigation() {
  const isOpen = document.body.classList.toggle("nav-open");
  navToggle?.setAttribute("aria-expanded", String(isOpen));
  navToggle?.setAttribute("aria-label", isOpen ? "Close navigation" : "Open navigation");
}

navToggle?.addEventListener("click", toggleNavigation);

navLinks.forEach((link) => {
  link.addEventListener("click", closeNavigation);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeNavigation();
  }
});

window.addEventListener("resize", () => {
  if (window.innerWidth > 820) {
    closeNavigation();
  }
});

themeToggle?.addEventListener("click", () => {
  const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";
  setTheme(nextTheme);
});

const sections = Array.from(document.querySelectorAll("main section[id]"));

if ("IntersectionObserver" in window && sections.length > 0) {
  const activeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        const activeId = entry.target.id;
        navLinks.forEach((link) => {
          const isActive = link.getAttribute("href") === `#${activeId}`;
          link.classList.toggle("active-link", isActive);
        });
      });
    },
    {
      rootMargin: "-35% 0px -55% 0px",
      threshold: 0,
    }
  );

  sections.forEach((section) => activeObserver.observe(section));
}

const revealElements = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window && revealElements.length > 0) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.15,
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}
