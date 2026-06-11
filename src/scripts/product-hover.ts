export function initProductHover() {
  if (window.innerWidth < 992) return;
  const items = document.querySelectorAll(".home_product-item");
  items.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      item.classList.add("is-active");
      document.querySelectorAll(".home_product-card_bottom").forEach((el) => {
        if (!item.contains(el)) el.classList.add("inactive");
      });
    });
    item.addEventListener("mouseleave", () => {
      item.classList.remove("is-active");
      document.querySelectorAll(".home_product-card_bottom").forEach((el) => {
        el.classList.remove("inactive");
      });
    });
  });
}
