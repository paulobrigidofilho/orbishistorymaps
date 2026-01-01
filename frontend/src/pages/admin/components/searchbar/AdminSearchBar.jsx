///////////////////////////////////////////////////////////////////////
// =================== ADMIN SEARCH BAR COMPONENT =================== //
///////////////////////////////////////////////////////////////////////

// Reusable search bar component for admin pages
// Uses conditional rendering based on page type for search and filters

//  ========== Module imports  ========== //
import React from "react";
import styles from "./AdminSearchBar.module.css";

//  ========== Component imports  ========== //
import AdminSearchFilters from "./subcomponents/AdminSearchFilters";

//  ========== Constants imports  ========== //
import {
  SEARCH_PLACEHOLDERS,
  FILTERS_BY_PAGE,
} from "../../constants/adminSearchBarConstants";

///////////////////////////////////////////////////////////////////////
// =================== ADMIN SEARCH BAR COMPONENT =================== //
///////////////////////////////////////////////////////////////////////

export default function AdminSearchBar({
  pageType,
  searchValue,
  onSearchChange,
  filters,
  onFilterChange,
  dynamicOptions = {},
}) {
  ///////////////////////////////////////////////////////////////////////
  // ========================= HELPER FUNCTIONS ====================== //
  ///////////////////////////////////////////////////////////////////////

  // Get placeholder text based on page type
  const placeholder = SEARCH_PLACEHOLDERS[pageType] || "Search...";

  // Get filter configurations for current page
  const filterConfigs = FILTERS_BY_PAGE[pageType] || [];

  // Handle search input change
  const handleSearchChange = (e) => {
    onSearchChange(e.target.value);
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.searchBarContainer}>
      {/* Search Input */}
      <div className={styles.searchInputWrapper}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          type="text"
          placeholder={placeholder}
          value={searchValue}
          onChange={handleSearchChange}
          className={styles.searchInput}
        />
        {searchValue && (
          <button
            className={styles.clearButton}
            onClick={() => onSearchChange("")}
            aria-label="Clear search"
          >
            ✕
          </button>
        )}
      </div>

      {/* Filters */}
      {filterConfigs.length > 0 && (
        <AdminSearchFilters
          filterConfigs={filterConfigs}
          filters={filters}
          onFilterChange={onFilterChange}
          dynamicOptions={dynamicOptions}
        />
      )}
    </div>
  );
}

///////////////////////////////////////////////////////////////////////
// =================== END ADMIN SEARCH BAR COMPONENT ================ //
///////////////////////////////////////////////////////////////////////
