// ==============================================================================
// CHAPTER ONE CAFE - LIGHT MINIMAL GRAPHICAL CONTROLLER
// ==============================================================================

(function () {
  'use strict';

  // SVG Vector Graphics Library for Offers
  const GRAPHICS = {
    tag: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
      <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
      <line x1="6" y1="1" x2="6" y2="4"></line>
      <line x1="10" y1="1" x2="10" y2="4"></line>
      <line x1="14" y1="1" x2="14" y2="4"></line>
    </svg>`,
    academic: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
      <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
    </svg>`,
    handshake: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M11 17l-5-5a3 3 0 0 1 0-4.24l.7-.7a3 3 0 0 1 4.25 0L12 8"></path>
      <path d="M13 7l5 5a3 3 0 0 1 0 4.24l-.7.7a3 3 0 0 1-4.25 0L12 16"></path>
      <circle cx="18" cy="6" r="3"></circle>
      <circle cx="6" cy="18" r="3"></circle>
    </svg>`
  };

  const THEME_ACCENTS = {
    tag: 'gold',
    academic: 'emerald',
    handshake: 'purple'
  };

  // State Management
  const state = {
    selectedOffer: null,
    isSubmitting: false,
    googleScriptUrl: (CONFIG.googleAppsScriptUrl || '').trim(),
    localEntries: JSON.parse(localStorage.getItem('c1_cafe_giveaway_entries') || '[]'),
    lastEntry: null
  };

  // DOM Elements Cache
  const DOM = {
    // Views
    stepOffersView: document.getElementById('step-offers-view'),
    stepFormView: document.getElementById('step-form-view'),
    stepSuccessView: document.getElementById('step-success-view'),

    // Offers Grid
    offersContainer: document.getElementById('offers-container'),
    btnContinueToForm: document.getElementById('btn-continue-to-form'),

    // Step 2 (Form)
    btnBackToOffers: document.getElementById('btn-back-to-offers'),
    selBannerIconBox: document.getElementById('sel-banner-icon-box'),
    selBannerBadge: document.getElementById('sel-banner-badge'),
    selBannerTitle: document.getElementById('sel-banner-title'),
    selBannerDesc: document.getElementById('sel-banner-desc'),
    form: document.getElementById('giveaway-form'),
    inputName: document.getElementById('input-name'),
    inputPhone: document.getElementById('input-phone'),
    btnSubmit: document.getElementById('btn-submit'),
    errorName: document.getElementById('error-name'),
    errorPhone: document.getElementById('error-phone'),
    errorDuplicatePhone: document.getElementById('error-duplicate-phone'),

    // Step 3 (Success)
    successUserName: document.getElementById('success-user-name'),
    successUserPhone: document.getElementById('success-user-phone'),
    successOfferTitle: document.getElementById('success-offer-title'),
    successEntryId: document.getElementById('success-entry-id'),
    btnShareWhatsapp: document.getElementById('btn-share-whatsapp'),
    btnSubmitAnother: document.getElementById('btn-submit-another')
  };

  /**
   * Initialize Application
   */
  function init() {
    renderOffers();
    setupEventListeners();
  }

  /**
   * Render the 3 Graphical Offers
   */
  function renderOffers() {
    DOM.offersContainer.innerHTML = '';
    const offers = CONFIG.offers || [];

    offers.forEach((offer) => {
      const card = document.createElement('div');
      card.className = 'offer-card-item';
      card.dataset.id = offer.id;

      const accent = THEME_ACCENTS[offer.graphic] || 'blue';
      const vectorIcon = GRAPHICS[offer.graphic] || GRAPHICS.tag;

      card.innerHTML = `
        <div class="offer-graphic-box ${accent}">
          ${vectorIcon}
        </div>
        <div class="offer-details">
          <div class="badge-row">
            <span class="mono-tag ${accent}">${offer.badge}</span>
          </div>
          <h3 class="offer-headline">${offer.title}</h3>
          <p class="offer-caption">${offer.description}</p>
        </div>
        <div class="radio-indicator"></div>
      `;

      card.addEventListener('click', () => {
        selectOffer(offer, card);
      });

      DOM.offersContainer.appendChild(card);
    });
  }

  /**
   * Select Offer Card
   */
  function selectOffer(offer, cardEl) {
    state.selectedOffer = offer;

    const allCards = DOM.offersContainer.querySelectorAll('.offer-card-item');
    allCards.forEach(c => c.classList.remove('active'));
    cardEl.classList.add('active');

    DOM.btnContinueToForm.disabled = false;
  }

  /**
   * Transition to Step 2: Details Form
   */
  function goToFormStep() {
    if (!state.selectedOffer) return;

    const accent = THEME_ACCENTS[state.selectedOffer.graphic] || 'gold';
    DOM.selBannerIconBox.innerHTML = GRAPHICS[state.selectedOffer.graphic] || GRAPHICS.tag;
    DOM.selBannerIconBox.className = `perk-graphic-pod ${accent}`;
    DOM.selBannerBadge.textContent = state.selectedOffer.badge;
    DOM.selBannerTitle.textContent = state.selectedOffer.title;
    DOM.selBannerDesc.textContent = state.selectedOffer.description;

    DOM.stepOffersView.style.display = 'none';
    DOM.stepFormView.style.display = 'block';

    // Highlight the family line in a clean, minimal style when entering Step 2
    const familyCard = document.querySelector('.lovable-family-hero');
    if (familyCard) {
      familyCard.classList.remove('highlight-focus');
      // trigger reflow for smooth re-animation
      void familyCard.offsetWidth;
      familyCard.classList.add('highlight-focus');
    }

    // Scroll to top of card smoothly without auto-focusing input
    window.scrollTo({ top: 0, behavior: 'instant' });
  }

  /**
   * Return to Step 1: Offers View
   */
  function backToOffersStep() {
    DOM.stepFormView.style.display = 'none';
    DOM.stepOffersView.style.display = 'block';
  }

  /**
   * Auto-format Mobile Input (98765 43210)
   */
  function handlePhoneInput(e) {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 10) value = value.slice(0, 10);

    if (value.length > 5) {
      e.target.value = value.slice(0, 5) + ' ' + value.slice(5);
    } else {
      e.target.value = value;
    }

    DOM.errorPhone.style.display = 'none';
    DOM.errorDuplicatePhone.style.display = 'none';
  }

  /**
   * Check if phone number already entered
   */
  function isPhoneDuplicate(digits) {
    return state.localEntries.some(entry => {
      const clean = String(entry.phone || '').replace(/\D/g, '');
      return clean === digits;
    });
  }

  /**
   * Form Validation
   */
  function validate() {
    let isValid = true;
    const name = DOM.inputName.value.trim();
    const phoneDigits = DOM.inputPhone.value.replace(/\D/g, '');

    // Name check
    if (!name || name.length < 2) {
      DOM.errorName.style.display = 'block';
      isValid = false;
    } else {
      DOM.errorName.style.display = 'none';
    }

    // Phone digits check
    if (!phoneDigits || phoneDigits.length !== 10) {
      DOM.errorPhone.style.display = 'block';
      DOM.errorDuplicatePhone.style.display = 'none';
      return false;
    } else {
      DOM.errorPhone.style.display = 'none';
    }

    // Duplicate check
    if (isPhoneDuplicate(phoneDigits)) {
      DOM.errorDuplicatePhone.style.display = 'block';
      isValid = false;
    } else {
      DOM.errorDuplicatePhone.style.display = 'none';
    }

    return isValid;
  }

  /**
   * Handle Registration Submission
   */
  async function handleSubmit(e) {
    e.preventDefault();
    if (state.isSubmitting) return;

    if (!validate()) return;

    const name = DOM.inputName.value.trim();
    const phoneDigits = DOM.inputPhone.value.replace(/\D/g, '');
    const phoneFormatted = `+91 ${phoneDigits.slice(0, 5)} ${phoneDigits.slice(5)}`;
    const entryId = `C1-${Math.floor(1000 + Math.random() * 9000)}`;
    const selectedOfferTitle = state.selectedOffer ? state.selectedOffer.title : "Spend ₹499 & Get Flat 18% OFF";

    const payload = {
      timestamp: new Date().toISOString(),
      name: name,
      phone: phoneDigits,
      phoneFormatted: phoneFormatted,
      selectedOffer: selectedOfferTitle,
      entryId: entryId,
      device: navigator.userAgent.includes('Mobile') ? 'Mobile' : 'Desktop',
      cafe: CONFIG.cafeName || 'Chapter One Cafe'
    };

    // UI Loading state
    state.isSubmitting = true;
    DOM.btnSubmit.classList.add('loading');
    DOM.btnSubmit.disabled = true;

    // 1. Submit to Google Apps Script (if configured)
    const scriptUrl = state.googleScriptUrl;
    if (scriptUrl && scriptUrl.startsWith('http')) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000); // 8s safety timeout

        await fetch(scriptUrl, {
          method: 'POST',
          mode: 'no-cors',
          cache: 'no-cache',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify(payload),
          signal: controller.signal
        });

        clearTimeout(timeoutId);
      } catch (err) {
        console.warn('Google Sheets sync note:', err);
      }
    }

    // 2. Save locally in localStorage to enforce single-entry rule
    saveLocally(payload);

    // 3. Trigger celebration confetti
    triggerCelebration();

    // 4. Show Success View
    state.lastEntry = payload;
    showSuccessView(payload);

    // Reset button
    state.isSubmitting = false;
    DOM.btnSubmit.classList.remove('loading');
    DOM.btnSubmit.disabled = false;
  }

  /**
   * Save submission locally
   */
  function saveLocally(entry) {
    state.localEntries.unshift(entry);
    localStorage.setItem('c1_cafe_giveaway_entries', JSON.stringify(state.localEntries));
  }

  /**
   * Render Success Confirmation with Graphical Receipt
   */
  function showSuccessView(entry) {
    DOM.successUserName.textContent = entry.name;
    DOM.successUserPhone.textContent = entry.phoneFormatted;
    DOM.successOfferTitle.textContent = entry.selectedOffer;
    DOM.successEntryId.textContent = `#${entry.entryId}`;

    // WhatsApp Share Link
    const shareText = encodeURIComponent(
      `☕ Hey! I just registered for "${entry.selectedOffer}" at Chapter One Cafe! Results will be announced this Sunday, 15th November. Pick your offer here: ${window.location.href}`
    );
    DOM.btnShareWhatsapp.onclick = () => {
      window.open(`https://api.whatsapp.com/send?text=${shareText}`, '_blank');
    };

    DOM.stepFormView.style.display = 'none';
    DOM.stepSuccessView.style.display = 'block';
  }

  /**
   * Reset for another entry
   */
  function resetAll() {
    DOM.form.reset();
    state.selectedOffer = null;
    DOM.btnContinueToForm.disabled = true;

    const allCards = DOM.offersContainer.querySelectorAll('.offer-card-item');
    allCards.forEach(c => c.classList.remove('active'));

    DOM.errorName.style.display = 'none';
    DOM.errorPhone.style.display = 'none';
    DOM.errorDuplicatePhone.style.display = 'none';

    DOM.stepSuccessView.style.display = 'none';
    DOM.stepFormView.style.display = 'none';
    DOM.stepOffersView.style.display = 'block';
  }

  /**
   * Minimal Confetti Blast
   */
  function triggerCelebration() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#c89b3c', '#e11d48', '#f59e0b', '#24160f', '#fb7185']
      });
    }
  }

  /**
   * Setup Event Listeners
   */
  function setupEventListeners() {
    DOM.btnContinueToForm.addEventListener('click', goToFormStep);
    DOM.btnBackToOffers.addEventListener('click', backToOffersStep);

    DOM.inputPhone.addEventListener('input', handlePhoneInput);
    DOM.inputName.addEventListener('input', () => { DOM.errorName.style.display = 'none'; });
    DOM.form.addEventListener('submit', handleSubmit);
    DOM.btnSubmitAnother.addEventListener('click', resetAll);
  }

  // Launch on load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
