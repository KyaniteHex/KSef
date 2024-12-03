import React, { useState } from 'react';
import InputField from './InputField';
import SelectField from './SelectField';

const FormBuilder = ({ structure }) => {
  const [expanded, setExpanded] = useState({});

  const toggleVisibility = (key) => {
    setExpanded((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const renderElement = (element, parentKey = '') => {
    const {
      name,
      type,
      required,
      values,
      children,
      documentation,
      pattern,
      minLength,
      maxLength,
      minInclusive,
      maxInclusive,
    } = element;

    const elementKey = parentKey ? `${parentKey}-${name}` : name;

    const isHidden = !required && !expanded[elementKey];

    return (
      <div key={elementKey} style={{ marginBottom: '20px' }}>
        <label>
          {name} {required && <span>*</span>}
          {documentation && <span title={documentation} style={{ marginLeft: '5px', cursor: 'help' }}>ℹ</span>}
        </label>
        {!required && (
          <button
            type="button"
            onClick={() => toggleVisibility(elementKey)}
            style={{
              marginLeft: '10px',
              cursor: 'pointer',
              background: 'transparent',
              border: '1px solid #ccc',
              padding: '5px',
              borderRadius: '5px',
            }}
          >
            {isHidden ? 'Rozwiń' : 'Ukryj'}
          </button>
        )}
        {!isHidden && (
          <>
            {values ? (
              <SelectField name={name} options={values} required={required} />
            ) : (
              <InputField
                name={name}
                type={type}
                required={required}
                pattern={pattern}
                minLength={minLength}
                maxLength={maxLength}
                minInclusive={minInclusive}
                maxInclusive={maxInclusive}
              />
            )}
            {children && children.length > 0 && (
              <div style={{ marginLeft: '20px', borderLeft: '2px solid #ccc', paddingLeft: '10px' }}>
                {children.map((child, index) => renderElement(child, `${elementKey}-${index}`))}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  return (
    <form>
      {Array.isArray(structure) 
        ? structure.map((item, index) => renderElement(item, `root-${index}`)) 
        : renderElement(structure)}
    </form>
  );
};

export default FormBuilder;
