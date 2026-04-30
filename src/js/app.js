// Import data and logic modules (all local, no async)
import { classes } from './classes.js';
import { species } from './species.js';
import { breeds } from './breeds.js';
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
  populateClassSelect,
  populateSpeciesSelect,
  populateBreedSelect,
  populateMoreFilters,
  updateViewToggle,
  highlightSelectedFilters,
  renderActiveFilters,
  clearFilterSelection,
  getActiveFiltersData,
  updateFilterGroupSummaries,
} from './views.js';

// DOM element references for all main controls and sections
const classSelect = document.querySelector('#classSelect');
const speciesSelect = document.querySelector('#speciesSelect');
const breedSelect = document.querySelector('#breedSelect');
const filterForm = document.querySelector('#filterForm');
const moreFiltersBtn = document.querySelector('#moreFiltersBtn');
const moreFiltersDrawer = document.querySelector('#moreFiltersDrawer');
const resultsSection = document.querySelector('#resultsSection');
const gridViewBtn = document.querySelector('#gridViewBtn');
const listViewBtn = document.querySelector('#listViewBtn');
const activeFiltersContainer = document.querySelector('#activeFilters');

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
 * Handles class select change: updates species and breed dropdowns.
 * @param {Event} event - The change event.
 */
function handleClassSelectChange(event) {
  populateSpeciesSelect(speciesSelect, species, event.target.value);
  populateBreedSelect(breedSelect, breeds, '');
}
classSelect.addEventListener('change', handleClassSelectChange);

/**
 * Handles species select change: updates breed dropdown.
 * @param {Event} event - The change event.
 */
function handleSpeciesSelectChange(event) {
  populateBreedSelect(breedSelect, breeds, event.target.value);
}
speciesSelect.addEventListener('change', handleSpeciesSelectChange);

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
    classSelect,
    speciesSelect,
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
    classSelect,
    speciesSelect,
    breedSelect,
    drawer: moreFiltersDrawer,
    multiFilterNames,
    speciesItems: species,
    breedItems: breeds,
  });

  updateActiveFilters();
  highlightSelectedFilters(
    [classSelect, speciesSelect, breedSelect],
    moreFiltersDrawer,
    multiFilterNames,
    singleFilterNames
  );
  updateFilterGroupSummaries(
    moreFiltersDrawer,
    multiFilterNames,
    drawerFilters
  );
  renderResults();
}

// Called on any filter change; updates pills, highlights, and results
function handleFilterChange() {
  updateFilterGroupSummaries(
    moreFiltersDrawer,
    multiFilterNames,
    drawerFilters
  );
  updateActiveFilters();
  highlightSelectedFilters(
    [classSelect, speciesSelect, breedSelect],
    moreFiltersDrawer,
    multiFilterNames,
    singleFilterNames
  );
  renderResults();
}
filterForm.addEventListener('change', handleFilterChange);
moreFiltersDrawer.addEventListener('change', handleFilterChange);

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

// --- Render views and populate dropdowns ---

// getFilters parameters
const viewParams = {
  resultsSection,
  classSelect,
  speciesSelect,
  breedSelect,
  drawer: moreFiltersDrawer,
  multiFilterNames,
  singleFilterNames,
};
showDetail(breeds[2], resultsSection);
/**
 * Renders the current filtered pet results.
 * Uses showResults and showNoResults from views.js as the low-level renderer.
 */
function renderResults() {
  const filters = getFilters(viewParams);
  const { results } = filterPets(filters);

  if (results.length === 0) {
    showNoResults(resultsSection);
  } else {
    showResults(results, resultsSection);
  }
}

populateClassSelect(classSelect, classes);
populateSpeciesSelect(speciesSelect, species, '');
populateBreedSelect(breedSelect, breeds, '');
populateMoreFilters(moreFiltersDrawer, drawerFilters);
updateViewToggle(getViewMode(), gridViewBtn, listViewBtn, resultsSection);
updateActiveFilters();
highlightSelectedFilters(
  [classSelect, speciesSelect, breedSelect],
  moreFiltersDrawer,
  multiFilterNames,
  singleFilterNames
);
renderResults();
