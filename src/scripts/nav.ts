export function initNav(lenis?: { stop: () => void; start: () => void }) {
  const menuButton = document.querySelector<HTMLElement>(".menu_button.w-nav-button");
  const navMenu = document.querySelector<HTMLElement>(".nav_menu.w-nav-menu");
  const navbar = document.querySelector<HTMLElement>(".navbar");

  if (menuButton && navMenu) {
    menuButton.addEventListener("click", () => {
      const isOpen = navMenu.classList.toggle("w--open");
      menuButton.classList.toggle("w--open", isOpen);
      navbar?.classList.toggle("u-nav-fixed", isOpen);
      document.body.classList.toggle("u-no-scroll", isOpen);

      if (isOpen) {
        lenis?.stop();
      } else {
        lenis?.start();
      }

      if (!isOpen) {
        document.querySelectorAll(".nav_dropdown.w-dropdown").forEach((d) => {
          d.classList.remove("w--open");
          d.querySelector(".w-dropdown-toggle")?.classList.remove("w--open");
          d.querySelector(".w-dropdown-list")?.classList.remove("w--open");
        });
      }
    });
  }

  const dropdowns = document.querySelectorAll<HTMLElement>(".nav_dropdown.w-dropdown");

  dropdowns.forEach((dropdown) => {
    const toggle = dropdown.querySelector<HTMLElement>(".nav_dropdown-toggle");
    if (!toggle) return;

    toggle.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = dropdown.classList.contains("w--open");
      dropdowns.forEach((d) => {
        d.classList.remove("w--open");
        d.querySelector(".w-dropdown-toggle")?.classList.remove("w--open");
        d.querySelector(".w-dropdown-list")?.classList.remove("w--open");
      });
      if (!isOpen) {
        dropdown.classList.add("w--open");
        toggle.classList.add("w--open");
        dropdown.querySelector(".w-dropdown-list")?.classList.add("w--open");
        window.dispatchEvent(new Event("resize"));
      }
    });
  });

  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    if (!target.closest(".nav_dropdown.w-dropdown")) {
      dropdowns.forEach((d) => {
        d.classList.remove("w--open");
        d.querySelector(".w-dropdown-toggle")?.classList.remove("w--open");
        d.querySelector(".w-dropdown-list")?.classList.remove("w--open");
      });
    }
  });

  // Tabs inside dropdowns
  document.querySelectorAll<HTMLElement>(".nav_dropdown-tabs.w-tabs").forEach((tabs) => {
    const links = tabs.querySelectorAll<HTMLElement>(".nav_dropdown-tabs-link.w-tab-link[data-w-tab]");
    const panes = tabs.querySelectorAll<HTMLElement>(".nav_dropdown-tabs-pane.w-tab-pane[data-w-tab]");

    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        const tabName = link.getAttribute("data-w-tab");

        links.forEach((l) => l.classList.remove("w--current"));
        link.classList.add("w--current");

        panes.forEach((pane) => {
          if (pane.getAttribute("data-w-tab") === tabName) {
            pane.classList.add("w--tab-active");
          } else {
            pane.classList.remove("w--tab-active");
          }
        });
      });
    });
  });
}
