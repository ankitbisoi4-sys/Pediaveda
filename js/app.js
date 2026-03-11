const yearEl = document.querySelector("#year");
if (yearEl) {
  yearEl.textContent = new Date().getFullYear();
}

// mobile nav
const toggle = document.querySelector(".nav-toggle");
const nav = document.querySelector("#mainNav");
if (toggle && nav) {
  toggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });
}

nav?.querySelectorAll("a[href]").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    toggle?.setAttribute("aria-expanded", "false");
  });
});

const normalizePath = (value) => {
  if (!value) return "/";
  let normalized = value.toLowerCase();
  if (normalized.startsWith("http")) {
    try {
      normalized = new URL(normalized).pathname;
    } catch {
      return "/";
    }
  }
  normalized = normalized.replace(/^(\.\/)+/, "/");
  if (!normalized.startsWith("/")) normalized = `/${normalized.replace(/^\/+/, "")}`;
  normalized = normalized.replace(/index\.html$/, "");
  if (normalized.length > 1 && normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized || "/";
};

const currentPath = normalizePath(window.location.pathname);

document.querySelectorAll(".nav a[href]").forEach((link) => {
  const normalized = normalizePath(link.getAttribute("href"));
  if (
    normalized === currentPath ||
    (normalized === "/" && currentPath === "/") ||
    (normalized !== "/" && currentPath.endsWith(normalized))
  ) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
    const parent = link.closest(".has-dd");
    parent?.querySelector(":scope > a")?.classList.add("active");
  }
});
