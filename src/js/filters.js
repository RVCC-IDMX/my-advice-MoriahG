/**
 * Checks if a filter value is empty (for all filter types).
 * @param {*} value - The filter value to check.
 * @returns {boolean} True if the filter is empty.
 */
function isEmptyFilter(value) {
  return (
    value === '' ||
    value === undefined ||
    value === null ||
    (Array.isArray(value) && value.length === 0)
  );
}

/**
 * Checks if a value matches a filter (for multi/single values).
 * @param {*} value - The value to check.
 * @param {*} filter - The filter to match against.
 * @returns {boolean} True if the value matches the filter.
 */
/**
 * Checks if a value matches a filter (for multi/single values).
 * For the 'name' filter, performs a case-insensitive comparison.
 * @param {*} value - The value to check.
 * @param {*} filter - The filter to match against.
 * @param {string} [filterKey] - The key of the filter (optional, used for special cases).
 * @returns {boolean} True if the value matches the filter.
 */
function matchesFilter(value, filter, filterKey) {
  if (isEmptyFilter(filter)) return true;
  if (Array.isArray(filter))
    return filter.some((item) => matchesFilter(value, item, filterKey));
  if (Array.isArray(value)) {
    return value.includes('varied') || value.includes(filter);
  }
  if (value === 'varied' || value === null) return true;
  // Case-insensitive substring match for 'name' filter
  if (filterKey === 'name') {
    return String(value).toLowerCase().includes(String(filter).toLowerCase());
  }
  return String(value) === String(filter);
}

/**
 * Checks if two numeric ranges overlap (for [min, max] arrays).
 * @param {Array<number>} valueRange - The [min, max] value range from the breed.
 * @param {Array<number>} filterRange - The [min, max] value range from the filter (GROQ).
 * @returns {boolean} True if the ranges overlap or filter is empty/null.
 */
/**
 * Checks if two numeric ranges overlap (for [min, max] arrays).
 * @param {Array<number>} valueRange - The [min, max] value range from the breed.
 * @param {Array<number>} filterRange - The [min, max] value range from the filter (GROQ).
 * @returns {boolean} True if the ranges overlap or filter is empty/null.
 */
function matchesRangeOverlap(valueRange, filterRange) {
  if (isEmptyFilter(filterRange)) return true;
  if (!Array.isArray(valueRange) || !Array.isArray(filterRange)) return false;
  let [min, max] = valueRange;
  let [fmin, fmax] = filterRange;

  // If filter is [null, null], treat as unbounded (match all)
  if (fmin == null && fmax == null) return true;

  // If breed data is missing, do not match
  if (min == null || max == null) return false;

  // Convert to numbers if possible
  min = Number(min);
  max = Number(max);
  fmin = fmin == null ? -Infinity : Number(fmin);
  fmax = fmax == null ? Infinity : Number(fmax);

  // Overlap: breed's max >= filter min AND breed's min <= filter max
  return max >= fmin && min <= fmax;
}

/**
 * Checks if a boolean value matches a filter (for goodWithChildren, goodWithOtherPets).
 * @param {*} value - The boolean value to check.
 * @param {*} filter - The boolean filter to match against.
 * @returns {boolean} True if the value matches or filter is empty.
 */
function matchesBooleanFilter(value, filter) {
  if (isEmptyFilter(filter)) return true;
  return value === filter;
}

const commonFilterDescriptors = [
  {
    getValue: (item) => item.name,
    filterKey: 'name',
    matcher: (value, filter) => matchesFilter(value, filter, 'name'),
  },
  { getValue: (item) => item.size, filterKey: 'size', matcher: matchesFilter },
  {
    getValue: (item) => item.temperament,
    filterKey: 'temperament',
    matcher: matchesFilter,
  },
  {
    getValue: (item) => item.lifeSpan,
    filterKey: 'lifeSpan',
    matcher: matchesRangeOverlap,
  },
  {
    getValue: (item) => item.origin,
    filterKey: 'origin',
    matcher: matchesFilter,
  },
  {
    getValue: (item) => item.breedGroup,
    filterKey: 'breedGroup',
    matcher: matchesFilter,
  },
  {
    getValue: (item) => item.habitat?.housing,
    filterKey: 'housing',
    matcher: matchesFilter,
  },
  {
    getValue: (item) => item.care?.exercise,
    filterKey: 'exercise',
    matcher: matchesFilter,
  },
  {
    getValue: (item) => item.goodWithChildren,
    filterKey: 'goodWithChildren',
    matcher: matchesBooleanFilter,
  },
  {
    getValue: (item) => item.goodWithOtherPets,
    filterKey: 'goodWithOtherPets',
    matcher: matchesBooleanFilter,
  },
];

/**
 * Checks if an item passes all common filters.
 * @param {Object} item - The item to check.
 * @param {Object} filters - The filters to apply.
 * @returns {boolean} True if the item passes all filters.
 */
function passesCommonFilters(item, filters) {
  return commonFilterDescriptors.every(({ getValue, filterKey, matcher }) => {
    const value = getValue(item);
    const filterValue = filters[filterKey];
    return matcher(value, filterValue);
  });
}

/**
 * Checks if a breed matches all selected filters.
 * @param {Object} breed - The breed object.
 * @param {Object} filters - The filters to apply.
 * @returns {boolean} True if the breed matches all filters.
 */
function matchesBreedFilters(breed, filters) {
  if (filters.breedId && breed.id !== filters.breedId) return false;
  return passesCommonFilters(breed, filters);
}

/**
 * Determines the result type for filtered pets.
 * @param {number} totalLength - Total number of results.
 * @returns {string} The result type ('none' or 'breed').
 */
function getResultType(totalLength) {
  if (totalLength === 0) return 'none';
  return 'breed';
}

/**
 * Formats a string value with optional capitalization.
 * @param {*} value - The value to format.
 * @param {boolean} [capitalize=false] - Whether to capitalize the first letter.
 * @returns {string} The formatted string or 'Unknown'.
 */
function formatString(value, capitalize = false) {
  if (value === undefined || value === null || value === '') return 'Unknown';
  let text = String(value).replace(/[_-]+/g, ' ');
  text = text.replace(/([a-z])([A-Z])/g, '$1 $2');
  text = text.toLowerCase();
  return capitalize ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

/**
 * Formats an array value for display.
 * @param {*} value - The array to format.
 * @returns {string} The formatted array string or 'Unknown'.
 */
function formatArray(value) {
  if (!Array.isArray(value)) return 'Unknown';
  const filtered = value.filter((item) => item !== 'varied');
  return filtered.length ? filtered.join(', ') : 'Varied';
}

/**
 * Formats a numeric range array to a display string.
 * @param {*} range - The range array.
 * @param {string} unit - The unit to append.
 * @returns {string} The formatted range or 'Unknown'.
 */
function formatRangeValue(range, unit = '') {
  if (!Array.isArray(range) || range.length !== 2) return 'Unknown';
  const formatted = `${range[0]}–${range[1]}`;
  return unit ? `${formatted} ${unit}` : formatted;
}

/**
 * Format a size value for display (capitalized).
 * @param {*} size - Size value (string or other) to format
 * @returns {string} Human-friendly size string
 */
function formatSize(size) {
  return formatString(size, true);
}

/**
 * Format a life span range for display with units.
 * @param {*} lifeSpan - Array-like [min, max] lifespan values
 * @returns {string} Formatted lifespan string (e.g. "2–8 yrs")
 */
function formatLifespan(lifeSpan) {
  return formatRangeValue(lifeSpan, 'yrs');
}

/**
 * Format temperament array for display.
 * Filters out the special "varied" value and joins items.
 * @param {*} temperament - Array of temperament descriptors
 * @returns {string} Formatted temperament string or 'Unknown'
 */
function formatTemperament(temperament) {
  return formatArray(temperament);
}

/**
 * Format monthly cost for display.
 * @param {*} cost - Cost object with monthly property
 * @returns {string} Formatted cost string (e.g. "$75/month")
 */
function formatMonthlyCost(cost) {
  if (!cost || typeof cost !== 'object' || typeof cost.monthly !== 'number') {
    return 'Unknown';
  }
  return `$${cost.monthly}/month`;
}

/**
 * Format housing preference for display.
 * @param {*} housing - Housing string (apartment, house, farm)
 * @returns {string} Formatted housing string
 */
function formatHousing(housing) {
  if (!housing) return 'Unknown';
  return formatString(housing, true);
}

/**
 * Format exercise level for display.
 * @param {*} exercise - Exercise level (low, moderate, high, veryHigh)
 * @returns {string} Formatted exercise string
 */
function formatExercise(exercise) {
  if (!exercise) return 'Unknown';
  return formatString(exercise, true);
}

/**
 * Format boolean value as Yes/No for display.
 * @param {*} value - Boolean value
 * @returns {string} 'Yes', 'No', or 'Unknown'
 */
function formatBoolean(value) {
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  return 'Unknown';
}

/**
 * Formats a pet item for display in the views.
 * @param {Object} item - The breed item.
 * @returns {Object} The display-ready values.
 */
export function formatPetForDisplay(item) {
  return {
    displayName: `Breed: ${item.name}`,
    description: item.description,
    size: formatSize(item.size),
    lifespan: formatLifespan(item.lifeSpan),
    temperament: formatTemperament(item.temperament),
    origin: formatString(item.origin, true),
    breedGroup: formatString(item.breedGroup, true),
    monthlyCost: formatMonthlyCost(item.cost),
    housing: formatHousing(item.habitat?.housing),
    exercise: formatExercise(item.care?.exercise),
    goodWithChildren: formatBoolean(item.goodWithChildren),
    goodWithOtherPets: formatBoolean(item.goodWithOtherPets),
  };
}

/**
 * Filters pets (breeds) based on selected filters.
 * @param {Object} [filters={}] - The filters to apply.
 * @returns {{results: Array, type: string}} The filtered results and result type.
 */
export function filterPets(petData, filters = {}) {
  const results = petData.filter((breed) =>
    matchesBreedFilters(breed, filters)
  );

  return {
    results,
    type: getResultType(results.length),
  };
}
