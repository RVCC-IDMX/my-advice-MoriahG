// Numeric range matcher (kept for future use)
/*
function matchesRange(valueRange, filterRange) {
  if (!Array.isArray(filterRange) || isEmptyFilter(filterRange)) return true;
  if (!Array.isArray(valueRange)) return true;

  const [min, max] = valueRange;
  const [fmin, fmax] = filterRange;

  if (fmin != null && max < fmin) return false;
  if (fmax != null && min > fmax) return false;
  return true;
}
*/

// Configuration for all filters shown in the "More Filters" drawer
export const drawerFilters = [
  {
    label: 'Size',
    name: 'size',
    options: ['small', 'medium', 'large', 'varied'],
    type: 'multi',
  },
  /*
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
  */
  {
    label: 'Temperament',
    name: 'temperament',
    options: [
      'friendly',
      'loyal',
      'alert',
      'intelligent',
      'curious',
      'affectionate',
      'energetic',
      'playful',
      'gentle',
      'confident',
      'courageous',
      'adaptable',
      'calm',
      'devoted',
      'outgoing',
      'eager to please',
    ],
    type: 'multi',
  },
  {
    label: 'Life Span (years)',
    name: 'lifeSpan',
    type: 'single',
    options: [
      { label: '1-3 years', value: '1-3' },
      { label: '4-7 years', value: '4-7' },
      { label: '8-15 years', value: '8-15' },
      { label: '16+ years', value: '16+' },
    ],
  },
  /*
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
  */
];

// Arrays of filter names by type for easy iteration
export const multiFilterNames = drawerFilters
  .filter((f) => f.type === 'multi')
  .map((f) => f.name);
export const singleFilterNames = drawerFilters
  .filter((f) => f.type === 'single')
  .map((f) => f.name);

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
function matchesFilter(value, filter) {
  if (isEmptyFilter(filter)) return true;
  if (Array.isArray(filter))
    return filter.some((item) => matchesFilter(value, item));
  if (Array.isArray(value)) {
    return value.includes('varied') || value.includes(filter);
  }
  if (value === 'varied' || value === null) return true;
  return String(value) === String(filter);
}

/**
 * Checks if a numeric value range matches a dropdown filter string.
 * @param {Array<number>} valueRange - The [min, max] value range.
 * @param {string} filterString - The dropdown filter string.
 * @returns {boolean} True if the value range matches the filter.
 */
function matchesDropdownRange(valueRange, filterString) {
  if (isEmptyFilter(filterString)) return true;
  if (!Array.isArray(valueRange)) return false;
  const [min, max] = valueRange;
  if (typeof min !== 'number' || typeof max !== 'number') return true;

  // Life span (both min and max must fit in range)
  if (filterString === '1-3') return min >= 1 && max <= 3;
  if (filterString === '4-7') return min >= 4 && max <= 7;
  if (filterString === '8-15') return min >= 8 && max <= 15;
  if (filterString === '16+') return min >= 16;

  // Cost (both min and max must fit in range)
  if (filterString === '<100') return min < 100 && max < 100;
  if (filterString === '100-500') return min >= 100 && max <= 500;
  if (filterString === '501-2000') return min >= 501 && max <= 2000;
  if (filterString === '2001+') return min >= 2001;

  return true;
}

/**
 * Checks if a value matches a user preference (for boolean/single values).
 * @param {*} value - The value to check.
 * @param {*} preference - The user preference to match.
 * @returns {boolean} True if the value matches the preference.
 */
/*
function matchesPreference(value, preference) {
  if (preference === undefined) return true;
  return value === null || value === preference;
}
*/

const commonFilterDescriptors = [
  { getValue: (item) => item.size, filterKey: 'size', matcher: matchesFilter },
  {
    getValue: (item) => item.temperament,
    filterKey: 'temperament',
    matcher: matchesFilter,
  },
  {
    getValue: (item) => item.lifeSpan,
    filterKey: 'lifeSpan',
    matcher: matchesDropdownRange,
  },
  /*
  {
    getValue: (item) => item.cost?.initial,
    filterKey: 'cost',
    matcher: matchesDropdownRange,
  },
  {
    getValue: (item) => item.habitat?.housing,
    filterKey: 'housing',
    matcher: matchesFilter,
  },
  {
    getValue: (item) => item.habitat?.space,
    filterKey: 'space',
    matcher: matchesFilter,
  },
  {
    getValue: (item) => item.habitat?.climate,
    filterKey: 'climate',
    matcher: matchesFilter,
  },
  {
    getValue: (item) => item.care?.social,
    filterKey: 'social',
    matcher: matchesFilter,
  },
  {
    getValue: (item) => item.care?.grooming,
    filterKey: 'grooming',
    matcher: matchesFilter,
  },
  {
    getValue: (item) => item.care?.exercise,
    filterKey: 'exercise',
    matcher: matchesFilter,
  },
  {
    getValue: (item) => item.care?.training,
    filterKey: 'training',
    matcher: matchesFilter,
  },
  {
    getValue: (item) => item.goodWithChildren,
    filterKey: 'goodWithChildren',
    matcher: matchesPreference,
  },
  {
    getValue: (item) => item.goodWithOtherPets,
    filterKey: 'goodWithOtherPets',
    matcher: matchesPreference,
  },
  */
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
 * Formats a boolean-like value to Yes / No / Varied.
 * @param {*} value - The value to format.
 * @returns {string} 'Yes', 'No', or 'Varied'.
 */
/*
function formatBooleanVaried(value) {
  if (value === true) return 'Yes';
  if (value === false) return 'No';
  return 'Varied';
}
*/

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

function formatSize(size) {
  return formatString(size, true);
}

function formatLifespan(lifeSpan) {
  return formatRangeValue(lifeSpan, 'yrs');
}

function formatTemperament(temperament) {
  return formatArray(temperament);
}

/*
function formatCost(cost) {
  if (!cost || typeof cost !== 'object') return 'Unknown';
  const formatRange = (range) =>
    Array.isArray(range) && range.length === 2
      ? `$${range[0]}–$${range[1]}`
      : 'Unknown';

  return `Initial ${formatRange(cost.initial)}, Adoption ${formatRange(
    cost.adoption
  )}, Monthly ${formatRange(cost.monthly)}`;
}

function formatHabitat(habitat) {
  if (!habitat || typeof habitat !== 'object') return 'Unknown';

  const housing =
    Array.isArray(habitat.housing) && habitat.housing.length
      ? habitat.housing.join(', ')
      : 'Varied';
  const space = formatString(habitat.space) || 'Varied';
  const climate =
    Array.isArray(habitat.climate) && habitat.climate.length
      ? habitat.climate.join(', ')
      : 'Varied';

  return `Housing: ${housing}; Space: ${space}; Climate: ${climate}`;
}

function formatCare(care) {
  if (!care || typeof care !== 'object') return 'Unknown';

  return `Social: ${formatString(care.social, true)}, Grooming: ${formatString(
    care.grooming,
    true
  )}, Exercise: ${formatString(care.exercise, true)}, Training: ${formatString(
    care.training,
    true
  )}`;
}

function formatGoodWith(value) {
  return formatBooleanVaried(value);
}
*/

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
    /*
    cost: formatCost(item.cost),
    habitat: formatHabitat(item.habitat),
    care: formatCare(item.care),
    goodWithChildren: formatGoodWith(item.goodWithChildren),
    goodWithOtherPets: formatGoodWith(item.goodWithOtherPets),
    */
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
