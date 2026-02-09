const steps = [
  {
    prompt: 'I am a...',
    key: 'identity',
    options: ['Woman', 'Man', 'Non-binary', 'Shopping for someone else'],
  },
  {
    prompt: 'I need a...',
    key: 'occasion',
    options: [
      'Wedding guest look',
      'Boardroom ready',
      'Brunch smart-casual',
      'Evening cocktail',
      'Summer resort',
      'Festive Indian wear',
    ],
  },
  {
    prompt: 'I like...',
    key: 'vibe',
    options: [
      'Minimal and tailored',
      'Bold colors',
      'Monochrome luxe',
      'Crafted textiles',
      'Understated with a statement accessory',
      'Comfort first',
    ],
  },
];

const catalog = [
  {
    title: 'Champagne silk kurta set',
    tag: 'Festive Indian wear',
    vibe: 'Understated with a statement accessory',
    price: 'Rs 14,500',
    pickup: 'Ready for pickup today in Mumbai',
  },
  {
    title: 'Midnight linen bandhgala',
    tag: 'Evening cocktail',
    vibe: 'Minimal and tailored',
    price: 'Rs 18,900',
    pickup: 'Reserve for Delhi pickup in 2 hours',
  },
  {
    title: 'Ivory chikankari saree',
    tag: 'Wedding guest look',
    vibe: 'Crafted textiles',
    price: 'Rs 22,000',
    pickup: 'Ready for pickup today in Lucknow',
  },
  {
    title: 'Charcoal Italian suit',
    tag: 'Boardroom ready',
    vibe: 'Minimal and tailored',
    price: 'Rs 32,000',
    pickup: 'Same-day tailoring slot in Bangalore',
  },
  {
    title: 'Terracotta co-ord set',
    tag: 'Brunch smart-casual',
    vibe: 'Bold colors',
    price: 'Rs 9,800',
    pickup: 'Pickup today in Hyderabad',
  },
  {
    title: 'Sea-foam resort dress',
    tag: 'Summer resort',
    vibe: 'Comfort first',
    price: 'Rs 11,400',
    pickup: 'Ready tomorrow in Goa',
  },
];

const promptEl = document.getElementById('prompt');
const optionsEl = document.getElementById('options');
const nextBtn = document.getElementById('next-btn');
const stepCountEl = document.getElementById('step-count');
const stepFillEl = document.getElementById('step-fill');
const textInput = document.getElementById('text-input');
const catalogSection = document.getElementById('catalog');
const catalogGrid = document.getElementById('catalog-grid');
const flowSection = document.getElementById('question-flow');

let currentStep = 0;
const answers = {};
let currentChoice = '';

function renderStep() {
  const step = steps[currentStep];
  promptEl.textContent = step.prompt;
  stepCountEl.textContent = `Step ${currentStep + 1} of ${steps.length}`;
  stepFillEl.style.width = `${((currentStep + 1) / steps.length) * 100}%`;
  optionsEl.innerHTML = '';
  currentChoice = answers[step.key] || '';
  textInput.value = currentChoice;

  step.options.forEach((opt) => {
    const button = document.createElement('button');
    button.className = 'option';
    button.type = 'button';
    button.textContent = opt;
    if (opt === currentChoice) button.classList.add('active');
    button.addEventListener('click', () => {
      currentChoice = opt;
      document.querySelectorAll('.option').forEach((el) => el.classList.remove('active'));
      button.classList.add('active');
      nextBtn.disabled = false;
      textInput.value = opt;
    });
    optionsEl.appendChild(button);
  });

  nextBtn.disabled = !currentChoice;
}

function showCatalog() {
  flowSection.hidden = true;
  catalogSection.hidden = false;

  const selections = {
    identity: answers.identity,
    occasion: answers.occasion,
    vibe: answers.vibe,
  };

  const curated = catalog.filter((item) => {
    const matchesVibe = item.vibe === selections.vibe || selections.vibe === 'Understated with a statement accessory' && item.vibe.includes('statement');
    const matchesOccasion = item.tag === selections.occasion || item.tag === 'Festive Indian wear' && selections.occasion?.includes('Festive');
    return matchesVibe || matchesOccasion;
  });

  const picks = curated.length ? curated : catalog.slice(0, 4);

  catalogGrid.innerHTML = '';
  picks.forEach((item) => {
    const card = document.createElement('article');
    card.className = 'item-card';
    card.innerHTML = `
      <div class="item-tag">${item.tag}</div>
      <h3 class="item-title">${item.title}</h3>
      <div class="item-meta">${item.vibe}</div>
      <div class="item-price">${item.price}</div>
      <div class="item-cta"><span>Pickup</span>${item.pickup}</div>
    `;
    catalogGrid.appendChild(card);
  });
}

nextBtn.addEventListener('click', () => {
  const step = steps[currentStep];
  answers[step.key] = currentChoice || textInput.value.trim();

  if (currentStep < steps.length - 1) {
    currentStep += 1;
    renderStep();
  } else {
    showCatalog();
  }
});

textInput.addEventListener('input', (e) => {
  currentChoice = e.target.value.trim();
  if (!currentChoice) {
    document.querySelectorAll('.option').forEach((el) => el.classList.remove('active'));
  }
  nextBtn.disabled = !currentChoice;
});

renderStep();
