import React from 'react';
import InputField from './InputField';
import SelectField from './SelectField';

const FormBuilder = ({ structure }) => {
  if (!structure || !structure.elements) {
    return <div>Brak danych do wyświetlenia.</div>;
  }

  const renderElement = (element) => {
    const { name, type, required, values, children, documentation } = element;

    return (
      <div key={name}>
        <label>
          {name} {required && <span>*</span>}
          {documentation && <span title={documentation}> ℹ </span>}
        </label>
        {values ? (
          <SelectField name={name} options={values} required={required} />
        ) : (
          <InputField name={name} type={type} required={required} />
        )}
        {children && (
          <div style={{ marginLeft: '20px' }}>
            {children.map((child) => renderElement(child))}
          </div>
        )}
      </div>
    );
  };

  return <form>{structure.elements.map((el) => renderElement(el))}</form>;
};

export default FormBuilder;
