///////////////////////////////////////////////////////////////////////
// =================== TAG INPUT COMPONENT =========================== //
///////////////////////////////////////////////////////////////////////

// Reusable tag input component with autocomplete suggestions
// Used in AddProductModal and ProductEditModal for tag management

//  ========== Module imports  ========== //
import React, { useState, useEffect, useRef } from "react";
import styles from "./TagInput.module.css";

///////////////////////////////////////////////////////////////////////
// =================== TAG INPUT COMPONENT =========================== //
///////////////////////////////////////////////////////////////////////

export default function TagInput({
  tags = [],
  suggestions = [],
  onAddTag,
  onRemoveTag,
  placeholder = "Add a tag...",
  maxTags = 20,
  disabled = false,
}) {
  ///////////////////////////////////////////////////////////////////////
  // ========================= STATE VARIABLES ======================= //
  ///////////////////////////////////////////////////////////////////////

  const [inputValue, setInputValue] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  ///////////////////////////////////////////////////////////////////////
  // ========================= USE EFFECT HOOKS ====================== //
  ///////////////////////////////////////////////////////////////////////

  // Filter suggestions based on input
  useEffect(() => {
    if (inputValue.trim()) {
      const filtered = suggestions.filter(
        (suggestion) =>
          suggestion.tag_name.toLowerCase().includes(inputValue.toLowerCase()) &&
          !tags.some((tag) => tag.tag_name === suggestion.tag_name)
      );
      setFilteredSuggestions(filtered.slice(0, 8)); // Limit to 8 suggestions
      setShowSuggestions(filtered.length > 0);
    } else {
      setFilteredSuggestions([]);
      setShowSuggestions(false);
    }
    setHighlightedIndex(-1);
  }, [inputValue, suggestions, tags]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  ///////////////////////////////////////////////////////////////////////
  // ======================= HELPER FUNCTIONS ======================== //
  ///////////////////////////////////////////////////////////////////////

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (highlightedIndex >= 0 && filteredSuggestions[highlightedIndex]) {
        handleSelectSuggestion(filteredSuggestions[highlightedIndex].tag_name);
      } else if (inputValue.trim()) {
        handleAddTag(inputValue.trim());
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredSuggestions.length - 1 ? prev + 1 : prev
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === "Escape") {
      setShowSuggestions(false);
      setHighlightedIndex(-1);
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      // Remove last tag when backspace is pressed on empty input
      const lastTag = tags[tags.length - 1];
      onRemoveTag(lastTag.tag_id);
    } else if (e.key === "," || e.key === "Tab") {
      // Allow comma or tab to add tag
      if (inputValue.trim()) {
        e.preventDefault();
        handleAddTag(inputValue.trim());
      }
    }
  };

  const handleAddTag = (tagName) => {
    // Validate tag
    const normalizedTag = tagName.toLowerCase().replace(/,/g, "").trim();
    if (!normalizedTag) return;
    if (normalizedTag.length > 50) return;
    if (tags.length >= maxTags) return;
    if (tags.some((tag) => tag.tag_name === normalizedTag)) return;

    onAddTag(normalizedTag);
    setInputValue("");
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const handleSelectSuggestion = (tagName) => {
    handleAddTag(tagName);
  };

  const handleRemoveTag = (tagId) => {
    onRemoveTag(tagId);
    inputRef.current?.focus();
  };

  ///////////////////////////////////////////////////////////////////////
  // ========================= JSX BELOW ============================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.tagInputContainer}>
      <div className={styles.tagInputWrapper}>
        {/* Existing Tags */}
        {tags.map((tag) => (
          <span key={tag.tag_id} className={styles.tag}>
            {tag.tag_name}
            {!disabled && (
              <button
                type="button"
                onClick={() => handleRemoveTag(tag.tag_id)}
                className={styles.tagRemoveButton}
                aria-label={`Remove ${tag.tag_name} tag`}
              >
                ×
              </button>
            )}
          </span>
        ))}

        {/* Input Field */}
        {tags.length < maxTags && !disabled && (
          <input
            ref={inputRef}
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => inputValue.trim() && setShowSuggestions(true)}
            placeholder={tags.length === 0 ? placeholder : ""}
            className={styles.tagInput}
            disabled={disabled}
          />
        )}
      </div>

      {/* Tag Limit Indicator */}
      {tags.length >= maxTags && (
        <span className={styles.tagLimitReached}>
          Maximum {maxTags} tags reached
        </span>
      )}

      {/* Autocomplete Suggestions */}
      {showSuggestions && filteredSuggestions.length > 0 && (
        <div ref={suggestionsRef} className={styles.suggestionsDropdown}>
          {filteredSuggestions.map((suggestion, index) => (
            <button
              key={suggestion.tag_name}
              type="button"
              onClick={() => handleSelectSuggestion(suggestion.tag_name)}
              className={`${styles.suggestionItem} ${
                index === highlightedIndex ? styles.highlighted : ""
              }`}
            >
              <span className={styles.suggestionName}>{suggestion.tag_name}</span>
              <span className={styles.suggestionCount}>
                {suggestion.usage_count} product{suggestion.usage_count !== 1 ? "s" : ""}
              </span>
            </button>
          ))}
        </div>
      )}

      {/* Helper Text */}
      <p className={styles.helperText}>
        Press Enter or comma to add. {tags.length}/{maxTags} tags.
      </p>
    </div>
  );
}
