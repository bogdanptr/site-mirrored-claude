import Lenis from "lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Swiper from "swiper";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { initProductHover } from "./product-hover";
import { initNav } from "./nav";

gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", () => {
  const dynamicYearEl = document.querySelector(".dynamic-year");
  if (dynamicYearEl) {
    dynamicYearEl.textContent = String(new Date().getFullYear());
  }

  // Lenis smooth scroll
  const lenis = new Lenis();
  lenis.on("scroll", ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Footer logo draw-in (approximated as fade/slide-up; DrawSVGPlugin is a paid GSAP plugin)
  const footerShapes = gsap.utils.toArray<SVGPathElement>(".footer_logo path");
  if (footerShapes.length) {
    gsap.from(footerShapes, {
      scrollTrigger: {
        trigger: ".footer",
        start: "clamp(top bottom)",
        end: "clamp(bottom bottom)",
        toggleActions: "play none none none",
      },
      yPercent: 100,
      autoAlpha: 0,
      stagger: 0.1,
      duration: 2.2,
      ease: "power4.out",
    });
  }

  // Border draw-in
  const borders = gsap.utils.toArray<HTMLElement>(".u-border");
  borders.forEach((line) => {
    gsap.from(line, {
      scaleX: 0,
      transformOrigin: "left center",
      duration: 2.4,
      ease: "power4.inOut",
      scrollTrigger: {
        trigger: line,
        start: "bottom bottom",
        end: "bottom top",
      },
    });
  });

  // CTA section transformer animation
  const ctaSection = document.querySelector("[section-cta]");
  if (ctaSection) {
    gsap
      .timeline({
        scrollTrigger: {
          trigger: ".transformer_container",
          start: "clamp(top bottom)",
          end: "clamp(top top)",
          scrub: true,
        },
        defaults: {
          ease: "power4.out",
        },
      })
      .set("[cta-number-container]", { width: "2.5rem" })
      .from("[cta-number]", { textContent: 30.0, snap: { textContent: 0.1 } }, "<")
      .from(".cta_transformer", { yPercent: 20 }, "<")
      .fromTo(
        ".cta_transformer-left .transformer_guide",
        { height: "0%" },
        { height: "50%", ease: "power1.out" },
        "<"
      )
      .fromTo(
        ".cta_transformer-top .transformer_guide",
        { width: "0%" },
        { width: "50%", ease: "power1.out" },
        "<"
      );
  }

  // Envelope load-in (approximated as fade-in; DrawSVGPlugin is a paid GSAP plugin)
  const envelopes = gsap.utils
    .toArray<SVGPathElement>(".envelope path")
    .filter((line) => !line.closest(".cc-no-animate"));
  envelopes.forEach((line) => {
    gsap.set(line.closest(".envelope"), { autoAlpha: 0 });
    gsap.timeline({
      scrollTrigger: {
        trigger: line,
        start: "top bottom",
        end: "clamp(bottom top)",
        toggleActions: "play none none none",
      },
    })
      .to(line.closest(".envelope"), { autoAlpha: 1, duration: 0 })
      .from(line, { autoAlpha: 0, duration: 1.2, ease: "power4.out" }, "<");
  });

  // Parallax images
  gsap.utils.toArray<HTMLElement>(".a-parallax-container").forEach((container) => {
    if ((container as HTMLElement).dataset.parallax === "false") return;
    const image = container.querySelector<HTMLElement>(".a-parallax-image");
    if (!image) return;
    gsap.fromTo(
      image,
      { yPercent: -5 },
      {
        yPercent: 5,
        ease: "none",
        scrollTrigger: {
          trigger: container,
          scrub: true,
          pin: false,
          invalidateOnRefresh: true,
        },
      }
    );
  });

  // Stats counters
  const stats = document.querySelectorAll("[data-gsap=stats]");
  if (stats.length) {
    gsap.from(stats, {
      scrollTrigger: {
        trigger: stats[0],
        start: "top bottom",
        end: "bottom top",
        toggleActions: "play none play play",
      },
      duration: 1.2,
      ease: "power4.out",
      textContent: 0,
      snap: { textContent: 1 },
    });
  }

  // Testimonials swiper
  const productSection = document.querySelector("[products-section]");
  if (productSection) {
    new Swiper(".swiper.cc-products", {
      modules: [Navigation],
      breakpoints: {
        320: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1280: { slidesPerView: 3 },
      },
      navigation: {
        nextEl: ".swiper-arrows.cc-blocks.cc-next.cc-explore",
        prevEl: ".swiper-arrows.cc-blocks.cc-prev.cc-explore",
      },
      spaceBetween: 16,
      disabledClass: "cc-disabled",
    });
  }

  // Resources nav dropdown blog carousel (mobile only)
  const blogSwiperEl = document.querySelector(".swiper.cc-blog-related");
  if (blogSwiperEl && window.innerWidth < 768) {
    new Swiper(".swiper.cc-blog-related", {
      modules: [Navigation],
      slidesPerView: 1,
      spaceBetween: 16,
      navigation: {
        nextEl: ".swiper-arrows.cc-blocks.cc-next:not(.cc-navigation):not(.cc-explore)",
        prevEl: ".swiper-arrows.cc-blocks.cc-prev:not(.cc-navigation):not(.cc-explore)",
      },
      disabledClass: "cc-disabled",
    });
  }

  initProductHover();
  initNav(lenis);
});
