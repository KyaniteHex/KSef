import React, { useState } from "react";

const ChoiceField = ({ name, options, required, documentation, renderElement }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionChange = (optionName) => {
    setSelectedOption(optionName);
  };

  return (
    <div>
      {options.map((option, index) => (
        <div key={`${name}-${index}`} style={{ marginBottom: "10px" }}>
          <label>
            <input
              type="radio"
              name={name}
              value={option.name || `choice-${index}`}
              required={required}
              onChange={() => handleOptionChange(option.name || `choice-${index}`)}
            />
            {option.name}
          </label>
          {option.documentation && (
            <span
              title={option.documentation}
              style={{ marginLeft: "5px", cursor: "help" }}
            >
              ℹ
            </span>
          )}
          {selectedOption === (option.name || `choice-${index}`) && (
            <div
              style={{
                marginLeft: "20px",
                borderLeft: "2px solid #ccc",
                paddingLeft: "10px",
              }}
            >
              {/* Obsługa dzieci w choice */}
              {option.children &&
                option.children.map((child, idx) =>
                  renderElement(child, `${name}-${index}-${idx}`)
                )}
              {/* Obsługa zagnieżdżonych choice */}
              {option.options &&
                option.options.map((nestedOption, idx) =>
                  renderElement(
                    { ...nestedOption, type: "choice" },
                    `${name}-${index}-${idx}`
                  )
                )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default ChoiceField;
