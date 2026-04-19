/* ============================================================
   STYLISH AND HEALTHY — Main JavaScript
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Sticky Nav ──────────────────────────────────────────── */
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Mobile Nav Overlay ──────────────────────────────────── */
  const hamburger = document.querySelector('.nav__hamburger');
  const overlay   = document.querySelector('.nav__overlay');
  const closeBtn  = document.querySelector('.nav__overlay-close');

  if (hamburger && overlay) {
    hamburger.addEventListener('click', () => overlay.classList.add('open'));
    closeBtn?.addEventListener('click', () => overlay.classList.remove('open'));
    // Close on link click
    overlay.querySelectorAll('.nav__overlay-link').forEach(link => {
      link.addEventListener('click', () => overlay.classList.remove('open'));
    });
  }

  /* ── Scroll Reveal ───────────────────────────────────────── */
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    reveals.forEach((el, i) => {
      el.style.transitionDelay = `${(i % 4) * 80}ms`;
      revealObserver.observe(el);
    });
  }

  /* ── Gold Line Animation ─────────────────────────────────── */
  const goldLines = document.querySelectorAll('.gold-line, .manifesto__line-top, .manifesto__line-bottom');
  if (goldLines.length) {
    const lineObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          lineObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    goldLines.forEach(line => lineObserver.observe(line));
  }

  /* ── Mailchimp Newsletter Form (AJAX) ───────────────────── */
  const mcForm = document.getElementById('mc-embedded-subscribe-form');
  if (mcForm) {
    mcForm.addEventListener('submit', function(e) {
      e.preventDefault();
      const emailInput = mcForm.querySelector('input[name="EMAIL"]');
      const responseEl = document.getElementById('mc-form-response');
      const btn = mcForm.querySelector('button[type="submit"]');

      if (!emailInput || !emailInput.value.trim()) {
        if (responseEl) { responseEl.textContent = 'Please enter your email address.'; responseEl.style.color = '#D4A090'; }
        return;
      }

      // Disable button while submitting
      if (btn) { btn.disabled = true; btn.querySelector('span').textContent = 'JOINING...'; }

      // Mailchimp requires JSONP — swap /post for /post-json and add c= callback
      const action = mcForm.action
        .replace('/post?', '/post-json?')
        .replace('/post-json?', '/post-json?')
        + '&c=mailchimpCallback';

      const params = new URLSearchParams(new FormData(mcForm));
      const script = document.createElement('script');
      script.src = action + '&' + params.toString();

      window.mailchimpCallback = function(data) {
        script.remove();
        delete window.mailchimpCallback;
        if (btn) { btn.disabled = false; btn.querySelector('span').textContent = 'JOIN →'; }
        if (data.result === 'success') {
          if (responseEl) { responseEl.textContent = '✓ You\'re in. Welcome to the ritual.'; responseEl.style.color = '#C9A263'; }
          emailInput.value = '';
        } else {
          // Strip Mailchimp's HTML tags from error message
          const msg = data.msg ? data.msg.replace(/<[^>]*>/g, '') : 'Something went wrong. Please try again.';
          if (responseEl) { responseEl.textContent = msg.includes('already subscribed') ? 'You\'re already subscribed.' : msg; responseEl.style.color = '#D4A090'; }
        }
      };

      // Timeout fallback
      const timeout = setTimeout(() => {
        script.remove();
        if (btn) { btn.disabled = false; btn.querySelector('span').textContent = 'JOIN →'; }
        if (responseEl) { responseEl.textContent = 'Request timed out. Please try again.'; responseEl.style.color = '#D4A090'; }
      }, 8000);

      script.onload = () => clearTimeout(timeout);
      document.head.appendChild(script);
    });
  }

});
