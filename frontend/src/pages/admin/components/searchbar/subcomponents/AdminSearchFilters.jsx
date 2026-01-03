///////////////////////////////////////////////////////////////////////
// =================== ADMIN SEARCH FILTERS COMPONENT ================ //
///////////////////////////////////////////////////////////////////////

// Renders filter dropdowns based on configuration
// Supports both static and dynamic filter options

//  ========== Module imports  ========== //
import React from "react";
import styles from "../AdminSearchBar.module.css";

//  ========== Component imports  ========== //
import AdminCountryFilter from "./AdminCountryFilter/AdminCountryFilter";

///////////////////////////////////////////////////////////////////////
// =================== ADMIN SEARCH FILTERS COMPONENT ================ //
///////////////////////////////////////////////////////////////////////

export default function AdminSearchFilters({
  filterConfigs,
  filters,
  onFilterChange,
  dynamicOptions = {},
}) {
  ///////////////////////////////////////////////////////////////////////
  // ========================= HELPER FUNCTIONS ====================== //
  ///////////////////////////////////////////////////////////////////////

  // Get options for a filter - use dynamic options if available
  const getFilterOptions = (filterConfig) => {
    if (filterConfig.dynamic && dynamicOptions[filterConfig.key]) {
      return [
        filterConfig.options[0], // Keep the "All" option
        ...dynamicOptions[filterConfig.key],
      ];
    }
    return filterConfig.options;
  };

  // Handle filter change
  const handleChange = (filterKey, value) => {
    onFilterChange(filterKey, value);
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.filtersContainer}>
      {filterConfigs.map((filterConfig) => {
        // Use custom country filter component for country field
        if (filterConfig.key === "country") {
          return (
            <AdminCountryFilter
              key={filterConfig.key}
              value={filters[filterConfig.key] || ""}
              onChange={(value) => handleChange(filterConfig.key, value)}
            />
          );
        }

        // Use standard select for other filters
        return (
          <select
            key={filterConfig.key}
            value={filters[filterConfig.key] || ""}
            onChange={(e) => handleChange(filterConfig.key, e.target.value)}
            className={styles.filterSelect}
            aria-label={filterConfig.label}
          >
            {getFilterOptions(filterConfig).map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      })}
    </div>
  );
}

///////////////////////////////////////////////////////////////////////
// =================== END ADMIN SEARCH FILTERS COMPONENT ============ //
///////////////////////////////////////////////////////////////////////
