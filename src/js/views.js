import { formatPetForDisplay } from './filters.js';
import { fetchImg } from './app.js';

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
  select.textContent = '';
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

/**
 * Populates the breed select dropdown.
 * @param {HTMLSelectElement} select - The breed <select> element.
 * @param {Array<{id: string, name: string}>} breedItems - All available breeds.
 */
function populateBreedSelect(select, breedItems) {
  populateSelect(
    select,
    Array.isArray(breedItems)
      ? breedItems.map((br) => ({ value: br.id, label: br.name }))
      : []
  );
}

/**
 * Clears a selected filter in the UI and resets any dependent controls.
 * This is a view helper: it updates form controls (DOM), but does not re-run filtering logic.
 * @param {Object} params - Parameters object.
 * @param {string} params.key - The filter key to clear.
 * @param {string|boolean|undefined} params.value - The filter value to clear (for multi-select).
 * @param {HTMLSelectElement} params.breedSelect - Main breed select.
 * @param {HTMLElement} params.drawer - The More Filters drawer.
 * @param {Array<string>} params.multiFilterNames - Keys for multi-select filters.
 * @param {Array<{id: string, name: string}>} params.breedItems - All available breeds.
 */
function clearFilterSelection({
  key,
  value,
  breedSelect,
  drawer,
  multiFilterNames,
}) {
  if (key === 'breedId') {
    breedSelect.value = '';
  }

  if (
    Array.isArray(multiFilterNames) &&
    multiFilterNames.includes(key) &&
    value !== undefined
  ) {
    const checkbox = drawer.querySelector(
      `input[name="${key}"][value="${value}"]`
    );
    if (checkbox) checkbox.checked = false;
    return;
  }

  const select = drawer.querySelector(`select[name="${key}"]`);
  if (select) select.value = '';
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
 * @param {HTMLElement} drawerContainer - The DOM element for the drawer.
 * @param {Array} filtersData - The configuration array for the filters.
 */
function populateMoreFilters(drawerContainer, filtersData) {
  drawerContainer.textContent = '';
  const col1 = document.createElement('div');
  const col2 = document.createElement('div');
  col1.className = 'drawer-column';
  col2.className = 'drawer-column';

  for (const [index, filter] of filtersData.entries()) {
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

  drawerContainer.append(col1, col2);
}

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

/**
 * Highlights selected filters in the UI for accessibility and clarity.
 * @param {Array<HTMLSelectElement>} mainSelects - Array of main select elements.
 * @param {HTMLElement} drawer - The More Filters drawer element.
 * @param {Array<string>} multiNames - Keys for multi-select filters.
 * @param {Array<string>} singleNames - Keys for single-select filters.
 */
function highlightSelectedFilters(
  mainSelects,
  drawer,
  multiNames,
  singleNames
) {
  for (const select of mainSelects) {
    select.classList.toggle('selected-filter', Boolean(select.value));
  }

  for (const key of multiNames) {
    const wrapper = drawer.querySelector(`fieldset .checkbox-label-${key}`);
    const someChecked =
      Array.from(drawer.querySelectorAll(`input[name="${key}"]:checked`))
        .length > 0;
    if (wrapper) {
      wrapper.classList.toggle('selected-filter', someChecked);
    }
  }

  for (const key of singleNames) {
    const select = drawer.querySelector(`select[name="${key}"]`);
    if (select) {
      select.classList.toggle('selected-filter', select.value !== '');
    }
  }
}

/**
 * Renders the active filter pills.
 * @param {Array} activeFilters - Array of filter objects { label, key, value }.
 * @param {HTMLElement} container - The container element for active filters.
 */
function renderActiveFilters(activeFilters, container) {
  container.textContent = '';
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
    button.dataset.key = filter.key;
    if (filter.value !== undefined) {
      button.dataset.value = filter.value;
    }

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
 * @param {HTMLElement} drawer - The More Filters drawer element.
 * @param {string} key - The filter key.
 * @returns {HTMLSelectElement|null} The drawer select.
 */
function getDrawerSelect(drawer, key) {
  return drawer.querySelector(`select[name="${key}"]`);
}

/**
 * Gets all checked checkbox inputs for a drawer filter.
 * @param {HTMLElement} drawer - The More Filters drawer element.
 * @param {string} key - The filter key.
 * @returns {Array<HTMLInputElement>} The checked inputs.
 */
function getCheckedInputs(drawer, key) {
  return Array.from(drawer.querySelectorAll(`input[name="${key}"]:checked`));
}

/**
 * Builds the data used to render active filter pills based on current UI selections.
 * @param {Object} params - Parameters object.
 * @param {HTMLSelectElement} params.breedSelect - Breed select element.
 * @param {HTMLElement} params.drawer - The More Filters drawer element.
 * @param {Array<string>} params.multiFilterNames - Keys for multi-select filters.
 * @param {Array<string>} params.singleFilterNames - Keys for single-select filters.
 * @returns {Array<{label: string, key: string, value?: string}>} Active filter pill data.
 */
function getActiveFiltersData({
  breedSelect,
  drawer,
  multiFilterNames,
  singleFilterNames,
}) {
  const activeFiltersData = [];
  for (const [select, key] of [[breedSelect, 'breedId']]) {
    const selected = getSelectedOptionLabel(select);
    if (selected) {
      activeFiltersData.push({
        label: `${formatLabel(key).replace(' Id', '')}: ${selected}`,
        key,
      });
    }
  }

  for (const key of multiFilterNames) {
    const checked = getCheckedInputs(drawer, key);
    for (const option of checked) {
      const valueLabel = option.parentElement
        ? option.parentElement.textContent.trim()
        : formatLabel(option.value);
      activeFiltersData.push({
        label: `${formatLabel(key)}: ${valueLabel}`,
        key,
        value: option.value,
      });
    }
  }

  for (const key of singleFilterNames) {
    const select = getDrawerSelect(drawer, key);
    if (select && select.value !== '') {
      const label =
        select.selectedOptions[0]?.textContent || formatLabel(select.value);
      activeFiltersData.push({
        label: `${formatLabel(key)}: ${label}`,
        key,
        value: select.value,
      });
    }
  }

  return activeFiltersData;
}

/**
 * Gathers all selected filter values from the main form and drawer.
 * @param {Object} params - Parameters object.
 * @param {HTMLSelectElement} params.breedSelect - Main breed select.
 * @param {HTMLElement} params.drawer - The More Filters drawer element.
 * @param {Array<string>} params.multiFilterNames - Keys for multi-select filters.
 * @param {Array<string>} params.singleFilterNames - Keys for single-select filters.
 * @returns {Object} The assembled filter values.
 */
function getFilters({
  breedSelect,
  drawer,
  multiFilterNames,
  singleFilterNames,
}) {
  const filters = {
    breedId: breedSelect.value,
  };

  for (const key of multiFilterNames) {
    const values = getCheckedInputs(drawer, key).map(
      (checkbox) => checkbox.value
    );
    if (values.length) filters[key] = values;
  }

  for (const key of singleFilterNames) {
    const select = getDrawerSelect(drawer, key);
    if (select && select.value !== '') {
      filters[key] =
        key === 'goodWithChildren' || key === 'goodWithOtherPets'
          ? select.value === 'true'
          : select.value;
    }
  }

  return filters;
}

/**
 * Updates the summary labels for all multi-select filter groups in the more filters drawer.
 * Ensures the summary reflects the currently checked options after programmatic changes.
 * @param {HTMLElement} drawer - The More Filters drawer element.
 * @param {Array<string>} multiFilterNames - Keys for multi-select filters.
 * @param {Array<{name: string, label: string}>} drawerFilters - Drawer filter configuration.
 */
function updateFilterGroupSummaries(drawer, multiFilterNames, drawerFilters) {
  for (const key of multiFilterNames) {
    const details = Array.from(
      drawer.querySelectorAll('details.filter-dropdown')
    ).find((d) => d.querySelector(`input[name="${key}"]`));
    if (!details) continue;

    const summary = details.querySelector('summary');
    if (!summary) continue;

    const checked = Array.from(
      details.querySelectorAll(`input[name="${key}"]:checked`)
    )
      .map((checkbox) => checkbox.parentElement?.textContent.trim())
      .filter(Boolean);

    const filterObj = Array.isArray(drawerFilters)
      ? drawerFilters.find((f) => f && f.name === key)
      : undefined;

    if (!filterObj) continue;

    if (checked.length) {
      summary.textContent = `${filterObj.label}: ${checked.join(', ')}`;
    } else {
      summary.textContent = filterObj.label;
    }
  }
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
 * Render a detail view for a single item into the provided container.
 * @param {Object} item - The item (breed) to display. Expected fields: `image`, `imageAlt`, `name`, etc.
 * @param {HTMLElement} container - The container element where the detail view will be rendered.
 * @returns {void}
 */
function showDetail(item, container) {
  // Show this view
  container.classList.remove('hidden');

  // Build the content
  container.textContent = '';
  const detailCard = document.createElement('article');
  detailCard.className = 'pet-detail-card';

  const img = document.createElement('img');
  img.src = item.image;
  img.alt = item.imageAlt || item.name;
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
    /* TODO: revive in Final via Groq inference
    ['Cost:', display.cost],
    ['Habitat:', display.habitat],
    ['Care:', display.care],
    ['Good with children:', display.goodWithChildren],
    ['Good with other pets:', display.goodWithOtherPets],
    */
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

export {
  showResults,
  showNoResults,
  populateBreedSelect,
  populateMoreFilters,
  updateViewToggle,
  highlightSelectedFilters,
  renderActiveFilters,
  clearFilterSelection,
  getDrawerSelect,
  getCheckedInputs,
  getActiveFiltersData,
  updateFilterGroupSummaries,
  getFilters,
  showDetail,
};
