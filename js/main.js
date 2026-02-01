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
  const map = {
    home: document.querySelector("#home"),
    projects: document.querySelector("#projects"),
    about: document.querySelector("#about"),
    contact: document.querySelector("#contact"),
  };

  const sections = Object.entries(map)
    .filter(([, el]) => el)
    .map(([key, el]) => ({ key, el }));

  if (!sections.length) return;

  const setActive = (key) => {
    links.forEach((a) => a.classList.toggle("is-active", a.dataset.spy === key));
  };

  // show/hide capsule on scroll (same behavior everywhere)
  const toggleVisible = () => {
    if (window.scrollY > 120) stickyNav.classList.add("is-visible");
    else stickyNav.classList.remove("is-visible");
  };

  // robust scrollspy for mobile + desktop
  const SPY_OFFSET = 140; // how far from top counts as "active"
  const updateActive = () => {
    const y = window.scrollY + SPY_OFFSET;

    let current = sections[0].key;
    for (const s of sections) {
      if (s.el.offsetTop <= y) current = s.key;
    }
    setActive(current);
  };

  // Smooth scroll for sticky nav clicks
  const SCROLL_OFFSET = 90;
  links.forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || !href.startsWith("#")) return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const y = target.getBoundingClientRect().top + window.scrollY;
      window.scrollTo({ top: Math.max(0, y - SCROLL_OFFSET), behavior: "smooth" });
    });
  });

  // run once + on scroll
  const onScroll = () => {
    toggleVisible();
    updateActive();
  };

  window.addEventListener("scroll", () => requestAnimationFrame(onScroll), { passive: true });
  window.addEventListener("resize", () => requestAnimationFrame(onScroll));

  // initial
  toggleVisible();
  updateActive();
})();




(function () {
  const btn = document.querySelector(".mobile-menu-btn");
  const mobileCapsule = document.querySelector(".capsule-nav");
  if (!btn || !mobileCapsule) return;

  const links = Array.from(mobileCapsule.querySelectorAll(".capsule-link"));

  const isMobile = () => window.matchMedia("(max-width: 900px)").matches;

  function setActiveById(id) {
    links.forEach((a) => {
      const href = a.getAttribute("href") || "";
      a.classList.toggle("is-active", href === `#${id}`);
    });
  }

  function openMenu() {
    mobileCapsule.classList.add("is-open");
    btn.classList.add("is-open");
    btn.setAttribute("aria-expanded", "true");
  }

  function closeMenu() {
    mobileCapsule.classList.remove("is-open");
    btn.classList.remove("is-open");
    btn.setAttribute("aria-expanded", "false");
  }

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    e.stopPropagation();
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
    if (!isMobile()) return;
    if (!mobileCapsule.classList.contains("is-open")) return;

    const inside = mobileCapsule.contains(e.target) || btn.contains(e.target);
    if (!inside) closeMenu();
  });

  // Scrollspy for mobile capsule (mobile only)
  const sections = [
    { id: "home", el: document.querySelector("#home") },
    { id: "projects", el: document.querySelector("#projects") },
    { id: "about", el: document.querySelector("#about") },
    { id: "contact", el: document.querySelector("#contact") },
  ].filter((s) => s.el);

  if (!sections.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      if (!isMobile()) return;

      // pick the closest section to the top "reading zone"
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visible) {
        const s = sections.find((x) => x.el === visible.target);
        if (s) setActiveById(s.id);
      }
    },
    {
      threshold: [0.12, 0.25, 0.4],
      // more forgiving on mobile:
      rootMargin: "-10% 0px -70% 0px",
    }
  );

  sections.forEach((s) => io.observe(s.el));

  // Default
  setActiveById("home");

  // If user rotates to desktop, close menu and do nothing else
  window.addEventListener("resize", () => {
    if (!isMobile()) closeMenu();
  });
})();
