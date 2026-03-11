document.addEventListener("DOMContentLoaded", () => {
  const triggers = Array.from(document.querySelectorAll("[data-lightbox]"));
  if (!triggers.length) return;

  const groups = triggers.reduce((map, trigger) => {
    const group = trigger.getAttribute("data-lightbox") || "default";
    if (!map.has(group)) map.set(group, []);
    map.get(group).push(trigger);
    return map;
  }, new Map());

  let activeIndex = 0;
  let activeGroup = "default";
  let overlay;

  const render = () => {
    const groupItems = groups.get(activeGroup) || [];
    const item = groupItems[activeIndex];
    if (!item || !overlay) return;

    const img = overlay.querySelector("img");
    const captionEl = overlay.querySelector("[data-lightbox-caption]");
    img.src = item.getAttribute("href");
    img.alt = item.querySelector("img")?.alt || "Gallery image";
    captionEl.textContent = item.getAttribute("data-caption") || "";

    overlay.querySelector("[data-lightbox-prev]").disabled = activeIndex === 0;
    overlay.querySelector("[data-lightbox-next]").disabled =
      activeIndex === groupItems.length - 1;
  };

  const close = () => {
    if (overlay) {
      overlay.remove();
      overlay = undefined;
      document.body.classList.remove("lightbox-open");
    }
    document.removeEventListener("keydown", handleKeydown);
  };

  const handleKeydown = (event) => {
    if (event.key === "Escape") {
      close();
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      changeSlide(1);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      changeSlide(-1);
    }
  };

  const changeSlide = (delta) => {
    const groupItems = groups.get(activeGroup) || [];
    const nextIndex = Math.min(
      Math.max(activeIndex + delta, 0),
      groupItems.length - 1,
    );
    if (nextIndex !== activeIndex) {
      activeIndex = nextIndex;
      render();
    }
  };

  const open = (trigger) => {
    activeGroup = trigger.getAttribute("data-lightbox") || "default";
    const groupItems = groups.get(activeGroup) || [];
    activeIndex = groupItems.indexOf(trigger);

    if (!overlay) {
      overlay = document.createElement("div");
      overlay.className = "lightbox";
      overlay.innerHTML = `
        <div class="lightbox__backdrop" data-lightbox-close></div>
        <figure class="lightbox__content">
          <button class="lightbox__close" type="button" aria-label="Close" data-lightbox-close>&times;</button>
          <img src="" alt="" loading="lazy" />
          <figcaption data-lightbox-caption></figcaption>
          <div class="lightbox__controls">
            <button type="button" data-lightbox-prev aria-label="Previous image">‹</button>
            <button type="button" data-lightbox-next aria-label="Next image">›</button>
          </div>
        </figure>
      `;
      document.body.appendChild(overlay);

      overlay.addEventListener("click", (event) => {
        if (event.target.matches("[data-lightbox-close]")) {
          close();
        } else if (event.target.matches("[data-lightbox-prev]")) {
          changeSlide(-1);
        } else if (event.target.matches("[data-lightbox-next]")) {
          changeSlide(1);
        }
      });
    }

    document.body.classList.add("lightbox-open");
    render();
    document.addEventListener("keydown", handleKeydown);
  };

  document.addEventListener("click", (event) => {
    const trigger = event.target.closest("[data-lightbox]");
    if (!trigger) return;
    event.preventDefault();
    open(trigger);
  });
});
