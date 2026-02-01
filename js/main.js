(function () {
    const hero = document.querySelector(".landing-hero");
    const trigger = document.querySelector(".hero-morph-trigger");
    if (!hero || !trigger) return;

    // Trigger when the top of the next content reaches the top area
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          // If trigger is visible, user has scrolled past hero => morph ON
          if (entry.isIntersecting) {
            hero.classList.add("is-morphed");
          } else {
            hero.classList.remove("is-morphed");
          }
        });
      },
      {
        root: null,
        threshold: 0,
        // Move the activation point up/down:
        // negative top means "activate a bit earlier"
        rootMargin: "-20% 0px 0px 0px",
      }
    );

    io.observe(trigger);
  })();






  (function () {
    const btn = document.querySelector(".scroll-top");
    if (!btn) return;

    // Show button after scrolling down
    window.addEventListener("scroll", () => {
      if (window.scrollY > 600) {
        btn.classList.add("is-visible");
      } else {
        btn.classList.remove("is-visible");
      }
    });

    // Scroll to top on click
    btn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  })();


  



  (function () {
    const stickyNav = document.querySelector(".sticky-nav");
    if (!stickyNav) return;

    const links = Array.from(stickyNav.querySelectorAll(".sticky-nav__link"));
    const setActive = (key) => {
      links.forEach((a) => a.classList.toggle("is-active", a.dataset.spy === key));
    };

    // 1) Show/hide capsule on scroll
    const toggleVisible = () => {
      if (window.scrollY > 120) stickyNav.classList.add("is-visible");
      else stickyNav.classList.remove("is-visible");
    };
    window.addEventListener("scroll", toggleVisible, { passive: true });
    toggleVisible();

    // 2) Scrollspy using IntersectionObserver
    const sections = [
      { key: "top", el: document.querySelector(".landing-hero") },
      { key: "projects", el: document.querySelector("#projects") },
      { key: "about", el: document.querySelector("#about") },
      { key: "contact", el: document.querySelector("#contact") },
    ].filter(s => s.el);

    // If nothing found, stop
    if (!sections.length) return;

    const io = new IntersectionObserver(
      (entries) => {
        // pick the most visible intersecting section
        const visible = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio - a.intersectionRatio))[0];

        if (visible) {
          const found = sections.find(s => s.el === visible.target);
          if (found) setActive(found.key);
        }
      },
      {
        root: null,
        threshold: [0.2, 0.35, 0.5, 0.65],
        // pushes the "active" point a bit down from top so it feels natural
        rootMargin: "-20% 0px -55% 0px",
      }
    );

    sections.forEach(s => io.observe(s.el));

    // Default active
    setActive("top");

    // 3) Smooth scroll on click (and account for sticky nav height)
    links.forEach((a) => {
      a.addEventListener("click", (e) => {
        const href = a.getAttribute("href");
        if (!href || !href.startsWith("#")) return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        const y = target.getBoundingClientRect().top + window.scrollY;
        const offset = 90; // adjust if you want it higher/lower
        window.scrollTo({ top: Math.max(0, y - offset), behavior: "smooth" });
      });
    });
  })();



(function () {
  const btn = document.querySelector(".mobile-menu-btn");
  const mobileCapsule = document.querySelector(".capsule-nav");
  if (!btn || !mobileCapsule) return;

  const links = Array.from(mobileCapsule.querySelectorAll(".capsule-link"));

  function setActiveById(id) {
    links.forEach((a) => {
      const href = a.getAttribute("href") || "";
      const match = href === `#${id}`;
      a.classList.toggle("is-active", match);
    });
  }

  function openMenu() {
    btn.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
    mobileCapsule.classList.add("is-open");
  }

  function closeMenu() {
    btn.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
    mobileCapsule.classList.remove("is-open");
  }

  // Toggle on click
  btn.addEventListener("click", () => {
    mobileCapsule.classList.contains("is-open") ? closeMenu() : openMenu();
  });

  // Close when clicking a link + smooth scroll
  links.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      closeMenu();

      const y = target.getBoundingClientRect().top + window.scrollY;
      const offset = 86;
      window.scrollTo({ top: Math.max(0, y - offset), behavior: "smooth" });
    });
  });

  // Close if you tap outside
  document.addEventListener("click", (e) => {
    if (!mobileCapsule.classList.contains("is-open")) return;
    const isInside = mobileCapsule.contains(e.target) || btn.contains(e.target);
    if (!isInside) closeMenu();
  });

  // Scrollspy for mobile capsule
  const sections = [
    { id: "home", el: document.querySelector("#home") },
    { id: "projects", el: document.querySelector("#projects") },
    { id: "about", el: document.querySelector("#about") },
    { id: "contact", el: document.querySelector("#contact") },
  ].filter((s) => s.el);

  if (!sections.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        const s = sections.find((x) => x.el === visible.target);
        if (s) setActiveById(s.id);
      }
    },
    {
      root: null,
      threshold: [0.25, 0.4, 0.55, 0.7],
      rootMargin: "-20% 0px -55% 0px",
    }
  );

  sections.forEach((s) => io.observe(s.el));

  // Default
  setActiveById("home");
})();
