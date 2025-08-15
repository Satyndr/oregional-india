import "../styles/SearchPage.css";
import PropTypes from "prop-types";
import { getCityData, getAllCities } from "../services/operations/cityFire";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useDebounce from "../utils/helper";

const SearchPage = ({ onClose }) => {
  const [cities, setCities] = useState([]);
  const [allCities, setAllCities] = useState([]);
  const [cityName, setCityName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef(null);

  const debouncedSearchTerm = useDebounce(cityName, 500);

  useEffect(() => {
    //set the focus to input box
    inputRef.current.focus();
  }, []);

  useEffect(() => {
    const fetchAllCities = async () => {
      try {
        setIsLoading(true);
        const citiesData = await getAllCities();
        setAllCities(citiesData);
      } catch (error) {
        console.log("Error fetching cities:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllCities();
  }, []);

  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.length > 0) {
      const filteredCities = allCities.filter((city) =>
        city.cityName?.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setSuggestions(filteredCities);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedSearchTerm, allCities]);

  const handleCitySelect = (selectedCity) => {
    setCityName(selectedCity.cityName);
    setShowSuggestions(false);
    navigate(`/${selectedCity.cityName}`, {
      state: { cityData: selectedCity },
    });
    onClose();
  };

  const handleSearch = async () => {
    if (cityName) {
      setIsLoading(true);
      try {
        const response = await getCityData(cityName);
        const citiesList = response;

        if (citiesList) {
          setCities(citiesList);
          navigate(`/${cityName}`, { state: { cityData: citiesList } });
        } else {
          navigate(`/${cityName}`, { state: { cityData: null } });
        }

        onClose();
      } catch (error) {
        console.log("error: ", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (typeof onClose !== "function") {
    throw new Error("The onClose prop must be a function.");
  }

  return (
    <div className="search-page">
      <button onClick={onClose} className="close-button">
        <i className="ri-close-large-line"></i>
      </button>
      <form
        className="search-box"
        onSubmit={(e) => {
          e.preventDefault();
          handleSearch();
        }}
      >
        <input
          type="text"
          value={cityName}
          ref={inputRef}
          onChange={(e) => {
            setCityName(e.target.value);
            setShowSuggestions(true);
          }}
          placeholder="Search city..."
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearch();
            }
            if (e.key === "Escape") {
              setShowSuggestions(false);
            }
          }}
          onFocus={() => cityName && setShowSuggestions(true)}
        />
        {isLoading ? (
          <div className="spinner"></div>
        ) : (
          <button type="submit">
            <i className="ri-search-line"></i>
          </button>
        )}
      </form>

      {showSuggestions && (
        <div className="suggestions-container">
          {suggestions.length > 0 ? (
            <ul className="suggestions-list">
              {suggestions.map((city, index) => (
                <li
                  key={index}
                  className="suggestion-item"
                  onClick={() => handleCitySelect(city)}
                >
                  <span>{city.cityName}</span>
                  {city.state && (
                    <span className="city-state">, {city.state}</span>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            cityName && (
              <div className="no-suggestions">
                No cities found matching "{cityName}"
              </div>
            )
          )}
        </div>
      )}
    </div>
  );
};

SearchPage.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default SearchPage;
