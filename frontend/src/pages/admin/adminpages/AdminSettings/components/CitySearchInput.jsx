///////////////////////////////////////////////////////////////////////
// ================ CITY SEARCH INPUT COMPONENT ==================== //
///////////////////////////////////////////////////////////////////////

// This component provides Google Places autocomplete for NZ cities
// Restricted to New Zealand localities only

//  ========== Module imports  ========== //
import React, { useState, useEffect, useRef, useCallback } from "react";
import styles from "./CitySearchInput.module.css";

//  ========== Utility imports  ========== //
import { loadGoogleMapsApi } from "../../../../../utils/googleMapsLoader";

///////////////////////////////////////////////////////////////////////
// ================ NZ CITY DATA ==================================== //
///////////////////////////////////////////////////////////////////////

// North Island cities with postal prefixes for local zone configuration
const NZ_NORTH_ISLAND_CITIES = {
  "Tauranga": { region: "Bay of Plenty", postalPrefixes: ["310", "311", "312", "314", "315", "316"] },
  "Auckland": { region: "Auckland", postalPrefixes: ["010", "012", "020", "021", "022", "023", "024", "060", "061", "062", "063", "102", "103", "104", "160", "161", "162", "163", "200", "201", "210", "211", "212", "213", "214", "215", "216", "620", "621", "622", "623", "624", "625", "626", "627", "628", "629", "630", "631", "632"] },
  "Hamilton": { region: "Waikato", postalPrefixes: ["320", "321", "322", "323", "324", "325", "326", "327", "328", "329", "330", "331", "332"] },
  "Wellington": { region: "Wellington", postalPrefixes: ["500", "501", "502", "503", "504", "505", "506", "507", "510", "511", "512", "513", "514", "515", "516", "517", "518", "519", "520", "521", "522", "523", "524", "525", "526", "527", "528", "529", "530", "531", "532", "533", "534", "535", "536", "537", "538", "539", "540", "541", "542", "543", "544", "545", "546", "547", "548", "549", "550", "551"] },
  "Rotorua": { region: "Bay of Plenty", postalPrefixes: ["301", "302", "303", "304", "305", "306", "307", "308", "309"] },
  "Napier": { region: "Hawke's Bay", postalPrefixes: ["410", "411", "412", "413", "414", "415", "416"] },
  "Hastings": { region: "Hawke's Bay", postalPrefixes: ["410", "411", "412", "413", "414", "415", "416", "417", "418", "419", "420", "421"] },
  "New Plymouth": { region: "Taranaki", postalPrefixes: ["430", "431", "432", "433", "434", "435", "436", "437", "438", "439"] },
  "Palmerston North": { region: "Manawatu-Wanganui", postalPrefixes: ["440", "441", "442", "443", "444", "445", "446", "447", "448", "449"] },
  "Whangarei": { region: "Northland", postalPrefixes: ["011", "013", "014", "015", "016", "017", "018", "019"] },
  "Gisborne": { region: "Gisborne", postalPrefixes: ["401", "402", "403", "404", "405", "406", "407", "408", "409"] },
  "Whanganui": { region: "Manawatu-Wanganui", postalPrefixes: ["450", "451", "452", "453", "454", "455"] },
  "Taupo": { region: "Waikato", postalPrefixes: ["330", "331", "332", "333", "334", "335"] },
};

///////////////////////////////////////////////////////////////////////
// ================ COMPONENT ====================================== //
///////////////////////////////////////////////////////////////////////

export default function CitySearchInput({ 
  onCitySelect, 
  currentCity = "",
  disabled = false,
  placeholder = "Search for a NZ city..."
}) {
  ///////////////////////////////////////////////////////////////////////
  // ================ STATE ========================================== //
  ///////////////////////////////////////////////////////////////////////

  const [searchTerm, setSearchTerm] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [googleMapsLoaded, setGoogleMapsLoaded] = useState(false);
  const [useManualFallback, setUseManualFallback] = useState(false);
  
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const autocompleteServiceRef = useRef(null);
  const placesServiceRef = useRef(null);
  const sessionTokenRef = useRef(null);

  ///////////////////////////////////////////////////////////////////////
  // ================ EFFECTS ======================================== //
  ///////////////////////////////////////////////////////////////////////

  // Initialize Google Places API
  useEffect(() => {
    const initGooglePlaces = async () => {
      try {
        await loadGoogleMapsApi();
        
        if (window.google?.maps?.places) {
          autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
          
          // Create a dummy element for PlacesService
          const dummyElement = document.createElement("div");
          placesServiceRef.current = new window.google.maps.places.PlacesService(dummyElement);
          
          // Generate session token for billing optimization
          sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
          
          setGoogleMapsLoaded(true);
        } else {
          console.warn("[CitySearchInput] Google Places not available, using manual fallback");
          setUseManualFallback(true);
        }
      } catch (error) {
        console.error("[CitySearchInput] Error loading Google Maps:", error);
        setUseManualFallback(true);
      }
    };

    initGooglePlaces();
  }, []);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target) &&
        inputRef.current &&
        !inputRef.current.contains(event.target)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  ///////////////////////////////////////////////////////////////////////
  // ================ FUNCTIONS ====================================== //
  ///////////////////////////////////////////////////////////////////////

  // Search for cities using Google Places API
  const searchWithGoogle = useCallback(async (query) => {
    if (!autocompleteServiceRef.current || query.length < 2) {
      setPredictions([]);
      return;
    }

    setIsLoading(true);

    const request = {
      input: query,
      componentRestrictions: { country: "nz" },
      types: ["(cities)"],
      sessionToken: sessionTokenRef.current,
    };

    autocompleteServiceRef.current.getPlacePredictions(
      request,
      (results, status) => {
        setIsLoading(false);

        if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
          // Filter to only North Island cities we support
          const filteredResults = results
            .map((prediction) => {
              // Extract city name from prediction
              const cityName = prediction.structured_formatting?.main_text || 
                               prediction.description.split(",")[0].trim();
              
              // Check if this city is in our supported list
              const supportedCity = Object.keys(NZ_NORTH_ISLAND_CITIES).find(
                (city) => city.toLowerCase() === cityName.toLowerCase()
              );

              if (supportedCity) {
                return {
                  placeId: prediction.place_id,
                  city: supportedCity,
                  region: NZ_NORTH_ISLAND_CITIES[supportedCity].region,
                  postalPrefixes: NZ_NORTH_ISLAND_CITIES[supportedCity].postalPrefixes,
                  description: prediction.description,
                };
              }
              return null;
            })
            .filter(Boolean);

          setPredictions(filteredResults);
        } else {
          setPredictions([]);
        }
      }
    );
  }, []);

  // Search using manual fallback (filter local city list)
  const searchManually = useCallback((query) => {
    if (query.length < 1) {
      setPredictions([]);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const matchedCities = Object.entries(NZ_NORTH_ISLAND_CITIES)
      .filter(([city]) => city.toLowerCase().includes(lowerQuery))
      .map(([city, data]) => ({
        city,
        region: data.region,
        postalPrefixes: data.postalPrefixes,
        description: `${city}, ${data.region}, New Zealand`,
      }));

    setPredictions(matchedCities);
  }, []);

  // Handle search input change
  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setShowDropdown(true);

    if (useManualFallback || !googleMapsLoaded) {
      searchManually(value);
    } else {
      searchWithGoogle(value);
    }
  };

  // Handle city selection
  const handleSelectCity = (city) => {
    setSearchTerm("");
    setPredictions([]);
    setShowDropdown(false);

    // Generate new session token for next search
    if (window.google?.maps?.places) {
      sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
    }

    // Pass selected city data to parent
    onCitySelect({
      city: city.city,
      region: city.region,
      postalPrefixes: city.postalPrefixes,
    });
  };

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowDropdown(false);
    }
  };

  ///////////////////////////////////////////////////////////////////////
  // ================ RENDER ========================================= //
  ///////////////////////////////////////////////////////////////////////

  return (
    <div className={styles.citySearchContainer}>
      {/* Search Input */}
      <div className={styles.inputWrapper}>
        <i className={`material-icons ${styles.searchIcon}`}>search</i>
        <input
          ref={inputRef}
          type="text"
          className={styles.searchInput}
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
        />
        {isLoading && (
          <span className={styles.loadingSpinner}></span>
        )}
      </div>

      {/* Manual Fallback Notice */}
      {useManualFallback && (
        <p className={styles.fallbackNotice}>
          <i className="material-icons">info</i>
          Using offline city list (Google Maps unavailable)
        </p>
      )}

      {/* Predictions Dropdown */}
      {showDropdown && predictions.length > 0 && (
        <div ref={dropdownRef} className={styles.dropdown}>
          {predictions.map((city, index) => (
            <div
              key={`${city.city}-${index}`}
              className={`${styles.dropdownItem} ${
                currentCity === city.city ? styles.currentCity : ""
              }`}
              onClick={() => handleSelectCity(city)}
            >
              <div className={styles.cityInfo}>
                <i className="material-icons">place</i>
                <div className={styles.cityText}>
                  <span className={styles.cityName}>{city.city}</span>
                  <span className={styles.regionName}>{city.region}</span>
                </div>
              </div>
              {currentCity === city.city && (
                <span className={styles.currentBadge}>Current</span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {showDropdown && searchTerm.length >= 2 && predictions.length === 0 && !isLoading && (
        <div className={styles.dropdown}>
          <div className={styles.noResults}>
            <i className="material-icons">location_off</i>
            <span>No matching North Island cities found</span>
          </div>
        </div>
      )}
    </div>
  );
}
