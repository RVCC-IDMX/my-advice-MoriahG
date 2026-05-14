// Import data and logic modules (all local, no async)
import { filterPets } from './filters.js';
import {
  showResults,
  showNoResults,
  showDetail,
  showRefusal,
  updateViewToggle,
} from './views.js';

let lastResults = [];
const ITEMS_PER_PAGE = 20;
let displayCount = ITEMS_PER_PAGE;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

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

// --------- Breed enrichment with Groq inference (on-demand) ---------

/**
 * Infers properties for a single breed via Groq API and caches the result.
 * Returns an object with inferred properties, or an empty object if inference fails.
 * @param {Object} breed - The breed object with name, temperament, breedGroup, size.
 * @returns {Promise<Object>} Inferred properties (cost, habitat, care, goodWithChildren, goodWithOtherPets) or empty object on failure.
 */
export async function enrichBreed(breed) {
  try {
    const cacheKey = `breedInference_${breed.id}`;

    // Check if inferred properties are already cached
    const cached = loadCache(cacheKey);
    if (cached) {
      return cached;
    }

    const res = await fetch('/.netlify/functions/infer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ breed }),
    });

    if (!res.ok) {
      return {}; // Gracefully skip inference on HTTP error
    }

    const inferred = await res.json();
    if (inferred && inferred.inferred === true) {
      saveCache(cacheKey, inferred);
      return inferred;
    }
    return {};
  } catch {
    // Network error or parse error — gracefully skip
    return {};
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
    // Silently fail on fetch or parse errors
  }
}

// DOM element references for all main controls and sections
document.addEventListener('DOMContentLoaded', () => {
  const filterForm = document.querySelector('#filterForm');
  const groqQueryInput = document.querySelector('#groqQuery');
  const resultsSection = document.querySelector('#resultsSection');
  const gridViewBtn = document.querySelector('#gridViewBtn');
  const listViewBtn = document.querySelector('#listViewBtn');

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
   * Handles the filter form submit event.
   * Prevents default form submission and renders results.
   * @param {Event} event - The submit event object.
   */
  function handleFormSubmit(event) {
    event.preventDefault();
    renderResults();
  }
  filterForm.addEventListener('submit', handleFormSubmit);

  /**
   * Handles clicks on pet cards to show details and its back button. Handles clicks on load more button.
   * @param {Event} event - The click event.
   */
  async function handleCardClick(event) {
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

    // call showDetail(item, container) and await it
    await showDetail(item, resultsSection);
  }
  resultsSection.addEventListener('click', handleCardClick);

  // ------ Render views and populate dropdowns ------

  /**
   * Calls the GROQ API to get filters from the user's query.
   * @param {string} query - The user's text query.
   * @returns {Promise<Object>} The filters object.
   */
  async function getGroqFilters(query) {
    if (!query.trim()) return {};
    try {
      const res = await fetch('/.netlify/functions/groq', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query }),
      });
      if (!res.ok) throw new Error('GROQ API error');

      const data = await res.json();
      return data;
    } catch (error) {
      resultsSection.textContent = `Could not process your query: ${error.message}`;
      return {};
    }
  }

  /**
   * Renders the current filtered pet results using GROQ query.
   */
  async function renderResults() {
    if (isLoadingBreeds) {
      resultsSection.textContent = 'Loading Breeds...';
      return;
    }
    const allBreeds = await loadBreedsFromCacheOrFetch();
    breeds = allBreeds;

    const query = groqQueryInput.value;
    const groqResult = await getGroqFilters(query);
    if (groqResult && groqResult.refused) {
      showRefusal(resultsSection, groqResult.refusal_reason);
      return;
    }
    // groqResult is the filter object directly
    const filters = groqResult || {};
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

  updateViewToggle(getViewMode(), gridViewBtn, listViewBtn, resultsSection);
  renderResults();
});
