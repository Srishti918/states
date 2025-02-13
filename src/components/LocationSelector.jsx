import React, { useState, useEffect } from "react";
import axios from "axios";

const LocationSelector = () => {
  // State variables to hold data for countries, states, cities
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // State variables to hold the selected values
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  // Fetch countries on component mount
  useEffect(() => {
    axios
      .get("https://crio-location-selector.onrender.com/countries")
      .then((response) => {
        setCountries(response.data);
      })
      .catch((error) => {
        console.error("Error fetching countries:", error);
      });
  }, []);

  // Fetch states when a country is selected
  useEffect(() => {
    if (selectedCountry) {
      axios
        .get(`https://crio-location-selector.onrender.com/country=${selectedCountry}/states`)
        .then((response) => {
          setStates(response.data);
          setSelectedState("");  // Reset state when country changes
          setSelectedCity("");   // Reset city when state changes
        })
        .catch((error) => {
          console.error("Error fetching states:", error);
        });
    }
  }, [selectedCountry]);

  // Fetch cities when a state is selected
  useEffect(() => {
    if (selectedCountry && selectedState) {
      axios
        .get(`https://crio-location-selector.onrender.com/country=${selectedCountry}/state=${selectedState}/cities`)
        .then((response) => {
          setCities(response.data);
          setSelectedCity(""); // Reset city when state changes
        })
        .catch((error) => {
          console.error("Error fetching cities:", error);
        });
    }
  }, [selectedCountry, selectedState]);

  // Handle country change
  const handleCountryChange = (event) => {
    setSelectedCountry(event.target.value);
  };

  // Handle state change
  const handleStateChange = (event) => {
    setSelectedState(event.target.value);
  };

  // Handle city change
  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
  };

  // Display selection summary with custom styles
  const getSelectionSummary = () => {
    if (selectedCity && selectedState && selectedCountry) {
      return (
        <div  style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "row",
          }}>
            <p style={{fontWeight: "bold", fontSize: "20px"}}>You selected{" "} </p>
          <p style={{ fontWeight: "bolder", color: "black" ,paddingLeft: "5px", fontSize: "25px"}}>
          {selectedCity}, 
          </p>
          <h3 style={{ fontWeight: "bold", color: "grey",paddingLeft: "5px" }}>
            {selectedState},
          </h3>
          <h3 style={{ fontWeight: "bold", color: "grey",paddingLeft: "5px"  }}>
            {selectedCountry}
          </h3>
        </div>
      );
    }
    return null;
  };

  return (
    <div>
      <h2>Select Location</h2>
      
      {/* Container to arrange the dropdowns in a row */}
      <div style={styles.rowContainer}>
        {/* Country Dropdown */}
        <div style={styles.dropdownWrapper}>
        
          <select
            id="country"
            value={selectedCountry}
            onChange={handleCountryChange}
            style={styles.dropdown}
          >
            <option value="">Select Country</option>
            {countries.map((country) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>

        {/* State Dropdown */}
        <div style={styles.dropdownWrapper}>
          
          <select
            id="state"
            value={selectedState}
            onChange={handleStateChange}
            disabled={!selectedCountry} // Disable until a country is selected
            style={styles.dropdown}
          >
            <option value="">Select State</option>
            {selectedCountry &&
              states.map((state) => (
                <option key={state} value={state}>
                  {state}
                </option>
              ))}
          </select>
        </div>

        {/* City Dropdown */}
        <div style={styles.dropdownWrapper}>
          
          <select
            id="city"
            value={selectedCity}
            onChange={handleCityChange}
            disabled={!selectedState} // Disable until a state is selected
            style={styles.dropdown}
          >
            <option value="">Select City</option>
            {selectedState &&
              cities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Display the selection summary */}
      {getSelectionSummary()}
    </div>
  );
};

// Inline styles for the layout
const styles = {
  rowContainer: {
    display: "flex",
    justifyContent: "space-between",
    gap: "10px",
    marginBottom: "20px",
  },
  dropdownWrapper: {
    display: "flex",
    flexDirection: "column",
    width: "30%", // Adjust width as needed
  },
  dropdown: {
    padding: "10px",
    fontSize: "14px",
  },
};

export default LocationSelector;
