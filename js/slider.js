document.addEventListener("DOMContentLoaded", () => {
  const sliders = document.querySelectorAll("[data-slider]");
  sliders.forEach((slider) => {
    const slides = Array.from(slider.children);
    if (slides.length <= 1) return;

    let index = 0;
    let timer;

    const scrollToIndex = (i, behavior = "smooth") => {
      const target = slides[i];
      if (!target) return;
      slider.scrollTo({ left: target.offsetLeft, behavior });
    };

    const start = () => {
      stop();
      timer = window.setInterval(() => {
        index = (index + 1) % slides.length;
        scrollToIndex(index);
      }, 6000);
    };

    const stop = () => {
      if (timer) {
        window.clearInterval(timer);
        timer = undefined;
      }
    };

    slider.addEventListener("mouseenter", stop);
    slider.addEventListener("mouseleave", start);
    slider.addEventListener("focusin", stop);
    slider.addEventListener("focusout", start);

    slider.addEventListener("keydown", (event) => {
      if (event.key === "ArrowRight") {
        event.preventDefault();
        index = Math.min(index + 1, slides.length - 1);
        scrollToIndex(index);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        index = Math.max(index - 1, 0);
        scrollToIndex(index);
      }
    });

    slider.setAttribute("tabindex", "0");
    start();
  });
});
