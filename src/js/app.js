// Import data and logic modules (all local, no async)
import {
  filterPets,
  drawerFilters,
  multiFilterNames,
  singleFilterNames,
} from './filters.js';
import {
  showResults,
  showNoResults,
  showDetail,
  getFilters,
  populateBreedSelect,
  populateMoreFilters,
  updateViewToggle,
  highlightSelectedFilters,
  renderActiveFilters,
  clearFilterSelection,
  getActiveFiltersData,
  updateFilterGroupSummaries,
} from './views.js';

let lastResults = [];
const ITEMS_PER_PAGE = 20;
let displayCount = ITEMS_PER_PAGE;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
let isBreedSelectPopulated = false; // Flag to track if dropdown is populated

// --------- Caching functions for localStorage ---------

/**
 * Load a cached value from localStorage and respect TTL.
 * Returns parsed data or null when not present/expired/invalid.
 * @param {string} key - Storage key to read
 * @returns {*|null} Parsed cached value or null
 */
function loadCache(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const { timestamp, data } = JSON.parse(raw);
    if (
      Date.now() - timestamp > CACHE_TTL_MS &&
      (!Array.isArray(data) ||
        !(
          (typeof data === 'string' && data.trim() !== '') ||
          (typeof data?.url === 'string' && data.url.trim() !== '')
        ))
    ) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

/**
 * Save a value to localStorage with a timestamp for TTL.
 * Silently fails if storage is unavailable or full.
 * @param {string} key - Storage key to write
 * @param {*} data - Data to serialize and store
 * @returns {void}
 */
function saveCache(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify({ timestamp: Date.now(), data }));
  } catch {
    // localStorage full or unavailable — fall through
  }
}

// --------- Image API fetching with caching  ---------

/**
 * Fetches a dog image from the image API and updates the item object.
 * Includes a failsafe for breeds without photos to avoid repeated API calls.
 * (Exported so views can request images for items.)
 * @param {Object} item - The breed item object. Must include `id`.
 * @returns {Promise<void>} Resolves once image is set or skipped
 */
export async function fetchImg(item) {
  try {
    const cacheKey = `breedImage_${item.id}`;
    const noPhotoCacheKey = 'noPhotoBreeds';

    // Load "no-photo" cache
    let noPhotoCache = loadCache(noPhotoCacheKey);
    if (!Array.isArray(noPhotoCache)) {
      noPhotoCache = [];
    }

    if (noPhotoCache.includes(item.id)) {
      //console.warn(`Skipping fetch for breed ${item.id} (no photo available)`);
      return;
    }

    // Check image cache
    const cached = loadCache(cacheKey);
    if (cached) {
      item.image = cached;
      return;
    }

    // Fetch image from API
    const res = await fetch(`/.netlify/functions/image?breedId=${item.id}`);
    if (!res.ok) {
      throw new Error(`HTTP error: ${res.status}`);
    }

    const data = await res.json();
    if (data && data.url) {
      item.image = data.url;
      saveCache(cacheKey, data.url);
    } else {
      // Add to "no-photo" cache if no image is available
      if (!noPhotoCache.includes(item.id)) {
        noPhotoCache = [...noPhotoCache, item.id]; // Ensure proper array update
        saveCache(noPhotoCacheKey, noPhotoCache);
      }
    }
  } catch {
    //console.error('Image fetch failed:', error);
  }
}

// DOM element references for all main controls and sections
document.addEventListener('DOMContentLoaded', () => {
  const breedSelect = document.querySelector('#breedSelect');
  const filterForm = document.querySelector('#filterForm');
  const moreFiltersBtn = document.querySelector('#moreFiltersBtn');
  const moreFiltersDrawer = document.querySelector('#moreFiltersDrawer');
  const resultsSection = document.querySelector('#resultsSection');
  const gridViewBtn = document.querySelector('#gridViewBtn');
  const listViewBtn = document.querySelector('#listViewBtn');
  const activeFiltersContainer = document.querySelector('#activeFilters');

  let breeds = [];
  let isLoadingBreeds = false;

  /**
   * Fetches breed data from the API.
   * @returns {Promise<Array>} A promise resolving to the array of breed objects.
   */
  async function fetchBreeds() {
    isLoadingBreeds = true;
    resultsSection.textContent = 'Loading Breeds...';

    try {
      const response = await fetch('/.netlify/functions/api');
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      breeds = await response.json();
      isLoadingBreeds = false;
      return breeds;
    } catch (error) {
      isLoadingBreeds = false;
      resultsSection.textContent = `Fetch failed: ${error.message}`;
    }
  }

  /**
   * Loads breeds from cache or fetches from API if cache is empty/expired.
   * @returns {Promise<Array>} A promise resolving to the array of breed objects.
   */
  async function loadBreedsFromCacheOrFetch() {
    const cacheKey = 'dogBreedsCache';
    const cached = loadCache(cacheKey);
    if (cached) return cached;
    const fresh = await fetchBreeds();
    saveCache(cacheKey, fresh);
    return fresh;
  }

  // Key for storing view mode in sessionStorage
  const VIEW_KEY = 'petViewMode';

  /**
   * Gets the current view mode from sessionStorage.
   * @returns {string} The current view mode ('grid' or 'list').
   */
  function getViewMode() {
    return sessionStorage.getItem(VIEW_KEY) || 'grid';
  }

  /**
   * Sets the view mode in sessionStorage.
   * @param {string} mode - The view mode to set ('grid' or 'list').
   */
  function setViewMode(mode) {
    sessionStorage.setItem(VIEW_KEY, mode);
  }

  // --- Event listeners for filter UI ---

  /**
   * Handles toggling the More Filters drawer open/closed.
   */
  function handleMoreFiltersBtnClick() {
    const expanded = moreFiltersBtn.getAttribute('aria-expanded') === 'true';
    moreFiltersBtn.setAttribute('aria-expanded', String(!expanded));
    moreFiltersDrawer.setAttribute('aria-hidden', String(expanded));
  }
  moreFiltersBtn.addEventListener('click', handleMoreFiltersBtnClick);

  /**
   * Handles grid view button click: sets view to grid.
   */
  function handleGridViewBtnClick() {
    setViewMode('grid');
    updateViewToggle('grid', gridViewBtn, listViewBtn, resultsSection);
    renderResults();
  }
  gridViewBtn.addEventListener('click', handleGridViewBtnClick);

  /**
   * Handles list view button click: sets view to list.
   */
  function handleListViewBtnClick() {
    setViewMode('list');
    updateViewToggle('list', gridViewBtn, listViewBtn, resultsSection);
    renderResults();
  }
  listViewBtn.addEventListener('click', handleListViewBtnClick);

  /**
   * Renders the active filter pills in the UI.
   */
  function updateActiveFilters() {
    const activeFiltersData = getActiveFiltersData({
      breedSelect,
      drawer: moreFiltersDrawer,
      multiFilterNames,
      singleFilterNames,
    });
    renderActiveFilters(activeFiltersData, activeFiltersContainer);
  }

  /**
   * Removes a filter from the UI and updates the results.
   * @param {string} key - The filter key to remove.
   * @param {string|boolean} [value] - The filter value to remove (for multi-select).
   */
  function removeFilter(key, value) {
    clearFilterSelection({
      key,
      value,
      breedSelect,
      drawer: moreFiltersDrawer,
      multiFilterNames,
      breedItems: breeds,
    });
    updateActiveFilters();
    highlightSelectedFilters(
      [breedSelect],
      moreFiltersDrawer,
      multiFilterNames,
      singleFilterNames
    );
    updateFilterGroupSummaries(
      moreFiltersDrawer,
      multiFilterNames,
      drawerFilters
    );
  }

  /**
   * Handles the filter form submit event.
   * Prevents default form submission and renders results.
   * @param {Event} event - The submit event object.
   */
  function handleFormSubmit(event) {
    event.preventDefault();
    renderResults();
  }
  // Listens for submit events on the main form and uses callback to update results
  filterForm.addEventListener('submit', handleFormSubmit);

  /**
   * Handles drawer filter changes.
   * Updates the drawer group summaries, active filter pills, and highlights.
   * @param {Event} event - The change event object.
   */
  function handleDrawerChange() {
    updateFilterGroupSummaries(
      moreFiltersDrawer,
      multiFilterNames,
      drawerFilters
    );
    updateActiveFilters();
    highlightSelectedFilters(
      [breedSelect],
      moreFiltersDrawer,
      multiFilterNames,
      singleFilterNames
    );
  }
  filterForm.addEventListener('change', handleDrawerChange); // Kept so filter pills show before submitting form, does not trigger breed filtering/rendering
  moreFiltersDrawer.addEventListener('change', handleDrawerChange);

  /**
   * Handles clicks on the active filters container (removes filters).
   * @param {Event} event - The click event.
   */
  function handleRemoveFiltersClick(event) {
    const button = event.target.closest('.remove-filter');
    if (button) {
      removeFilter(button.dataset.key, button.dataset.value);
    }
  }
  activeFiltersContainer.addEventListener('click', handleRemoveFiltersClick);

  /**
   * Handles clicks on pet cards to show details and its back button. Handles clicks on load more button.
   * @param {Event} event - The click event.
   */
  function handleCardClick(event) {
    // Load more button
    if (event.target.closest('.load-more-btn')) {
      displayCount += ITEMS_PER_PAGE;
      showResults(lastResults, resultsSection, displayCount);
      return;
    }

    // Back button
    if (event.target.closest('.back-button')) {
      if (lastResults.length === 0) {
        showNoResults(resultsSection);
      } else {
        showResults(lastResults, resultsSection, displayCount);
      }
      return;
    }

    // Card click
    const card = event.target.closest('.pet-card');
    if (!card) return;

    // find the item this card represents
    const itemId = card.dataset.id;
    const item = breeds.find((breed) => breed.id === itemId);

    // call showDetail(item, container)
    showDetail(item, resultsSection);
  }
  resultsSection.addEventListener('click', handleCardClick);

  // ------ Render views and populate dropdowns ------

  // getFilters parameters
  const viewParams = {
    resultsSection,
    breedSelect,
    drawer: moreFiltersDrawer,
    multiFilterNames,
    singleFilterNames,
  };
  /**
   * Renders the current filtered pet results.
   * Uses showResults and showNoResults from views.js as the low-level renderer.
   */
  async function renderResults() {
    if (isLoadingBreeds) {
      resultsSection.textContent = 'Loading Breeds...';
      return;
    }
    const allBreeds = await loadBreedsFromCacheOrFetch();
    breeds = allBreeds;

    // Populate the BreedSelect dropdown only once
    if (!isBreedSelectPopulated) {
      populateBreedSelect(breedSelect, breeds);
      isBreedSelectPopulated = true;
    }

    const filters = getFilters(viewParams);
    const { results } = filterPets(breeds, filters);
    lastResults = Array.isArray(results) ? results : [];

    // Reset display count on new search
    displayCount = ITEMS_PER_PAGE;

    if (results.length === 0) {
      showNoResults(resultsSection);
    } else {
      showResults(results, resultsSection, displayCount);
    }
  }

  populateBreedSelect(breedSelect, breeds);
  populateMoreFilters(moreFiltersDrawer, drawerFilters);
  updateViewToggle(getViewMode(), gridViewBtn, listViewBtn, resultsSection);
  updateActiveFilters();
  highlightSelectedFilters(
    [breedSelect],
    moreFiltersDrawer,
    multiFilterNames,
    singleFilterNames
  );
  renderResults();
});
