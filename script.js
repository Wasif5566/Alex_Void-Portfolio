/**
 * ================================================================
 *  ALEX VOID PORTFOLIO — script.js
 *  Handles:
 *   01. Navbar scroll effect
 *   02. Mobile hamburger menu
 *   03. Smooth scroll for nav links
 *   04. Scroll reveal animations (IntersectionObserver)
 *   05. Skill bar animation on scroll
 *   06. Project filter tabs
 *   07. Contact form validation
 *   08. Footer year
 *   09. Glass "flashlight" cursor effect
 * ================================================================
 */

'use strict';

/* ================================================================
   WAIT FOR DOM READY
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {

  initNavbarScroll();
  initHamburgerMenu();
  initSmoothScroll();
  initScrollReveal();
  initSkillBars();
  initProjectFilter();
  initContactForm();
  initFooterYear();
  initGlassFlashlight();
  initCustomCursor();      // ← custom cursor (added)

});


/* ================================================================
   01. NAVBAR — adds .scrolled class after 60px
   ================================================================ */
function initNavbarScroll() {
  const nav = document.getElementById('siteNav');
  if (!nav) return;

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // run on load in case already scrolled
}


/* ================================================================
   02. HAMBURGER MENU — toggles open/close
   ================================================================ */
function initHamburgerMenu() {
  const btn       = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!btn || !mobileMenu) return;

  btn.addEventListener('click', () => {
    const isOpen = btn.classList.toggle('open');
    mobileMenu.classList.toggle('open', isOpen);
    btn.setAttribute('aria-expanded', String(isOpen));
    mobileMenu.setAttribute('aria-hidden', String(!isOpen));
  });

  // Close menu when a mobile link is clicked
  mobileMenu.querySelectorAll('.mobile-link').forEach(link => {
    link.addEventListener('click', () => {
      btn.classList.remove('open');
      mobileMenu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
      mobileMenu.setAttribute('aria-hidden', 'true');
    });
  });
}


/* ================================================================
   03. SMOOTH SCROLL — handles all internal # links
   ================================================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();

      // Offset for fixed navbar (80px)
      const navHeight = document.getElementById('siteNav')?.offsetHeight || 80;
      const top = target.getBoundingClientRect().top + window.scrollY - navHeight;

      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}


/* ================================================================
   04. SCROLL REVEAL — IntersectionObserver for fade-in animations
   ================================================================ */
function initScrollReveal() {
  // All elements with reveal classes
  const revealEls = document.querySelectorAll(
    '.reveal-up, .reveal-left, .reveal-right'
  );
  if (!revealEls.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Unobserve after animation — no need to re-trigger
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,          // 12% visible before triggering
      rootMargin: '0px 0px -40px 0px' // slight upward offset
    }
  );

  revealEls.forEach(el => observer.observe(el));
}


/* ================================================================
   05. SKILL BAR ANIMATION — fills bars when section enters view
   ================================================================ */
function initSkillBars() {
  const bars = document.querySelectorAll('.skill-bar__fill');
  if (!bars.length) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const bar = entry.target;
          const targetWidth = bar.getAttribute('data-width') || '0';
          // Small timeout for visual delight
          setTimeout(() => {
            bar.style.width = targetWidth + '%';
          }, 200);
          observer.unobserve(bar);
        }
      });
    },
    { threshold: 0.4 }
  );

  bars.forEach(bar => observer.observe(bar));
}


/* ================================================================
   06. PROJECT FILTER — shows/hides cards by category
   ================================================================ */
function initProjectFilter() {
  const filterBtns  = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      // Update active button state
      filterBtns.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');

      const filter = btn.getAttribute('data-filter');

      // Show/hide cards
      projectCards.forEach(card => {
        const categories = (card.getAttribute('data-category') || '').toLowerCase();

        if (filter === 'all' || categories.includes(filter)) {
          // Reveal card
          card.classList.remove('hidden');
          // Small re-trigger animation
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
              card.style.opacity = '1';
              card.style.transform = 'translateY(0)';
            });
          });
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}


/* ================================================================
   07. CONTACT FORM VALIDATION
   ================================================================ */
function initContactForm() {
  const submitBtn  = document.getElementById('submitBtn');
  const nameInput  = document.getElementById('fullName');
  const emailInput = document.getElementById('emailAddr');
  const msgInput   = document.getElementById('projectMsg');
  const nameError  = document.getElementById('nameError');
  const emailError = document.getElementById('emailError');
  const msgError   = document.getElementById('msgError');
  const successMsg = document.getElementById('formSuccess');

  // Guard: exit if form elements missing
  if (!submitBtn) return;

  /* --- Helper: show error for a field --- */
  function showError(input, errorEl, message) {
    input.classList.add('error');
    errorEl.textContent = message;
  }

  /* --- Helper: clear error for a field --- */
  function clearError(input, errorEl) {
    input.classList.remove('error');
    errorEl.textContent = '';
  }

  /* --- Live validation on blur --- */
  nameInput?.addEventListener('blur', () => {
    const val = nameInput.value.trim();
    if (!val) {
      showError(nameInput, nameError, 'NAME IS REQUIRED');
    } else if (val.length < 2) {
      showError(nameInput, nameError, 'AT LEAST 2 CHARACTERS');
    } else {
      clearError(nameInput, nameError);
    }
  });

  emailInput?.addEventListener('blur', () => {
    const val = emailInput.value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val) {
      showError(emailInput, emailError, 'EMAIL IS REQUIRED');
    } else if (!emailRegex.test(val)) {
      showError(emailInput, emailError, 'INVALID EMAIL FORMAT');
    } else {
      clearError(emailInput, emailError);
    }
  });

  msgInput?.addEventListener('blur', () => {
    const val = msgInput.value.trim();
    if (!val) {
      showError(msgInput, msgError, 'MESSAGE IS REQUIRED');
    } else if (val.length < 10) {
      showError(msgInput, msgError, 'AT LEAST 10 CHARACTERS');
    } else {
      clearError(msgInput, msgError);
    }
  });

  /* --- Form submit handler --- */
  submitBtn.addEventListener('click', () => {
    let isValid = true;

    // Validate name
    const nameVal = nameInput?.value.trim() || '';
    if (!nameVal || nameVal.length < 2) {
      showError(nameInput, nameError, nameVal ? 'AT LEAST 2 CHARACTERS' : 'NAME IS REQUIRED');
      isValid = false;
    } else {
      clearError(nameInput, nameError);
    }

    // Validate email
    const emailVal  = emailInput?.value.trim() || '';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal) {
      showError(emailInput, emailError, 'EMAIL IS REQUIRED');
      isValid = false;
    } else if (!emailRegex.test(emailVal)) {
      showError(emailInput, emailError, 'INVALID EMAIL FORMAT');
      isValid = false;
    } else {
      clearError(emailInput, emailError);
    }

    // Validate message
    const msgVal = msgInput?.value.trim() || '';
    if (!msgVal) {
      showError(msgInput, msgError, 'MESSAGE IS REQUIRED');
      isValid = false;
    } else if (msgVal.length < 10) {
      showError(msgInput, msgError, 'AT LEAST 10 CHARACTERS');
      isValid = false;
    } else {
      clearError(msgInput, msgError);
    }

    // If all valid — simulate send
    if (isValid) {
      simulateSend();
    }
  });

  /* --- Simulate async form send --- */
  function simulateSend() {
    const btnText = submitBtn.querySelector('.btn-text');

    // Disable button, show loading
    submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'SENDING...';

    // Fake 1.5s network delay
    setTimeout(() => {
      // Reset button
      submitBtn.disabled = false;
      if (btnText) btnText.textContent = 'SEND MESSAGE';

      // Clear fields
      if (nameInput)  nameInput.value  = '';
      if (emailInput) emailInput.value = '';
      if (msgInput)   msgInput.value   = '';

      // Show success message
      if (successMsg) {
        successMsg.hidden = false;
        successMsg.focus();
        // Hide success after 6 seconds
        setTimeout(() => { successMsg.hidden = true; }, 6000);
      }
    }, 1500);
  }
}


/* ================================================================
   08. FOOTER YEAR — auto-updates copyright year
   ================================================================ */
function initFooterYear() {
  const yearEl = document.getElementById('footerYear');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}


/* ================================================================
   09. GLASS FLASHLIGHT — cursor glow behind glass layers
       A radial gradient follows the mouse, revealing the dot grid
       and noise texture more clearly (as per DESIGN.md spec)
   ================================================================ */
function initGlassFlashlight() {
  // Only on non-touch devices (performance)
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const glassCards = document.querySelectorAll('.glass-card');
  if (!glassCards.length) return;

  glassCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width)  * 100;
      const y = ((e.clientY - rect.top)  / rect.height) * 100;

      // Set radial gradient flashlight as card background
      card.style.setProperty(
        '--flashlight',
        `radial-gradient(
          circle at ${x}% ${y}%,
          rgba(207, 188, 255, 0.07) 0%,
          transparent 60%
        )`
      );
      card.style.backgroundImage = 'var(--flashlight)';
    });

    card.addEventListener('mouseleave', () => {
      card.style.backgroundImage = '';
    });
  });
}


/* ================================================================
   10. CUSTOM CURSOR
   Two-element system:
   - Dot   : snaps exactly to mouse (no lag)
   - Ring  : lerps (linear interpolates) toward mouse each frame
             creating a smooth "spring" trailing effect
 
   Uses requestAnimationFrame for 60fps GPU-smooth movement.
   Applies body classes for state-based CSS transitions:
     .cursor-hover  — over interactive elements
     .cursor-text   — over inputs/textareas
     .cursor-click  — on mousedown
     .cursor-out    — mouse left the window
   ================================================================ */
function initCustomCursor() {
  // Skip on touch/mobile devices — they have no cursor
  if (window.matchMedia('(pointer: coarse)').matches) return;
 
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;
 
  /* --- Current true mouse position (snaps instantly) --- */
  let mouseX = window.innerWidth  / 2;
  let mouseY = window.innerHeight / 2;
 
  /* --- Ring's smoothed position (lerps each frame) --- */
  let ringX  = mouseX;
  let ringY  = mouseY;
 
  /* --- Lerp factor: lower = more lag, higher = tighter --- */
  const LERP = 0.11;
 
  /* --- rAF loop — runs every frame --- */
  let rafId;
  function animate() {
    /* Lerp ring toward real cursor */
    ringX += (mouseX - ringX) * LERP;
    ringY += (mouseY - ringY) * LERP;
 
    /* Apply positions using transform (GPU-accelerated) */
    dot.style.transform  = `translate(${mouseX}px, ${mouseY}px)`;
    ring.style.transform = `translate(${ringX}px,  ${ringY}px)`;
 
    rafId = requestAnimationFrame(animate);
  }
 
  /* --- Track real mouse position --- */
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
 
    /* Make visible on first move */
    if (!dot.classList.contains('visible')) {
      dot.classList.add('visible');
      ring.classList.add('visible');
    }
 
    /* Make sure window is marked as "in" */
    document.body.classList.remove('cursor-out');
  });
 
  /* --- Hide when mouse leaves window --- */
  document.addEventListener('mouseleave', () => {
    document.body.classList.add('cursor-out');
  });
  document.addEventListener('mouseenter', () => {
    document.body.classList.remove('cursor-out');
  });
 
  /* --- Click states (squish on press) --- */
  document.addEventListener('mousedown', () => {
    document.body.classList.add('cursor-click');
  });
  document.addEventListener('mouseup', () => {
    document.body.classList.remove('cursor-click');
  });
 
  /* ----------------------------------------------------------------
     Hover detection — applies state classes based on what's under
     the cursor. Uses event delegation (one listener on document).
  ---------------------------------------------------------------- */
 
  /* Elements that trigger the expanded hover state */
  const HOVER_SELECTOR = [
    'a',
    'button',
    '[role="button"]',
    '.filter-btn',
    '.btn-ghost',
    '.btn-primary-cta',
    '.btn-submit',
    '.project-card',
    '.sidebar-icon',
    '.nav-link-item',
    '.mobile-link',
    '.footer-link',
    '.btn-view-case',
    '.project-card__link',
  ].join(', ');
 
  /* Elements that trigger the text-beam state */
  const TEXT_SELECTOR = 'input, textarea, [contenteditable]';
 
  document.addEventListener('mouseover', (e) => {
    const target = e.target;
 
    if (target.matches(TEXT_SELECTOR) || target.closest(TEXT_SELECTOR)) {
      /* Text input — show blinking beam */
      document.body.classList.remove('cursor-hover');
      document.body.classList.add('cursor-text');
    } else if (target.matches(HOVER_SELECTOR) || target.closest(HOVER_SELECTOR)) {
      /* Interactive element — expand ring */
      document.body.classList.remove('cursor-text');
      document.body.classList.add('cursor-hover');
    } else {
      /* Default state */
      document.body.classList.remove('cursor-hover', 'cursor-text');
    }
  });
 
  /* Start the animation loop */
  animate();
 
  /* Clean up rAF if page is hidden (battery/performance) */
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      cancelAnimationFrame(rafId);
    } else {
      animate();
    }
  });
}