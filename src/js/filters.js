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

import { species } from './species.js';
import { breeds } from './breeds.js';

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
function matchesPreference(value, preference) {
  if (preference === undefined) return true;
  return value === null || value === preference;
}

const commonFilterDescriptors = [
  { getValue: (item) => item.size, filterKey: 'size', matcher: matchesFilter },
  {
    getValue: (item) => item.lifeSpan,
    filterKey: 'lifeSpan',
    matcher: matchesDropdownRange,
  },
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
 * Checks if a breed matches a given classId.
 * @param {Object} breed - The breed object.
 * @param {string} classId - The class ID to match.
 * @returns {boolean} True if the breed matches the classId.
 */
function breedMatchesClassId(breed, classId) {
  if (!classId) return true;
  return species.some((s) => s.id === breed.speciesId && s.classId === classId);
}

/**
 * Checks if a breed matches all selected filters.
 * @param {Object} breed - The breed object.
 * @param {Object} filters - The filters to apply.
 * @returns {boolean} True if the breed matches all filters.
 */
function matchesBreedFilters(breed, filters) {
  if (!breedMatchesClassId(breed, filters.classId)) return false;
  if (filters.speciesId && breed.speciesId !== filters.speciesId) return false;
  if (filters.breedId && breed.id !== filters.breedId) return false;
  return passesCommonFilters(breed, filters);
}

/**
 * Checks if a species matches all selected filters (excluding breed).
 * @param {Object} speciesItem - The species object.
 * @param {Object} filters - The filters to apply.
 * @returns {boolean} True if the species matches all filters.
 */
function matchesSpeciesFilters(speciesItem, filters) {
  if (filters.breedId) return false;
  if (filters.classId && speciesItem.classId !== filters.classId) return false;
  if (filters.speciesId && speciesItem.id !== filters.speciesId) return false;
  return passesCommonFilters(speciesItem, filters);
}

/**
 * Determines the result type for filtered pets.
 * @param {number} breedResultsLength - Number of breed results.
 * @param {number} speciesOnlyLength - Number of species-only results.
 * @param {number} totalLength - Total number of results.
 * @returns {string} The result type ('none', 'mixed', 'breed', or 'species').
 */
function getResultType(breedResultsLength, speciesOnlyLength, totalLength) {
  if (totalLength === 0) return 'none';
  if (breedResultsLength > 0) return speciesOnlyLength > 0 ? 'mixed' : 'breed';
  return 'species';
}

/**
 * Filters pets (breeds and species) based on selected filters.
 * @param {Object} [filters={}] - The filters to apply.
 * @returns {{results: Array, type: string}} The filtered results and result type.
 */
export function filterPets(filters = {}) {
  const breedResults = breeds.filter((breed) =>
    matchesBreedFilters(breed, filters)
  );
  const speciesResults = species.filter((sp) =>
    matchesSpeciesFilters(sp, filters)
  );

  const breedSpeciesIds = new Set(breedResults.map((br) => br.speciesId));
  const speciesOnly = speciesResults.filter(
    (sp) => !breedSpeciesIds.has(sp.id)
  );
  const results = [...breedResults, ...speciesOnly];

  return {
    results,
    type: getResultType(
      breedResults.length,
      speciesOnly.length,
      results.length
    ),
  };
}
