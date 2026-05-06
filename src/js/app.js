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

  async function fetchBreeds() {
    isLoadingBreeds = true;
    resultsSection.textContent = 'Loading Breeds...';

    try {
      const response = await fetch('/.netlify/functions/api');
      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }
      breeds = await response.json();

      populateBreedSelect(breedSelect, breeds);
      isLoadingBreeds = false;
      renderResults();
    } catch (error) {
      isLoadingBreeds = false;
      resultsSection.textContent = `Fetch failed: ${error.message}`;
    }
  }

  fetchBreeds();

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
   * Prevents default form submission, refreshes active filter pills,
   * highlights the selected filters, and renders results.
   * @param {Event} event - The submit event object.
   */
  function handleFormSubmit(event) {
    event.preventDefault();
    renderResults();
  }
  // Listens for submit events on the main form and uses callback to update results
  filterForm.addEventListener('submit', handleFormSubmit);

  // Filters selected via more filters only affect results after form is submitted
  moreFiltersDrawer.addEventListener('submit', handleFormSubmit);

  /**
   * Handles drawer filter changes.
   * Updates the drawer group summaries and refreshes the active filter pill list.
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
  filterForm.addEventListener('change', handleDrawerChange);
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
   * Handles clicks on pet cards to show details and its back button.
   * @param {Event} event - The click event.
   */
  function handleCardClick(event) {
    // Back button
    if (event.target.closest('.back-button')) {
      if (lastResults.length === 0) {
        showNoResults(resultsSection);
      } else {
        showResults(lastResults, resultsSection);
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

  // --- Render views and populate dropdowns ---

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
  function renderResults() {
    if (isLoadingBreeds) {
      return;
    }

    const filters = getFilters(viewParams);
    const { results } = filterPets(breeds, filters);
    lastResults = Array.isArray(results) ? results : [];

    if (results.length === 0) {
      showNoResults(resultsSection);
    } else {
      showResults(results, resultsSection);
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
});
