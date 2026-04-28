// Import data and logic modules (all local, no async)
import { classes } from './classes.js';
import { species } from './species.js';
import { breeds } from './breeds.js';
import { filterPets } from './filters.js';

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

// Key for storing view mode in sessionStorage
const VIEW_KEY = 'petViewMode';
// Human-readable filter names for pills and labels
const filterNames = {
  classId: 'Class',
  speciesId: 'Species',
  breedId: 'Breed',
  size: 'Size',
  housing: 'Housing',
  space: 'Space',
  climate: 'Climate',
  social: 'Social',
  grooming: 'Grooming',
  exercise: 'Exercise',
  training: 'Training',
  lifeSpan: 'Life Span',
  cost: 'Cost',
  goodWithChildren: 'Good with Children',
  goodWithOtherPets: 'Good with Other Pets',
};
// Configuration for all filters shown in the "More Filters" drawer
const drawerFilters = [
  {
    label: 'Size',
    name: 'size',
    options: ['small', 'medium', 'large', 'varied'],
    type: 'multi',
  },
  {
    label: 'Housing',
    name: 'housing',
    options: [
      'apartment',
      'house',
      'farm',
      'enclosure',
      'terrarium',
      'aquarium',
      'cage',
    ],
    type: 'multi',
  },
  {
    label: 'Space',
    name: 'space',
    options: ['small', 'medium', 'large', 'varied'],
    type: 'multi',
  },
  {
    label: 'Climate',
    name: 'climate',
    options: ['cold', 'temperate', 'warm', 'humid', 'hot', 'varied'],
    type: 'multi',
  },
  {
    label: 'Social Needs',
    name: 'social',
    options: ['solitary', 'independent', 'social', 'highlySocial', 'varied'],
    type: 'multi',
  },
  {
    label: 'Grooming',
    name: 'grooming',
    options: ['none', 'low', 'moderate', 'high', 'varied'],
    type: 'multi',
  },
  {
    label: 'Exercise',
    name: 'exercise',
    options: ['low', 'moderate', 'high', 'veryHigh', 'varied'],
    type: 'multi',
  },
  {
    label: 'Training',
    name: 'training',
    options: ['easy', 'moderate', 'difficult', 'varied'],
    type: 'multi',
  },
  {
    label: 'Life Span (years)',
    name: 'lifeSpan',
    type: 'single',
    options: [
      { label: '1–3 years', value: '1-3' },
      { label: '4–7 years', value: '4-7' },
      { label: '8–15 years', value: '8-15' },
      { label: '16+ years', value: '16+' },
    ],
  },
  {
    label: 'Cost ($)',
    name: 'cost',
    type: 'single',
    options: [
      { label: '<$100', value: '<100' },
      { label: '$100–$500', value: '100-500' },
      { label: '$501–$2000', value: '501-2000' },
      { label: '$2001+', value: '2001+' },
    ],
  },
  {
    label: 'Good with Children',
    name: 'goodWithChildren',
    options: [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ],
    type: 'single',
  },
  {
    label: 'Good with Other Pets',
    name: 'goodWithOtherPets',
    options: [
      { label: 'Yes', value: true },
      { label: 'No', value: false },
    ],
    type: 'single',
  },
];

// Arrays of filter names by type for easy iteration
const multiFilterNames = drawerFilters
  .filter((f) => f.type === 'multi')
  .map((f) => f.name);
const singleFilterNames = drawerFilters
  .filter((f) => f.type === 'single')
  .map((f) => f.name);

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

/**
 * Creates an <option> element for a select dropdown.
 * @param {string} value - The value for the option.
 * @param {string} label - The label to display.
 * @returns {HTMLOptionElement} option - The created option element.
 */
function createOption(value, label) {
  const option = document.createElement('option');
  option.value = value;
  option.textContent = label;
  return option;
}

/**
 * Populates a <select> element with options.
 * @param {HTMLSelectElement} select - The select element to populate.
 * @param {Array} options - The options to add (array of {value, label}).
 */
function populateSelect(select, options) {
  select.innerHTML = ''; // Safe innerHTML usage for clearing content, not set to data
  select.append(createOption('', 'Any'));
  if (!Array.isArray(options)) return;
  const fragment = document.createDocumentFragment();
  for (const item of options) {
    if (
      item &&
      typeof item.value !== 'undefined' &&
      typeof item.label === 'string'
    ) {
      fragment.append(createOption(item.value, item.label));
    }
  }
  select.append(fragment);
}

const speciesById = Object.fromEntries(
  species.map((item) => [item.id, item.name])
);

/**
 * Gets the visible label from a select element.
 * Only returns a label for a real selection, not the placeholder.
 * @param {HTMLSelectElement|null} select - The select element.
 * @returns {string|undefined} The selected option text.
 */
function getSelectedOptionLabel(select) {
  if (!select || select.value === '') return undefined;
  return select.selectedOptions[0]?.textContent;
}

/**
 * Gets the select element for a drawer filter.
 * @param {string} key - The filter key.
 * @returns {HTMLSelectElement|null} The drawer select.
 */
function getDrawerSelect(key) {
  return moreFiltersDrawer.querySelector(`select[name="${key}"]`);
}

/**
 * Gets all checked checkbox inputs for a drawer filter.
 * @param {string} key - The filter key.
 * @returns {Array<HTMLInputElement>} The checked inputs.
 */
function getCheckedInputs(key) {
  return Array.from(
    moreFiltersDrawer.querySelectorAll(`input[name="${key}"]:checked`)
  );
}

/**
 * Populates the class select dropdown.
 */
function populateClassSelect() {
  populateSelect(
    classSelect,
    classes.map((cls) => ({ value: cls.id, label: cls.name }))
  );
}

/**
 * Populates the species select dropdown based on classId.
 * @param {string} classId - The selected class ID.
 */
function populateSpeciesSelect(classId) {
  populateSelect(
    speciesSelect,
    species
      .filter((sp) => !classId || sp.classId === classId)
      .map((sp) => ({ value: sp.id, label: sp.name }))
  );
}

/**
 * Populates the breed select dropdown based on speciesId.
 * @param {string} speciesId - The selected species ID.
 */
function populateBreedSelect(speciesId) {
  populateSelect(
    breedSelect,
    breeds
      .filter((br) => !speciesId || br.speciesId === speciesId)
      .map((br) => ({ value: br.id, label: br.name }))
  );
}

/**
 * Formats a camelCase or PascalCase string into a human-readable label.
 * @param {string} value - The string to format.
 * @returns {string} - The formatted label.
 */
function formatLabel(value) {
  return String(value)
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (char) => char.toUpperCase());
}

/**
 * Populates the more filters drawer with filter controls.
 */
function populateMoreFilters() {
  moreFiltersDrawer.innerHTML = ''; // Safe innerHTML usage for clearing content, not set to data
  const col1 = document.createElement('div');
  const col2 = document.createElement('div');
  col1.className = 'drawer-column';
  col2.className = 'drawer-column';

  for (const [index, filter] of drawerFilters.entries()) {
    const fieldset = document.createElement('fieldset');
    fieldset.className = 'filter-group';

    if (filter.type === 'single') {
      const legend = document.createElement('legend');
      legend.textContent = filter.label;
      fieldset.append(legend);

      const select = document.createElement('select');
      select.name = filter.name;
      select.id = filter.name;
      select.setAttribute('aria-label', filter.label);
      select.append(createOption('', 'Any'));
      for (const option of filter.options) {
        select.append(createOption(String(option.value), option.label));
      }
      fieldset.append(select);
    } else {
      const details = document.createElement('details');
      details.className = 'filter-dropdown';
      const summary = document.createElement('summary');
      summary.textContent = filter.label;
      details.append(summary);

      const optionWrapper = document.createElement('div');
      optionWrapper.className = 'dropdown-options';

      for (const option of filter.options) {
        const checkboxId = `${filter.name}-${option}`;
        const label = document.createElement('label');
        label.className = `checkbox-label checkbox-label-${filter.name}`;

        const input = document.createElement('input');
        input.type = 'checkbox';
        input.name = filter.name;
        input.value = option;
        input.id = checkboxId;
        input.setAttribute(
          'aria-label',
          `${filter.label} ${formatLabel(option)}`
        );
        input.addEventListener('change', () => {
          const checked = Array.from(
            optionWrapper.querySelectorAll('input[type="checkbox"]:checked')
          ).map((checkbox) => checkbox.parentElement.textContent.trim());
          summary.textContent = checked.length
            ? `${filter.label}: ${checked.join(', ')}`
            : filter.label;
        });

        label.setAttribute('for', checkboxId);
        label.append(input, formatLabel(option));
        optionWrapper.append(label);
      }

      details.append(optionWrapper);
      fieldset.append(details);
    }

    if (index % 2 === 0) {
      col1.append(fieldset);
    } else {
      col2.append(fieldset);
    }
  }

  moreFiltersDrawer.append(col1, col2);
}

// --- Event listeners for filter UI ---
moreFiltersBtn.addEventListener('click', () => {
  const expanded = moreFiltersBtn.getAttribute('aria-expanded') === 'true';
  moreFiltersBtn.setAttribute('aria-expanded', String(!expanded));
  moreFiltersDrawer.setAttribute('aria-hidden', String(expanded));
});

// When class changes, update species and breed dropdowns
classSelect.addEventListener('change', (event) => {
  populateSpeciesSelect(event.target.value);
  populateBreedSelect('');
});

// When species changes, update breed dropdown
speciesSelect.addEventListener('change', (event) => {
  populateBreedSelect(event.target.value);
});

/**
 * Updates the view toggle buttons and results section based on the selected mode.
 * @param {string} mode - The view mode ('grid' or 'list').
 */
function updateViewToggle(mode) {
  gridViewBtn.setAttribute('aria-pressed', String(mode === 'grid'));
  listViewBtn.setAttribute('aria-pressed', String(mode === 'list'));
  resultsSection.classList.toggle('list-view', mode === 'list');
}

// View toggle buttons for grid/list
gridViewBtn.addEventListener('click', () => {
  setViewMode('grid');
  updateViewToggle('grid');
  renderResults();
});

// View toggle buttons for grid/list
listViewBtn.addEventListener('click', () => {
  setViewMode('list');
  updateViewToggle('list');
  renderResults();
});

/**
 * Gathers all selected filter values from the form and drawer.
 * @returns {Object} - The filters object with selected values.
 */
function getFilters() {
  const filters = {
    classId: classSelect.value,
    speciesId: speciesSelect.value,
    breedId: breedSelect.value,
  };

  for (const key of multiFilterNames) {
    const values = getCheckedInputs(key).map((checkbox) => checkbox.value);
    if (values.length) filters[key] = values;
  }

  for (const key of singleFilterNames) {
    const select = getDrawerSelect(key);
    if (select && select.value !== '') {
      // Only convert to boolean for goodWithChildren/goodWithOtherPets
      if (key === 'goodWithChildren' || key === 'goodWithOtherPets') {
        filters[key] = select.value === 'true';
      } else {
        filters[key] = select.value;
      }
    }
  }
  return filters;
}

/**
 * Renders the active filter pills in the UI.
 */
function renderActiveFilters() {
  const activeFilters = [];
  for (const [select, key] of [
    [classSelect, 'classId'],
    [speciesSelect, 'speciesId'],
    [breedSelect, 'breedId'],
  ]) {
    const selected = getSelectedOptionLabel(select);
    if (selected) {
      activeFilters.push({
        label: `${filterNames[key]}: ${selected}`,
        key,
      });
    }
  }

  for (const key of multiFilterNames) {
    const checked = getCheckedInputs(key);
    for (const option of checked) {
      const valueLabel = option.parentElement
        ? option.parentElement.textContent.trim()
        : formatLabel(option.value);
      activeFilters.push({
        label: `${filterNames[key]}: ${valueLabel}`,
        key,
        value: option.value,
      });
    }
  }

  for (const key of singleFilterNames) {
    const select = getDrawerSelect(key);
    if (select && select.value !== '') {
      const label =
        select.selectedOptions[0]?.textContent || formatLabel(select.value);
      activeFilters.push({
        label: `${filterNames[key]}: ${label}`,
        key,
        value: select.value,
      });
    }
  }

  const container = document.querySelector('#activeFilters');
  container.innerHTML = ''; // Safe innerHTML usage for clearing content, not set to data
  container.classList.toggle('has-filters', activeFilters.length > 0);

  const pillElements = [];
  const fragment = document.createDocumentFragment();
  for (const filter of activeFilters) {
    const pill = document.createElement('span');
    pill.className = `filter-pill filter-pill-${filter.key}`;
    pill.textContent = filter.label;

    const button = document.createElement('button');
    button.className = 'remove-filter';
    button.type = 'button';
    button.setAttribute('aria-label', `Remove filter: ${filter.label}`);
    button.textContent = '×';
    button.addEventListener('click', () =>
      removeFilter(filter.key, filter.value)
    );

    pill.append(button);
    pillElements.push(pill);
    fragment.append(pill);
  }

  container.append(fragment);

  const filterBarBottom = container.parentElement;
  const viewToggle = filterBarBottom.querySelector('.view-toggle');
  if (viewToggle && pillElements.length > 0) {
    const pillsRight =
      pillElements[pillElements.length - 1].getBoundingClientRect().right;
    const menuLeft = viewToggle.getBoundingClientRect().left;
    if (pillsRight > menuLeft - 8) {
      while (
        pillElements.length &&
        pillElements[pillElements.length - 1].getBoundingClientRect().right >
          menuLeft - 32
      ) {
        pillElements.pop()?.remove();
      }
      const ellipsis = document.createElement('span');
      ellipsis.className = 'filter-pill';
      ellipsis.textContent = '...';
      container.append(ellipsis);
    }
  }
}

/**
 * Removes a filter from the UI and updates the results.
 * @param {string} key - The filter key to remove.
 * @param {string|boolean} [value] - The filter value to remove (for multi-select).
 */
function removeFilter(key, value) {
  if (key === 'classId') {
    classSelect.value = '';
    populateSpeciesSelect('');
    populateBreedSelect('');
  }
  if (key === 'speciesId') {
    speciesSelect.value = '';
    populateBreedSelect('');
  }
  if (key === 'breedId') {
    breedSelect.value = '';
  }

  if (multiFilterNames.includes(key) && value !== undefined) {
    const checkbox = moreFiltersDrawer.querySelector(
      `input[name="${key}"][value="${value}"]`
    );
    if (checkbox) checkbox.checked = false;
  } else {
    const select = getDrawerSelect(key);
    if (select) select.value = '';
  }

  renderActiveFilters();
  highlightSelectedFilters();
  updateFilterGroupSummaries();
  renderResults();
}

/**
 * Highlights selected filters in the UI for accessibility and clarity.
 */
function highlightSelectedFilters() {
  for (const select of [classSelect, speciesSelect, breedSelect]) {
    select.classList.toggle('selected-filter', Boolean(select.value));
  }

  for (const key of multiFilterNames) {
    const wrapper = moreFiltersDrawer.querySelector(
      `fieldset .checkbox-label-${key}`
    );
    const someChecked =
      Array.from(
        moreFiltersDrawer.querySelectorAll(`input[name="${key}"]:checked`)
      ).length > 0;
    if (wrapper) {
      wrapper.classList.toggle('selected-filter', someChecked);
    }
  }

  for (const key of singleFilterNames) {
    const select = getDrawerSelect(key);
    if (select) {
      select.classList.toggle('selected-filter', select.value !== '');
    }
  }
}

/**
 * Renders the filtered pet results in the results section.
 */
// Main rendering function: displays all matching pets as cards
function renderResults() {
  const filters = getFilters();
  const { results } = filterPets(filters);

  resultsSection.innerHTML = ''; // Safe innerHTML usage for clearing content, not set to data
  if (results.length === 0) {
    const emptyCard = document.createElement('div');
    emptyCard.className = 'pet-card';
    const title = document.createElement('h2');
    title.textContent = 'No matches found';
    const message = document.createElement('p');
    message.textContent = 'Try adjusting your filters.';
    emptyCard.append(title, message);
    resultsSection.append(emptyCard);
    return;
  }

  const fragment = document.createDocumentFragment();

  for (const item of results) {
    const card = document.createElement('article');
    card.className = 'pet-card';
    card.tabIndex = 0;

    const img = document.createElement('img');
    img.src = item.image;
    img.alt = item.imageAlt || item.name;
    img.loading = 'lazy';
    card.append(img);

    const info = document.createElement('div');
    info.className = 'pet-info';

    const speciesName = item.speciesId
      ? speciesById[item.speciesId] || 'Unknown'
      : item.name || 'Unknown';

    const titleRow = document.createElement('div');
    titleRow.className = 'pet-title-row';
    const name = document.createElement('h2');
    name.textContent = item.name;
    titleRow.append(name);

    if (speciesName && speciesName !== item.name) {
      const subtitle = document.createElement('span');
      subtitle.className = 'pet-subtitle';
      subtitle.textContent = speciesName;
      titleRow.append(subtitle);
    }

    info.append(titleRow);

    const details = document.createElement('div');
    details.className = 'pet-details';
    const sizeText = item.size
      ? item.size.charAt(0).toUpperCase() + item.size.slice(1)
      : 'Unknown';
    const lifespanText = item.lifeSpan
      ? `${item.lifeSpan[0]}–${item.lifeSpan[1]} yrs`
      : 'Unknown';
    const temperamentText = Array.isArray(item.temperament)
      ? item.temperament.filter((t) => t !== 'varied').join(', ') || 'Varied'
      : 'Unknown';

    const rowData = [
      ['Lifespan', lifespanText],
      ['Size', sizeText],
      ['Temperament', temperamentText],
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

  resultsSection.append(fragment);
}

/**
 * Updates the summary labels for all multi-select filter groups in the more filters drawer.
 * Ensures the summary reflects the currently checked options after programmatic changes.
 */
function updateFilterGroupSummaries() {
  for (const key of multiFilterNames) {
    // Find the details element that contains a checkbox with name=key
    const details = Array.from(
      moreFiltersDrawer.querySelectorAll('details.filter-dropdown')
    ).find((d) => d.querySelector(`input[name="${key}"]`));
    if (!details) return;
    const summary = details.querySelector('summary');
    if (!summary) return;
    const checked = Array.from(
      details.querySelectorAll(`input[name="${key}"]:checked`)
    ).map((checkbox) => checkbox.parentElement.textContent.trim());
    const filterObj = drawerFilters.find((f) => f.name === key);
    if (checked.length && filterObj) {
      summary.textContent = `${filterObj.label}: ${checked.join(', ')}`;
    } else if (filterObj) {
      summary.textContent = filterObj.label;
    }
  }
}

/**
 * Handles changes to any filter input and updates the UI.
 */
// Called on any filter change; updates pills, highlights, and results
function handleFilterChange() {
  renderActiveFilters();
  highlightSelectedFilters();
  renderResults();
}

// --- Initial setup: populate all dropdowns and render first view ---
filterForm.addEventListener('change', handleFilterChange);
moreFiltersDrawer.addEventListener('change', handleFilterChange);

populateClassSelect();
populateSpeciesSelect('');
populateBreedSelect('');
populateMoreFilters();
updateViewToggle(getViewMode());
renderActiveFilters();
highlightSelectedFilters();
renderResults();
