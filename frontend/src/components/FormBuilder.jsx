import React, { useState } from 'react';
import InputField from './InputField';
import SelectField from './SelectField';
import ChoiceField from './ChoiceField';

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
      optional,
      values,
      children = [],
      documentation,
      options = [],
    } = element;

    const elementKey = parentKey ? `${parentKey}-${name}` : name;
    const isHidden = !expanded[elementKey];

    return (
      <div key={elementKey} style={{ marginBottom: '20px' }}>
        <label>
          {name} {optional && <span>(opcjonalne)</span>}
          {documentation && (
            <span
              title={documentation}
              style={{ marginLeft: '5px', cursor: 'help' }}
            >
              ℹ
            </span>
          )}
        </label>
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
        {!isHidden && (
          <>
            {type === 'choice' && options.length > 0 ? (
              <ChoiceField
                name={name}
                options={options}
                optional={optional}
                documentation={documentation}
              />
            ) : values && values.length > 0 ? (
              <SelectField name={name} options={values} optional={optional} />
            ) : type ? (
              <InputField name={name} type={type} optional={optional} />
            ) : null}
            {children.length > 0 && (
              <div
                style={{
                  marginLeft: '20px',
                  borderLeft: '2px solid #ccc',
                  paddingLeft: '10px',
                }}
              >
                {children.map((child, index) =>
                  renderElement(child, `${elementKey}-${index}`)
                )}
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
