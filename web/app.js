import {
  steps,
  catalog,
  filterCatalog,
  getArrivalLabel,
  isValidImageUrl,
  limitHero,
  sortFulfillment,
  validateNotify,
} from './logic.mjs';

const storageKey = 'concierge-profile';
const consentKey = 'concierge-consent';
const state = {
  currentStep: 0,
  answers: {},
  currentChoice: '',
  consent: localStorage.getItem(consentKey) || 'pending',
  profile: JSON.parse(localStorage.getItem(storageKey) || '{}'),
  visibleCount: 6,
  selectedItem: null,
  holdUntil: null,
  holdTimer: null,
};

const promptEl = document.getElementById('prompt');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const stepCountEl = document.getElementById('step-count');
const stepFillEl = document.getElementById('step-fill');
const textInput = document.getElementById('text-input');
const imageInput = document.getElementById('image-url');
const imageError = document.getElementById('image-error');
const profileChip = document.getElementById('profile-chip');
const flowSection = document.getElementById('question-flow');
const catalogSection = document.getElementById('catalog');
const catalogGrid = document.getElementById('catalog-grid');
const promoChip = document.getElementById('promo-chip');
const moreBtn = document.getElementById('more-btn');
const fallbackState = document.getElementById('fallback-state');
const overlay = document.getElementById('detail-overlay');
const detailContent = document.getElementById('detail-content');
const alternates = document.getElementById('alternates');
const notifyForm = document.getElementById('notify-form');
const notifyInput = document.getElementById('notify-input');
const notifyError = document.getElementById('notify-error');
const notifySuccess = document.getElementById('notify-success');
const consentBanner = document.getElementById('consent-banner');
const consentAccept = document.getElementById('consent-accept');
const consentReject = document.getElementById('consent-reject');
const resetBtn = document.getElementById('reset-data');

function saveProfile() {
  if (state.consent === 'accepted') {
    localStorage.setItem(storageKey, JSON.stringify(state.answers));
  }
}

function applyPrefill() {
  const step = steps[state.currentStep];
  state.currentChoice = state.answers[step.key] || state.profile[step.key] || '';
  if (state.profile[step.key]) {
    profileChip.hidden = false;
    profileChip.textContent = `Prefilled: ${state.profile[step.key]} (editable)`;
  } else {
    profileChip.hidden = true;
  }
}

function renderStep() {
  const step = steps[state.currentStep];
  promptEl.textContent = step.prompt;
  stepCountEl.textContent = `Step ${state.currentStep + 1} of ${steps.length}`;
  stepFillEl.style.width = `${((state.currentStep + 1) / steps.length) * 100}%`;

  applyPrefill();
  textInput.value = state.currentChoice;
  optionsEl.innerHTML = '';

  step.options.forEach((opt) => {
    const btn = document.createElement('button');
    btn.className = 'option';
    btn.type = 'button';
    btn.textContent = opt;
    btn.setAttribute('aria-label', `Select ${opt}`);
    if (opt === state.currentChoice) btn.classList.add('active');
    btn.addEventListener('click', () => {
      state.currentChoice = opt;
      textInput.value = opt;
      renderStep();
      nextBtn.focus();
    });
    optionsEl.appendChild(btn);
  });

  nextBtn.disabled = !state.currentChoice;
}

function renderResults() {
  flowSection.hidden = true;
  catalogSection.hidden = false;
  promoChip.hidden = false;

  let picks = limitHero(filterCatalog(catalog, state.answers));
  if (!Array.isArray(picks)) picks = [];

  if (!picks.length) {
    fallbackState.hidden = false;
    catalogGrid.innerHTML = '';
    moreBtn.hidden = true;
    return;
  }

  fallbackState.hidden = true;
  const visibleItems = picks.slice(0, state.visibleCount);
  moreBtn.hidden = picks.length <= 6;
  moreBtn.textContent = state.visibleCount > 6 ? 'Show less' : 'See more';

  catalogGrid.innerHTML = '';
  visibleItems.forEach((item) => {
    const sorted = sortFulfillment(item.fulfillment || [{ type: 'pickup', label: 'Pickup', etaHours: 2, cutoff: '23:59', timezone: 'Asia/Kolkata' }]);
    const fastest = sorted[0];
    const card = document.createElement('article');
    card.className = `item-card ${item.hero ? 'hero-card' : ''}`;
    card.innerHTML = `
      <div class="badges">
        <span class="item-tag">${item.tag}</span>
        <span class="availability">${item.inventoryStatus}</span>
        ${item.freshness ? `<span class="freshness">${item.freshness}</span>` : ''}
      </div>
      <h3 class="item-title">${item.title}</h3>
      <div class="item-price">${item.price}</div>
      <div class="item-cta">Fastest: ${getArrivalLabel(fastest)}</div>
      <button class="secondary open-detail" data-id="${item.id}" aria-label="Open details for ${item.title}">Details</button>
    `;
    catalogGrid.appendChild(card);
  });
}

function openDetail(itemId) {
  const item = catalog.find((entry) => entry.id === itemId);
  if (!item) return;
  state.selectedItem = item;
  const defaultSize = item.sizes[0];
  const defaultStore = item.stores[0];
  state.holdUntil = Date.now() + 10 * 60 * 1000;

  detailContent.innerHTML = `
    <h3>${item.title}</h3>
    <p>${item.returnPolicy}</p>
    <p>${item.price}${item.promo ? ` · ${item.promo}` : ''}</p>
    <label>Size
      <select id="detail-size" aria-label="Choose size">
        ${item.sizes.map((size) => `<option ${item.unavailableSizes.includes(size) ? 'disabled' : ''}>${size}${item.unavailableSizes.includes(size) ? ' (unavailable)' : ''}</option>`).join('')}
      </select>
    </label>
    <label>Store
      <select id="detail-store" aria-label="Choose store">${item.stores.map((store) => `<option>${store}</option>`).join('')}</select>
    </label>
    <p id="hold-timer">Hold expires in 10:00</p>
    <a id="detail-cta" class="primary" href="${item.checkoutUrl}&size=${encodeURIComponent(defaultSize)}&store=${encodeURIComponent(defaultStore)}">Reserve for pickup</a>
  `;

  overlay.hidden = false;
  overlay.querySelector('.close').focus();
  const detailSize = document.getElementById('detail-size');
  const detailStore = document.getElementById('detail-store');
  const detailCta = document.getElementById('detail-cta');

  function syncCta() {
    detailCta.href = `${item.checkoutUrl}&size=${encodeURIComponent(detailSize.value.replace(' (unavailable)', ''))}&store=${encodeURIComponent(detailStore.value)}`;
  }

  detailSize.addEventListener('change', syncCta);
  detailStore.addEventListener('change', syncCta);

  clearInterval(state.holdTimer);
  state.holdTimer = setInterval(() => {
    const diff = state.holdUntil - Date.now();
    const timerEl = document.getElementById('hold-timer');
    if (diff <= 0) {
      timerEl.textContent = 'Hold released';
      detailCta.classList.add('disabled-link');
      detailCta.setAttribute('aria-disabled', 'true');
      clearInterval(state.holdTimer);
      return;
    }
    const minutes = String(Math.floor(diff / 60000)).padStart(2, '0');
    const seconds = String(Math.floor((diff % 60000) / 1000)).padStart(2, '0');
    timerEl.textContent = `Hold expires in ${minutes}:${seconds}`;
  }, 1000);

  const alternateItems = catalog.filter((entry) => entry.id !== item.id && (entry.tag === item.tag || entry.vibe === item.vibe)).slice(0, 3);
  alternates.innerHTML = '';
  alternateItems.forEach((alt) => {
    const button = document.createElement('button');
    button.className = 'option';
    button.textContent = alt.title;
    button.addEventListener('click', () => openDetail(alt.id));
    alternates.appendChild(button);
  });
}

nextBtn.addEventListener('click', () => {
  const step = steps[state.currentStep];
  state.answers[step.key] = state.currentChoice || textInput.value.trim();
  saveProfile();
  if (state.currentStep < steps.length - 1) {
    state.currentStep += 1;
    renderStep();
    return;
  }
  if (!isValidImageUrl(imageInput.value.trim())) {
    imageError.hidden = false;
    return;
  }
  imageError.hidden = true;
  state.answers.imageUrl = imageInput.value.trim();
  renderResults();
});

textInput.addEventListener('input', (event) => {
  state.currentChoice = event.target.value.trim();
  nextBtn.disabled = !state.currentChoice;
});

moreBtn.addEventListener('click', () => {
  state.visibleCount = state.visibleCount > 6 ? 6 : catalog.length;
  renderResults();
});

catalogGrid.addEventListener('click', (event) => {
  const target = event.target;
  if (target.matches('.open-detail')) {
    openDetail(target.dataset.id);
  }
});

overlay.querySelector('.close').addEventListener('click', () => {
  overlay.hidden = true;
  clearInterval(state.holdTimer);
});

notifyForm.addEventListener('submit', (event) => {
  event.preventDefault();
  if (!validateNotify(notifyInput.value.trim())) {
    notifyError.hidden = false;
    notifySuccess.hidden = true;
    return;
  }
  notifyError.hidden = true;
  notifySuccess.hidden = false;
  notifyForm.querySelector('button').disabled = true;
});

consentAccept.addEventListener('click', () => {
  state.consent = 'accepted';
  localStorage.setItem(consentKey, 'accepted');
  consentBanner.hidden = true;
  saveProfile();
});

consentReject.addEventListener('click', () => {
  state.consent = 'rejected';
  localStorage.setItem(consentKey, 'rejected');
  localStorage.removeItem(storageKey);
  consentBanner.hidden = true;
});

resetBtn.addEventListener('click', () => {
  localStorage.removeItem(storageKey);
  localStorage.removeItem(consentKey);
  window.location.reload();
});

if (state.consent !== 'pending') {
  consentBanner.hidden = true;
}

renderStep();
