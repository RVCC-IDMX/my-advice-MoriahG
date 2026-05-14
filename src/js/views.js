import { formatPetForDisplay } from './filters.js';
import { fetchImg, enrichBreed } from './app.js';

/**
 * Updates the view toggle buttons and results section based on the selected mode.
 * @param {string} mode - The view mode ('grid' or 'list').
 * @param {HTMLElement} gridViewBtn - Grid view button element.
 * @param {HTMLElement} listViewBtn - List view button element.
 * @param {HTMLElement} resultsSection - Results section element.
 */
function updateViewToggle(mode, gridViewBtn, listViewBtn, resultsSection) {
  gridViewBtn.setAttribute('aria-pressed', String(mode === 'grid'));
  listViewBtn.setAttribute('aria-pressed', String(mode === 'list'));
  resultsSection.classList.toggle('list-view', mode === 'list');
}

// Results view
/**
 * Renders the filtered pet results in the results container.
 * @param {Array} items - The list of pets to display.
 * @param {HTMLElement} container - The DOM element where the results will be rendered.
 * @param {number} [displayCount=20] - The maximum number of cards to display initially.
 */
function showResults(items, container, displayCount = 20) {
  // Show this view
  container.classList.remove('hidden');

  // Build the content
  container.textContent = '';

  const fragment = document.createDocumentFragment();
  const itemsToDisplay = items.slice(0, displayCount);

  for (const item of itemsToDisplay) {
    const card = document.createElement('article');
    card.className = 'pet-card';
    card.tabIndex = 0;
    card.dataset.id = item.id;

    const img = document.createElement('img');
    img.alt = item.imageAlt || item.name;
    img.loading = 'lazy';
    // Add error handler to prevent endless loop
    img.addEventListener('error', () => {
      if (!img.src.endsWith('/images/placeholder.jpg')) {
        img.src = '/images/placeholder.jpg';
        img.alt = 'No photo available for this breed';
      }
    });
    card.append(img);
    // Fetch specific image for this card
    fetchImg(item).then(() => {
      if (!img.src) {
        img.src = item.image || '';
      }
    });

    const info = document.createElement('div');
    info.className = 'pet-info';

    const display = formatPetForDisplay(item);

    const titleRow = document.createElement('div');
    titleRow.className = 'pet-title-row';
    const name = document.createElement('h2');
    name.textContent = item.name;
    titleRow.append(name);

    info.append(titleRow);

    const details = document.createElement('div');
    details.className = 'pet-details';

    const rowData = [
      ['Lifespan', display.lifespan],
      ['Size', display.size],
      ['Temperament', display.temperament],
    ];

    for (const [label, value] of rowData) {
      const row = document.createElement('div');
      row.className = 'pet-detail-row';
      const labelSpan = document.createElement('span');
      labelSpan.className = 'pet-detail-label';
      labelSpan.textContent = label;
      const valueSpan = document.createElement('span');
      valueSpan.className = 'pet-detail-value';
      valueSpan.textContent = value;
      row.append(labelSpan, valueSpan);
      details.append(row);
    }

    info.append(details);
    card.append(info);
    fragment.append(card);
  }

  container.append(fragment);

  // Add load more button if there are more items to display
  if (items.length > displayCount) {
    const loadMoreContainer = document.createElement('div');
    loadMoreContainer.className = 'load-more-container';

    const loadMoreBtn = document.createElement('button');
    loadMoreBtn.className = 'load-more-btn';
    loadMoreBtn.type = 'button';
    loadMoreBtn.textContent = 'Load More';

    loadMoreContainer.append(loadMoreBtn);
    container.append(loadMoreContainer);
  }
}

// No results view
/**
 * Renders the no results state in the container.
 * @param {HTMLElement} container - The DOM element where the message will be rendered.
 */
function showNoResults(container) {
  // Show this view
  container.classList.remove('hidden');

  // Build the content
  container.textContent = '';

  const emptyCard = document.createElement('div');
  emptyCard.className = 'no-results';
  const title = document.createElement('h2');
  title.textContent = 'No matches found';
  const message = document.createElement('p');
  message.textContent = 'Try adjusting your filters.';

  emptyCard.append(title, message);
  container.append(emptyCard);
}

// Detail view
/**
 * Displays detail view for a single pet breed, fetching inferred properties on-demand.
 * @param {Object} item - The breed object.
 * @param {HTMLElement} container - The DOM element where the detail will be rendered.
 * @returns {Promise<void>} Resolves once detail is rendered.
 */
async function showDetail(item, container) {
  // Show this view with loading state
  container.classList.remove('hidden');
  container.textContent = '';

  // Show loading message while inferring
  const loadingMsg = document.createElement('div');
  loadingMsg.className = 'loading-message';
  loadingMsg.textContent = `Loading details for ${item.name}...`;
  container.append(loadingMsg);

  // Infer properties on-demand if not already present
  if (!item.cost || !item.habitat || !item.care) {
    const inferred = await enrichBreed(item);
    // Merge inferred properties into the item
    Object.assign(item, inferred);
  }

  // Clear loading state and render details
  container.textContent = '';
  const detailCard = document.createElement('article');
  detailCard.className = 'pet-detail-card';

  const img = document.createElement('img');
  img.src = item.image || '/images/placeholder.jpg';
  img.alt = item.imageAlt || 'No photo available for this breed';
  img.loading = 'lazy';

  detailCard.append(img);

  const petDetails = document.createElement('div');
  petDetails.className = 'pet-details';

  const display = formatPetForDisplay(item); // filter.js function to format properties

  const titleRow = document.createElement('div');
  titleRow.className = 'pet-title-row';

  const name = document.createElement('h2');
  name.textContent = display.displayName;
  titleRow.append(name);

  const displayRows = [
    ['Description:', display.description],
    ['Size:', display.size],
    ['Lifespan:', display.lifespan],
    ['Temperament:', display.temperament],
    ['Origin:', display.origin],
    ['Breed Group:', display.breedGroup],
    ['Below are AI inferred values, may not be accurate:'],
    ['Cost:', display.monthlyCost],
    ['Housing:', display.housing],
    ['Exercise:', display.exercise],
    ['Good with children:', display.goodWithChildren],
    ['Good with other pets:', display.goodWithOtherPets],
  ];

  petDetails.append(titleRow);

  const detailList = document.createElement('div');
  detailList.className = 'pet-detail-list';

  for (const [label, value] of displayRows) {
    const row = document.createElement('div');
    row.className = 'pet-detail-row';

    const labelSpan = document.createElement('span');
    labelSpan.className = 'pet-detail-label';
    labelSpan.textContent = label;

    const valueSpan = document.createElement('span');
    valueSpan.className = 'pet-detail-value';
    valueSpan.textContent = value;

    row.append(labelSpan, valueSpan);
    detailList.append(row);
  }

  // Back Button
  const backButton = document.createElement('button');
  backButton.className = 'back-button';
  backButton.type = 'button';
  backButton.textContent = '< Back';

  petDetails.append(detailList);
  detailCard.append(petDetails, backButton);
  container.append(detailCard);
}

/**
 * Renders a refusal message if the GROQ API refuses the query.
 * @param {HTMLElement} container - The DOM element where the message will be rendered.
 * @param {string} refusalReason - The reason for the refusal.
 */
function showRefusal(container, refusalReason) {
  container.classList.remove('hidden');
  container.textContent = '';
  const refusalCard = document.createElement('div');
  refusalCard.className = 'refusal-message';
  const title = document.createElement('h2');
  title.textContent = 'Ruh-Roh, your input was roofused!';
  const message = document.createElement('p');
  message.textContent = `${refusalReason}, Paw-lease try again!`;
  refusalCard.append(title, message);
  container.append(refusalCard);
}

export {
  showResults,
  showNoResults,
  showRefusal,
  updateViewToggle,
  showDetail,
};
