(() => {
  "use strict";

  const doc = document;
  const body = doc.body;

  /* ------------------------------------------------------------------------
     Header state
     ------------------------------------------------------------------------ */

  const header = doc.getElementById("site-header");
  let scrollTicking = false;

  const updateHeader = () => {
    if (header) {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
    }
    scrollTicking = false;
  };

  updateHeader();
  window.addEventListener(
    "scroll",
    () => {
      if (!scrollTicking) {
        window.requestAnimationFrame(updateHeader);
        scrollTicking = true;
      }
    },
    { passive: true }
  );

  /* ------------------------------------------------------------------------
     Mobile menu
     ------------------------------------------------------------------------ */

  const menu = doc.getElementById("mobile-menu");
  const menuToggle = doc.getElementById("menu-toggle");
  const menuClose = doc.getElementById("menu-close");
  const main = doc.getElementById("main");
  const footer = doc.querySelector(".site-footer");
  let lastFocused = null;

  const getMenuFocusables = () => {
    if (!menu) return [];
    return Array.from(menu.querySelectorAll('a[href], button:not([disabled])'));
  };

  const focusTarget = (target) => {
    if (!target) return;
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
    target.addEventListener(
      "blur",
      () => {
        target.removeAttribute("tabindex");
      },
      { once: true }
    );
  };

  const onMenuKeydown = (event) => {
    if (!menu || menu.hidden) return;

    if (event.key === "Escape") {
      event.preventDefault();
      closeMenu();
      return;
    }

    if (event.key !== "Tab") return;

    const focusables = getMenuFocusables();
    if (!focusables.length) return;

    const first = focusables[0];
    const last = focusables[focusables.length - 1];

    if (event.shiftKey && doc.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && doc.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  function openMenu() {
    if (!menu || !menuToggle) return;

    lastFocused = doc.activeElement;
    menu.hidden = false;
    menuToggle.setAttribute("aria-expanded", "true");
    menuToggle.setAttribute("aria-label", "Close menu");
    body.classList.add("menu-open");

    if (main) main.setAttribute("inert", "");
    if (header) header.setAttribute("inert", "");
    if (footer) footer.setAttribute("inert", "");

    doc.addEventListener("keydown", onMenuKeydown);

    window.requestAnimationFrame(() => {
      if (menuClose) menuClose.focus();
    });
  }

  function closeMenu({ restoreFocus = true } = {}) {
    if (!menu || menu.hidden) return;

    menu.hidden = true;
    if (menuToggle) {
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open menu");
    }
    body.classList.remove("menu-open");

    if (main) main.removeAttribute("inert");
    if (header) header.removeAttribute("inert");
    if (footer) footer.removeAttribute("inert");

    doc.removeEventListener("keydown", onMenuKeydown);

    if (restoreFocus && lastFocused instanceof HTMLElement) {
      lastFocused.focus();
    }
  }

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
      if (menu.hidden) {
        openMenu();
      } else {
        closeMenu();
      }
    });
  }

  if (menuClose) {
    menuClose.addEventListener("click", () => closeMenu());
  }

  if (menu) {
    menu.addEventListener("click", (event) => {
      if (event.target === menu) {
        closeMenu();
        return;
      }

      const link = event.target.closest('a[href^="#"]');
      if (!link) return;

      event.preventDefault();

      const hash = link.getAttribute("href");
      const target = doc.querySelector(hash);
      closeMenu({ restoreFocus: false });

      if (window.history && typeof window.history.pushState === "function") {
        window.history.pushState(null, "", hash);
      }

      if (target) {
        window.setTimeout(() => {
          focusTarget(target);
          target.scrollIntoView({ block: "start", behavior: "instant" });
        }, 0);
      }
    });
  }

  const desktopQuery = window.matchMedia("(min-width: 961px)");
  const handleDesktopChange = (event) => {
    if (event.matches) closeMenu({ restoreFocus: false });
  };

  if (typeof desktopQuery.addEventListener === "function") {
    desktopQuery.addEventListener("change", handleDesktopChange);
  } else if (typeof desktopQuery.addListener === "function") {
    desktopQuery.addListener(handleDesktopChange);
  }

  /* ------------------------------------------------------------------------
     Active navigation
     ------------------------------------------------------------------------ */

  const sectionIds = ["work", "about", "skills", "education", "contact"];
  const sections = sectionIds
    .map((id) => doc.getElementById(id))
    .filter((section) => section instanceof HTMLElement);

  const navLinks = Array.from(
    doc.querySelectorAll('.desktop-nav a[href^="#"], .mobile-nav a[href^="#"]')
  );

  const setActiveSection = (id) => {
    navLinks.forEach((link) => {
      if (id && link.getAttribute("href") === `#${id}`) {
        link.setAttribute("aria-current", "true");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const updateActiveSection = () => {
    if (!sections.length) return;

    const probe = window.scrollY + 140;
    let current = null;

    sections.forEach((section) => {
      const top = section.getBoundingClientRect().top + window.scrollY;
      if (top <= probe) current = section.id;
    });

    const atBottom =
      window.innerHeight + window.scrollY >= doc.documentElement.scrollHeight - 4;

    setActiveSection(atBottom ? "contact" : current);
  };

  if (sections.length) {
    let navTicking = false;

    window.addEventListener(
      "scroll",
      () => {
        if (!navTicking) {
          window.requestAnimationFrame(() => {
            updateActiveSection();
            navTicking = false;
          });
          navTicking = true;
        }
      },
      { passive: true }
    );

    window.addEventListener("resize", updateActiveSection);
    window.addEventListener("load", updateActiveSection);
    updateActiveSection();
  }

  /* ------------------------------------------------------------------------
     Reveal on scroll
     ------------------------------------------------------------------------ */

  const reveals = Array.from(doc.querySelectorAll(".reveal"));
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  if (reveals.length) {
    if (reducedMotion.matches || !("IntersectionObserver" in window)) {
      reveals.forEach((element) => element.classList.add("is-visible"));
    } else {
      reveals.forEach((element) => element.classList.add("is-pending"));

      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-visible");
              entry.target.classList.remove("is-pending");
              observer.unobserve(entry.target);
            }
          });
        },
        {
          rootMargin: "0px 0px -8% 0px",
          threshold: 0.08,
        }
      );

      reveals.forEach((element) => revealObserver.observe(element));
    }
  }

  /* ------------------------------------------------------------------------
     Contact form
     ------------------------------------------------------------------------ */

  const form = doc.getElementById("contact-form");

  if (form instanceof HTMLFormElement) {
    form.noValidate = true;

    const status = doc.getElementById("form-status");
    const submitButton = form.querySelector('button[type="submit"]');

    const fields = [
      {
        input: doc.getElementById("name"),
        error: doc.getElementById("name-error"),
        validate(value) {
          const clean = value.trim();
          if (clean.length < 2) return "Please enter your name.";
          if (clean.length > 80) return "Please keep your name under 80 characters.";
          return true;
        },
      },
      {
        input: doc.getElementById("email"),
        error: doc.getElementById("email-error"),
        validate(value) {
          const clean = value.trim();
          if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
            return "Please enter a valid email address.";
          }
          return true;
        },
      },
      {
        input: doc.getElementById("subject"),
        error: doc.getElementById("subject-error"),
        validate(value) {
          const clean = value.trim();
          if (clean.length < 3) return "Please add a short subject.";
          return true;
        },
      },
      {
        input: doc.getElementById("message"),
        error: doc.getElementById("message-error"),
        validate(value) {
          const clean = value.trim();
          if (clean.length < 10) return "Please write at least 10 characters.";
          return true;
        },
      },
    ].filter((field) => field.input && field.error);

    const setFieldState = (field, message) => {
      const wrapper = field.input.closest(".field");
      if (!wrapper) return;

      if (message) {
        wrapper.classList.add("is-invalid");
        field.input.setAttribute("aria-invalid", "true");
        field.error.textContent = message;
      } else {
        wrapper.classList.remove("is-invalid");
        field.input.removeAttribute("aria-invalid");
        field.error.textContent = "";
      }
    };

    fields.forEach((field) => {
      field.input.addEventListener("input", () => {
        const wrapper = field.input.closest(".field");
        if (!wrapper || !wrapper.classList.contains("is-invalid")) return;
        const result = field.validate(field.input.value);
        setFieldState(field, result === true ? "" : result);
      });
    });

    form.addEventListener("submit", async (event) => {
      event.preventDefault();

      if (!status || !submitButton) return;

      const honeypot = form.querySelector('input[name="botcheck"]');
      if (honeypot instanceof HTMLInputElement && honeypot.checked) {
        status.className = "form-status form-status--success";
        status.textContent = "Message sent. I'll get back to you soon.";
        form.reset();
        return;
      }

      let firstInvalid = null;

      fields.forEach((field) => {
        const result = field.validate(field.input.value);
        if (result === true) {
          setFieldState(field, "");
        } else {
          setFieldState(field, result);
          if (!firstInvalid) firstInvalid = field.input;
        }
      });

      if (firstInvalid) {
        firstInvalid.focus();
        return;
      }

      const originalButton = submitButton.innerHTML;
      submitButton.disabled = true;
      submitButton.textContent = "Sending…";
      form.setAttribute("aria-busy", "true");
      status.className = "form-status";
      status.textContent = "";

      try {
        const response = await fetch(form.action, {
          method: "POST",
          body: new FormData(form),
          headers: {
            Accept: "application/json",
          },
        });

        const data = await response.json().catch(() => null);

        if (!response.ok || !data || data.success !== true) {
          throw new Error(
            data && typeof data.message === "string"
              ? data.message
              : "The form service did not accept the message."
          );
        }

        form.reset();
        fields.forEach((field) => setFieldState(field, ""));
        status.className = "form-status form-status--success";
        status.textContent = "Message sent. I'll get back to you soon.";
      } catch (error) {
        status.className = "form-status form-status--error";
        status.textContent =
          "The message could not be sent. Please email me directly at sayanjagulia489@gmail.com.";
      } finally {
        submitButton.disabled = false;
        submitButton.innerHTML = originalButton;
        form.removeAttribute("aria-busy");
      }
    });
  }

  /* ------------------------------------------------------------------------
     Footer year
     ------------------------------------------------------------------------ */

  const year = doc.getElementById("year");
  if (year) {
    year.textContent = String(new Date().getFullYear());
  }
})();
