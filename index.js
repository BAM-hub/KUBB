const mobileNavTrigger = document.getElementById("menu-toggle");
const linksWrapper = document.querySelector(".header-links-wrapper");
const header = document.querySelector("header");
const banner = document.querySelector(".banner");

function hideNav() {
  mobileNavTrigger.setAttribute("aria-expanded", "false");
  linksWrapper.setAttribute("aria-hidden", "true");
  header.classList.remove("active");
  removeBackdrop();
}

function showNav() {
  linksWrapper.setAttribute("aria-hidden", "false");
}

function handleMenuAnimation() {
  function clearAnimation() {
    linksWrapper.classList.remove("animate-menu");
  }
  // should remove the old event to avoid memory leaks
  linksWrapper.removeEventListener("transitionend", clearAnimation);
  linksWrapper.classList.add("animate-menu");
  linksWrapper.addEventListener("transitionend", clearAnimation);
}

function handleBackdropKeyDown(e) {
  if (e.key === "Escape") {
    handleMenuAnimation();
    hideNav();
  }
}

function createBackdrop() {
  if (document.querySelector(".backdrop")) return;

  document.body.classList.add("no-scroll");
  const backdrop = document.createElement("div");
  backdrop.classList.add("backdrop");
  backdrop.addEventListener("click", () => {
    // could pass this as a callback for reuseability, but the page is to small for it
    handleMenuAnimation();
    hideNav();
  });
  document.body.append(backdrop);
  window.addEventListener("keydown", handleBackdropKeyDown);
}

function removeBackdrop() {
  document.body.classList.remove("no-scroll");
  window.removeEventListener("keydown", handleBackdropKeyDown);
  document.querySelector(".backdrop")?.remove();
}

function setupNavigation() {
  if (window.innerWidth >= 1024) {
    showNav();
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) {
        header.classList.add("dim");
      } else {
        header.classList.remove("dim");
      }
    });
  });
  observer.observe(banner);

  mobileNavTrigger.addEventListener("click", (e) => {
    const isHidden = linksWrapper.getAttribute("aria-hidden");
    handleMenuAnimation();
    if (isHidden === "true") {
      showNav();
      mobileNavTrigger.setAttribute("aria-expanded", "true");
      header.classList.add("active");
      createBackdrop();
    } else {
      document.body.classList.remove("no-scroll");
      hideNav();
    }
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 1024) {
      removeBackdrop();
      header.classList.remove("active");

      showNav();
    } else if (mobileNavTrigger.getAttribute("aria-expanded") !== "true") {
      hideNav();
    } else {
      header.classList.add("active");
      createBackdrop();
    }
  });
}

function setupRipple() {
  document.querySelectorAll(".ripple-btn").forEach((button) => {
    function createRipple(event) {
      const ripple = document.createElement("span");
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      let x, y;

      if (event.type === "keydown") {
        x = rect.width / 2 - size / 2;
        y = rect.height / 2 - size / 2;
      } else {
        x = event.clientX - rect.left - size / 2;
        y = event.clientY - rect.top - size / 2;
      }

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.classList.add("ripple");

      button.appendChild(ripple);

      ripple.addEventListener("animationend", () => ripple.remove());
    }

    button.addEventListener("click", createRipple);
    button.addEventListener("keydown", (event) => {
      event.preventDefault();
      if ((event.key === "Enter" || event.key === " ") && !event.repeat) {
        createRipple(event);
      }
    });
  });
}

setupRipple();
setupNavigation();
