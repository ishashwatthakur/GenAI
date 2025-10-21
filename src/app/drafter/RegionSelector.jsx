import React, { useState, useRef, useEffect } from "react";
import { countries } from "./countries";

export default function RegionSelector({ onSelect }) {
  const [selected, setSelected] = useState(countries.find(c => c.code === "US"));
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  useEffect(() => {
    // Set initial jurisdiction
    if (onSelect && selected) {
      onSelect(selected.code);
    }
  }, []);
  const dropdownRef = useRef(null);
  
  // Filter countries based on search term
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (country) => {
    setSelected(country);
    setIsOpen(false);
    
    // Skip jurisdiction update if "Region" is selected
    if (country.code === "REGION") {
      return;
    }
    
    // Update URL with selected country code
    const params = new URLSearchParams(window.location.search);
    params.set('region', country.code);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.pushState({}, '', newUrl);
    
    // Call parent callback if provided
    if (onSelect) {
      const jurisdiction = `${country.code} Federal`;
      onSelect(jurisdiction);
      window.selectedJurisdiction = jurisdiction;
    }
  };

  return (
    <div 
      ref={dropdownRef}
      className="relative" 
        style={{ 
        width: "400px",
        position: "absolute",
        top: "-105px",
        left: "50%",
        transform: "translateX(-50%)", // Center horizontally
        zIndex: 9999
      }}
    >
      {/* Selected Country Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        type="button"
        style={{
          width: "100%",
          padding: "10px 16px",
          background: "white",
          border: "2px solid #eee",
          borderRadius: "8px",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          cursor: "pointer",
          transition: "all 0.2s",
          position: "relative",
          fontSize: "15px",
          fontWeight: "500",
          color: "#333",
          hover: {
            borderColor: "#42c58a",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
          }
        }}
      >
        {selected ? (
          selected.code === "REGION" ? (
            <span style={{ flex: 1, textAlign: "left", color: "#666" }}>Select Region</span>
          ) : (
            <>
              <img
                src={selected.flag}
                alt={selected.name}
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "50%",
                  objectFit: "cover"
                }}
              />
              <span style={{ flex: 1, textAlign: "left", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{selected.name}</span>
            </>
          )
        ) : (
          <span style={{ flex: 1, textAlign: "left", color: "#666" }}>Select Region</span>
        )}
        <svg
          style={{
            width: "20px",
            height: "20px",
            transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
            transition: "transform 0.2s"
          }}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 8px)",
            left: 0,
            width: "100%",
            background: "white",
            border: "2px solid #eee",
            borderRadius: "12px",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
            zIndex: 9999
          }}
        >
          {/* Search input */}
          <div style={{ padding: "12px", borderBottom: "2px solid #eee" }}>
            <input
              type="text"
              placeholder="Type to search countries..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "8px 12px",
                border: "1px solid #ddd",
                borderRadius: "6px",
                fontSize: "14px",
                outline: "none",
                transition: "all 0.2s",
              }}
              onFocus={(e) => e.target.style.borderColor = "#42c58a"}
              onBlur={(e) => e.target.style.borderColor = "#ddd"}
            />
          </div>
          
          {/* Country list */}
          <div style={{
            maxHeight: "350px",
            overflowY: "auto",
          }}>
            {filteredCountries.map((country) => (
            <button
              key={country.code}
              onClick={() => handleSelect(country)}
              style={{
                width: "100%",
                padding: "8px 12px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                border: "none",
                background: selected?.code === country.code ? "#e7f9f3" : "white",
                cursor: "pointer",
                transition: "all 0.2s",
                borderBottom: "1px solid #eee",
                ...(country.code === "REGION" && {
                  fontWeight: "500",
                  color: "#666",
                  borderBottom: "2px solid #eee"
                })
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "#f8f9fa";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 
                  selected?.code === country.code ? "#e7f9f3" : "white";
              }}
              type="button"
            >
              {country.code !== "REGION" && (
                <img
                  src={country.flag}
                  alt={country.name}
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    objectFit: "cover"
                  }}
                />
              )}
              <span style={{ flex: 1, textAlign: "left" }}>{country.name}</span>
            </button>
          ))}
          </div>
        </div>
      )}

      <style jsx global>{`
        /* Custom scrollbar for the dropdown */
        div::-webkit-scrollbar {
          width: 8px;
        }
        div::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb {
          background: #888;
          border-radius: 4px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #666;
        }

        /* Hover effects */
        button:hover {
          border-color: #42c58a !important;
          box-shadow: 0 2px 8px rgba(66, 197, 138, 0.2) !important;
        }

        /* Animation for dropdown */
        @keyframes dropdownFade {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .dropdown-menu {
          animation: dropdownFade 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}