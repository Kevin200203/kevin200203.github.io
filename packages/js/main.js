const root = document.documentElement;
root.classList.add("js");

const navToggle = document.querySelector(".nav__toggle");
const navLinks = document.querySelectorAll(".nav__link");
const sections = Array.from(document.querySelectorAll("main section[id]"));

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

if (window.location.hash && revealElements.length > 0) {
  revealElements.forEach((element) => element.classList.add("is-visible"));
} else if ("IntersectionObserver" in window && revealElements.length > 0) {
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
      threshold: 0.12,
    }
  );

  revealElements.forEach((element) => revealObserver.observe(element));
} else {
  revealElements.forEach((element) => element.classList.add("is-visible"));
}
